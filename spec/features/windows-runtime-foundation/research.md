# Discovery

## Users and jobs

- Windows developers need Shelf to open their normal PowerShell environment and installed coding
  agents without learning Unix shell assumptions.
- Developers with existing Shelf configuration need upgrades to preserve their explicit shell choice.
- Maintainers need one native process and path layer that downstream Windows features can trust.

## Pain landscape

- Shelf currently discovers Windows shells in an order that prefers Windows PowerShell over
  PowerShell 7 and returns no explicit preferred shell.
- Node-installed agents may resolve to `.cmd`, `.bat`, or `.ps1` wrappers that cannot be launched as
  ordinary executables.
- Windows paths are compared through several inconsistent string operations.
- Killing a ConPTY child directly can leave agent descendants running.
- Login-shell environment capture assumes a Unix shell.

## Constraints and risks

- Windows 10 22H2 and Windows 11 x64 must both work.
- PowerShell 7 is optional and must not be bundled.
- Existing macOS and Linux behavior must remain unchanged.
- Windows command-line parsing and process ownership are security boundaries.
- Persisted configuration must remain backward compatible.

## Candidate success signals

- New Windows installations select PowerShell 7 when available.
- Existing valid shell settings remain unchanged.
- Fixture agents installed as `.exe`, `.cmd`, `.bat`, or `.ps1` receive the intended arguments.
- Windows path comparisons agree across slash, case, root, prefix, and trailing-separator variants.
- Closing a PTY removes its complete descendant tree.

## Explicit unknowns

- None. The approved Windows GA plan resolves the shell, process, and compatibility policies.

## Problem brief

### Problem statement

Windows developers struggle to use Shelf as a dependable local terminal host because its runtime
assumes Unix executable, environment, path, and process semantics. This causes failed launches,
incorrect workspace matches, and orphaned processes. A solution should provide native Windows
behavior without changing valid saved preferences or regressing macOS and Linux.

### Target users

Windows developers using Shelf with PowerShell, Claude, Codex, or pi, plus maintainers supporting the
cross-platform runtime.

### Jobs to be done

- Start the expected local shell.
- Launch an installed agent regardless of its Windows wrapper type.
- Compare workspace paths with Windows semantics.
- Close every process Shelf owns.

### Success signals and how we will know

The automated runtime suite passes on Windows and proves shell precedence, wrapper dispatch, path
normalization, and process-tree cleanup through public runtime seams.

### Constraints

No configuration migration, no bundled PowerShell, and no change to Unix behavior.

### Explicitly out of scope

Agent session UX, AI Organizer behavior, installer signing, ARM64, and Microsoft Store delivery.

### Open questions

None.
