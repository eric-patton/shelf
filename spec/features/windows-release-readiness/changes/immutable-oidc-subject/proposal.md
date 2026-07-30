# Proposal - immutable-oidc-subject

**Trigger:** GitHub changed the default OIDC subject format for repositories created after
2026-07-15. The fork was created on 2026-07-29, and the live repository API reports the immutable
prefix `repo:eric-patton@248889511/shelf@1316644982`.

**Summary:** Replace the stale name-only Azure federated credential subject with the fork's actual
immutable owner-ID and repository-ID subject. This keeps Azure trust bound to this exact repository
even across ordinary renames and prevents the release runbook from directing the owner to create a
credential that cannot authenticate.

## Blast radius

- Requirements affected: AC-8 and the exact OIDC edge case.
- Design decisions affected: the protected-environment federated credential subject.
- Tasks affected: add release-contract, documentation, live API, validation, and convergence work.
- Already-built code affected: `docs/releasing-windows.md` and
  `scripts/qa/verify-release-contract.ps1`.

## Status

- [x] delta reviewed by analyze
- [ ] implemented and verified
- [ ] folded into the canonical feature spec
