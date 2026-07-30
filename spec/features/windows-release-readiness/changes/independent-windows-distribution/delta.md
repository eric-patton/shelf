# Delta: independent Windows distribution

> This change is expressed against the current Windows release-readiness specification.

## ADDED

- The distribution is named Shelf for Windows and is maintained from `eric-patton/shelf`.
- The fork retains the upstream MIT license declaration and explicit upstream attribution.
- The application identifier and MSI upgrade code are unique to the fork so installation does not
  silently replace upstream Shelf.
- The update checker and all public release links use `eric-patton/shelf`.
- A protected `production-release` environment holds public publication until signed artifacts have
  been reviewed. The publication job has no Azure signing authority.
- AC-10: Package metadata, Tauri identity, update source, public documentation, license, and
  attribution consistently identify Shelf for Windows as an independently maintained distribution
  from `eric-patton/shelf`.
- AC-11: The tag workflow uploads signed Windows artifacts before a distinct protected
  `production-release` approval, and only the signing job receives Azure OIDC permission.

## MODIFIED

- **Release tag**
  - Was: A tag publishes Windows MSI, Windows NSIS, macOS DMG, and checksum assets immediately after
    the platform build jobs succeed.
  - Now: A tag builds, signs, verifies, checksums, and privately uploads Windows MSI and NSIS assets,
    then waits for `production-release` approval before publishing them.
- **Install or upgrade**
  - Was: Shelf upgrades over the prior upstream release.
  - Now: Shelf for Windows uses a distinct installer identity, reuses compatible `~/.shelf`
    workspace configuration, and upgrades in place only over earlier Shelf for Windows releases.
- **Documentation**
  - Was: Documentation directs users to `Harukaon/shelf` releases and describes a shared
    cross-platform release.
  - Now: Documentation directs users to `eric-patton/shelf`, identifies the distribution as an
    independent Windows-focused fork, preserves upstream attribution, and documents coexistence and
    migration behavior.
- **Azure release setup**
  - Was: GitHub OIDC and one protected environment authorize signing and immediate publication.
  - Now: OIDC is bound to `repo:eric-patton/shelf:environment:windows-release`; signing and
    publication use distinct protected environments.
- **Clean-system validation**
  - Was: The matrix verifies an in-place upgrade from the previous upstream public release.
  - Now: The matrix verifies migration from upstream Shelf 0.2.27 plus in-place upgrade behavior for
    subsequent Shelf for Windows releases.

## REMOVED

- Publishing a macOS DMG from the Windows-focused fork release workflow. Cross-platform CI remains,
  and upstream macOS behavior stays protected.
