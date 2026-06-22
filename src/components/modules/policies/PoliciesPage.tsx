"use client";

import { useState } from "react";
import { FileText, Download, Search, CheckCircle2, Clock, AlertCircle, Plus } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

type PolicyStatus = "Current" | "Under Review" | "Overdue Review";
type PolicyCategory = "AML/CTF" | "Agency Operations" | "Client Services" | "Privacy" | "HR & Conduct" | "Risk";

interface Policy {
  ref: string;
  title: string;
  category: PolicyCategory;
  status: PolicyStatus;
  version: string;
  owner: string;
  reviewDate: string;
  description: string;
}

// ── Demo data ──────────────────────────────────────────────────────────────

const POLICIES: Policy[] = [
  {
    ref: "POL-001",
    title: "AML/CTF Program — Real Estate Agency",
    category: "AML/CTF",
    status: "Current",
    version: "v3.2",
    owner: "Taylor Reid",
    reviewDate: "31 Mar 2027",
    description: "Governs the agency's obligations under the Anti-Money Laundering and Counter-Terrorism Financing Act 2006, including customer due diligence, record-keeping and AUSTRAC reporting.",
  },
  {
    ref: "POL-002",
    title: "Vendor Identity Verification Procedure",
    category: "AML/CTF",
    status: "Current",
    version: "v2.1",
    owner: "Taylor Reid",
    reviewDate: "31 Mar 2027",
    description: "Step-by-step procedure for verifying vendor identity, sighting and certifying ID documents, PEP screening and sanctions checks before listing a property.",
  },
  {
    ref: "POL-003",
    title: "Trust Account Management Policy",
    category: "Agency Operations",
    status: "Current",
    version: "v4.0",
    owner: "Sarah Kim",
    reviewDate: "30 Jun 2027",
    description: "Outlines obligations for receiving, holding and disbursing trust money in accordance with the Property and Stock Agents Act 2002.",
  },
  {
    ref: "POL-004",
    title: "Agency Agreement & Disclosure Standards",
    category: "Agency Operations",
    status: "Current",
    version: "v2.5",
    owner: "Taylor Reid",
    reviewDate: "30 Jun 2026",
    description: "Standards for preparing and executing agency agreements, rebate disclosure, cooling-off periods and commission disclosure in compliance with the Property and Stock Agents Act 2002.",
  },
  {
    ref: "POL-005",
    title: "Privacy & Personal Information Policy",
    category: "Privacy",
    status: "Under Review",
    version: "v1.8",
    owner: "Mark Ng",
    reviewDate: "15 Jul 2026",
    description: "Governs the collection, use, storage and disclosure of personal information in accordance with the Privacy Act 1988 and the Australian Privacy Principles.",
  },
  {
    ref: "POL-006",
    title: "Client Complaint Handling Procedure",
    category: "Client Services",
    status: "Current",
    version: "v2.0",
    owner: "Sarah Kim",
    reviewDate: "31 Dec 2026",
    description: "Procedure for receiving, recording, investigating and resolving client complaints, including escalation to NSW Fair Trading or NCAT where required.",
  },
  {
    ref: "POL-007",
    title: "Continuing Professional Development (CPD) Policy",
    category: "HR & Conduct",
    status: "Current",
    version: "v1.4",
    owner: "Taylor Reid",
    reviewDate: "31 Dec 2026",
    description: "Outlines mandatory CPD requirements under the Property and Stock Agents Regulation 2022, including minimum structured hours, approved topics and record-keeping.",
  },
  {
    ref: "POL-008",
    title: "Conflicts of Interest Policy",
    category: "Agency Operations",
    status: "Overdue Review",
    version: "v1.1",
    owner: "Mark Ng",
    reviewDate: "30 Apr 2026",
    description: "Identifies and manages conflicts of interest between agents, the agency and clients — including dual-agency, referral fees and related-party transactions.",
  },
  {
    ref: "POL-009",
    title: "Data Breach Response Procedure",
    category: "Privacy",
    status: "Current",
    version: "v1.0",
    owner: "Jamie Walsh",
    reviewDate: "31 Mar 2027",
    description: "Procedure for identifying, containing, reporting and notifying affected parties in the event of an eligible data breach under the Notifiable Data Breaches scheme.",
  },
  {
    ref: "POL-010",
    title: "Suspicious Matter Reporting (SMR) Procedure",
    category: "AML/CTF",
    status: "Current",
    version: "v2.3",
    owner: "Taylor Reid",
    reviewDate: "31 Mar 2027",
    description: "Procedure for identifying and reporting suspicious matters to AUSTRAC under the AML/CTF Act 2006, including tipping-off prohibitions and internal escalation steps.",
  },
];

// ── Style maps ─────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<PolicyStatus, React.CSSProperties> = {
  "Current":        { background: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Under Review":   { background: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Overdue Review": { background: "rgba(240,96,96,0.1)",      color: "#f06060" },
};

const STATUS_ICON = {
  "Current":        CheckCircle2,
  "Under Review":   Clock,
  "Overdue Review": AlertCircle,
} as const;

const CATEGORY_STYLE: Record<PolicyCategory, React.CSSProperties> = {
  "AML/CTF":          { background: "rgba(240,96,96,0.08)",      color: "#f06060" },
  "Agency Operations":{ background: "var(--b-badge-blue-bg)",    color: "var(--b-badge-blue-text)" },
  "Client Services":  { background: "var(--b-badge-green-bg)",   color: "var(--b-badge-green-text)" },
  "Privacy":          { background: "var(--b-badge-yellow-bg)",  color: "var(--b-badge-yellow-text)" },
  "HR & Conduct":     { background: "var(--b-bg-secondary)",     color: "var(--b-text-muted)" },
  "Risk":             { background: "rgba(240,96,96,0.08)",      color: "#f06060" },
};

// ── Component ──────────────────────────────────────────────────────────────

export function PoliciesPage() {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<PolicyCategory | "All">("All");

  const categories: (PolicyCategory | "All")[] = ["All", "AML/CTF", "Agency Operations", "Client Services", "Privacy", "HR & Conduct"];

  const overdue = POLICIES.filter(p => p.status === "Overdue Review").length;
  const underReview = POLICIES.filter(p => p.status === "Under Review").length;

  const filtered = POLICIES.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.ref.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === "All" || p.category === filterCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-6 md:p-8 max-w-[1200px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-semibold" style={{ color: "var(--b-text)" }}>Policies & Procedures</h1>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>
            {POLICIES.length} documents · {overdue > 0 && <span style={{ color: "#f06060" }}>{overdue} overdue for review · </span>}
            {underReview > 0 && <span style={{ color: "var(--b-badge-yellow-text)" }}>{underReview} under review</span>}
          </p>
        </div>
        <button className="b-btn-accent flex items-center gap-2 px-4 h-[38px] text-[13px] font-medium flex-shrink-0">
          <Plus className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} />
          New Policy
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Documents",   value: String(POLICIES.length), style: { color: "var(--b-text)" } },
          { label: "Under Review",      value: String(underReview),     style: { color: "var(--b-badge-yellow-text)" } },
          { label: "Overdue for Review",value: String(overdue),         style: { color: "#f06060" } },
        ].map(s => (
          <div key={s.label} className="p-4 border" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}>
            <div className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--b-text-muted)" }}>{s.label}</div>
            <div className="text-[2rem] font-bold leading-none" style={s.style}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex gap-px border-b flex-1 min-w-0 overflow-x-auto" style={{ borderColor: "var(--b-border)" }}>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className="b-tab flex-shrink-0"
              data-active={filterCat === c}
            >
              {c}
            </button>
          ))}
        </div>
        <div
          className="hidden md:flex items-center gap-2 px-3 h-[34px] border flex-shrink-0"
          style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border-strong)" }}
        >
          <Search className="w-3.5 h-3.5" style={{ color: "var(--b-text-muted)" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search policies…"
            className="bg-transparent text-[12.5px] outline-none w-44"
            style={{ color: "var(--b-text)" }}
          />
        </div>
      </div>

      {/* Policy list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16 border border-dashed" style={{ borderColor: "var(--b-border)", color: "var(--b-text-muted)" }}>
            No policies match your search
          </div>
        )}
        {filtered.map(p => {
          const StatusIcon = STATUS_ICON[p.status];
          return (
            <div
              key={p.ref}
              className="flex items-start gap-4 p-4 border transition-colors cursor-pointer b-card"
              style={{ borderColor: "var(--b-border)" }}
            >
              {/* Icon */}
              <div
                className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--b-bg-active)", color: "var(--b-text-muted)" }}
              >
                <FileText className="w-4 h-4" />
              </div>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[11px] font-semibold" style={{ color: "var(--b-text-muted)" }}>{p.ref}</span>
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold" style={CATEGORY_STYLE[p.category]}>{p.category}</span>
                    </div>
                    <div className="text-[13.5px] font-semibold mb-1" style={{ color: "var(--b-text)" }}>{p.title}</div>
                    <div className="text-[12px] leading-relaxed" style={{ color: "var(--b-text-muted)" }}>{p.description}</div>
                  </div>

                  {/* Meta */}
                  <div className="flex-shrink-0 text-right space-y-1.5">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold" style={STATUS_STYLE[p.status]}>
                        <StatusIcon className="w-3 h-3" />
                        {p.status}
                      </span>
                    </div>
                    <div className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>
                      {p.version} · Owner: {p.owner}
                    </div>
                    <div className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>
                      Review due: {p.reviewDate}
                    </div>
                  </div>
                </div>
              </div>

              {/* Download */}
              <button
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center border transition-colors"
                style={{ borderColor: "var(--b-border-strong)", color: "var(--b-text-muted)" }}
                title="Download"
                onClick={e => e.stopPropagation()}
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
