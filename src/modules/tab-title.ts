export type CustomTabTitleState = {
  title: string;
  customTitle?: string;
};

export function normalizeCustomTabTitle(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const title = value.trim();
  return title || null;
}

export function applyCustomTabTitle(tab: CustomTabTitleState, value: unknown): boolean {
  const title = normalizeCustomTabTitle(value);
  if (!title) return false;
  tab.customTitle = title;
  tab.title = title;
  return true;
}

export function shouldApplyAutomaticTabTitle(tab: Pick<CustomTabTitleState, "customTitle">): boolean {
  return normalizeCustomTabTitle(tab.customTitle) === null;
}

export function restoreCustomTabTitle<T extends CustomTabTitleState>(
  tab: T,
  customTitle?: unknown,
): T {
  const title = normalizeCustomTabTitle(customTitle);
  if (title) {
    tab.customTitle = title;
    tab.title = title;
  }
  return tab;
}
