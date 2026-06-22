import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic();

const NAV_GUIDE = `
BRIESA PLATFORM — module navigation:
• Dashboard (/dashboard): overview, compliance score, AI insights, today's tasks
• Properties (/properties): [real estate] listing management, AML/CTF compliance intake
  – Listings (/properties/listings): active listings register, new listing intake with AML/CTF + vendor ID checklist, agency agreement, due diligence, marketing, access setup
  – Appraisals (/properties/appraisals): property appraisal records, CMA reports
  – Sales Pipeline (/properties/pipeline): prospect tracking from appraisal to settlement
• Policies (/policies): [real estate] agency policies, AML/CTF program, licensing & CPD
  – Policies & Procedures (/policies/procedures): document library for agency compliance policies
  – AML/CTF Compliance (/policies/aml-ctf): AML/CTF program, risk assessments, AUSTRAC obligations, SMR procedure
  – Licensing & CPD (/policies/licensing): licence renewals and CPD tracking
• Safety (/safety): hub for all safety sub-modules
  – Incidents (/safety/incidents): report incidents; ICAM + TapRooT® investigation workflows; corrective actions
  – Actions (/safety/actions): all corrective/preventive actions — tagged by ICAM factor, TapRooT root cause, and type (Immediate / Systemic / Preventive)
  – Permits to Work (/safety/permits-to-work): high-risk work permits, permit lifecycle management
  – Toolbox Talks (/safety/toolbox-talks): pre-shift safety briefings and attendance records
  – Prestart Checks (/safety/prestart-checks): plant and equipment prestart inspections
  – SWMS (/safety/swms): Safe Work Method Statements — creation, review, sign-off
  – LOTO (/safety/loto): Lockout/Tagout procedures for plant isolation
• Compliance (/compliance): audit and inspection management, compliance score tracking
  – Audits (/compliance/audits): internal and external audit records
  – Inspections (/compliance/inspections): routine and triggered site inspections
  – Exposure Monitoring (/compliance/exposure-monitoring): occupational exposure records
• Training (/training): training matrix, course records, competency verification
• Risk (/risk): risk register, hazard register, bow-tie controls
• People (/people): workforce management
  – Workers (/people/workers): worker profiles, licence and certification tracking
  – Contractors (/people/contractors): contractor pre-qualification and management
  – Inductions (/people/inductions): site and role inductions, completion rates
• Operations (/operations): plant register, operational checklists, maintenance records
• Governance (/governance): policies, procedures, controlled documents
• Insights (/insights): analytics dashboards, trend reports, custom reporting
• Blueprints (/blueprints): procedure and document templates
• Wallet (/wallet): digital licence and certification wallet
`.trim();

const WHS_KNOWLEDGE = `
AUSTRALIAN WHS LEGISLATION AND STANDARDS (key reference):

Model WHS Act 2011 (adopted by all states/territories except Victoria):
• s17 — 'reasonably practicable' duty standard
• s19 — PCBU primary duty of care to workers and others affected by work
• s27 — Officer due diligence: must proactively acquire and use WHS knowledge
• s35-38 — Notifiable incidents: must notify regulator immediately for death, serious injury/illness, dangerous incident. Preserve scene.
• Penalty tiers: Category 1 (reckless) ≤$3M/org; Category 2 (failure to comply) ≤$1.5M/org; Category 3 (contravention) ≤$500K/org

Model WHS Regulations 2011:
• Reg 36 — hazard identification and risk management duty
• Reg 44-49 — WHS management systems, policies, consultation
• Reg 291-297 — high-risk construction work (HRCW): work at height >2 m, scaffolding, demolition, excavation, asbestos; requires SWMS before commencement
• Reg 419-432 — plant and structures: design registration, plant registration, inspection
• Reg 328-379 — hazardous chemicals: SDS, labelling, health monitoring

Key standards and codes of practice:
• Safe Work Australia codes of practice: authoritative guidance on how to comply
• AS/NZS ISO 45001:2018 — OHS management systems (replaces AS/NZS 4801)
• Silica dust: exposure standard halved to 0.025 mg/m³ (Safe Work Australia, effective 2024)

Investigation methodologies:
• ICAM (Incident Cause Analysis Method): Australian standard for incident investigation
  – Analyses absent/failed defences → individual/team actions → organisational/management factors → contributing factors
  – Produces systemic corrective actions mapped to each causal layer
• TapRooT® Root Cause Analysis: international RCA system used alongside ICAM
  – SnapCharT™ timeline → causal factors → Root Cause Tree (Equipment / Procedure / Training / Communications / Work Direction / Management System) → corrective actions
  – Together ICAM + TapRooT ensure investigations address root causes, not just symptoms

Key metrics:
• TRIFR = (recordable injuries × 1,000,000) / hours worked — industry benchmarks vary; construction target typically <5
• LTIFR = (lost-time injuries × 1,000,000) / hours worked
• Compliance score: audit-ready percentage across WHS obligations

REAL ESTATE LEGISLATION AND COMPLIANCE (Australia):
• AML/CTF Act 2006 (Cth): Real estate agents became reporting entities under AUSTRAC from 31 March 2026. Must complete customer due diligence (CDD) before marketing, listing or exchanging contracts.
  – CDD requires: verify identity of all vendors (primary + secondary ID), identify beneficial owners, PEP screening, sanctions checks
  – Enhanced CDD for high-risk transactions, PEPs and suspicious matters
  – Suspicious Matter Reports (SMR) must be filed with AUSTRAC — tipping-off prohibited
  – Records kept minimum 7 years
• Property and Stock Agents Act 2002 (NSW): governs agency agreements, commissions, trust accounts, cooling-off periods and conduct
  – Agency agreement must disclose commission, fees and rebates before signing
  – Sole and exclusive agency agreements: 42-day maximum initial term
  – Trust accounting: all client money held in statutory trust accounts; annual audit required
• Privacy Act 1988 (Cth) + Australian Privacy Principles: governs collection and use of client personal information; Notifiable Data Breaches (NDB) scheme applies
• Property and Stock Agents Regulation 2022 (NSW): CPD obligations — minimum structured and elective hours per year; REINSW or approved provider delivery
• Section 32 / Vendor Statement (VIC) or equivalent: vendors must disclose title, encumbrances, outgoings and planning matters before exchange
• Conveyancing Act 1919 (NSW) / Sale of Land Act 1962 (VIC): governs contract terms, cooling-off rights and purchaser protections
• Trust accounting: separate trust account mandatory; interest to Statutory Interest Account; annual audit by approved auditor
`.trim();

function buildSystemPrompt(pathname: string, industry: string): string {
  const pageMap: Record<string, string> = {
    "/dashboard":                    "Dashboard overview — compliance score, AI insights and tasks",
    "/properties":                   "Properties module — listings, appraisals, sales pipeline",
    "/properties/listings":          "Listings register — active listings, AML/CTF compliance status, new listing intake with vendor ID and AML checklist",
    "/properties/appraisals":        "Property appraisals — CMA reports, vendor price discussions",
    "/properties/pipeline":          "Sales pipeline — prospect to settlement tracking",
    "/policies":                     "Policies module — agency policies, AML/CTF program, licensing & CPD",
    "/policies/procedures":          "Policies & Procedures library — agency compliance documents",
    "/policies/aml-ctf":             "AML/CTF Compliance — AUSTRAC obligations, SMR procedure, risk assessments",
    "/policies/licensing":           "Licensing & CPD — licence renewals, CPD tracking and submissions",
    "/safety":                       "Safety module hub",
    "/safety/incidents":             "Incidents register — ICAM/TapRooT investigation workflows, severity, status",
    "/safety/actions":               "Corrective actions — tagged by ICAM factor, TapRooT root cause, action type",
    "/safety/permits-to-work":       "Permits to Work — high-risk work authorisation",
    "/safety/toolbox-talks":         "Toolbox Talks — pre-shift safety briefings",
    "/safety/prestart-checks":       "Prestart Checks — plant and equipment inspections",
    "/safety/swms":                  "Safe Work Method Statements (SWMS)",
    "/safety/loto":                  "Lockout/Tagout (LOTO) procedures",
    "/compliance":                   "Compliance hub — audit readiness score",
    "/compliance/audits":            "Audit records and audit management",
    "/compliance/inspections":       "Site and facility inspections",
    "/training":                     "Training matrix and competency records",
    "/risk":                         "Risk register and hazard register",
    "/people":                       "People — workers, contractors, inductions",
    "/people/workers":               "Worker profiles and licence tracking",
    "/people/contractors":           "Contractor pre-qualification and management",
    "/people/inductions":            "Inductions — completion rates, site and role inductions",
    "/operations":                   "Operations — plant register, checklists",
    "/governance":                   "Governance — policies, procedures, documents",
    "/insights":                     "Analytics and reporting dashboards",
    "/blueprints":                   "Blueprints — document templates",
    "/wallet":                       "Wallet — digital licence and certification cards",
  };
  const pageDesc = pageMap[pathname] ?? `page: ${pathname}`;
  const industryLabel =
    industry === "industrial"  ? "industrial manufacturing/processing"
    : industry === "facilities" ? "facilities management"
    : industry === "realestate" ? "real estate agency"
    : "construction";

  return [
    `You are Briesa AI — the intelligent WHS assistant built into the Briesa platform for Australian workplaces.`,
    ``,
    `CURRENT CONTEXT:`,
    `• User is on: ${pageDesc}`,
    `• Industry: ${industryLabel}`,
    ``,
    WHS_KNOWLEDGE,
    ``,
    NAV_GUIDE,
    ``,
    `BEHAVIOUR RULES:`,
    `• Be concise and practical. Most answers should be 2–4 short paragraphs or a clear numbered list.`,
    `• For navigation questions: tell the user exactly which page to go to and what to look for.`,
    `• For legislation questions: cite the specific Act section or Regulation number.`,
    `• For investigation questions: explain ICAM and TapRooT clearly and reference what the Briesa platform provides.`,
    `• If the user is on a specific page, tailor your answer to what they can see and do there.`,
    `• Never make up legislation. If unsure, say so and direct the user to Safe Work Australia (safeworkaustralia.gov.au).`,
    `• Use plain paragraphs. For lists, use numbered or short dashes. Keep responses focused.`,
  ].join("\n");
}

export async function POST(req: NextRequest) {
  const { messages, pathname, industry } = await req.json() as {
    messages: Array<{ role: "user" | "assistant"; content: string }>;
    pathname: string;
    industry: string;
  };

  if (!messages?.length) return new Response("Missing messages", { status: 400 });

  const systemPrompt = buildSystemPrompt(pathname ?? "/dashboard", industry ?? "construction");

  const stream = await client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 800,
    system: systemPrompt,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
