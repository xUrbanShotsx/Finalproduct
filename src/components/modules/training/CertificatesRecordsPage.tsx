"use client";

import { useState } from "react";
import { Plus, Award, CalendarDays, Building2, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { PageShell, Stat, Badge } from "../shared";
import { CertificatesRecordsDrawer } from "./CertificatesRecordsDrawer";

type CertStatus = "Expired" | "Expiring" | "Current" | "Future";

interface CertRecord {
  holder: string;
  role: string;
  certType: string;
  certNo: string;
  issuingBody: string;
  issueDate: string;
  expiryDate: string;
  status: CertStatus;
  daysToExpiry: number | null;
}

const BANDS: { label: string; status: CertStatus; borderColor: string; headerBg: string; headerColor: string }[] = [
  { label: "Expired",       status: "Expired",  borderColor: "#f06060",                      headerBg: "rgba(240,96,96,0.08)",       headerColor: "#f06060" },
  { label: "Expiring Soon (30 days)", status: "Expiring", borderColor: "var(--b-badge-yellow-text)", headerBg: "var(--b-badge-yellow-bg)", headerColor: "var(--b-badge-yellow-text)" },
  { label: "Current",       status: "Current",  borderColor: "var(--b-badge-green-text)",    headerBg: "var(--b-badge-green-bg)",     headerColor: "var(--b-badge-green-text)" },
];

const ALL_CERTS: CertRecord[] = [
  { holder: "M. Jones",  role: "Site Supervisor",     certType: "First Aid (HLTAID011)",          certNo: "FAC-22801",       issuingBody: "St John Ambulance",    issueDate: "22 Jun 2021", expiryDate: "22 Jun 2024", status: "Expired",  daysToExpiry: -8   },
  { holder: "J. Smith",  role: "Rigger",               certType: "High Risk Work Licence — EWP",  certNo: "HRWL-EWP-0012345",issuingBody: "SafeWork NSW",         issueDate: "10 Jun 2020", expiryDate: "10 Jun 2025", status: "Expiring", daysToExpiry: 11   },
  { holder: "K. Davis",  role: "First Aid Officer",    certType: "First Aid (HLTAID011)",          certNo: "FAC-23445",       issuingBody: "St John Ambulance",    issueDate: "01 Mar 2024", expiryDate: "01 Mar 2027", status: "Current",  daysToExpiry: 624  },
  { holder: "L. Brown",  role: "Traffic Controller",   certType: "Traffic Controller Licence",    certNo: "TCL-44521",       issuingBody: "Transport for NSW",    issueDate: "22 May 2022", expiryDate: "22 May 2026", status: "Current",  daysToExpiry: 340  },
  { holder: "T. Walsh",  role: "Formwork Carpenter",   certType: "High Risk Work Licence — EWP",  certNo: "HRWL-EWP-0098765",issuingBody: "SafeWork NSW",         issueDate: "15 Apr 2022", expiryDate: "15 Apr 2027", status: "Current",  daysToExpiry: 303  },
  { holder: "K. Davis",  role: "First Aid Officer",    certType: "Working at Heights",            certNo: "CERT-WAH-0041",   issuingBody: "Altura Training",      issueDate: "10 Jun 2024", expiryDate: "10 Jun 2026", status: "Current",  daysToExpiry: 359  },
  { holder: "S. Nguyen", role: "Emergency Warden",     certType: "Emergency Warden",              certNo: "CERT-0520",       issuingBody: "Fire & Safety Aust.",  issueDate: "20 May 2024", expiryDate: "20 May 2027", status: "Current",  daysToExpiry: 703  },
  { holder: "R. Patel",  role: "Confined Space Tech",  certType: "Confined Space Entry",          certNo: "CERT-CS-0088",    issuingBody: "Confined Space Pty",   issueDate: "03 Jun 2024", expiryDate: "03 Jun 2027", status: "Current",  daysToExpiry: 352  },
];

function StatusIcon({ status }: { status: CertStatus }) {
  if (status === "Current" || status === "Future") return <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--b-badge-green-text)" }} />;
  if (status === "Expiring") return <Clock className="w-3.5 h-3.5" style={{ color: "var(--b-badge-yellow-text)" }} />;
  return <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#f06060" }} />;
}

export function CertificatesRecordsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const expired  = ALL_CERTS.filter(c => c.status === "Expired").length;
  const expiring = ALL_CERTS.filter(c => c.status === "Expiring").length;
  const current  = ALL_CERTS.filter(c => c.status === "Current").length;

  return (
    <>
      <PageShell
        back={{ href: "/training", label: "Training" }}
        title="Certificates & Records"
        description="Track all worker certificates, licences and training records with expiry alerts."
        cta="Add Certificate"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Add Certificate
          </button>
        }
        stats={
          <>
            <Stat label="Active Certificates" value={`${current}`}  sub="current & in date"    highlight="green"  />
            <Stat label="Expiring (30d)"       value={`${expiring}`} sub="action required"      highlight="yellow" />
            <Stat label="Expired"              value={`${expired}`}  sub="renewal overdue"      highlight="red"    />
            <Stat label="Total Records"        value={`${ALL_CERTS.length}`} sub="across all workers"               />
          </>
        }
        tabs={["All", "Active", "Expiring", "Expired"]}
      >
        <div className="p-6 space-y-5">
          {BANDS.map(band => {
            const certs = ALL_CERTS.filter(c => c.status === band.status);
            if (certs.length === 0) return null;
            return (
              <div key={band.status} className="border overflow-hidden" style={{ borderColor: band.borderColor }}>
                {/* Band header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ background: band.headerBg, borderColor: band.borderColor }}>
                  <div className="flex items-center gap-2">
                    <StatusIcon status={band.status} />
                    <span className="text-[12px] font-bold uppercase tracking-widest" style={{ color: band.headerColor }}>{band.label}</span>
                  </div>
                  <span className="text-[11px] font-semibold" style={{ color: band.headerColor }}>{certs.length} certificate{certs.length !== 1 ? "s" : ""}</span>
                </div>

                {/* Certificate cards — 2 col */}
                <div className="p-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {certs.map((cert, i) => (
                    <div
                      key={cert.certNo + i}
                      className="border p-4 cursor-pointer transition-colors"
                      style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--b-border-hover)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--b-border)"}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 flex items-center justify-center border flex-shrink-0" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}>
                            <Award className="w-4 h-4" style={{ color: band.headerColor }} />
                          </div>
                          <div>
                            <div className="text-[12.5px] font-semibold leading-snug" style={{ color: "var(--b-text)" }}>{cert.certType}</div>
                            <div className="text-[11px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>{cert.holder} · {cert.role}</div>
                          </div>
                        </div>
                        {cert.status === "Expiring" && cert.daysToExpiry !== null && (
                          <Badge label={`${cert.daysToExpiry}d`} bg="var(--b-badge-yellow-bg)" color="var(--b-badge-yellow-text)" />
                        )}
                        {cert.status === "Expired" && (
                          <Badge label="Expired" bg="rgba(240,96,96,0.1)" color="#f06060" />
                        )}
                      </div>

                      {/* Details row */}
                      <div className="flex items-center gap-4 text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
                        <span className="font-mono">{cert.certNo}</span>
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {cert.issuingBody}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[11.5px] mt-1.5" style={{ color: "var(--b-text-muted)" }}>
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          Issued {cert.issueDate}
                        </span>
                        <span
                          style={{
                            fontWeight: cert.status !== "Current" ? 600 : 400,
                            color: cert.status === "Expired" ? "#f06060" : cert.status === "Expiring" ? "var(--b-badge-yellow-text)" : "var(--b-text-muted)",
                          }}
                        >
                          Expires {cert.expiryDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </PageShell>

      <CertificatesRecordsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
