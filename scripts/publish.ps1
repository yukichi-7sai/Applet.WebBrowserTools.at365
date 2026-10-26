param([string]$OutputDirectory, [string]$AppDockRoot)
$ErrorActionPreference = 'Stop'
$taskRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
. ([IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..\AppDock.at365\scripts\publish-paths.ps1')))
$taskArtifact = Get-PublishDirectory $taskRoot
$taskHostRoot = if ($AppDockRoot) { [IO.Path]::GetFullPath($AppDockRoot) } else { [IO.Path]::GetFullPath((Join-Path $taskRoot '..\AppDock.at365')) }
& (Join-Path $taskHostRoot 'setup-tools.bat')
if ($LASTEXITCODE -ne 0) { throw "AppDock tool setup failed ($LASTEXITCODE)" }
& (Join-Path $taskHostRoot 'dev.bat') install --frozen-lockfile
if ($LASTEXITCODE -ne 0) { throw "AppDock dependency preparation failed ($LASTEXITCODE)" }
$taskOutput = if ($OutputDirectory) { [IO.Path]::GetFullPath($OutputDirectory) } else { Join-Path $taskArtifact 'Applet.WebBrowserTools.at365' }
& (Join-Path $taskHostRoot 'dev.bat') exec node (Join-Path $PSScriptRoot 'build.cjs') --host $taskHostRoot --test --publish $taskOutput
if ($LASTEXITCODE -ne 0) { throw "WebBrowserTools build failed ($LASTEXITCODE)" }
& (Join-Path $taskHostRoot 'scripts\pack-applet-update.ps1') -SourceDirectory $taskOutput -OutputDirectory $taskArtifact

Install-PublishedDeployment $taskRoot $taskArtifact
