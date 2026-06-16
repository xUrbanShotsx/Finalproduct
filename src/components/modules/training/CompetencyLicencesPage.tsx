"use client";

import { useState } from "react";
import { Plus, ChevronDown, ChevronRight, CheckCircle2, AlertTriangle, Clock, Shield } from "lucide-react";
import { PageShell, Stat, Badge } from "../shared";
import { CompetencyLicencesDrawer } from "./CompetencyLicencesDrawer";

type LicStatus = "Current" | "Expiring" | "Expired";

interface LicRecord {
  worker: string;
  role: string;
  licenceNo: string;
  issueDate: string;
  expiryDate: string;
  status: LicStatus;
  daysToExpiry: number | null;
  verified: boolean;
}

const GROUPS: { type: string; records: LicRecord[] }[] = [
  {
    type: "High Risk Work Licence — EWP",
    records: [
      { worker: "J. Smith",  role: "Rigger",             licenceNo: "HRWL-EWP-0012345", issueDate: "10 Jun 2020", expiryDate: "10 Jun 2025", status: "Expiring", daysToExpiry: 11,  verified: true  },
      { worker: "T. Walsh",  role: "Formwork Carpenter", licenceNo: "HRWL-EWP-0098765", issueDate: "15 Apr 2022", expiryDate: "15 Apr 2027", status: "Current",  daysToExpiry: 303, verified: true  },
    ],
  },
  {
    type: "White Card (Construction Induction)",
    records: [
      { worker: "J. Smith",   role: "Rigger",              licenceNo: "WC-10344221", issueDate: "03 Jan 2019", expiryDate: "No Expiry",    status: "Current",  daysToExpiry: null, verified: true  },
      { worker: "M. Jones",   role: "Site Supervisor",     licenceNo: "WC-20981120", issueDate: "15 Feb 2018", expiryDate: "No Expiry",    status: "Current",  daysToExpiry: null, verified: true  },
      { worker: "K. Davis",   role: "First Aid Officer",   licenceNo: "WC-30441509", issueDate: "08 Jun 2020", expiryDate: "No Expiry",    status: "Current",  daysToExpiry: null, verified: false },
      { worker: "L. Brown",   role: "Traffic Controller",  licenceNo: "WC-41302890", issueDate: "22 Mar 2021", expiryDate: "No Expiry",    status: "Current",  daysToExpiry: null, verified: true  },
      { worker: "A. Chen",    role: "Apprentice",          licenceNo: "WC-50088341", issueDate: "01 Oct 2023", expiryDate: "No Expiry",    status: "Current",  daysToExpiry: null, verified: true  },
    ],
  },
  {
    type: "First Aid Certificate (HLTAID011)",
    records: [
      { worker: "K. Davis",  role: "First Aid Officer",  licenceNo: "FAC-23445", issueDate: "01 Mar 2024", expiryDate: "01 Mar 2027", status: "Current",  daysToExpiry: 624, verified: true  },
      { worker: "M. Jones",  role: "Site Supervisor",    licenceNo: "FAC-22801", issueDate: "22 Jun 2021", expiryDate: "22 Jun 2024", status: "Expired",  daysToExpiry: -8,  verified: true  },
    ],
  },
  {
    type: "Traffic Controller Licence",
    records: [
      { worker: "L. Brown",  role: "Traffic Controller", licenceNo: "TCL-44521", issueDate: "22 May 2022", expiryDate: "22 May 2026", status: "Current",  daysToExpiry: 340, verified: true  },
    ],
  },
];

const STATUS_COLOR: Record<LicStatus, { bg: string; color: string }> = {
  Current:  { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  Expiring: { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  Expired:  { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
};

function StatusIcon({ s }: { s: LicStatus }) {
  if (s === "Current")  return <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--b-badge-green-text)" }} />;
  if (s === "Expiring") return <Clock        className="w-3.5 h-3.5" style={{ color: "var(--b-badge-yellow-text)" }} />;
  return <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#f06060" }} />;
}

export function CompetencyLicencesPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed,  setCollapsed]  = useState<Record<string, boolean>>({});

  function toggle(type: string) {
    setCollapsed(prev => ({ ...prev, [type]: !prev[type] }));
  }

  return (
    <>
      <PageShell
        back={{ href: "/training", label: "Training" }}
        title="Competency & Licences"
        description="Track worker licences, high risk work tickets and competency currency across the site."
        cta="Add Licence"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Add Licence
          </button>
        }
        stats={
          <>
            <Stat label="Current"         value="9"  sub="verified & in date"     highlight="green"  />
            <Stat label="Expiring (30d)"  value="1"  sub="J. Smith — HRWL EWP"    highlight="yellow" />
            <Stat label="Expired"         value="1"  sub="M. Jones — First Aid"    highlight="red"    />
            <Stat label="Total Held"      value="11" sub="across 5 workers"                           />
          </>
        }
        tabs={["All", "Current", "Expiring (30d)", "Expired", "Unverified"]}
      >
        <div className="p-6 space-y-3">
          {GROUPS.map(g => {
            const open = !collapsed[g.type];
            const expiredCount  = g.records.filter(r => r.status === "Expired").length;
            const expiringCount = g.records.filter(r => r.status === "Expiring").length;
            return (
              <div key={g.type} className="border overflow-hidden" style={{ borderColor: expiredCount > 0 ? "#f06060" : expiringCount > 0 ? "var(--b-badge-yellow-text)" : "var(--b-border)" }}>
                {/* Group header */}
                <button
                  onClick={() => toggle(g.type)}
                  className="w-full flex items-center justify-between px-4 py-3"
                  style={{ background: "var(--b-bg-secondary)", borderBottom: open ? "1px solid var(--b-border)" : "none" }}
                >
                  <div className="flex items-center gap-2.5">
                    {open ? <ChevronDown className="w-4 h-4" style={{ color: "var(--b-text-muted)" }} />
                           : <ChevronRight className="w-4 h-4" style={{ color: "var(--b-text-muted)" }} />}
                    <Shield className="w-3.5 h-3.5" style={{ color: expiredCount > 0 ? "#f06060" : "var(--b-text-muted)" }} />
                    <span className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>{g.type}</span>
                    <span className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>{g.records.length} record{g.records.length !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {expiredCount  > 0 && <Badge label={`${expiredCount} expired`}  bg="rgba(240,96,96,0.1)"      color="#f06060" />}
                    {expiringCount > 0 && <Badge label={`${expiringCount} expiring`} bg="var(--b-badge-yellow-bg)" color="var(--b-badge-yellow-text)" />}
                  </div>
                </button>

                {/* Records */}
                {open && g.records.map((r, i) => {
                  const sc = STATUS_COLOR[r.status];
                  return (
                    <div
                      key={r.licenceNo + i}
                      className="flex items-center px-4 py-2.5 border-b transition-colors cursor-pointer"
                      style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--b-bg-hover)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--b-bg)"}
                    >
                      <div className="w-48 flex-shrink-0">
                        <div className="text-[12.5px] font-semibold" style={{ color: "var(--b-text)" }}>{r.worker}</div>
                        <div className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>{r.role}</div>
                      </div>
                      <div className="flex-1 text-[12px] font-mono" style={{ color: "var(--b-text-secondary)" }}>{r.licenceNo}</div>
                      <div className="w-28 text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>{r.issueDate}</div>
                      <div className="w-32 text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>{r.expiryDate}</div>
                      <div className="w-28 flex items-center gap-1.5">
                        <StatusIcon s={r.status} />
                        <Badge label={r.status === "Expiring" ? `${r.daysToExpiry}d left` : r.status} bg={sc.bg} color={sc.color} />
                      </div>
                      <div className="w-20 text-right">
                        {r.verified
                          ? <span className="text-[11px]" style={{ color: "var(--b-badge-green-text)" }}>Verified</span>
                          : <span className="text-[11px]" style={{ color: "#f06060" }}>Unverified</span>
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </PageShell>

      <CompetencyLicencesDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
