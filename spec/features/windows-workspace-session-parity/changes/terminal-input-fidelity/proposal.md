# Change proposal: terminal input fidelity

## Trigger

Windows pilot feedback found that Codex prompt text remained too dark on its dark composer surface
under a light Shelf theme. The same feedback found that Codex did not receive its standard `Ctrl+J`
newline shortcut reliably, even though the shortcut worked in Claude Code.

## Why

The existing 4.5:1 terminal contrast floor is readable by a minimum accessibility measure, but it
does not meet the clarified visual target for near-white text on a dark TUI surface inside a light
application theme. Separately, terminal applications should receive the standard LF control byte for
`Ctrl+J` without depending on browser, WebView, or terminal-emulator translation details. Installed
app testing confirmed that WebView2 consumed the physical chord before xterm could translate it.
Current Codex releases also have a documented Windows integrated-terminal regression that ignores
all configured newline key aliases. Codex therefore needs one protected bracketed-paste newline
after the chord reaches xterm so its composer does not discard the otherwise empty trailing line.

## Blast radius

- Specification: add acceptance criteria for the stronger light-theme contrast target and reliable
  Codex multiline input.
- Plan: make terminal contrast mode-aware, disable browser-only WebView2 accelerator handling, and
  add a focused provider-compatible control-key translation seam.
- Tasks: add test-first contrast and `Ctrl+J` coverage plus installed Windows verification.
- Product code: terminal theme options, the xterm custom key handler, and Windows WebView2 settings.
