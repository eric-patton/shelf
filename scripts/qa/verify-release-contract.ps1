$ErrorActionPreference = "Stop"

function Assert-Contains {
    param(
        [string]$Path,
        [string]$Pattern,
        [string]$Message
    )
    $content = Get-Content -LiteralPath $Path -Raw
    if ($content -notmatch $Pattern) {
        throw "$Message ($Path)"
    }
}

$package = Get-Content -LiteralPath "package.json" -Raw | ConvertFrom-Json
$tauri = Get-Content -LiteralPath "src-tauri/tauri.conf.json" -Raw | ConvertFrom-Json
$releaseConfig = Get-Content -LiteralPath "src-tauri/tauri.windows-release.conf.json" -Raw |
    ConvertFrom-Json
$cargo = Get-Content -LiteralPath "src-tauri/Cargo.toml" -Raw

# feat-004/AC-1
Assert-Contains ".github/workflows/ci.yml" "windows-latest" "CI must run on Windows"
Assert-Contains ".github/workflows/ci.yml" "macos-latest" "CI must run on macOS"
Assert-Contains ".github/workflows/ci.yml" "cargo clippy.*-D warnings" "CI must deny Clippy warnings"
Assert-Contains ".github/workflows/ci.yml" "tauri build -- --debug --no-bundle" "CI must build debug Tauri"

# feat-004/AC-3
Assert-Contains ".github/workflows/ci.yml" "npm audit --audit-level=high" "CI must audit npm"
Assert-Contains ".github/workflows/ci.yml" "cargo-audit.*0\.22\.2" "CI must install the pinned Cargo audit tool"

# feat-004/AC-4
if ($package.version -ne "0.3.0" -or $tauri.version -ne "0.3.0" -or $cargo -notmatch '(?m)^version = "0\.3\.0"$') {
    throw "Package, Tauri, and Cargo versions must all be 0.3.0."
}
Assert-Contains ".github/workflows/build.yml" "bundles msi,nsis" "Release must build MSI and NSIS"

# feat-004/AC-5
Assert-Contains ".github/workflows/build.yml" "id-token: write" "Release must request OIDC"
Assert-Contains ".github/workflows/build.yml" "azure/login@v3" "Release must use Azure Login"
Assert-Contains ".github/workflows/build.yml" "ArtifactSigningClientTools" "Release must install Artifact Signing Client Tools"
Assert-Contains "src-tauri/tauri.windows-release.conf.json" "signCommand" "Tauri must sign after bundle patching"
Assert-Contains "src-tauri/tauri.windows-release.conf.json" "sign-windows-artifact\.ps1" "Tauri must call the Artifact Signing wrapper"
if (
    $releaseConfig.bundle.windows.signCommand.cmd -ne "pwsh" -or
    "../scripts/qa/sign-windows-artifact.ps1" -notin $releaseConfig.bundle.windows.signCommand.args -or
    "%1" -notin $releaseConfig.bundle.windows.signCommand.args
) {
    throw "Tauri must invoke the repository signing wrapper from its src-tauri working directory."
}
Assert-Contains ".github/workflows/build.yml" "verify-windows-signatures\.ps1" "Release must verify signatures"
Assert-Contains ".github/workflows/build.yml" "environment: windows-release" "Release must use protected environment"

# feat-004/AC-6
Assert-Contains ".github/workflows/build.yml" "\*\*/\*\.dmg" "Release must include DMG"
Assert-Contains ".github/workflows/build.yml" "\*\*/\*\.msi" "Release must include MSI"
Assert-Contains ".github/workflows/build.yml" "\*\*/\*\.exe" "Release must include NSIS"
Assert-Contains ".github/workflows/build.yml" "SHA256SUMS" "Release must publish checksums"

# feat-004/AC-7
Assert-Contains "README.md" "Windows 10 22H2" "README must state the Windows baseline"
Assert-Contains "docs/windows.md" "Get-AuthenticodeSignature" "Windows guide must explain signature verification"
Assert-Contains "docs/releasing-windows.md" "Windows 11" "Release guide must include the Windows matrix"

Write-Output "Release contract passed."
