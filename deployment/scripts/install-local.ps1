param([string]$AppDockDirectory)
$ErrorActionPreference = 'Stop'
$taskRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
if (-not $AppDockDirectory) {
    $taskConfig = Join-Path $taskRoot 'deploy.local.txt'
    if (Test-Path -LiteralPath $taskConfig -PathType Leaf) { $AppDockDirectory = Get-Content -LiteralPath $taskConfig -Encoding UTF8 -TotalCount 1 }
}
if ([string]::IsNullOrWhiteSpace($AppDockDirectory)) { throw 'Pass an AppDock directory or create deploy.local.txt.' }
$taskHost = [IO.Path]::GetFullPath($AppDockDirectory)
if (-not (Test-Path -LiteralPath (Join-Path $taskHost 'AppDock.at365.exe') -PathType Leaf)) { throw 'AppDock.at365.exeがあるフォルダーを指定してください。' }
$taskSource = Join-Path $taskRoot 'Applet.WebBrowserTools.at365'
$taskFiles = @('index.js', 'extension.json')
foreach ($taskFile in $taskFiles) {
    if (-not (Test-Path -LiteralPath (Join-Path $taskSource $taskFile) -PathType Leaf)) { throw '先にpublish.batを実行してください。' }
}
$taskDestination = Join-Path $taskHost 'extensions\Applet.WebBrowserTools.at365'
New-Item -ItemType Directory -Path $taskDestination -Force | Out-Null
foreach ($taskFile in $taskFiles) { Copy-Item -LiteralPath (Join-Path $taskSource $taskFile) -Destination (Join-Path $taskDestination $taskFile) -Force }
foreach ($taskOldName in @('Applet.WebBrowserTools.at365.exe', 'Applet.WebBrowserTools.at365.dll', 'Applet.WebBrowserTools.at365.deps.json', 'Applet.WebBrowserTools.at365.runtimeconfig.json')) {
    $taskOldFile = Join-Path $taskDestination $taskOldName
    if (Test-Path -LiteralPath $taskOldFile -PathType Leaf) { Remove-Item -LiteralPath $taskOldFile }
}
Write-Output "Appletを配置しました: $taskDestination"
Write-Output 'AppDockを起動し直し、Applet.WebBrowserTools.at365を有効にしてください。'
