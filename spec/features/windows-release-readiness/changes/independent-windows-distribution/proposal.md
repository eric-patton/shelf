# Proposal: independent Windows distribution

**Trigger:** The Windows port will be maintained and released from `eric-patton/shelf` instead of
waiting for the upstream repository to adopt and operate the Windows release path.

**Summary:** Make the user-owned fork the explicit Windows distribution authority. The distribution
uses the product name Shelf for Windows, a unique application and installer identity, fork-owned
update and release URLs, retained MIT attribution, Windows-only release assets, and separate
approvals for signing and public publication. Cross-platform CI remains in place so continued
upstream synchronization does not regress macOS behavior.

## Blast radius

- Requirements affected: release tag, install and migration, release assets, documentation, Azure
  setup, clean-system validation, distribution identity, and publication approval.
- Design decisions affected: repository ownership, application identity, MSI upgrade identity,
  release asset scope, update source, and protected GitHub environments.
- Tasks affected: T5, T6, T7, T9, and T10, plus new implementation and verification tasks T12-T15.
- Already-built code affected: Tauri configuration, Cargo and npm package metadata, update checker,
  WebDriver harness, release contract, build workflow, README files, and Windows release guides.

## Status

- [x] Delta reviewed by analyze
- [x] Implemented and verified
- [x] Folded into the canonical feature spec
