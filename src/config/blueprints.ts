/* ───────────────────────────────────────────────────────────────
   Blueprints — ISO management-system document packs
   Config: standards, document lists, pricing, model routing
   ─────────────────────────────────────────────────────────────── */

export type ISOStandard = "ISO_9001" | "ISO_14001" | "ISO_45001";

export type BlueprintStatus = "NOT_STARTED" | "INTAKE" | "GENERATING" | "REVIEW" | "COMPLETE";

export type DocCategory = "MANDATORY_DOCUMENT" | "MANDATORY_RECORD" | "RECOMMENDED_PROCEDURE";

export type DocStatus = "PENDING" | "GENERATING" | "GENERATED" | "EDITED" | "APPROVED";

export interface DocType {
  id: string;
  name: string;
  category: DocCategory;
  clauseRef: string;
  /** Complex documents use the stronger model (Sonnet); simple ones use Haiku. */
  complex?: boolean;
}

export interface StandardDef {
  key: ISOStandard;
  code: string;        // "ISO 9001"
  year: string;        // ":2015"
  name: string;        // "Quality Management"
  tagline: string;
  color: string;       // accent
  docs: DocType[];
}

export const CATEGORY_LABEL: Record<DocCategory, string> = {
  MANDATORY_DOCUMENT: "Mandatory Document",
  MANDATORY_RECORD: "Mandatory Record",
  RECOMMENDED_PROCEDURE: "Recommended Procedure",
};

export const CATEGORY_SHORT: Record<DocCategory, string> = {
  MANDATORY_DOCUMENT: "Document",
  MANDATORY_RECORD: "Record",
  RECOMMENDED_PROCEDURE: "Procedure",
};

/* ── ISO 9001 — 24 documents ── */
const ISO_9001_DOCS: DocType[] = [
  // Mandatory documents
  { id: "qms-scope",            name: "QMS Scope",                         category: "MANDATORY_DOCUMENT",     clauseRef: "4.3" },
  { id: "quality-policy",       name: "Quality Policy",                    category: "MANDATORY_DOCUMENT",     clauseRef: "5.2" },
  { id: "quality-objectives",   name: "Quality Objectives",                category: "MANDATORY_DOCUMENT",     clauseRef: "6.2" },
  { id: "quality-manual",       name: "Quality Manual",                    category: "MANDATORY_DOCUMENT",     clauseRef: "4.4", complex: true },
  // Mandatory records
  { id: "training-records",     name: "Training Records",                  category: "MANDATORY_RECORD",       clauseRef: "7.2" },
  { id: "calibration-record",   name: "Calibration Record",                category: "MANDATORY_RECORD",       clauseRef: "7.1.5" },
  { id: "design-dev-records",   name: "Design & Development Records",      category: "MANDATORY_RECORD",       clauseRef: "8.3" },
  { id: "supplier-evaluation",  name: "Supplier Evaluation",               category: "MANDATORY_RECORD",       clauseRef: "8.4" },
  { id: "production-control",   name: "Production Control Records",        category: "MANDATORY_RECORD",       clauseRef: "8.5" },
  { id: "conformity-record",    name: "Conformity Record",                 category: "MANDATORY_RECORD",       clauseRef: "8.6" },
  { id: "nonconforming-output", name: "Nonconforming Outputs Record",      category: "MANDATORY_RECORD",       clauseRef: "8.7" },
  { id: "monitoring-record",    name: "Monitoring & Measurement Record",   category: "MANDATORY_RECORD",       clauseRef: "9.1" },
  { id: "internal-audit-prog",  name: "Internal Audit Program",            category: "MANDATORY_RECORD",       clauseRef: "9.2", complex: true },
  { id: "mgmt-review-record",   name: "Management Review Record",          category: "MANDATORY_RECORD",       clauseRef: "9.3" },
  { id: "corrective-register",  name: "Corrective Actions Register",       category: "MANDATORY_RECORD",       clauseRef: "10.2" },
  { id: "customer-property",    name: "Customer Property Record",          category: "MANDATORY_RECORD",       clauseRef: "8.5.3" },
  // Recommended procedures
  { id: "document-control",     name: "Document Control Procedure",        category: "RECOMMENDED_PROCEDURE",  clauseRef: "7.5" },
  { id: "risk-opportunity",     name: "Risk & Opportunity Procedure",      category: "RECOMMENDED_PROCEDURE",  clauseRef: "6.1", complex: true },
  { id: "internal-audit-proc",  name: "Internal Audit Procedure",          category: "RECOMMENDED_PROCEDURE",  clauseRef: "9.2", complex: true },
  { id: "ncr-corrective",       name: "NCR / Corrective Action Procedure", category: "RECOMMENDED_PROCEDURE",  clauseRef: "10.2" },
  { id: "mgmt-review-proc",     name: "Management Review Procedure",       category: "RECOMMENDED_PROCEDURE",  clauseRef: "9.3" },
  { id: "context-org",          name: "Context of the Organisation",       category: "RECOMMENDED_PROCEDURE",  clauseRef: "4.1" },
  { id: "purchasing",           name: "Purchasing Procedure",              category: "RECOMMENDED_PROCEDURE",  clauseRef: "8.4" },
  { id: "competence-training",  name: "Competence & Training Procedure",   category: "RECOMMENDED_PROCEDURE",  clauseRef: "7.2" },
];

/* ── ISO 14001 — 16 documents ── */
const ISO_14001_DOCS: DocType[] = [
  { id: "ems-scope",            name: "EMS Scope",                         category: "MANDATORY_DOCUMENT",     clauseRef: "4.3" },
  { id: "env-policy",           name: "Environmental Policy",              category: "MANDATORY_DOCUMENT",     clauseRef: "5.2" },
  { id: "env-objectives",       name: "Environmental Objectives",          category: "MANDATORY_DOCUMENT",     clauseRef: "6.2" },
  { id: "aspects-impacts",      name: "Aspects & Impacts Register",        category: "MANDATORY_DOCUMENT",     clauseRef: "6.1.2", complex: true },
  { id: "compliance-oblig",     name: "Compliance Obligations Register",   category: "MANDATORY_RECORD",       clauseRef: "6.1.3" },
  { id: "env-training",         name: "Environmental Training Records",    category: "MANDATORY_RECORD",       clauseRef: "7.2" },
  { id: "env-monitoring",       name: "Monitoring & Measurement Record",   category: "MANDATORY_RECORD",       clauseRef: "9.1" },
  { id: "eval-compliance",      name: "Evaluation of Compliance Record",   category: "MANDATORY_RECORD",       clauseRef: "9.1.2" },
  { id: "env-audit-prog",       name: "Internal Audit Program",            category: "MANDATORY_RECORD",       clauseRef: "9.2", complex: true },
  { id: "env-mgmt-review",      name: "Management Review Record",          category: "MANDATORY_RECORD",       clauseRef: "9.3" },
  { id: "env-nonconformity",    name: "Nonconformity Record",              category: "MANDATORY_RECORD",       clauseRef: "10.2" },
  { id: "context-interested",   name: "Context & Interested Parties",      category: "RECOMMENDED_PROCEDURE",  clauseRef: "4.1" },
  { id: "aspects-risk",         name: "Aspects & Risk Procedure",          category: "RECOMMENDED_PROCEDURE",  clauseRef: "6.1", complex: true },
  { id: "emergency-prep",       name: "Emergency Preparedness Procedure",  category: "RECOMMENDED_PROCEDURE",  clauseRef: "8.2" },
  { id: "operational-control",  name: "Operational Control Procedure",     category: "RECOMMENDED_PROCEDURE",  clauseRef: "8.1" },
  { id: "waste-management",     name: "Waste Management Procedure",        category: "RECOMMENDED_PROCEDURE",  clauseRef: "8.1" },
];

/* ── ISO 45001 — 15 documents ── */
const ISO_45001_DOCS: DocType[] = [
  { id: "ohs-scope",            name: "OHS Scope",                         category: "MANDATORY_DOCUMENT",     clauseRef: "4.3" },
  { id: "ohs-policy",           name: "OHS Policy",                        category: "MANDATORY_DOCUMENT",     clauseRef: "5.2" },
  { id: "ohs-objectives",       name: "OHS Objectives",                    category: "MANDATORY_DOCUMENT",     clauseRef: "6.2" },
  { id: "legal-register",       name: "Legal Requirements Register",       category: "MANDATORY_DOCUMENT",     clauseRef: "6.1.3" },
  { id: "ohs-training",         name: "OHS Training Records",              category: "MANDATORY_RECORD",       clauseRef: "7.2" },
  { id: "incident-investigation", name: "Incident Investigation Record",   category: "MANDATORY_RECORD",       clauseRef: "10.2" },
  { id: "ohs-audit-prog",       name: "Internal Audit Program",            category: "MANDATORY_RECORD",       clauseRef: "9.2", complex: true },
  { id: "ohs-mgmt-review",      name: "Management Review Record",          category: "MANDATORY_RECORD",       clauseRef: "9.3" },
  { id: "ohs-corrective",       name: "Corrective Action Record",          category: "MANDATORY_RECORD",       clauseRef: "10.2" },
  { id: "worker-consult-rec",   name: "Worker Consultation Record",        category: "MANDATORY_RECORD",       clauseRef: "5.4" },
  { id: "ohs-monitoring",       name: "Monitoring & Measurement Record",   category: "MANDATORY_RECORD",       clauseRef: "9.1" },
  { id: "hazard-risk-assess",   name: "Hazard ID & Risk Assessment",       category: "RECOMMENDED_PROCEDURE",  clauseRef: "6.1.2", complex: true },
  { id: "worker-consult-proc",  name: "Worker Consultation Procedure",     category: "RECOMMENDED_PROCEDURE",  clauseRef: "5.4" },
  { id: "emergency-response",   name: "Emergency Response Procedure",      category: "RECOMMENDED_PROCEDURE",  clauseRef: "8.2" },
  { id: "contractor-mgmt",      name: "Contractor Management Procedure",   category: "RECOMMENDED_PROCEDURE",  clauseRef: "8.1.4" },
];

export const STANDARDS: Record<ISOStandard, StandardDef> = {
  ISO_9001: {
    key: "ISO_9001", code: "ISO 9001", year: ":2015", name: "Quality Management",
    tagline: "Quality management system for consistent products and services.",
    color: "#3b82f6", docs: ISO_9001_DOCS,
  },
  ISO_14001: {
    key: "ISO_14001", code: "ISO 14001", year: ":2015", name: "Environmental Management",
    tagline: "Environmental management system to control impacts and obligations.",
    color: "#00c46a", docs: ISO_14001_DOCS,
  },
  ISO_45001: {
    key: "ISO_45001", code: "ISO 45001", year: ":2018", name: "OH&S Management",
    tagline: "Occupational health & safety management — pre-filled from your Briesa data.",
    color: "#f5c842", docs: ISO_45001_DOCS,
  },
};

export const ALL_STANDARDS: ISOStandard[] = ["ISO_9001", "ISO_14001", "ISO_45001"];

/* ── Pricing (AUD) ── */
export const BUNDLE_PRICING: Record<number, number> = { 1: 1750, 2: 3250, 3: 4500 };
export const RENEWAL_PRICE = 199; // per blueprint / year

export function priceFor(count: number): number {
  if (count <= 0) return 0;
  return BUNDLE_PRICING[Math.min(count, 3)] ?? BUNDLE_PRICING[3];
}

export function bundleLabel(count: number): string {
  return count === 1 ? "Single Standard" : count === 2 ? "Dual Bundle" : "Triple Bundle";
}

export function docCount(key: ISOStandard): number {
  return STANDARDS[key].docs.length;
}

/* ── Model routing ── */
export const HAIKU = "claude-haiku-4-5-20251001";
export const SONNET = "claude-sonnet-4-6";

export function modelFor(doc: DocType): string {
  return doc.complex ? SONNET : HAIKU;
}

/** Rough $/1M token estimate for the demo cost ledger (input+output blended). */
export const MODEL_COST_PER_MTOK: Record<string, number> = {
  [HAIKU]: 1.6,
  [SONNET]: 9.0,
};

export function fmtAUD(n: number): string {
  return "$" + n.toLocaleString("en-AU");
}
