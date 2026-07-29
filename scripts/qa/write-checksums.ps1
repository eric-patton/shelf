param(
    [Parameter(Mandatory = $true)]
    [string]$Path,
    [Parameter(Mandatory = $true)]
    [string]$OutputFile
)

$ErrorActionPreference = "Stop"
$root = (Resolve-Path -LiteralPath $Path).Path
$output = [System.IO.Path]::GetFullPath($OutputFile)
$files = Get-ChildItem -LiteralPath $root -Recurse -File |
    Where-Object {
        $_.FullName -ne $output -and $_.Extension -in @(".exe", ".msi", ".dmg")
    } |
    Sort-Object FullName

if (-not $files) {
    throw "No release assets were found under '$root'."
}

$lines = foreach ($file in $files) {
    $relative = [System.IO.Path]::GetRelativePath($root, $file.FullName).Replace("\", "/")
    $hash = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
    "$hash  $relative"
}

$lines | Set-Content -LiteralPath $output -Encoding utf8NoBOM
Write-Output $output
