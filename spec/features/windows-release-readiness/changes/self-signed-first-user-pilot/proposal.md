# Proposal - self-signed first-user pilot

**Trigger:** The release owner wants to use Shelf for Windows as its first user before paying for
Azure Artifact Signing or investing in public distribution.
**Summary:** Add a local-only pilot build path that creates or reuses a non-exportable self-signed
code-signing certificate in the current user's certificate store, explicitly trusts its public
certificate for that Windows user, signs the application plus MSI and NSIS installers, verifies the
signatures, and produces checksums. Keep the existing Azure-backed public tag workflow unchanged and
prohibit publishing pilot artifacts.

## Blast radius

Everything this change touches, so the ripple is explicit.

- Requirements affected: Windows release readiness gains a separate local pilot scenario and
  acceptance criterion. Public-release AC-5, AC-6, AC-8, AC-9, and AC-11 remain unchanged.
- Design decisions affected: local packaging, certificate lifecycle, trust boundaries, signature
  verification, artifact output, and first-user instructions.
- Tasks affected (regenerate these): add pilot contract coverage, certificate and signing scripts,
  Tauri pilot signing configuration, pilot documentation, executable build verification, install and
  launch verification, and convergence.
- Already-built code affected: `package.json`, `scripts/qa/`, `src-tauri/`, and
  `docs/releasing-windows.md`.

## Status

- [x] delta reviewed (analyze)
- [x] implemented and verified
- [x] folded into the canonical feature spec
