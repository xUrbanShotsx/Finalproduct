import type { DocType, StandardDef } from "@/config/blueprints";
import { CATEGORY_LABEL } from "@/config/blueprints";
import type { OrgContext } from "./types";

/* Static authoring instructions — same for every document, every blueprint. */
const STATIC_INSTRUCTIONS = `You are a senior ISO management-systems consultant who writes audit-ready documentation for Australian organisations.

Write in clear, professional Australian English. Produce a single, complete, ready-to-use document in GitHub-flavoured Markdown.

Rules:
- Start with a single H1 title, then a short metadata block (Document ID, Clause reference, Version, Date, Owner).
- Use H2/H3 headings, tables and numbered clauses where appropriate.
- Be specific to the organisation described in the context — use its name, industry, sites and scope. Never write generic placeholders like "[Company Name]".
- Where the organisation's existing data is provided, incorporate it directly (e.g. reference real hazards, incidents, contractors, training).
- Content must be defensible at a certification audit: reference the correct ISO clause, define responsibilities, frequency, and records kept.
- Do not add commentary before or after the document. Output only the document.`;

/**
 * Build the system blocks for a blueprint.
 * The org-context block is identical for every document in a standard, so we
 * mark it with cache_control: ephemeral — Anthropic prompt caching then reuses
 * it across all 15-24 documents in the run instead of re-reading it each time.
 */
export function buildSystemBlocks(standard: StandardDef, org: OrgContext) {
  const ctx = orgContextText(standard, org);
  return [
    { type: "text" as const, text: STATIC_INSTRUCTIONS },
    {
      type: "text" as const,
      text: ctx,
      cache_control: { type: "ephemeral" as const },
    },
  ];
}

function orgContextText(standard: StandardDef, org: OrgContext): string {
  const lines: string[] = [];
  lines.push(`# ORGANISATION CONTEXT (shared across the entire ${standard.code} document pack)`);
  lines.push("");
  lines.push(`Standard: ${standard.code}${standard.year} — ${standard.name}`);
  lines.push(`Organisation: ${org.orgName}`);
  if (org.abn) lines.push(`ABN: ${org.abn}`);
  lines.push(`Industry: ${org.industry}`);
  lines.push(`State / Jurisdiction: ${org.state}, Australia`);
  lines.push(`Employees: ${org.employeeCount}`);
  if (org.sites?.length) lines.push(`Sites: ${org.sites.join("; ")}`);
  lines.push(`Scope of the management system: ${org.scopeDescription || "(define an appropriate scope for this organisation)"}`);
  if (org.existingCertifications?.length) lines.push(`Existing certifications: ${org.existingCertifications.join(", ")}`);
  if (org.primaryContact) lines.push(`Management representative / primary contact: ${org.primaryContact}`);

  const b = org.briesaData;
  if (b) {
    lines.push("");
    lines.push("## EXISTING WHS DATA FROM THE CUSTOMER'S BRIESA WORKSPACE");
    lines.push("Use this real operational data wherever relevant instead of inventing examples.");
    if (b.hazards?.length) {
      lines.push("");
      lines.push("### Hazard Register");
      b.hazards.forEach(h => lines.push(`- ${h.hazard} — residual risk ${h.risk}; controls: ${h.controls}`));
    }
    if (b.riskAssessments?.length) {
      lines.push("");
      lines.push("### Risk Assessments");
      b.riskAssessments.forEach(r => lines.push(`- ${r.task} — ${r.riskLevel}; highest control: ${r.control}`));
    }
    if (b.incidents?.length) {
      lines.push("");
      lines.push("### Incidents (last 12 months)");
      b.incidents.forEach(i => lines.push(`- ${i.ref} ${i.type} (${i.severity}) on ${i.date}`));
    }
    if (b.contractors?.length) {
      lines.push("");
      lines.push("### Contractor Management");
      b.contractors.forEach(c => lines.push(`- ${c.name} — ${c.trade} (${c.status})`));
    }
    if (b.training?.length) {
      lines.push("");
      lines.push("### Training Completion");
      b.training.forEach(t => lines.push(`- ${t.course}: ${t.completed}/${t.total} workers current`));
    }
  }
  return lines.join("\n");
}

export function buildUserPrompt(standard: StandardDef, doc: DocType): string {
  return [
    `Write the **${doc.name}** for ${standard.code}.`,
    `Category: ${CATEGORY_LABEL[doc.category]}.`,
    `Primary clause reference: ${standard.code} clause ${doc.clauseRef}.`,
    "",
    docGuidance(doc),
    "",
    "Produce the complete, final document now in Markdown.",
  ].join("\n");
}

function docGuidance(doc: DocType): string {
  switch (doc.category) {
    case "MANDATORY_DOCUMENT":
      return "This is a controlled management-system document. Make it concise but complete, with clear statements of intent, scope and responsibilities, signed off by top management.";
    case "MANDATORY_RECORD":
      return "This is a record/register template. Include a short purpose, the fields/columns to be captured, retention period, the responsible role, and 2-3 worked example rows in a Markdown table so the customer can see how to use it.";
    case "RECOMMENDED_PROCEDURE":
      return "This is a documented procedure. Include purpose, scope, responsibilities, a numbered step-by-step process, inputs/outputs, records generated, and review frequency.";
  }
}

export function buildGapPrompt(
  standardCode: string,
  docTitles: string[],
  briesaSummary: string,
): { system: string; user: string } {
  const system =
    "You are an ISO lead auditor performing a pre-certification gap analysis for an Australian organisation. " +
    "You return ONLY valid minified JSON, no prose, no markdown fences.";
  const user = [
    `Standard under review: ${standardCode}.`,
    `The organisation has generated the following documents: ${docTitles.join(", ")}.`,
    "",
    "Existing operational evidence available:",
    briesaSummary || "(limited existing evidence)",
    "",
    "Assess readiness for certification. Return JSON with this exact shape:",
    `{"score": <0-100 integer>, "summary": "<2 sentence overview>", "findings": [{"clauseRef":"x.x","area":"...","status":"Conformant|Partial|Gap","finding":"...","severity":"Critical|Major|Minor"}], "criticalGaps": [{"title":"...","detail":"...","clauseRef":"x.x","severity":"Critical|Major|Minor"}]}`,
    "Provide 6-10 findings spanning the key clauses, and 2-4 prioritised critical gaps the organisation must close before audit.",
  ].join("\n");
  return { system, user };
}
