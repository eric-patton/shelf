# Shelf

> [中文文档](README_zh.md)

A desktop workspace manager for [Claude Code](https://docs.anthropic.com/en/docs/claude-code), [Codex](https://github.com/openai/codex), and [pi](https://pi.dev). Organize your projects, browse and resume sessions, all in one window.

## Why Shelf?

Claude Code lives in the terminal. Conversations are stored as files deep in `~/.claude/projects/`, with opaque session IDs and no visual way to browse them. If you work across multiple projects, it's easy to lose track of what you discussed and where.

Shelf wraps terminal-based coding agents with a clean GUI:

- **See all your sessions at a glance.** Sessions are organized by project workspace in a sidebar, with names, timestamps, and pinning.
- **Resume any conversation instantly.** Click a session to open it in a terminal tab. There is no need to remember or copy session IDs.
- **Manage multiple projects in one place.** Add your project folders as workspaces; Shelf auto-discovers supported agent sessions inside each one.
- **Run side terminals too.** Open plain shell tabs alongside agent sessions for git, builds, or anything else.

## Screenshot

<p align="center">
  <img src="logo/shelf-logo.svg" width="120" alt="Shelf Logo" />
</p>

<p align="center">
  <img src="logo/ai-preview.jpg" width="640" alt="Shelf AI Session Organizer" />
</p>

<p align="center">
  <img src="logo/home-screenshot.png" width="640" alt="Shelf Home" />
</p>

## Features

- **Workspace management:** add or remove project folders and auto-discover sessions
- **Session browser:** list, resume, rename, delete, and pin Claude Code, Codex, and pi sessions
- **AI session organizer:** one-click scan and auto-categorize local AI conversation history
- **Restart recovery:** restores workspaces, sessions, terminals, and sidebar state after reopening
- **Embedded terminals:** xterm.js plus a real PTY, tabbed and reorderable via drag-and-drop
- **File tree:** browse workspace files and drag files into the terminal
- **Resizable panels:** drag to resize the sidebar and file tree
- **Dark theme:** One Dark-inspired terminal color scheme
- **i18n:** English and Chinese
- **Cross-platform:** Windows 10 22H2, Windows 11 x64, macOS Apple Silicon, and Linux

## Install

Download the latest release from [Releases](https://github.com/Harukaon/shelf/releases):

- Windows x64: choose the `.msi` for Windows Installer deployment or the `-setup.exe` NSIS
  installer for an interactive per-user install.
- macOS Apple Silicon: choose the `.dmg`.

Windows release assets for version 0.3.0 and later are expected to include an Authenticode publisher
signature and SHA-256 checksum file. Verify both before installing. See the
[Windows guide](docs/windows.md) for commands and troubleshooting.

## Requirements

- Windows 10 22H2 or Windows 11 x64, macOS on Apple Silicon, or a supported Linux desktop.
- Microsoft Edge WebView2 Runtime on Windows. Current Windows installations normally include it.
- PowerShell 7 is preferred on Windows. Windows PowerShell is the automatic fallback, and Command
  Prompt remains selectable.
- At least one supported CLI installed and accessible in PATH: [Claude Code](https://docs.anthropic.com/en/docs/claude-code), [Codex](https://github.com/openai/codex), or [pi](https://pi.dev).
- Built-in OpenSSH Client is required only for SSH workspaces on Windows.

## Development

```powershell
# Install dependencies
npm ci

# Run in dev mode
npm run tauri dev

# Build for production
npm run tauri build

# Run Windows desktop smoke after building the debug app
pwsh -File scripts/qa/ensure-msedgedriver.ps1
npm run test:e2e
```

## Tech Stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Backend   | Tauri v2, Rust, portable-pty            |
| Frontend  | TypeScript, Vite                        |
| Terminal  | xterm.js, FitAddon                      |
| UI        | Lucide icons, SortableJS                |

## Friends

- [LINUX DO](https://linux.do/)

## License

MIT
