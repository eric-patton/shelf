param(
    [string]$OutputDirectory = "src-tauri/target/webdriver"
)

$ErrorActionPreference = "Stop"
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputDirectory)
New-Item -ItemType Directory -Path $resolvedOutput -Force | Out-Null

$installerPath = Join-Path $resolvedOutput "MicrosoftEdgeWebview2Setup.exe"
$bootstrapperUri = "https://go.microsoft.com/fwlink/p/?LinkId=2124703"

try {
    Invoke-WebRequest -Uri $bootstrapperUri -OutFile $installerPath
    $installer = Start-Process -FilePath $installerPath `
        -ArgumentList "/silent", "/install" `
        -Wait `
        -PassThru
    $successExitCodes = @(0, -2147219416, -2147219187)
    if ($installer.ExitCode -notin $successExitCodes) {
        throw "WebView2 Evergreen Bootstrapper exited with code $($installer.ExitCode)."
    }
} finally {
    Remove-Item -LiteralPath $installerPath -Force -ErrorAction SilentlyContinue
}

Write-Output "Microsoft Edge WebView2 Evergreen Runtime is current."
$global:LASTEXITCODE = 0
