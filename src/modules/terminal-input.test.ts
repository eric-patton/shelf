import { describe, expect, it } from "vitest";
import {
  terminalInputForKey,
  type TerminalKeyEvent,
} from "./terminal-input";

function keyEvent(overrides: Partial<TerminalKeyEvent> = {}): TerminalKeyEvent {
  return {
    type: "keydown",
    key: "j",
    code: "KeyJ",
    ctrlKey: true,
    metaKey: false,
    altKey: false,
    shiftKey: false,
    ...overrides,
  };
}

describe("terminal control-key input", () => {
  it("translates exact Ctrl+J keydown to LF [spec/design-system.md:16]", () => {
    expect(terminalInputForKey(keyEvent())).toBe("\x0a");
  });

  it("protects the Codex newline from trailing-line cleanup [feat-002/AC-11]", () => {
    expect(terminalInputForKey(keyEvent(), "codex")).toBe(
      "\x1b[200~\n \x1b[201~\x1b[D",
    );
  });

  it("leaves other J key combinations and keyup under xterm control [spec/design-system.md:16]", () => {
    expect(terminalInputForKey(keyEvent({ type: "keyup" }))).toBeNull();
    expect(terminalInputForKey(keyEvent({ ctrlKey: false }))).toBeNull();
    expect(terminalInputForKey(keyEvent({ shiftKey: true }))).toBeNull();
    expect(terminalInputForKey(keyEvent({ altKey: true }))).toBeNull();
    expect(terminalInputForKey(keyEvent({ metaKey: true }))).toBeNull();
    expect(terminalInputForKey(keyEvent({ code: "KeyK", key: "k" }))).toBeNull();
  });
});
