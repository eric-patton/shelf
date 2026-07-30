export type TerminalKeyEvent = {
  type: string;
  key: string;
  code: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
};

export type TerminalInputMode = "standard" | "codex";

// Codex reads Win32 console key events through ConPTY, not raw bytes. ConPTY's
// input parser swallows bracketed-paste markers and re-encodes a bare LF as a
// Ctrl+Enter key event, so neither survives to Codex's composer as a newline.
// ConPTY does accept win32-input-mode sequences (CSI Vk;Sc;Uc;Kd;Cs;Rc _) on
// its input pipe, which deliver the exact KEY_EVENT_RECORD a physical Ctrl+J
// produces in Windows Terminal: keydown then keyup of Vk 0x4A "J", scancode
// 0x24, char LF, LEFT_CTRL_PRESSED. Codex binds Ctrl+J as its newline key.
const CODEX_WIN32_INPUT_CTRL_J = "\x1b[74;36;10;1;8;1_\x1b[74;36;10;0;8;1_";

export function terminalInputForKey(
  event: TerminalKeyEvent,
  mode: TerminalInputMode = "standard",
): string | null {
  if (
    event.type === "keydown"
    && event.ctrlKey
    && !event.metaKey
    && !event.altKey
    && !event.shiftKey
    && (event.code === "KeyJ" || event.key === "j" || event.key === "J")
  ) {
    return mode === "codex" ? CODEX_WIN32_INPUT_CTRL_J : "\x0a";
  }
  return null;
}
