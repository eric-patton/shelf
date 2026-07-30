param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern("^[A-Fa-f0-9]{40}$")]
    [string]$Thumbprint
)

$ErrorActionPreference = "Stop"
$expectedSubject = "CN=Shelf for Windows Local Pilot, O=Eric Patton"
$stores = @("My", "Root", "TrustedPublisher")
$matches = foreach ($storeName in $stores) {
    $path = "Cert:\CurrentUser\$storeName\$Thumbprint"
    if (Test-Path -LiteralPath $path) {
        $certificate = Get-Item -LiteralPath $path
        if ($certificate.Subject -ne $expectedSubject) {
            throw "Refusing to remove unexpected certificate '$Thumbprint' from CurrentUser\$storeName."
        }
        [pscustomobject]@{
            Store = $storeName
            Path = $path
        }
    }
}

if (-not $matches) {
    Write-Output "No matching Shelf for Windows pilot certificate was found."
    exit 0
}

foreach ($match in $matches) {
    Remove-Item -LiteralPath $match.Path
    Write-Output "Removed pilot certificate '$Thumbprint' from CurrentUser\$($match.Store)."
}
