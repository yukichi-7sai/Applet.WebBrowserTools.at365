# 検証記録

## 2026-10-29: 情報metadataのコミット前照合

- icon/taglineと版の変更、配置manifest/entry、更新ZIP/feedを先行発行時の入力とSHA256へ照合し一致。本体0.101.9の固定EXEでも既存8Appletの情報表示を確認した。実装入力は不変で、先行の発行・表示試験を再利用し、追加の版更新・再発行は行わない。
- 共通レビューと再利用判断は`../AppDock.at365/.artifacts/commit-validation-applet-information-20261029/{review,reuse,validation}.json`、stage/commitとGitHub origin/mainの照合結果は同じ場所の`stage.json`・`commits.json`・`push.json`を参照する。先行の検証資料は保持。実サービス・実利用のApplet起動・GitHub Release・実利用deployは今回の検証対象外。

対象の現行版は`0.3.6`。以下は記録した条件での検証結果であり、外部サービスや実機条件の現在の動作保証とは区別する。

## 2026-10-29: Applet情報のアイコンとキャッチコピー 0.3.6

- main/追跡先とcleanを確認し、通常環境のpull --ff-only後に、manifestの任意表示情報 `icon: mouse` と `tagline: ブラウザー操作を、指先ひとつで。` を設定。設定・コマンド・保存・権限・最低本体版は変更せず、0.3.5→0.3.6のパッチ更新として関連する版の正本を揃えた。発行前にmetadataと版の差分をレビューし、阻害事項なし。
- 標準publish.batで40.ARTIFACTへ発行。配置manifest/ZIP内manifest/feedのID・版・icon/tagline、ZIPのサイズ/SHA256を照合し成功。native/.NETはProductVersionも一致。本体0.101.6の固定EXEへ発行物をコピーし、停止状態で情報パネルの表示を確認した。通常のApplet起動や外部サービス・実入力は実行していない。
- 共通の入力・完全ログ・配布照合は`../AppDock.at365/.artifacts/applet-branding-20261029/`、本体の`VERIFICATION.md`、本repoの`.artifacts/applet-branding-20261029/validation.json`を参照。機能別の標準全回帰は今回実行せず、表示情報と配布の影響に必要な範囲を検証した。既存の再利用資料を保持し、今回の整理による削除なし。コミット/プッシュ/Release/実利用deployは行っていない。

## 2026-10-26: 全変更Appletのローカルコミット照合

- publish内のTypeScript検査・単体2/2・セットアップ初回／再実行・発行成功を再利用。製品／試験／発行スクリプトと依存版は不変。今回の変更は表示名と固定ツール／依存準備を通すpublish修正。
- 各repoの実装時入力一覧と現在のソースを照合。host toolchain／lockfile／SDK／Runtimeは一致し、package.jsonのdependencies／devDependencies／scripts／packageManager／enginesも一致。UI側は実装時から更新されているため、最新の固定EXEで4Appletの表示名／版・起動停止を追加検証し成功。.artifacts/commit-validation-applets-20261026/reuse.jsonへ試験単位の判断を記録。
- 全4件のfeed／ZIP hashを確認。新たな製品修正はなく、現発行版を維持する。新GUI証跡は../Applet.WebBrowserTools.at365/.artifacts/commit-validation-applets-20261026/のpublished-smoke.log、smoke-result.json。設定は隔離profileのみで、既定ショートカット初期化をfixtureで抑止し、Pause／F13～F24の送信・OS登録なし。
- commit前後の入力・stage tree／commit treeとcommit SHAは各.artifacts/commit-validation-applets-20261026/へ保存する。今回の差分を1repoずつローカルcommitし、push・Release・実利用deployは行わない。旧検証資料は参照中として保持、削除0件。
## 2026-10-26: 表示名と発行（0.3.5）

- 既存のdisplayName変更を確認。表示名はWebBrowserTools、内部name／id／entry・設定・公開APIは保持。開始時はmainで未コミット変更があったため、自動pull／stashは行わず既存差分を保持した。通常修正としてパッチ番号を1つ更新。
- 発行前にmanifest／版／発行スクリプトと影響先をレビューし、阻害指摘なし。レビュー記録は.artifacts/displayname-publish-20261026/review.json。
- 原因はtoolchain.json指定のNode 24.22.1がこの端末に未導入で、旧24.21.0用environment.batが残っていたこと。publish.ps1を、隣接AppDockのsetup-tools.bat → dev.bat install --frozen-lockfile → dev.bat exec nodeでのビルドへ変更。各段階の終了コードを検査する。AppDockRootはスクリプトの場所から相対的に解決し、固定のドライブ／30.PROJECTパスを追加していない。
- 修正済みpublish.batで初回ツール準備、固定依存の照合、TypeScriptビルド、単体2/2、ZIP/feed作成に成功。setup-tools.bat再実行も成功。公開元・SHA256／LTS・待機／供給網ポリシーを維持。Windows PowerShellのモジュール探索パスは試験プロセス内だけ既存のシステム値へ指定し、永続変更なし。
- publish.batは終了コード0。40.ARTIFACTの配布manifest／実行ファイル／update.jsonの版、ZIPの全エントリー・サイズ・SHA256と配布フォルダーの一致を確認。package-result.jsonに記録。既存deploy関連ファイルを保持。
- 固定の発行済みAppDock 0.94.4へ4つの発行物をそのままコピーし、コピーhash一致、snapshotの内部名／表示名／版と管理画面の4行を確認。Watch／WebBrowserTools／WindowsToolsの起動・停止、ホストの終了コード0を確認。共通証跡は../Applet.WebBrowserTools.at365/.artifacts/displayname-publish-20261026/のpublished-smoke.cjs、smoke-result.json、displaynames.png、host-inputs.json。参照ソースはAppDock main 0.94.3で、固定EXEは0.94.4。
- 各repoの同名.artifactsフォルダーへ入力hash、コマンド／終了コード、完全ログとそのhashを保存。検証後の製品入力は一致。使用方法と設計の版表記のみの文書修正は製品試験へ影響しない。ホスト全回帰／旧GUI全回帰／実ブラウザーや物理入力は変更範囲外として未実施。
- 整理は各.artifacts直下を列挙してcleanup.jsonへ記録。今回の試験は同じ方式の成功1回として保持。他の古い資料は参照・実行方式・所有が確定しないため保持、削除0件。隔離ホストとAppletは終了済み。commit／push／Release／実利用deployなし。
## 2026-10-19: GitHub更新元の新アカウント対応（0.3.4）

- 開始時main／clean、現在のorigin/mainからpull --ff-only成功（Already up to date）。更新元を`yukichi-7sai/Applet.WebBrowserTools.at365`へ統一。updateRepository未登録を追加。publish.batの型検査・ビルドと標準2/2成功。

- 発行前レビューは指摘なし。設定項目・保存ファイル・公開APIの追加削除なしのためパッチ更新。既存publish.batで自身の40.ARTIFACT配下へ発行成功。ZIP/feed/同梱manifestのID・版・size・SHA256・runtimeの存在が一致。

- 最終AppDock 0.62.4 EXE（SHA256 043d72acd4f4176d0417bbc4166a111cecc5aaa7e8740baf21b8d6647b0e85ab）と最終Applet一式を隔離コピー。全6Appletを停止した状態で、保存済み旧指定の保持、新しい既定値の説明、版表示、「既定に戻す」後の画面／メモリ／settings.jsonの一致、停止状態維持を各Appletで確認。正常終了0。

- 証跡: `.artifacts/github-account-20261019/validation.json`。共通GUI/画像: `../AppDock.at365/.artifacts/applet-github-account-20261019/profile-1792345747763/`。入力hashは前後一致、hostはb27bd046b704e1a27ad31fdc2f481f80ea086b31。変更と無関係な全回帰・実アカウント・実Google受信・実GitHub Release取得・各機能の実Windows効果は未実施。今回と過去の成功/失敗・再利用資料を保持し削除0件。

- 本体のGitHub参照修正は先にb27bd04へコミット済み。今回のApplet変更は未コミット。push・Release・実利用先deployなし。
