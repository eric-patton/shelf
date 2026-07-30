$ErrorActionPreference = "Stop"

function Assert-File {
    param(
        [string]$Path,
        [string]$Message
    )

    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        throw "$Message ($Path)"
    }
}

function Assert-Contains {
    param(
        [string]$Path,
        [string]$Pattern,
        [string]$Message
    )

    Assert-File -Path $Path -Message $Message
    $content = Get-Content -LiteralPath $Path -Raw
    if ($content -notmatch $Pattern) {
        throw "$Message ($Path)"
    }
}

function Assert-NotContains {
    param(
        [string]$Path,
        [string]$Pattern,
        [string]$Message
    )

    Assert-File -Path $Path -Message $Message
    $content = Get-Content -LiteralPath $Path -Raw
    if ($content -match $Pattern) {
        throw "$Message ($Path)"
    }
}

$package = Get-Content -LiteralPath "package.json" -Raw | ConvertFrom-Json
$pilotConfig = "src-tauri/tauri.windows-pilot.conf.json"
$pilotBuild = "scripts/qa/build-windows-pilot.ps1"
$pilotSigner = "scripts/qa/sign-windows-pilot.ps1"
$pilotRemoval = "scripts/qa/remove-windows-pilot-certificate.ps1"
$publicWorkflow = ".github/workflows/build.yml"

# feat-004/AC-12
if (
    $package.scripts."test:pilot" -notmatch "verify-windows-pilot-contract\.ps1" -or
    $package.scripts."build:pilot" -notmatch "build-windows-pilot\.ps1"
) {
    throw "Package scripts must expose the pilot contract and build entry points."
}

Assert-Contains $pilotConfig "signCommand" `
    "The pilot Tauri configuration must define a post-patch signing command."
Assert-Contains $pilotConfig "sign-windows-pilot\.ps1" `
    "The pilot Tauri configuration must use the local pilot signer."
Assert-Contains $pilotSigner "SHELF_PILOT_CERT_THUMBPRINT" `
    "Pilot signing must bind to the validated certificate thumbprint."
Assert-Contains $pilotSigner "/sha1" `
    "Pilot signing must select the exact certificate thumbprint."
Assert-Contains $pilotSigner "/tr" `
    "Pilot signing must request an RFC3161 timestamp."
Assert-NotContains $pilotSigner "(?i)Export-PfxCertificate|\.pfx|/f\s" `
    "Pilot signing must not export or load private signing material."

Assert-Contains $pilotBuild "New-SelfSignedCertificate" `
    "The pilot build must create a self-signed certificate when needed."
Assert-Contains $pilotBuild "KeyExportPolicy\s+NonExportable" `
    "The pilot private key must be non-exportable."
Assert-Contains $pilotBuild 'Cert:\\CurrentUser\\My' `
    "The pilot private key must remain in the current user's personal store."
Assert-Contains $pilotBuild '@\("Root", "TrustedPublisher"\)' `
    "The pilot public certificate must enter both current-user trust stores."
Assert-Contains $pilotBuild 'Cert:\\CurrentUser\\\$storeName' `
    "Pilot trust installation must remain in the current user's certificate stores."
Assert-Contains $pilotBuild "Export-Certificate" `
    "The pilot build must export only the public certificate."
Assert-Contains $pilotBuild "verify-windows-signatures\.ps1" `
    "The pilot build must verify every Authenticode signature."
Assert-Contains $pilotBuild 'sign-windows-pilot\.ps1"\) -File \$applicationPath' `
    "The pilot build must sign Tauri's restored standalone application after bundling."
Assert-Contains $pilotBuild "write-checksums\.ps1" `
    "The pilot build must write SHA-256 checksums."
Assert-Contains $pilotBuild "artifacts.windows-pilot" `
    "Pilot artifacts must be staged under the ignored local artifact directory."
Assert-NotContains $pilotBuild "(?i)Export-PfxCertificate|\.pfx" `
    "The pilot build must never export a PFX."
Assert-Contains $pilotRemoval 'ValidatePattern\("\^\[A-Fa-f0-9\]\{40\}\$"\)' `
    "Pilot certificate removal must require one exact thumbprint."
Assert-Contains $pilotRemoval "Refusing to remove unexpected certificate" `
    "Pilot certificate removal must validate the exact expected subject."
Assert-Contains $pilotRemoval "Remove-Item -LiteralPath" `
    "Pilot certificate removal must target only the resolved certificate paths."

Assert-Contains ".gitignore" "(?m)^artifacts/\r?$" `
    "Pilot artifacts must remain ignored by Git."
Assert-Contains "docs/releasing-windows.md" "Self-signed first-user pilot" `
    "The release runbook must document the pilot path."
Assert-Contains "docs/releasing-windows.md" "not for public distribution" `
    "The release runbook must prohibit publishing pilot artifacts."
Assert-Contains $publicWorkflow "azure/login@v3" `
    "The public tag workflow must retain Azure signing."
Assert-NotContains $publicWorkflow "windows-pilot|build:pilot|sign-windows-pilot" `
    "The public tag workflow must not use the self-signed pilot path."

Write-Output "Windows pilot contract passed."
