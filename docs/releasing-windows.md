# Shelf for Windows release runbook

This runbook covers the independently maintained Shelf for Windows 0.3.0 release path from
`eric-patton/shelf`. It does not authorize publishing an unsigned Windows asset.

## One-time Azure and GitHub setup

1. Create an Azure Artifact Signing account in a supported region.
2. Complete Public Trust identity validation.
3. Create a Public Trust certificate profile.
4. Create or select a Microsoft Entra application or user-assigned managed identity for the
   workflow. Record its client ID, tenant ID, and Azure subscription ID.
5. Grant that workload identity the Artifact Signing Certificate Profile Signer role at the
   certificate profile scope.
6. Create a federated identity credential with these exact values:
   - Issuer: `https://token.actions.githubusercontent.com`
   - Audience: `api://AzureADTokenExchange`
   - Subject:
     `repo:eric-patton@248889511/shelf@1316644982:environment:windows-release`
7. Verify the live GitHub OIDC configuration before creating the credential:

   ```powershell
   gh api repos/eric-patton/shelf/actions/oidc/customization/sub
   ```

   This fork was created after GitHub's 2026-07-15 immutable-subject cutoff. Its live prefix is
   `repo:eric-patton@248889511/shelf@1316644982`, where `248889511` is the owner ID and
   `1316644982` is the repository ID. Do not use the older name-only subject. An ordinary rename
   keeps these IDs, while a transfer or replacement repository requires a new review.
8. Create the `windows-release` environment, require a release-owner approval, and restrict it to
   version tags.
9. Create the `production-release` environment, require a release-owner approval, and restrict it to
   version tags. This environment receives no Azure identity.
10. Add repository secrets:
   - `AZURE_CLIENT_ID`
   - `AZURE_TENANT_ID`
   - `AZURE_SUBSCRIPTION_ID`
11. Add repository variables:
   - `ARTIFACT_SIGNING_ENDPOINT`
   - `ARTIFACT_SIGNING_ACCOUNT`
   - `ARTIFACT_SIGNING_PROFILE`
   - `WINDOWS_PUBLISHER_MATCH`

The workflow requests `id-token: write` only for the protected Windows signing job. Pull requests and
the public publication job never receive Azure signing authority.

## Automated tag path

A `v*` tag starts `.github/workflows/build.yml`:

1. Windows builds `shelf-for-windows.exe` without bundling.
2. Azure Login exchanges the GitHub OIDC token.
3. The workflow installs Microsoft Artifact Signing Client Tools.
4. Tauri patches `shelf-for-windows.exe` for each bundle and invokes its signing hook before
   embedding it.
5. Tauri invokes the same hook for the final MSI and NSIS installers.
6. PowerShell rejects an invalid signature, missing timestamp, or unexpected publisher.
7. The workflow writes SHA-256 checksum files.
8. The workflow privately uploads the signed Windows assets for clean-system review.
9. The `publish` job waits for approval of the separate `production-release` environment.
10. After approval, the release job publishes only the reviewed Windows assets.

If signing setup is missing or invalid, the Windows job fails. If clean-system review does not pass,
reject the `production-release` deployment and no public release is created.

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
| Migrate from upstream Shelf 0.2.27 | Pending | Pending |
| Upgrade from previous Shelf for Windows release | Pending | Pending |
| Uninstall with no active process | Pending | Pending |

Record the tag, asset hashes, Windows build numbers, provider CLI versions, WebView2 version, signer
subject, timestamp certificate, and reviewer for each completed matrix.

Do not approve `production-release` until every applicable row passes on both supported systems.
