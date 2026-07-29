# Product-global: Shelf

## Vision

Shelf gives developers one dependable desktop workspace for projects, local AI coding tools, and
remote terminals. Platform differences should be visible only where they help users make an
informed choice.

## Glossary

- **Agent**: a supported coding CLI, currently Claude, Codex, or pi.
- **Local terminal**: a PTY and process tree started by Shelf on the current computer.
- **Remote terminal**: a terminal reached through Shelf's SSH workflow.
- **Preferred shell**: the first available shell Shelf selects for a new local terminal.
- **Saved shell**: a valid shell identifier already persisted in Shelf configuration.
- **Workspace**: the local or remote project directory associated with a Shelf session.
- **Session**: the provider-owned conversation or terminal record shown in Shelf.
- **AI Organizer**: Shelf's agent-assisted workflow for inspecting and organizing sessions.

## Global non-functional requirements

- Performance: Shelf remains responsive while scanning sessions and starts an available local shell
  within 5 seconds under normal workstation load.
- Security: commands retain argument boundaries, destructive AI operations require approval, and
  credentials never enter logs or fixtures.
- Accessibility: all non-terminal application controls remain keyboard reachable, expose accessible
  names, show visible focus, and preserve reduced-motion preferences.
- Reliability and availability: a failed provider, shell, SSH connection, or update check does not
  prevent Shelf from opening or using unaffected local features.
- Privacy and data handling: local paths and session content stay on the device unless the user
  explicitly starts a remote or external-provider operation.

## Product invariants

- A valid saved shell remains selected until the user changes it.
- Platform path comparisons use platform semantics and never raw string-prefix containment.
- Closing a local terminal closes its Shelf-owned descendant process tree.
- macOS and Linux keep their existing shell and path behavior when Windows-specific behavior changes.

## Cross-cutting constraints

- Windows GA supports Windows 10 22H2 and Windows 11 on x64.
- Windows shell precedence is PowerShell 7, Windows PowerShell 5.1, then user-selected cmd.
- Windows release artifacts are NSIS and MSI installers signed with Azure Artifact Signing Public
  Trust and accompanied by SHA-256 checksums.
