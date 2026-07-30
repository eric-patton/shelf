import { t } from "../i18n";
import type { TabInfo } from "../types";
import { openDialog } from "./dialog";
import { applyCustomTabTitle } from "./tab-title";

export function _renameTabPrompt(app: any, tab: TabInfo) {
  if (!tab.closable) return;

  const input = document.createElement("input");
  input.type = "text";
  input.value = tab.title;
  input.maxLength = 120;
  input.setAttribute("aria-label", t("tab.rename_label"));
  input.addEventListener("input", () => input.setCustomValidity(""));

  const row = document.createElement("div");
  row.className = "settings-row";
  row.appendChild(input);

  openDialog({
    title: t("tab.rename"),
    body: row,
    actions: [
      {
        label: t("settings.save"),
        variant: "primary",
        isDefault: true,
        onClick: () => {
          if (!applyCustomTabTitle(tab, input.value)) {
            input.setCustomValidity(t("tab.rename_required"));
            input.reportValidity();
            input.focus();
            return false;
          }
          app._renderTabs();
          app._scheduleSaveAppState();
        },
      },
      { label: t("settings.cancel") },
    ],
  });
  input.select();
}

