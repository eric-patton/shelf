param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$File
)

$ErrorActionPreference = "Stop"

$thumbprint = $env:SHELF_PILOT_CERT_THUMBPRINT
$expectedSubject = $env:SHELF_PILOT_CERT_SUBJECT
if ($thumbprint -notmatch "^[A-Fa-f0-9]{40}$") {
    throw "SHELF_PILOT_CERT_THUMBPRINT must contain one exact SHA-1 certificate thumbprint."
}
if ([string]::IsNullOrWhiteSpace($expectedSubject)) {
    throw "SHELF_PILOT_CERT_SUBJECT is required."
}

$certificatePath = "Cert:\CurrentUser\My\$thumbprint"
$certificate = Get-Item -LiteralPath $certificatePath -ErrorAction Stop
if ($certificate.Subject -ne $expectedSubject) {
    throw "Pilot certificate subject mismatch for thumbprint '$thumbprint'."
}
if (-not $certificate.HasPrivateKey) {
    throw "Pilot certificate '$thumbprint' does not have a private key."
}
if ($certificate.NotAfter -le (Get-Date).AddDays(7)) {
    throw "Pilot certificate '$thumbprint' is expired or expires within seven days."
}
$ekuExtension = $certificate.Extensions |
    Where-Object { $_.Oid.Value -eq "2.5.29.37" } |
    Select-Object -First 1
$codeSigningEku = $ekuExtension.EnhancedKeyUsages |
    Where-Object { $_.Value -eq "1.3.6.1.5.5.7.3.3" }
if (-not $codeSigningEku) {
    throw "Pilot certificate '$thumbprint' is not valid for code signing."
}

$resolvedFile = (Resolve-Path -LiteralPath $File).Path
$signTool = Get-ChildItem "${env:ProgramFiles(x86)}\Windows Kits\10\bin" `
    -Filter signtool.exe -Recurse -File |
    Where-Object { $_.FullName -match '[\\/]x64[\\/]signtool\.exe$' } |
    Sort-Object FullName -Descending |
    Select-Object -First 1

if (-not $signTool) {
    throw "A supported x64 Windows SDK signtool.exe was not found."
}

& $signTool.FullName sign `
    /v `
    /fd SHA256 `
    /sha1 $thumbprint `
    /s My `
    /tr "http://timestamp.digicert.com" `
    /td SHA256 `
    /d "Shelf for Windows Local Pilot" `
    $resolvedFile
if ($LASTEXITCODE -ne 0) {
    throw "Local pilot signing failed for '$resolvedFile' with exit code $LASTEXITCODE."
}

$signature = Get-AuthenticodeSignature -LiteralPath $resolvedFile
if ($signature.Status -ne "Valid") {
    throw "Local pilot signature is not valid for '$resolvedFile': $($signature.Status)"
}
if ($signature.SignerCertificate.Thumbprint -ne $thumbprint) {
    throw "Local pilot signature used an unexpected certificate for '$resolvedFile'."
}
if (-not $signature.TimeStamperCertificate) {
    throw "Local pilot signature is missing its RFC3161 timestamp for '$resolvedFile'."
}
