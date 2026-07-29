# Windows release runbook

This runbook covers Shelf's signed Windows 0.3.0 release path. It does not authorize publishing an
unsigned Windows asset.

## One-time Azure and GitHub setup

1. Create an Azure Artifact Signing account in a supported region.
2. Complete Public Trust identity validation.
3. Create a Public Trust certificate profile.
4. Grant the workload identity the Artifact Signing Certificate Profile Signer role.
5. Create an Azure workload identity federation entry for this repository and the protected
   `windows-release` GitHub environment.
6. Create the `windows-release` environment, require a release-owner approval, and restrict it to
   version tags.
7. Add repository secrets:
   - `AZURE_CLIENT_ID`
   - `AZURE_TENANT_ID`
   - `AZURE_SUBSCRIPTION_ID`
8. Add repository variables:
   - `ARTIFACT_SIGNING_ENDPOINT`
   - `ARTIFACT_SIGNING_ACCOUNT`
   - `ARTIFACT_SIGNING_PROFILE`
   - `WINDOWS_PUBLISHER_MATCH`

The workflow requests `id-token: write` only for the protected Windows job. Pull requests do not run
the signing job and never receive Azure signing authority.

## Automated tag path

A `v*` tag starts `.github/workflows/build.yml`:

1. macOS builds its existing Apple Silicon DMG.
2. Windows builds `shelf.exe` without bundling.
3. Azure Login exchanges the GitHub OIDC token.
4. The workflow installs Microsoft Artifact Signing Client Tools.
5. Tauri patches `shelf.exe` for each bundle and invokes its signing hook before embedding it.
6. Tauri invokes the same hook for the final MSI and NSIS installers.
7. PowerShell rejects an invalid signature, missing timestamp, or unexpected publisher.
8. The workflow writes SHA-256 checksum files.
9. The release job publishes assets only after macOS and Windows jobs succeed.

If signing setup is missing or invalid, the Windows job fails and no unsigned Windows asset is
published.

## Local release candidate

Local packaging is unsigned and is for verification only:

```powershell
npm ci
npm test
npm run build
cargo fmt --manifest-path src-tauri/Cargo.toml --check
cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings
cargo test --manifest-path src-tauri/Cargo.toml
npm audit --audit-level=high
npm run tauri build -- --bundles msi,nsis
```

Never upload the local unsigned Windows bundles to a public release.

## Clean-system matrix

Complete every row with signed release assets before marking Windows GA.

| Check | Windows 10 22H2 x64 | Windows 11 x64 |
|---|---|---|
| SHA-256 matches | Pending | Pending |
| EXE, MSI, and NSIS Authenticode valid and timestamped | Pending | Pending |
| Fresh MSI install and launch | Pending | Pending |
| Fresh NSIS install and launch | Pending | Pending |
| PowerShell 7 preferred | Pending | Pending |
| Windows PowerShell fallback | Pending | Pending |
| cmd selectable | Pending | Pending |
| Blank terminal command and process-tree close | Pending | Pending |
| Real Claude new and resume | Pending | Pending |
| Real Codex new and resume | Pending | Pending |
| Real pi new and resume | Pending | Pending |
| SSH new and resume for all providers | Pending | Pending |
| File preview, reveal, drag, and Recycle Bin delete | Pending | Pending |
| AI Organizer normal command | Pending | Pending |
| AI Organizer dangerous-command approval | Pending | Pending |
| Restart recovery | Pending | Pending |
| Upgrade from previous public release | Pending | Pending |
| Uninstall with no active process | Pending | Pending |

Record the tag, asset hashes, Windows build numbers, provider CLI versions, WebView2 version, signer
subject, timestamp certificate, and reviewer for each completed matrix.
