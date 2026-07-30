import type { ITerminalOptions } from "@xterm/xterm";

export type TerminalThemeMode =
  | "dark"
  | "light"
  | "github-light"
  | "solarized-light"
  | "dracula"
  | "monokai";

const LIGHT_THEME_MODES = new Set<TerminalThemeMode>([
  "light",
  "github-light",
  "solarized-light",
]);

export function terminalContrastOptions(
  mode: TerminalThemeMode,
): Pick<ITerminalOptions, "minimumContrastRatio"> {
  return { minimumContrastRatio: LIGHT_THEME_MODES.has(mode) ? 15 : 4.5 };
}

