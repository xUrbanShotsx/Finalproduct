import type { ISOStandard } from "@/config/blueprints";

/** Snapshot of the customer's existing Briesa data — used to pre-fill ISO 45001. */
export interface BriesaSnapshot {
  hazards: { hazard: string; risk: string; controls: string }[];
  riskAssessments: { task: string; riskLevel: string; control: string }[];
  incidents: { ref: string; type: string; severity: string; date: string }[];
  contractors: { name: string; trade: string; status: string }[];
  training: { course: string; completed: number; total: number }[];
}

export interface OrgContext {
  orgName: string;
  abn: string;
  industry: string;
  state: string;
  employeeCount: string;
  sites: string[];
  scopeDescription: string;
  existingCertifications: string[];
  primaryContact: string;
  /** Present only for ISO 45001 when "Pull from my Briesa data" is enabled. */
  briesaData?: BriesaSnapshot | null;
}

export interface GenerateRequest {
  standard: ISOStandard;
  docId: string;
  org: OrgContext;
}

export interface GenerateResult {
  content: string;
  aiModel: string;
  tokensUsed: number;
  costUsd: number;
  cached: boolean;
  fallback?: boolean;
}

export interface GapFinding {
  clauseRef: string;
  area: string;
  status: "Conformant" | "Partial" | "Gap";
  finding: string;
  severity: "Critical" | "Major" | "Minor";
}

export interface CriticalGap {
  title: string;
  detail: string;
  clauseRef: string;
  severity: "Critical" | "Major" | "Minor";
}

export interface GapReport {
  score: number;
  summary: string;
  findings: GapFinding[];
  criticalGaps: CriticalGap[];
  fallback?: boolean;
}
