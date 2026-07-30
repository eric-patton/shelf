param(
    [string]$ArtifactRoot = "artifacts/windows-pilot"
)

$ErrorActionPreference = "Stop"
$expectedSubject = "CN=Shelf for Windows Local Pilot, O=Eric Patton"
$friendlyName = "Shelf for Windows Local Pilot"
$codeSigningOid = "1.3.6.1.5.5.7.3.3"

function Test-NonExportablePrivateKey {
    param(
        [System.Security.Cryptography.X509Certificates.X509Certificate2]$Certificate
    )

    $rsa = [System.Security.Cryptography.X509Certificates.RSACertificateExtensions]::
        GetRSAPrivateKey($Certificate)
    if (-not $rsa) {
        return $false
    }

    try {
        if ($rsa -isnot [System.Security.Cryptography.RSACng]) {
            return $false
        }
        $exportPolicy = $rsa.Key.ExportPolicy
        $exportFlags = [System.Security.Cryptography.CngExportPolicies]::AllowExport -bor
            [System.Security.Cryptography.CngExportPolicies]::AllowPlaintextExport -bor
            [System.Security.Cryptography.CngExportPolicies]::AllowArchiving -bor
            [System.Security.Cryptography.CngExportPolicies]::AllowPlaintextArchiving
        return (($exportPolicy -band $exportFlags) -eq 0)
    } finally {
        $rsa.Dispose()
    }
}

function Test-PilotCertificate {
    param(
        [System.Security.Cryptography.X509Certificates.X509Certificate2]$Certificate
    )

    if (
        $Certificate.Subject -ne $expectedSubject -or
        -not $Certificate.HasPrivateKey -or
        $Certificate.NotAfter -le (Get-Date).AddDays(7)
    ) {
        return $false
    }

    $ekuExtension = $Certificate.Extensions |
        Where-Object { $_.Oid.Value -eq "2.5.29.37" } |
        Select-Object -First 1
    $codeSigningEku = $ekuExtension.EnhancedKeyUsages |
        Where-Object { $_.Value -eq $codeSigningOid }
    return [bool]$codeSigningEku -and (Test-NonExportablePrivateKey -Certificate $Certificate)
}

function Add-PilotTrust {
    param(
        [System.Security.Cryptography.X509Certificates.X509Certificate2]$Certificate,
        [string]$PublicCertificatePath
    )

    Export-Certificate -Cert $Certificate -FilePath $PublicCertificatePath -Force | Out-Null
    foreach ($storeName in @("Root", "TrustedPublisher")) {
        $storePath = "Cert:\CurrentUser\$storeName"
        $trustedPath = Join-Path $storePath $Certificate.Thumbprint
        if (-not (Test-Path -LiteralPath $trustedPath)) {
            Import-Certificate -FilePath $PublicCertificatePath `
                -CertStoreLocation $storePath | Out-Null
        }
        $trusted = Get-Item -LiteralPath $trustedPath -ErrorAction Stop
        if ($trusted.Thumbprint -ne $Certificate.Thumbprint) {
            throw "The current-user $storeName store contains an unexpected pilot certificate."
        }
    }
}

if (-not $IsWindows) {
    throw "The Shelf for Windows pilot build can run only on Windows."
}

$repoRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..\..")).Path
$artifactRootPath = [System.IO.Path]::GetFullPath((Join-Path $repoRoot $ArtifactRoot))
$allowedArtifactRoot = [System.IO.Path]::GetFullPath(
    (Join-Path $repoRoot "artifacts\windows-pilot")
)
if (
    $artifactRootPath -ne $allowedArtifactRoot -and
    -not $artifactRootPath.StartsWith(
        "$allowedArtifactRoot$([System.IO.Path]::DirectorySeparatorChar)",
        [System.StringComparison]::OrdinalIgnoreCase
    )
) {
    throw "Pilot artifacts must remain under '$allowedArtifactRoot'."
}
New-Item -ItemType Directory -Path $artifactRootPath -Force | Out-Null

$certificate = Get-ChildItem Cert:\CurrentUser\My |
    Where-Object { Test-PilotCertificate -Certificate $_ } |
    Sort-Object NotAfter -Descending |
    Select-Object -First 1
if (-not $certificate) {
    $certificate = New-SelfSignedCertificate `
        -Type CodeSigningCert `
        -Subject $expectedSubject `
        -FriendlyName $friendlyName `
        -CertStoreLocation Cert:\CurrentUser\My `
        -HashAlgorithm SHA256 `
        -KeyAlgorithm RSA `
        -KeyLength 3072 `
        -KeyExportPolicy NonExportable `
        -NotAfter (Get-Date).AddMonths(6)
}
if (-not (Test-PilotCertificate -Certificate $certificate)) {
    throw "The selected pilot certificate failed subject, validity, EKU, or key-export validation."
}

$publicCertificatePath = Join-Path $artifactRootPath "ShelfForWindows-Pilot.cer"
Add-PilotTrust -Certificate $certificate -PublicCertificatePath $publicCertificatePath

$previousThumbprint = $env:SHELF_PILOT_CERT_THUMBPRINT
$previousSubject = $env:SHELF_PILOT_CERT_SUBJECT
$previousLocation = Get-Location
try {
    $env:SHELF_PILOT_CERT_THUMBPRINT = $certificate.Thumbprint
    $env:SHELF_PILOT_CERT_SUBJECT = $expectedSubject
    Set-Location -LiteralPath $repoRoot

    & npm run tauri build -- --bundles msi,nsis `
        --config src-tauri/tauri.windows-pilot.conf.json
    if ($LASTEXITCODE -ne 0) {
        throw "Tauri pilot packaging failed with exit code $LASTEXITCODE."
    }

    $applicationPath = Join-Path $repoRoot `
        "src-tauri\target\release\shelf-for-windows.exe"
    $msiRoot = Join-Path $repoRoot "src-tauri\target\release\bundle\msi"
    $nsisRoot = Join-Path $repoRoot "src-tauri\target\release\bundle\nsis"
    & (Join-Path $PSScriptRoot "sign-windows-pilot.ps1") -File $applicationPath
    foreach ($path in @($applicationPath, $msiRoot, $nsisRoot)) {
        & (Join-Path $PSScriptRoot "verify-windows-signatures.ps1") `
            -Path $path `
            -PublisherMatch "Shelf for Windows Local Pilot"
    }

    $pilotFiles = @(
        Get-Item -LiteralPath $applicationPath
        Get-ChildItem -LiteralPath $msiRoot -Filter *.msi -File
        Get-ChildItem -LiteralPath $nsisRoot -Filter *.exe -File
    )
    foreach ($file in $pilotFiles) {
        Copy-Item -LiteralPath $file.FullName -Destination $artifactRootPath -Force
    }

    $checksumPath = Join-Path $artifactRootPath "SHA256SUMS.windows-pilot.txt"
    & (Join-Path $PSScriptRoot "write-checksums.ps1") `
        -Path $artifactRootPath `
        -OutputFile $checksumPath | Out-Null

    $manifest = [ordered]@{
        product = "Shelf for Windows"
        purpose = "local-first-user-pilot"
        publicDistribution = $false
        certificateSubject = $certificate.Subject
        certificateThumbprint = $certificate.Thumbprint
        certificateNotBefore = $certificate.NotBefore.ToUniversalTime().ToString("o")
        certificateNotAfter = $certificate.NotAfter.ToUniversalTime().ToString("o")
        privateKeyExportable = $false
        trustScope = "CurrentUser Root and TrustedPublisher"
        timestampRequired = $true
        artifacts = @($pilotFiles | ForEach-Object { $_.Name })
    }
    $manifest | ConvertTo-Json -Depth 4 |
        Set-Content -LiteralPath (Join-Path $artifactRootPath "pilot-manifest.json") `
            -Encoding utf8NoBOM

    Write-Output "Shelf for Windows local pilot artifacts are ready:"
    Write-Output $artifactRootPath
    Write-Output "Certificate thumbprint: $($certificate.Thumbprint)"
    Write-Warning "These artifacts are trusted only for this Windows user and are not for public distribution."
} finally {
    Set-Location -LiteralPath $previousLocation
    $env:SHELF_PILOT_CERT_THUMBPRINT = $previousThumbprint
    $env:SHELF_PILOT_CERT_SUBJECT = $previousSubject
}
