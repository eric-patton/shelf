# Specification delta: terminal input fidelity

## ADDED

### Scenario: Dark TUI surface in a light theme

- Given Shelf uses a light application theme
- And a terminal application paints a dark input surface
- When text is rendered on that surface
- Then Shelf requests near-white foreground adjustment for low-contrast cells
- And the text remains clearly legible without changing the surrounding light terminal background

### Acceptance criterion

- AC-10: In light application themes, terminal cells with a dark background target at least 15:1
  foreground contrast. When the target is mathematically unavailable, xterm uses the brightest
  available adjusted foreground. Dark application themes retain the standard 4.5:1 minimum.

### Scenario: Codex multiline input on Windows

- Given Codex is running in a Shelf terminal on Windows
- When the user presses exact `Ctrl+J`
- Then Shelf inserts one persistent newline in the Codex composer
- And the caret remains on the new line ready for more text
- And Shelf does not submit the draft

### Acceptance criterion

- AC-11: Exact `Ctrl+J` in a Windows Codex tab inserts one persistent composer newline without
  submitting the draft. Standard terminal tabs continue to receive the LF control byte.

## MODIFIED

None.

## REMOVED

None.
