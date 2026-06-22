"use client";

import { useState } from "react";
import { BadgeCheck, Plus, X, ChevronDown, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

const YELLOW = "#ffd600";
const GREEN  = "#1a8a4a";
const RED    = "#f06060";

type LicStatus = "Current" | "Expiring Soon" | "Expired";

interface Licence {
  id: number;
  name: string;
  number: string;
  issuer: string;
  issued: string;
  expires: string;
  status: LicStatus;
}

const SEED: Licence[] = [
  { id: 1, name: "Plumbing Licence",             number: "PL-089423",  issuer: "NSW Fair Trading",   issued: "01 Jan 2020",  expires: "30 Sep 2024", status: "Current"       },
  { id: 2, name: "White Card (General Induction)",number: "WC-339812",  issuer: "SafeWork NSW",       issued: "15 Mar 2018",  expires: "N/A",         status: "Current"       },
  { id: 3, name: "Public Liability Insurance",    number: "PLI-20220341",issuer: "CGU Insurance",     issued: "14 Jul 2023",  expires: "14 Jul 2024", status: "Expiring Soon" },
  { id: 4, name: "Gas Fitting Licence",           number: "GF-221987",  issuer: "NSW Fair Trading",   issued: "01 Jun 2019",  expires: "01 Jun 2025", status: "Current"       },
  { id: 5, name: "First Aid Certificate",         number: "FA-113492",  issuer: "St John Ambulance",  issued: "10 Feb 2023",  expires: "10 Feb 2025", status: "Current"       },
  { id: 6, name: "Asbestos Awareness",            number: "AA-882319",  issuer: "SafeWork NSW",       issued: "05 May 2022",  expires: "05 May 2023", status: "Expired"       },
];

const STATUS_CONFIG: Record<LicStatus, { color: string; bg: string; icon: typeof CheckCircle2 }> = {
  "Current":        { color: GREEN,  bg: "rgba(26,138,74,0.08)",  icon: CheckCircle2 },
  "Expiring Soon":  { color: YELLOW, bg: "rgba(255,214,0,0.1)",   icon: Clock        },
  "Expired":        { color: RED,    bg: "rgba(240,96,96,0.08)",  icon: AlertTriangle},
};

const ISSUERS = ["NSW Fair Trading", "SafeWork NSW", "CGU Insurance", "St John Ambulance", "Custom…"];
const STATUSES: LicStatus[] = ["Current", "Expiring Soon", "Expired"];

const INIT = { name: "", number: "", issuer: "NSW Fair Trading", issued: "", expires: "", status: "Current" as LicStatus };

export function TradieLicences() {
  const [licences, setLicences] = useState<Licence[]>(SEED);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [f, setF] = useState(INIT);
  const set = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));

  const expiring = licences.filter(l => l.status === "Expiring Soon").length;
  const expired  = licences.filter(l => l.status === "Expired").length;

  function addLicence() {
    if (!f.name) return;
    setLicences(prev => [{
      id: Date.now(), name: f.name, number: f.number, issuer: f.issuer,
      issued: f.issued, expires: f.expires || "N/A", status: f.status,
    }, ...prev]);
    setF(INIT);
    setDrawerOpen(false);
  }

  return (
    <div className="p-5 max-w-[860px]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-[800] tracking-tight" style={{ color: "var(--b-text)" }}>My Licences</h1>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>Store and track your licences, certificates and insurance.</p>
        </div>
        <button onClick={() => setDrawerOpen(true)} className="flex items-center gap-1.5 px-4 h-9 text-[12.5px] font-[700]" style={{ background: YELLOW, color: "#0a0a0a" }}>
          <Plus className="w-3.5 h-3.5" /> Add Licence
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Total",          value: String(licences.length), color: "var(--b-text)" },
          { label: "Expiring Soon",  value: String(expiring),        color: YELLOW          },
          { label: "Expired",        value: String(expired),         color: RED             },
        ].map(s => (
          <div key={s.label} className="border px-3 py-2.5 text-center" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
            <div className="text-[20px] font-[800] leading-none" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10.5px] mt-1" style={{ color: "var(--b-text-muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Licence cards */}
      <div className="grid sm:grid-cols-2 gap-3">
        {licences.map(l => {
          const st = STATUS_CONFIG[l.status];
          const Icon = st.icon;
          return (
            <div
              key={l.id}
              className="border flex flex-col"
              style={{ borderColor: l.status === "Expired" ? "rgba(240,96,96,0.3)" : l.status === "Expiring Soon" ? "rgba(255,214,0,0.3)" : "var(--b-border)", background: "var(--b-bg)" }}
            >
              {/* Status bar */}
              <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: "var(--b-border)", background: st.bg }}>
                <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: st.color }} />
                <span className="text-[11px] font-[700]" style={{ color: st.color }}>{l.status}</span>
                <span className="ml-auto font-mono text-[10px]" style={{ color: "var(--b-text-muted)" }}>{l.number}</span>
              </div>
              {/* Content */}
              <div className="flex-1 px-3 py-3 space-y-1">
                <p className="text-[13px] font-[700]" style={{ color: "var(--b-text)" }}>{l.name}</p>
                <p className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>{l.issuer}</p>
              </div>
              {/* Footer */}
              <div className="flex items-center justify-between px-3 py-2 border-t text-[10.5px]" style={{ borderColor: "var(--b-border)" }}>
                <span style={{ color: "var(--b-text-muted)" }}>Issued {l.issued}</span>
                <span style={{ color: l.status === "Expired" ? RED : l.status === "Expiring Soon" ? YELLOW : "var(--b-text-muted)", fontWeight: l.status !== "Current" ? 700 : 400 }}>
                  {l.expires === "N/A" ? "No expiry" : `Expires ${l.expires}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="flex flex-col border-l h-full" style={{ width: 400, background: "var(--b-bg)", borderColor: "var(--b-border-strong)" }}>
            <div className="flex items-center gap-3 px-5 py-4 border-b flex-shrink-0" style={{ borderColor: "var(--b-border)" }}>
              <BadgeCheck className="w-4 h-4" style={{ color: YELLOW }} />
              <span className="text-[13px] font-[700]" style={{ color: "var(--b-text)" }}>Add Licence / Certificate</span>
              <button onClick={() => setDrawerOpen(false)} className="ml-auto" style={{ color: "var(--b-text-muted)" }}><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {[
                { label: "Licence / Certificate Name *", key: "name",   placeholder: "e.g. Plumbing Licence" },
                { label: "Licence Number",               key: "number", placeholder: "e.g. PL-089423"        },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-[11px] font-[700] uppercase tracking-wide mb-1.5" style={{ color: "var(--b-text-muted)" }}>{label}</label>
                  <input
                    className="w-full px-3 h-[36px] border text-[12.5px] outline-none"
                    style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }}
                    placeholder={placeholder}
                    value={f[key as keyof typeof INIT]}
                    onChange={e => set(key as keyof typeof INIT, e.target.value)}
                  />
                </div>
              ))}
              <div>
                <label className="block text-[11px] font-[700] uppercase tracking-wide mb-1.5" style={{ color: "var(--b-text-muted)" }}>Issuing Body</label>
                <div className="relative">
                  <select className="w-full px-3 h-[36px] border text-[12.5px] outline-none appearance-none" style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }} value={f.issuer} onChange={e => set("issuer", e.target.value)}>
                    {ISSUERS.map(i => <option key={i}>{i}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--b-text-muted)" }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-[700] uppercase tracking-wide mb-1.5" style={{ color: "var(--b-text-muted)" }}>Date Issued</label>
                  <input type="date" className="w-full px-3 h-[36px] border text-[12.5px] outline-none" style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }} value={f.issued} onChange={e => set("issued", e.target.value)} />
                </div>
                <div>
                  <label className="block text-[11px] font-[700] uppercase tracking-wide mb-1.5" style={{ color: "var(--b-text-muted)" }}>Expiry Date</label>
                  <input type="date" className="w-full px-3 h-[36px] border text-[12.5px] outline-none" style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }} value={f.expires} onChange={e => set("expires", e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-[700] uppercase tracking-wide mb-1.5" style={{ color: "var(--b-text-muted)" }}>Status</label>
                <div className="relative">
                  <select className="w-full px-3 h-[36px] border text-[12.5px] outline-none appearance-none" style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }} value={f.status} onChange={e => set("status", e.target.value as LicStatus)}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--b-text-muted)" }} />
                </div>
              </div>
            </div>
            <div className="flex gap-2 px-5 py-4 border-t flex-shrink-0" style={{ borderColor: "var(--b-border)" }}>
              <button onClick={() => setDrawerOpen(false)} className="flex-1 h-9 text-[12.5px] font-[600] border" style={{ borderColor: "var(--b-border-strong)", color: "var(--b-text-muted)" }}>Cancel</button>
              <button onClick={addLicence} className="flex-1 h-9 text-[12.5px] font-[700]" style={{ background: YELLOW, color: "#0a0a0a" }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
