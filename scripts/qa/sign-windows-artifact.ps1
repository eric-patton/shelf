param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$File
)

$ErrorActionPreference = "Stop"

foreach ($name in @(
    "ARTIFACT_SIGNING_ENDPOINT",
    "ARTIFACT_SIGNING_ACCOUNT",
    "ARTIFACT_SIGNING_PROFILE"
)) {
    if (-not [Environment]::GetEnvironmentVariable($name)) {
        throw "Required signing environment variable '$name' is missing."
    }
}

$resolvedFile = (Resolve-Path -LiteralPath $File).Path
$dlibRoots = @(
    "$env:ProgramFiles\Microsoft Artifact Signing Client Tools",
    "${env:ProgramFiles(x86)}\Microsoft Artifact Signing Client Tools",
    "$env:LOCALAPPDATA\Microsoft\Microsoft Artifact Signing Client Tools"
) | Where-Object { $_ -and (Test-Path -LiteralPath $_) }

$dlib = $dlibRoots |
    ForEach-Object {
        Get-ChildItem -LiteralPath $_ -Filter Azure.CodeSigning.Dlib.dll -Recurse -File
    } |
    Where-Object { $_.FullName -match '[\\/]x64[\\/]' } |
    Select-Object -First 1

if (-not $dlib) {
    throw "Azure.CodeSigning.Dlib.dll x64 was not found. Install Artifact Signing Client Tools."
}

$signTool = Get-ChildItem "${env:ProgramFiles(x86)}\Windows Kits\10\bin" `
    -Filter signtool.exe -Recurse -File |
    Where-Object { $_.FullName -match '[\\/]x64[\\/]signtool\.exe$' } |
    Sort-Object FullName -Descending |
    Select-Object -First 1

if (-not $signTool) {
    throw "A supported x64 Windows SDK signtool.exe was not found."
}

$metadataPath = Join-Path ([System.IO.Path]::GetTempPath()) (
    "shelf-artifact-signing-{0}.json" -f [guid]::NewGuid()
)
$metadata = @{
    Endpoint = $env:ARTIFACT_SIGNING_ENDPOINT
    CodeSigningAccountName = $env:ARTIFACT_SIGNING_ACCOUNT
    CertificateProfileName = $env:ARTIFACT_SIGNING_PROFILE
    CorrelationId = if ($env:GITHUB_RUN_ID) {
        "shelf-$($env:GITHUB_RUN_ID)-$($env:GITHUB_RUN_ATTEMPT)"
    } else {
        "shelf-local"
    }
}

try {
    $metadata | ConvertTo-Json | Set-Content -LiteralPath $metadataPath -Encoding utf8NoBOM
    & $signTool.FullName sign `
        /v `
        /fd SHA256 `
        /tr "http://timestamp.acs.microsoft.com" `
        /td SHA256 `
        /dlib $dlib.FullName `
        /dmdf $metadataPath `
        $resolvedFile
    if ($LASTEXITCODE -ne 0) {
        throw "Artifact Signing failed for '$resolvedFile' with exit code $LASTEXITCODE."
    }
} finally {
    Remove-Item -LiteralPath $metadataPath -ErrorAction SilentlyContinue
}
