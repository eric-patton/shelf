param(
    [string]$OutputDirectory = "src-tauri/target/webdriver"
)

$ErrorActionPreference = "Stop"
$runtimeRoots = @(
    "${env:ProgramFiles(x86)}\Microsoft\EdgeWebView\Application",
    "$env:ProgramFiles\Microsoft\EdgeWebView\Application",
    "$env:LOCALAPPDATA\Microsoft\EdgeWebView\Application"
)

$version = $null
foreach ($root in $runtimeRoots) {
    if (-not (Test-Path -LiteralPath $root)) {
        continue
    }
    $version = Get-ChildItem -LiteralPath $root -Directory |
        Where-Object { $_.Name -match '^\d+\.\d+\.\d+\.\d+$' } |
        Sort-Object { [version]$_.Name } -Descending |
        Select-Object -First 1 -ExpandProperty Name
    if ($version) {
        break
    }
}

if (-not $version) {
    throw "Microsoft Edge WebView2 Runtime was not found."
}

Write-Output "Microsoft Edge WebView2 Runtime: $version"

$resolvedOutput = [System.IO.Path]::GetFullPath($OutputDirectory)
New-Item -ItemType Directory -Path $resolvedOutput -Force | Out-Null
$driverPath = Join-Path $resolvedOutput "msedgedriver.exe"
if (Test-Path -LiteralPath $driverPath) {
    $driverVersionOutput = & $driverPath --version
    $installedVersion = $driverVersionOutput -replace '^.*?(\d+\.\d+\.\d+\.\d+).*$', '$1'
    if ($installedVersion -eq $version) {
        Write-Output "Microsoft Edge WebDriver: $installedVersion"
        Write-Output "Microsoft Edge WebDriver path: $driverPath"
        exit 0
    }
}

$archive = Join-Path $resolvedOutput "edgedriver_win64.zip"
$uri = "https://msedgedriver.microsoft.com/$version/edgedriver_win64.zip"
Invoke-WebRequest -Uri $uri -OutFile $archive
Expand-Archive -LiteralPath $archive -DestinationPath $resolvedOutput -Force
Remove-Item -LiteralPath $archive

if (-not (Test-Path -LiteralPath $driverPath)) {
    throw "Edge WebDriver download did not contain msedgedriver.exe."
}

$driverVersionOutput = & $driverPath --version
$installedVersion = $driverVersionOutput -replace '^.*?(\d+\.\d+\.\d+\.\d+).*$', '$1'
Write-Output "Microsoft Edge WebDriver: $installedVersion"
Write-Output "Microsoft Edge WebDriver path: $driverPath"
