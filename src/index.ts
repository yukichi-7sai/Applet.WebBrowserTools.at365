interface Invocation {
  signal: AbortSignal;
  source?: string;
  window?: string;
}
interface Context {
  appdock: {
    call(method: string, params: Record<string, unknown>): Promise<unknown>;
  };
  commands: {
    register(
      id: string,
      title: string,
      handler: (invocation?: Invocation) => Promise<unknown>,
    ): void;
  };
  settings: {
    get<T>(key: string, fallback: T): T;
    onChanged(handler: () => Promise<void>): () => void;
  };
  ui: { showPanel(panel: unknown): Promise<unknown> };
}
export const commands = [
  ["close-tab", "タブを閉じる", "Ctrl+F4"],
  ["back", "戻る", null],
  ["forward", "進む", null],
  ["reload", "リロード", null],
  ["super-reload", "スーパーリロード", "Ctrl+F5"],
  ["toggle-fullscreen", "全画面を切り替え", "F11"],
  ["new-tab", "新しいタブを開く", "Ctrl+T"],
  ["new-window", "新しいウィンドウを開く", "Ctrl+N"],
  ["previous-tab", "前のタブへ", "Ctrl+Shift+Tab"],
  ["next-tab", "次のタブへ", "Ctrl+Tab"],
  ["restore-tab", "閉じたタブを復元", "Ctrl+Shift+T"],
] as const;
// Validate edited preferences before replacing the working bindings. The host validates again at execution.
export function validateKeys(value: unknown): string {
  if (typeof value !== "string" || value.length > 100)
    throw Error("送信キーが不正です。");
  const parts = value
    .toUpperCase()
    .split("+")
    .map((p) => p.trim());
  const key = parts.pop()!;
  const names: Record<string, string> = {
    CTRL: "CTRL",
    CONTROL: "CTRL",
    ALT: "ALT",
    SHIFT: "SHIFT",
    WIN: "WIN",
    WINDOWS: "WIN",
    META: "WIN",
  };
  const modifiers = parts.map((p) => names[p]);
  if (
    modifiers.some((p) => !p) ||
    new Set(modifiers).size !== modifiers.length ||
    !/^(?:[A-Z0-9]|F(?:[1-9]|1[0-9]|2[0-4])|ENTER|TAB|ESC|ESCAPE|SPACE|BACKSPACE|DELETE|INSERT|HOME|END|PAGEUP|PAGEDOWN|LEFT|RIGHT|UP|DOWN)$/.test(
      key,
    )
  )
    throw Error("未対応の送信キーです（例: Ctrl+Shift+T）。");
  return value;
}
let context: Context;
let active = false;
let dispose: (() => void) | undefined;
let bindings = new Map<string, string>();
async function refresh() {
  const next = new Map<string, string>();
  for (const [id, , keys] of commands)
    if (keys !== null)
      next.set(id, validateKeys(context.settings.get("keys." + id, keys)));
  bindings = next;
  await context.ui.showPanel({
    title: "WebBrowserTools",
    description:
      "アクティブなウィンドウへ操作を送ります。実行する場所は本体のショートカット・マウスジェスチャーの条件で設定してください。入力には設定 → 一般のApplet操作許可が必要です。",
    facts: commands.map(([id, title, keys]) => ({
      label: title,
      value: keys === null ? "Windows操作メッセージ" : next.get(id),
    })),
    actions: [],
  });
}
export async function activate(value: Context) {
  context = value;
  await refresh();
  active = true;
  for (const [id, title, keys] of commands)
    context.commands.register(
      "at365.web-browser-tools." + id,
      title,
      async (invocation) => {
        if (!active || invocation?.signal.aborted) return;
        return keys === null
          ? context.appdock.call("input.appCommand", { action: id })
          : context.appdock.call("input.sendKeys", { keys: bindings.get(id)! });
      },
    );
  dispose = context.settings.onChanged(refresh);
}
export async function deactivate() {
  active = false;
  dispose?.();
  dispose = undefined;
}
