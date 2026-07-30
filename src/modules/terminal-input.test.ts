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

  it("sends Codex a win32-input-mode Ctrl+J keystroke pair [feat-002/AC-11]", () => {
    expect(terminalInputForKey(keyEvent(), "codex")).toBe(
      "\x1b[74;36;10;1;8;1_\x1b[74;36;10;0;8;1_",
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
