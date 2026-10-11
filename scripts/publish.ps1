param([string]$OutputDirectory, [string]$AppDockRoot)
$ErrorActionPreference = 'Stop'
$taskRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$taskHostRoot = if ($AppDockRoot) { [IO.Path]::GetFullPath($AppDockRoot) } else { [IO.Path]::GetFullPath((Join-Path $taskRoot '..\AppDock.at365')) }
$taskToolchain = Get-Content (Join-Path $taskHostRoot 'toolchain.json') -Raw | ConvertFrom-Json
$taskNode = Join-Path $taskHostRoot ".tools\node\$($taskToolchain.node)\node.exe"
$taskOutput = if ($OutputDirectory) { [IO.Path]::GetFullPath($OutputDirectory) } else { Join-Path $taskRoot 'publish\Applet.WebBrowserTools.at365' }
& $taskNode (Join-Path $PSScriptRoot 'build.cjs') --host $taskHostRoot --test --publish $taskOutput
if ($LASTEXITCODE -ne 0) { throw "WebBrowserTools build failed ($LASTEXITCODE)" }
& (Join-Path $taskHostRoot 'scripts\pack-applet-update.ps1') -SourceDirectory $taskOutput -OutputDirectory (Join-Path $taskRoot 'publish')
