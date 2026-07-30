import type { ITerminalOptions } from "@xterm/xterm";

const MINIMUM_READABLE_CONTRAST_RATIO = 4.5;

export function terminalContrastOptions(): Pick<ITerminalOptions, "minimumContrastRatio"> {
  return { minimumContrastRatio: MINIMUM_READABLE_CONTRAST_RATIO };
}

