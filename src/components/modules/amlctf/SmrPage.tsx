"use client";

import { useState } from "react";
import { AlertTriangle, Clock, CheckCircle2, FileText, Plus } from "lucide-react";

type SmrStatus = "Draft" | "Submitted" | "Under Review";

interface SmrRecord {
  ref: string;
  property: string;
  vendor: string;
  indicator: string;
  status: SmrStatus;
  created: string;
  submitted?: string;
}

const RECORDS: SmrRecord[] = [
  { ref: "SMR-001", property: "82 Pacific Highway, Gordon",   vendor: "Thornfield Pty Ltd",     indicator: "Complex corporate ownership structure — beneficial owner not identifiable through normal CDD", status: "Submitted",    created: "6 Jun 2026", submitted: "8 Jun 2026" },
  { ref: "SMR-002", property: "14 Cove Road, Watsons Bay",    vendor: "Coastal Holdings Trust",  indicator: "Vendor unable to provide satisfactory explanation for source of funds — transaction value $4.5M",  status: "Draft",        created: "10 Jun 2026" },
  { ref: "SMR-003", property: "201 Crown Street, Darlinghurst", vendor: "Anonymous Purchaser",  indicator: "Purchaser requested unusual settlement terms inconsistent with normal practice",               status: "Under Review", created: "3 Jun 2026" },
];

const STATUS_STYLE: Record<SmrStatus, React.CSSProperties> = {
  "Draft":        { background: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Submitted":    { background: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Under Review": { background: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
};

const STATUS_ICON = { "Draft": Clock, "Submitted": CheckCircle2, "Under Review": AlertTriangle } as const;

export function SmrPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 md:p-8 max-w-[1100px]">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-semibold" style={{ color: "var(--b-text)" }}>Suspicious Matter Reports</h1>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>
            AUSTRAC SMR register — {RECORDS.length} total · {RECORDS.filter(r => r.status === "Draft").length} draft
          </p>
        </div>
        <button onClick={() => setOpen(true)} className="b-btn-accent flex items-center gap-2 px-4 h-[38px] text-[13px] font-medium flex-shrink-0">
          <Plus className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} />
          New SMR
        </button>
      </div>

      {/* Tipping-off warning */}
      <div className="flex items-start gap-3 p-4 border-l-2 mb-6" style={{ background: "rgba(240,96,96,0.05)", borderLeftColor: "#f06060", border: "1px solid rgba(240,96,96,0.2)" }}>
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#f06060" }} />
        <div>
          <div className="text-[12.5px] font-semibold mb-0.5" style={{ color: "var(--b-text)" }}>Tipping-off prohibition — AML/CTF Act s.123</div>
          <div className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>
            It is a criminal offence to disclose to a customer or third party that a Suspicious Matter Report has been or may be submitted to AUSTRAC. Do not discuss SMR matters outside of authorised staff.
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {RECORDS.map(r => {
          const Icon = STATUS_ICON[r.status];
          return (
            <div key={r.ref} className="flex items-start gap-4 p-4 border" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}>
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: "rgba(240,96,96,0.1)", color: "#f06060" }}>
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[11px] font-semibold" style={{ color: "var(--b-text-muted)" }}>{r.ref}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold" style={STATUS_STYLE[r.status]}>
                    <Icon className="w-3 h-3" />{r.status}
                  </span>
                </div>
                <div className="text-[13px] font-semibold mb-1" style={{ color: "var(--b-text)" }}>{r.property}</div>
                <div className="text-[12px] mb-2" style={{ color: "var(--b-text-muted)" }}>Vendor/party: {r.vendor}</div>
                <div className="text-[12px] leading-relaxed p-3 border-l-2" style={{ borderLeftColor: "#f06060", background: "rgba(240,96,96,0.04)", color: "var(--b-text-secondary)" }}>
                  <span className="font-semibold" style={{ color: "var(--b-text-muted)" }}>Indicator: </span>{r.indicator}
                </div>
                <div className="text-[11px] mt-2" style={{ color: "var(--b-text-muted)" }}>
                  Created: {r.created}{r.submitted ? ` · Submitted to AUSTRAC: ${r.submitted}` : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New SMR stub modal */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg p-6 border" style={{ background: "var(--b-bg)", borderColor: "var(--b-border)" }}>
              <h3 className="text-[16px] font-semibold mb-1" style={{ color: "var(--b-text)" }}>New Suspicious Matter Report</h3>
              <p className="text-[12.5px] mb-4" style={{ color: "var(--b-text-muted)" }}>This will open the AUSTRAC SMR submission workflow.</p>
              <div className="flex gap-3">
                <button onClick={() => setOpen(false)} className="b-btn-ghost px-4 h-[38px] text-[13px]">Cancel</button>
                <button onClick={() => setOpen(false)} className="b-btn-accent px-4 h-[38px] text-[13px] font-medium">Continue to AUSTRAC Portal</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
