import type { TabInfo } from "../types";
import type { SavedTabState } from "./app-state";

export function savedTabsFromRuntime(
  tabOrder: string[],
  tabsMap: Map<string, TabInfo>,
  startTabId: string,
): SavedTabState[] {
  const tabs: SavedTabState[] = [];
  for (const tabId of tabOrder) {
    const tab = tabsMap.get(tabId);
    if (!tab || !tab.closable || tabId === startTabId) continue;

    const kind = tab.sessionId ? "session" : tab.restoreKind || "terminal";
    const saved: SavedTabState = {
      id: tab.id,
      kind,
      title: tab.title,
      cwd: tab.cwd,
      workspacePath: tab.workspacePath,
      sessionProvider: tab.sessionProvider,
      sessionId: tab.sessionId,
      shell: tab.shell,
      ssh: tab.ssh,
    };
    if (isValidSavedTabState(saved)) tabs.push(saved);
  }
  return tabs;
}

export function isValidSavedTabState(tab: SavedTabState): boolean {
  if (!tab || typeof tab.id !== "string" || !tab.id || typeof tab.title !== "string") {
    return false;
  }
  switch (tab.kind) {
    case "terminal":
      return true;
    case "session":
      return !!tab.sessionId && !!tab.sessionProvider && !!tab.workspacePath;
    case "new-session":
      return !!tab.sessionProvider && !!tab.workspacePath;
    default:
      return false;
  }
}

export function validSavedTabStates(tabs: SavedTabState[]): SavedTabState[] {
  const seen = new Set<string>();
  return tabs.filter((tab) => {
    if (!isValidSavedTabState(tab) || seen.has(tab.id)) return false;
    seen.add(tab.id);
    return true;
  });
}
