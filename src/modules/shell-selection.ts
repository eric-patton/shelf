export type TerminalDetection = {
  shells: string[];
  defaultShell: string;
};

export function selectShell(
  savedShell: string | null | undefined,
  detection: TerminalDetection,
): string {
  if (savedShell && detection.shells.includes(savedShell)) {
    return savedShell;
  }
  if (detection.shells.includes(detection.defaultShell)) {
    return detection.defaultShell;
  }
  return detection.shells[0] || detection.defaultShell;
}

export function shellDisplayName(shell: string): string {
  switch (shell.toLowerCase()) {
    case "pwsh":
      return "PowerShell 7";
    case "powershell":
      return "Windows PowerShell";
    case "cmd":
      return "Command Prompt";
    default:
      return shell;
  }
}
