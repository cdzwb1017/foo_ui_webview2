<#
.SYNOPSIS
    Builds the VitePress site and creates a zero-install Windows documentation ZIP.

.DESCRIPTION
    The archive includes the production VitePress output plus a loopback-only,
    read-only launcher implemented with Windows PowerShell 5.1 and .NET.
    End users do not need Node.js, Python, npm, administrator access, or Internet.
#>

param(
    [Parameter(Mandatory = $false)]
    [switch]$SkipBuild,

    [Parameter(Mandatory = $false)]
    [string]$OutputDir = 'dist'
)

$ErrorActionPreference = 'Stop'
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$DocsDir = Join-Path $ScriptDir 'docs\vitepress'
$DocsDistDir = Join-Path $DocsDir 'dist'
$LauncherDir = Join-Path $DocsDir 'offline'
$OutputPath = Join-Path $ScriptDir $OutputDir
$TempDir = Join-Path ([System.IO.Path]::GetTempPath()) ('foo-ui-webview2-docs-' + [guid]::NewGuid().ToString('N'))

$version = (Get-Content (Join-Path $ScriptDir 'VERSION') -Raw).Trim()
if ($version -notmatch '^\d+\.\d+\.\d+$') {
    throw "Invalid VERSION value: $version"
}

if (-not $SkipBuild) {
    Write-Host 'Building VitePress documentation...' -ForegroundColor Yellow
    & npm.cmd --prefix $DocsDir run build
    if ($LASTEXITCODE -ne 0) { throw 'VitePress build failed.' }
}

if (-not (Test-Path (Join-Path $DocsDistDir 'index.html') -PathType Leaf)) {
    throw 'docs/vitepress/dist is missing. Run without -SkipBuild first.'
}
foreach ($required in @('open-docs.cmd', 'serve-docs.ps1', 'README.txt')) {
    if (-not (Test-Path (Join-Path $LauncherDir $required) -PathType Leaf)) {
        throw "Offline launcher file is missing: $required"
    }
}

try {
    New-Item -Path $TempDir -ItemType Directory -Force | Out-Null
    Copy-Item (Join-Path $LauncherDir 'open-docs.cmd') $TempDir
    Copy-Item (Join-Path $LauncherDir 'serve-docs.ps1') $TempDir
    Copy-Item (Join-Path $LauncherDir 'README.txt') $TempDir
    Set-Content (Join-Path $TempDir 'VERSION') $version -Encoding ascii
    Copy-Item $DocsDistDir (Join-Path $TempDir 'foo_ui_webview2') -Recurse

    $buildInfo = [ordered]@{
        package = 'foo_ui_webview2 offline documentation'
        version = $version
        generatedAtUtc = [DateTime]::UtcNow.ToString('o')
        siteBase = '/foo_ui_webview2/'
        runtime = 'Windows 10/11 built-in Windows PowerShell 5.1, .NET Framework, and default browser'
    }
    $buildInfo | ConvertTo-Json | Set-Content (Join-Path $TempDir 'BUILD_INFO.json') -Encoding utf8

    New-Item -Path $OutputPath -ItemType Directory -Force | Out-Null
    $zipPath = Join-Path $OutputPath "foo_ui_webview2-docs-$version.zip"
    if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::CreateFromDirectory(
        $TempDir,
        $zipPath,
        [System.IO.Compression.CompressionLevel]::Optimal,
        $false
    )

    $fileCount = (Get-ChildItem $TempDir -Recurse -File).Count
    $sizeMiB = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
    Write-Host "Created: $zipPath" -ForegroundColor Green
    Write-Host "Files: $fileCount; compressed size: $sizeMiB MiB"
} finally {
    if (Test-Path $TempDir) { Remove-Item $TempDir -Recurse -Force }
}
