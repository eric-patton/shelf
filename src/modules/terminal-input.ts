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

const CODEX_PROTECTED_NEWLINE = "\x1b[200~\n \x1b[201~\x1b[D";

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
    return mode === "codex" ? CODEX_PROTECTED_NEWLINE : "\x0a";
  }
  return null;
}
