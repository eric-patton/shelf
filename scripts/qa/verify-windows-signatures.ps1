param(
    [Parameter(Mandatory = $true)]
    [string]$Path,
    [string]$PublisherMatch = ""
)

$ErrorActionPreference = "Stop"
$resolvedPath = Resolve-Path -LiteralPath $Path
$files = if ((Get-Item -LiteralPath $resolvedPath).PSIsContainer) {
    Get-ChildItem -LiteralPath $resolvedPath -Recurse -File |
        Where-Object { $_.Extension -in @(".exe", ".msi") }
} else {
    @(Get-Item -LiteralPath $resolvedPath)
}

if (-not $files) {
    throw "No Windows executable or installer was found under '$resolvedPath'."
}

foreach ($file in $files) {
    $signature = Get-AuthenticodeSignature -LiteralPath $file.FullName
    if ($signature.Status -ne "Valid") {
        throw "Invalid Authenticode signature for '$($file.FullName)': $($signature.Status)"
    }
    if (-not $signature.TimeStamperCertificate) {
        throw "Missing RFC3161 timestamp for '$($file.FullName)'."
    }
    if ($PublisherMatch -and $signature.SignerCertificate.Subject -notlike "*$PublisherMatch*") {
        throw "Unexpected publisher for '$($file.FullName)': $($signature.SignerCertificate.Subject)"
    }
    Write-Output "Valid signature: $($file.FullName)"
}
