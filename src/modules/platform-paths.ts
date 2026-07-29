export type PathFlavor = "windows" | "posix";
export type PathInsertionDestination = "powershell" | "cmd" | "posix" | "agent";

export function pathFlavor(path: string, remote = false): PathFlavor {
  if (remote) return "posix";
  if (/^(?:[a-z]:[\\/]|\\\\|\\\\\?\\)/i.test(path) || path.includes("\\")) {
    return "windows";
  }
  return "posix";
}

function normalizeWindowsPath(path: string, foldCase: boolean): string {
  let normalized = path.trim().replace(/\//g, "\\");
  if (/^\\\\\?\\unc\\/i.test(normalized)) {
    normalized = `\\\\${normalized.slice(8)}`;
  } else if (/^\\\\\?\\/i.test(normalized)) {
    normalized = normalized.slice(4);
  }

  const isUnc = normalized.startsWith("\\\\");
  let collapsed = "";
  let previousSeparator = false;
  for (let index = 0; index < normalized.length; index++) {
    const character = normalized[index];
    if (character === "\\") {
      if (!previousSeparator || (isUnc && index < 2)) collapsed += character;
      previousSeparator = true;
    } else {
      collapsed += character;
      previousSeparator = false;
    }
  }

  while (collapsed.endsWith("\\") && !/^[a-z]:\\$/i.test(collapsed)) {
    collapsed = collapsed.slice(0, -1);
  }
  return foldCase ? collapsed.toLocaleLowerCase() : collapsed;
}

function normalizePosixPath(path: string): string {
  const collapsed = path.trim().replace(/\/+/g, "/");
  const trimmed = collapsed.replace(/\/+$/, "");
  return trimmed || "/";
}

export function normalizePath(
  path: string,
  options?: { remote?: boolean; preserveCase?: boolean },
): string {
  const flavor = pathFlavor(path, options?.remote);
  if (flavor === "windows") {
    return normalizeWindowsPath(path, !options?.preserveCase);
  }
  return normalizePosixPath(path);
}

export function pathsEqual(left: string, right: string, remote = false): boolean {
  return normalizePath(left, { remote }) === normalizePath(right, { remote });
}

export function pathEqualOrNested(path: string, parent: string, remote = false): boolean {
  const normalizedPath = normalizePath(path, { remote });
  const normalizedParent = normalizePath(parent, { remote });
  if (normalizedPath === normalizedParent) return true;
  const separator = pathFlavor(parent, remote) === "windows" ? "\\" : "/";
  const prefix = normalizedParent.endsWith(separator)
    ? normalizedParent
    : `${normalizedParent}${separator}`;
  return normalizedPath.startsWith(prefix);
}

export function relativePath(path: string, parent: string, remote = false): string {
  if (!pathEqualOrNested(path, parent, remote)) return path;
  const normalizedPath = normalizePath(path, { remote, preserveCase: true });
  const normalizedParent = normalizePath(parent, { remote, preserveCase: true });
  if (pathsEqual(path, parent, remote)) return ".";
  const separator = pathFlavor(parent, remote) === "windows" ? "\\" : "/";
  return normalizedPath.slice(normalizedParent.length).replace(
    new RegExp(`^${separator === "\\" ? "\\\\" : "/"}`),
    "",
  );
}

export function pathBasename(path: string, remote = false): string {
  const normalized = normalizePath(path, { remote, preserveCase: true });
  const separator = pathFlavor(path, remote) === "windows" ? "\\" : "/";
  return normalized.split(separator).pop() || normalized;
}

export function formatPathForInsertion(
  path: string,
  destination: PathInsertionDestination,
): string {
  switch (destination) {
    case "powershell":
      return `'${path.replace(/'/g, "''")}'`;
    case "cmd":
      return `"${path.replace(/"/g, '""')}"`;
    case "posix":
      return `'${path.replace(/'/g, `'\\''`)}'`;
    case "agent":
      return `"${path.replace(/"/g, '\\"')}"`;
  }
}
