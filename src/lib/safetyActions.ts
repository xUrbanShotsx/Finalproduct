/* Lightweight bridge so other modules (e.g. Blueprints gap analysis) can push
   Actions into the Safety > Actions board. Persisted in localStorage and merged
   by ActionsPage on mount. */

export interface ExtraAction {
  ref: string;
  source: "Incident" | "Audit" | "Prestart" | "Inspection" | "Toolbox" | "Hazard";
  sourceRef: string;
  description: string;
  site: string;
  assignee: string;
  due: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "Overdue" | "Closed";
}

const KEY = "briesa-extra-actions-v1";

export function getExtraActions(): ExtraAction[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function addExtraAction(a: ExtraAction) {
  if (typeof window === "undefined") return;
  const all = getExtraActions();
  localStorage.setItem(KEY, JSON.stringify([a, ...all]));
}
