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
$workflow = Get-Content -LiteralPath ".github/workflows/build.yml" -Raw
$updateSource = Get-Content -LiteralPath "src-tauri/src/commands/update.rs" -Raw

# feat-004/AC-1
Assert-Contains ".github/workflows/ci.yml" "windows-latest" "CI must run on Windows"
Assert-Contains ".github/workflows/ci.yml" "windows-2022" "Desktop CI must use the compatible Windows image"
Assert-Contains ".github/workflows/ci.yml" "macos-latest" "CI must run on macOS"
Assert-Contains ".github/workflows/ci.yml" "cargo clippy.*-D warnings" "CI must deny Clippy warnings"
Assert-Contains ".github/workflows/ci.yml" "tauri build -- --debug --no-bundle" "CI must build debug Tauri"
Assert-Contains ".github/workflows/ci.yml" "update-webview2-runtime\.ps1" "Desktop CI must update WebView2 before matching Edge WebDriver"

# feat-004/AC-3
Assert-Contains ".github/workflows/ci.yml" "npm audit --audit-level=high" "CI must audit npm"
Assert-Contains ".github/workflows/ci.yml" "cargo-audit.*0\.22\.2" "CI must install the pinned Cargo audit tool"

# feat-004/AC-4
if ($package.version -ne "0.3.0" -or $tauri.version -ne "0.3.0" -or $cargo -notmatch '(?m)^version = "0\.3\.0"\r?$') {
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
Assert-Contains ".github/workflows/build.yml" "\*\*/\*\.msi" "Release must include MSI"
Assert-Contains ".github/workflows/build.yml" "\*\*/\*\.exe" "Release must include NSIS"
Assert-Contains ".github/workflows/build.yml" "SHA256SUMS" "Release must publish checksums"

# feat-004/AC-7
Assert-Contains "README.md" "Windows 10 22H2" "README must state the Windows baseline"
Assert-Contains "docs/windows.md" "Get-AuthenticodeSignature" "Windows guide must explain signature verification"
Assert-Contains "docs/releasing-windows.md" "Windows 11" "Release guide must include the Windows matrix"

# feat-004/AC-10
if (
    $package.name -ne "shelf-for-windows" -or
    $tauri.productName -ne "Shelf for Windows" -or
    $tauri.identifier -ne "com.ericpatton.shelf.windows" -or
    $tauri.bundle.windows.wix.upgradeCode -ne "7ef88bb7-6239-432c-a7f3-91ec0d158583" -or
    $cargo -notmatch '(?m)^name = "shelf-for-windows"\r?$'
) {
    throw "Package, application, and installer identities must belong to Shelf for Windows."
}
Assert-Contains "src-tauri/src/commands/update.rs" 'REPO_OWNER: &str = "eric-patton"' "Updates must come from the fork"
Assert-Contains "README.md" "independently maintained" "README must disclose independent maintenance"
Assert-Contains "README.md" "github\.com/eric-patton/shelf/releases" "README must link to fork releases"
Assert-Contains "LICENSE" "Permission is hereby granted" "The full MIT license must be present"
Assert-Contains "NOTICE" "github\.com/Harukaon/shelf" "Upstream attribution must be present"

# feat-004/AC-11
Assert-Contains ".github/workflows/build.yml" "environment: production-release" "Publication must use a protected environment"
Assert-Contains ".github/workflows/build.yml" "needs: \[windows\]" "Publication must wait for signed Windows artifacts"
Assert-Contains ".github/workflows/build.yml" "actions/download-artifact@v8" "Publication must download reviewed artifacts"
if ($workflow -match '(?m)^\s+macos:\s*\r?$' -or $workflow -match '\.dmg') {
    throw "The Windows-focused release workflow must not publish macOS assets."
}
$publishBlock = [regex]::Match($workflow, '(?ms)^  publish:\r?\n.*\z').Value
if (-not $publishBlock) {
    throw "The publish job was not found."
}
if ($publishBlock -match 'id-token:\s*write|azure/login|ARTIFACT_SIGNING_') {
    throw "The publication job must not receive Azure signing authority."
}
Assert-Contains "docs/releasing-windows.md" "repo:eric-patton/shelf:environment:windows-release" "Runbook must document the exact fork OIDC subject"

Write-Output "Release contract passed."
