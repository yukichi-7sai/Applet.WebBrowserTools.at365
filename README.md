# Applet.WebBrowserTools.at365

## インストール方法

[AppDock](../AppDock.at365/README.md)を完全終了し、配布物の `extension.json` を含むフォルダー一式を、EXE隣の `extensions/Applet.WebBrowserTools.at365/` へ配置してください。AppDockを起動し、Applet管理で有効にすると利用できます。

## ビルド方法

Windowsと.NET 10 SDK、隣の `../AppDock.at365` に準備した固定Node・pnpm環境と依存パッケージを使用します。

本リポジトリのルートで実行します。

```powershell
.\publish.bat
```

出力先は `A:\40.ARTIFACT\Applet.WebBrowserTools.at365` です。詳しい手順と機能・操作・設定の文書は[開発ガイド](DEVELOPMENT.md)を参照してください。
