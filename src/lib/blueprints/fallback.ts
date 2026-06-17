import type { DocType, StandardDef } from "@/config/blueprints";
import { CATEGORY_LABEL } from "@/config/blueprints";
import type { OrgContext, GapReport } from "./types";

const today = () => new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "long", year: "numeric" });

/** Polished templated document used when no ANTHROPIC_API_KEY is configured. */
export function fallbackDocument(standard: StandardDef, doc: DocType, org: OrgContext): string {
  const meta = [
    `**Document ID:** ${standard.code.replace(/\s/g, "")}-${doc.id.toUpperCase()}`,
    `**Clause:** ${standard.code} ${doc.clauseRef}`,
    `**Version:** 1.0`,
    `**Issued:** ${today()}`,
    `**Owner:** ${org.primaryContact || "Management Representative"}`,
    `**Organisation:** ${org.orgName}`,
  ].join("  \n");

  const head = `# ${doc.name}\n\n${meta}\n\n> ${CATEGORY_LABEL[doc.category]} prepared for ${org.orgName} (${org.industry}, ${org.state}) under ${standard.code}${standard.year}.\n`;

  const scope = org.scopeDescription
    ? org.scopeDescription
    : `the ${standard.name.toLowerCase()} activities of ${org.orgName} across ${org.sites?.[0] ?? "all operational sites"}`;

  if (doc.category === "MANDATORY_DOCUMENT") {
    return `${head}
## 1. Purpose
This document defines ${org.orgName}'s commitment and approach to ${standard.name.toLowerCase()} in accordance with ${standard.code} clause ${doc.clauseRef}.

## 2. Scope
This applies to ${scope}.

## 3. Statement
${org.orgName} (${org.employeeCount} employees, ABN ${org.abn || "—"}) is committed to establishing, implementing and continually improving a management system that meets the requirements of ${standard.code}${standard.year}, applicable Australian legislation in ${org.state}, and the needs of interested parties.

## 4. Responsibilities
Top management retains accountability. ${org.primaryContact || "The Management Representative"} is responsible for maintaining this document and reporting performance to management review.

## 5. Review
This document is reviewed at least annually and whenever significant change occurs.

| Approved by | Role | Date |
|---|---|---|
| ${org.primaryContact || "________"} | Management Representative | ${today()} |
`;
  }

  if (doc.category === "MANDATORY_RECORD") {
    const rows = briesaRows(doc, org);
    return `${head}
## Purpose
Maintained by ${org.orgName} to demonstrate conformance with ${standard.code} clause ${doc.clauseRef}.

## Retention
Records retained for a minimum of 3 years and made available at audit.

## Register

| Ref | Description | Responsible | Date | Status |
|---|---|---|---|---|
${rows}

## Responsible role
${org.primaryContact || "Management Representative"} maintains this register and reviews entries monthly.
`;
  }

  // RECOMMENDED_PROCEDURE
  return `${head}
## 1. Purpose
To define how ${org.orgName} manages the activities required by ${standard.code} clause ${doc.clauseRef}.

## 2. Scope
Applies to ${scope}.

## 3. Responsibilities
${org.primaryContact || "The Management Representative"} owns this procedure; line managers implement it; all workers comply.

## 4. Procedure
1. Identify the requirement and applicable obligations for ${org.state}, Australia.
2. Plan the activity and assign responsibilities.
3. Execute the activity and apply controls.
4. Record the outcome in the relevant register.
5. Review effectiveness and raise corrective actions where needed.

## 5. Records
Outputs are stored in the associated register and reviewed at management review.

## 6. Review frequency
Reviewed annually or on significant change.
`;
}

function briesaRows(doc: DocType, org: OrgContext): string {
  const b = org.briesaData;
  if (b) {
    if (doc.id.includes("incident") && b.incidents?.length) {
      return b.incidents.slice(0, 3).map(i => `| ${i.ref} | ${i.type} | ${org.primaryContact || "WHS"} | ${i.date} | ${i.severity} |`).join("\n");
    }
    if (doc.id.includes("training") && b.training?.length) {
      return b.training.slice(0, 3).map((t, i) => `| TR-${i + 1} | ${t.course} | L&D | ${today()} | ${t.completed}/${t.total} current |`).join("\n");
    }
    if (doc.id.includes("hazard") && b.hazards?.length) {
      return b.hazards.slice(0, 3).map((h, i) => `| HZ-${i + 1} | ${h.hazard} | ${org.primaryContact || "WHS"} | ${today()} | ${h.risk} |`).join("\n");
    }
  }
  return [
    `| 001 | Example entry — replace with live data | ${org.primaryContact || "Owner"} | ${today()} | Open |`,
    `| 002 | Example entry — replace with live data | ${org.primaryContact || "Owner"} | ${today()} | Closed |`,
  ].join("\n");
}

export function fallbackGapReport(org: OrgContext, docTitles: string[]): GapReport {
  const hasBriesa = !!org.briesaData;
  const score = hasBriesa ? 82 : 68;
  return {
    score,
    summary: `${org.orgName} has a strong documentary foundation across ${docTitles.length} controlled documents. ${hasBriesa ? "Existing Briesa WHS evidence materially strengthens clause 6.1 and 9.1 readiness." : "Operational evidence should now be attached to close the remaining gaps before certification."}`,
    findings: [
      { clauseRef: "4.1", area: "Context of the organisation", status: "Conformant", finding: "Scope and interested parties are documented.", severity: "Minor" },
      { clauseRef: "5.2", area: "Policy", status: "Conformant", finding: "Policy is signed by top management.", severity: "Minor" },
      { clauseRef: "6.1", area: "Risk & opportunity", status: hasBriesa ? "Conformant" : "Partial", finding: hasBriesa ? "Risk register populated from live hazard data." : "Risk methodology defined but evidence is thin.", severity: "Major" },
      { clauseRef: "7.2", area: "Competence", status: "Partial", finding: "Training matrix exists; some records pending sign-off.", severity: "Major" },
      { clauseRef: "9.1", area: "Monitoring & measurement", status: hasBriesa ? "Partial" : "Gap", finding: "Monitoring frequency defined; first audit cycle not yet completed.", severity: "Major" },
      { clauseRef: "9.2", area: "Internal audit", status: "Gap", finding: "Internal audit program scheduled but not yet executed.", severity: "Critical" },
      { clauseRef: "9.3", area: "Management review", status: "Gap", finding: "First management review meeting not yet held.", severity: "Major" },
      { clauseRef: "10.2", area: "Corrective action", status: "Partial", finding: "Register established; demonstrate closed-loop on one item.", severity: "Minor" },
    ],
    criticalGaps: [
      { title: "Run first internal audit cycle", detail: "Execute the documented internal audit program and retain the audit report and findings before the certification audit.", clauseRef: "9.2", severity: "Critical" },
      { title: "Hold first management review", detail: "Convene a management review covering all clause 9.3 inputs and record decisions and actions.", clauseRef: "9.3", severity: "Major" },
      { title: "Close one corrective action end-to-end", detail: "Demonstrate the corrective-action process with at least one fully closed item showing root cause and effectiveness check.", clauseRef: "10.2", severity: "Major" },
    ],
    fallback: true,
  };
}
