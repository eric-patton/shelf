---
schema_version: 2
id: feat-004
slug: windows-release-readiness
title: Windows release readiness
status: active
owner: Eric Patton
depth: ga
sprint: sprint-1
external: null
depends_on: [feat-001, feat-002, feat-003]
requires_design: true
readiness:
  research: ready
  design: ready
  spec: ready
  plan: ready
  tasks: draft
gate:
  analyze: pass
  product_global_hash: "sha256:4a9d4727e7c3"
  constitution_hash: "sha256:c66ee3677b45"
converge:
  last_run: 5
  open: 0
  contradicts: 0
human_signoff:
  - id: hs-1
    description: Azure Artifact Signing Public Trust identity, profile, fork-bound GitHub OIDC, secrets, and both protected environments are approved.
    owner: Eric Patton
    resolved: false
  - id: hs-2
    description: Signed Shelf for Windows release candidate passes the clean Windows 10 22H2 and Windows 11 x64 matrix.
    owner: Eric Patton
    resolved: false
open_decisions: []
overrides: []
extends: []
---

# Feature notes: Windows release readiness

Independent Shelf for Windows distribution identity, automated assurance, signed installers,
two-stage publication, clean-system validation, and public Windows documentation.
