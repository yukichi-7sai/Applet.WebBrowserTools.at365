const assert = require("node:assert/strict"),
  { test } = require("node:test");
const applet = require("../out/index.js");
test("key grammar rejects invalid edits and accepts previous aliases", () => {
  for (const value of [
    "",
    "Ctrl+",
    "Ctrl+Ctrl+A",
    "Ctrl+Control+A",
    "F25",
    "A+B",
    "%{F4}",
  ])
    assert.throws(() => applet.validateKeys(value));
  for (const value of [
    "Ctrl+Shift+T",
    "Control+A",
    "Win+Left",
    "F24",
    "Alt+F4",
  ])
    assert.equal(applet.validateKeys(value), value);
});
test("eleven stable commands use host input; atomic live settings, cancellation and disposal", async () => {
  const handlers = new Map(),
    values = {},
    calls = [],
    panels = [];
  let changed,
    disposed = false;
  await applet.activate({
    appdock: {
      call: async (method, params) => {
        calls.push({ method, params });
      },
    },
    commands: {
      register: (id, title, handler) =>
        handlers.set(id.split(".").at(-1), handler),
    },
    settings: {
      get: (key, fallback) => values[key] ?? fallback,
      onChanged: (f) => {
        changed = f;
        return () => {
          disposed = true;
        };
      },
    },
    ui: { showPanel: async (p) => panels.push(p) },
  });
  assert.equal(handlers.size, 11);
  for (const fn of handlers.values()) await fn();
  assert.equal(calls.filter((c) => c.method === "input.sendKeys").length, 8);
  assert.deepEqual(
    calls
      .filter((c) => c.method === "input.appCommand")
      .map((c) => c.params.action),
    ["back", "forward", "reload"],
  );
  values["keys.new-tab"] = "Ctrl+N";
  await changed();
  await handlers.get("new-tab")();
  assert.equal(calls.at(-1).params.keys, "Ctrl+N");
  values["keys.new-tab"] = "bad";
  await assert.rejects(changed);
  await handlers.get("new-tab")();
  assert.equal(calls.at(-1).params.keys, "Ctrl+N");
  const before = calls.length;
  await handlers.get("new-tab")({ signal: AbortSignal.abort() });
  assert.equal(calls.length, before);
  await applet.deactivate();
  await handlers.get("new-tab")();
  assert.equal(calls.length, before);
  assert.equal(disposed, true);
});
