# WebBrowserTools 開発ガイド

## 発行・配置ファイルの保存先

標準発行先は `A:\40.ARTIFACT\Applet.WebBrowserTools.at365` です。`publish.bat`はソースrepo、`deploy.bat`は発行先から実行します。配置用ファイル・設定の保持とテンプレートの更新は[共通発行手順](../AppDock.at365/docs/publishing.md)を参照してください。

実装・コミット・リリースの段階別検証は[本体共通手順](../AppDock.at365/docs/development-workflow.md)に従います。利用者向けは[README](README.md)、実測結果は[VERIFICATION](VERIFICATION.md)です。

## ビルド・配置

0.3.2からsrc/index.tsをJavaScriptへ変換するNode Appletです。隣接するAppDock.at365のtoolchain.jsonに固定したローカルNodeとTypeScriptを使います。グローバル環境やApplet固有の依存追加は不要です。更新ZIP生成には既存の.NET 10 SDKを使います。

```bat
publish.bat
publish.bat -OutputDirectory "C:\Temp\WebBrowserTools" -AppDockRoot "C:\Source\AppDock.at365"
A:\40.ARTIFACT\Applet.WebBrowserTools.at365\deploy.bat "C:\Apps\AppDock.at365"
```

publishは型検査・Applet単体試験後、index.jsとextension.jsonをA:/40.ARTIFACT/Applet.WebBrowserTools.at365/Applet.WebBrowserTools.at365へ、共通パッカーでupdate.zip/update.jsonを標準発行先へ生成します。指定OutputDirectoryでも更新ZIP/JSONの出力は`A:\40.ARTIFACT\Applet.WebBrowserTools.at365`です。公開・実利用配置はしません。

deployは通常publishの2ファイルをextensions/Applet.WebBrowserTools.at365へコピーし、旧Applet EXE/DLL/deps.json/runtimeconfig.jsonだけを取り除きます。対象AppDockを終了してから実行してください。引数なしでは[記入例](deployment/deploy.local.txt.example)に従うdeploy.local.txtを使い、両方未指定なら配置しません。ホストEXE・設定・データは変更しません。

## 実装

11個の安定IDを一度登録し、settings.onChangedで全送信キーを検証してから参照先をまとめて入れ替えます。不正変更では直前の有効設定を保持します。キー文法は従来の修飾キーと1キーの組です。自己設定には従来settings APIを使います。

8操作はinput.sendKeys、戻る/進む/リロードはinput.appCommand（back/forward/reload）を呼びます。通常リロードとスーパーリロードを分け、Watchの旧Reloadは後者のCtrl+F5に相当します。汎用APPCOMMAND_CLOSE/NEWは使用しません。OS処理・対象ウィンドウ検査・物理キー待機・再入抑止・取消は[本体共通操作API](../AppDock.at365/docs/appdock-api.md)に集約しています。

最低本体版0.26.37、appdock-api capability、全Applet共通sendInput許可を必要とします。Node workerが実行文脈と取消を伝播するため、Applet独自の実行元判定は行いません。MCPから明示公開されたコマンドを経由する呼出しも許可する設計です。このAppletの操作コマンドは現manifestでは外部公開を追加していません。

## 検証

```powershell
..\AppDock.at365\.tools\node\24.21.0\node.exe scripts/build.cjs --test
..\AppDock.at365\.tools\node\24.21.0\node.exe scripts/test-host.cjs
```

単体試験は文法・11操作・設定即時反映・不正変更の原子性・取消・停止を確認します。host試験は旧ジェスチャー設定移行・設定UI・再起動・停止を確認し、割り当て編集自体は本体の専用GUI試験で検証します。第1引数にホストrepo、第2引数にwin-unpacked EXEを渡せます。

実キー/操作メッセージは本体scripts/native-input-ui-test.cjsが専用ウィンドウで確認します。従来の.NET Applet/専用入力・ジェスチャー試験は本体へ移した処理の重複を避けるため削除しました。共通入力と物理ジェスチャーの試験は本体側へ集約します。GUIは直列で実行してください。

## ジェスチャーと文書

本体管理ジェスチャー・開始対象・取消・初期値・旧設定移行の正本は[本体ジェスチャー仕様](../AppDock.at365/docs/gestures.md)です。初期8操作のmanifest宣言と既存キー・IDを維持します。Appletに対象ブラウザ検査や入力フックを置きません。

更新配布物は[共通更新仕様](../AppDock.at365/docs/updates.md)と[確認手順](../AppDock.at365/docs/update-checklist.md)を参照してください。生成物は.artifactsへ保存し、[本体の整理手順](../AppDock.at365/DEVELOPMENT.md#作業完了時のテストフォルダー整理)に従います。過去記録の旧パスは履歴値として保持します。READMEは利用案内、開発情報は本書、検証結果はVERIFICATIONへ分けます。

## 設定画面の構成

`extension.json`の`settingSections`で用途別のカードを宣言します。描画・余白・入力・検索・保存は[本体の共通テンプレート](../AppDock.at365/docs/extensions.md#共通の設定ページ)へ委譲し、Applet固有の設定フォームやCSSを複製しません。設定キー・既定値・実行処理を変えずに並び順を調整できます。最低本体版は0.36.8です。
