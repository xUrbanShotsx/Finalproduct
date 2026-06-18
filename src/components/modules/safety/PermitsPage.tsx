"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PermitDrawer } from "./PermitDrawer";
import { PageShell, Stat, StatusBadge, Badge, TableHead, Th, Tr, Td, matchesTab, matchesSite, siteOptionsOf } from "../shared";

const PERMIT_TYPES = {
  Heights:          { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  Excavation:       { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Confined Space": { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Hot Work":       { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "General Access": { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
};

const RECORDS = [
  {
    ref: "PTW-021",
    type: "Heights" as keyof typeof PERMIT_TYPES,
    description: "Scaffold erection — Level 3",
    location: "Site 01",
    issued: "10 Jun 2024",
    expires: "17 Jun 2024",
    status: "Active" as const,
    issuedBy: "J. Smith",
    expiringSoon: false,
  },
  {
    ref: "PTW-020",
    type: "Excavation" as keyof typeof PERMIT_TYPES,
    description: "Trenching — Grid H7",
    location: "Site 02",
    issued: "09 Jun 2024",
    expires: "Today",
    status: "Active" as const,
    issuedBy: "M. Jones",
    expiringSoon: true,
  },
  {
    ref: "PTW-019",
    type: "Confined Space" as keyof typeof PERMIT_TYPES,
    description: "Tank entry — B-Block sewer pit",
    location: "Site 01",
    issued: "08 Jun 2024",
    expires: "15 Jun 2024",
    status: "Active" as const,
    issuedBy: "K. Davis",
    expiringSoon: false,
  },
  {
    ref: "PTW-018",
    type: "Hot Work" as keyof typeof PERMIT_TYPES,
    description: "Welding — Substation roof",
    location: "Site 03",
    issued: "05 Jun 2024",
    expires: "12 Jun 2024",
    status: "Expired" as const,
    issuedBy: "T. Walsh",
    expiringSoon: false,
  },
  {
    ref: "PTW-017",
    type: "Heights" as keyof typeof PERMIT_TYPES,
    description: "MEWP operations — Façade",
    location: "Site 01",
    issued: "03 Jun 2024",
    expires: "10 Jun 2024",
    status: "Expired" as const,
    issuedBy: "J. Smith",
    expiringSoon: false,
  },
  {
    ref: "PTW-016",
    type: "General Access" as keyof typeof PERMIT_TYPES,
    description: "Roof access — Plant room",
    location: "Site 02",
    issued: "01 Jun 2024",
    expires: "08 Jun 2024",
    status: "Expired" as const,
    issuedBy: "L. Brown",
    expiringSoon: false,
  },
];

const PERMIT_TYPE_MAP: Record<string, keyof typeof PERMIT_TYPES> = {
  "Working at Heights": "Heights",
  "Excavation": "Excavation",
  "Confined Space": "Confined Space",
  "Hot Work": "Hot Work",
  "Electrical Isolation": "General Access",
  "General Work": "General Access",
};

export function PermitsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const [tab, setTab] = useState("");
  const [site, setSite] = useState("");
  return (
    <>
    <PageShell
      back={{ href: "/safety", label: "Safety" }}
      title="Permits"
      description="Work permits for excavation, heights, confined spaces and hot work."
      cta="New Permit"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            New Permit
          </button>
        }
      stats={
        <>
          <Stat label="Active Permits" value="4" sub="across 3 sites" highlight="green" />
          <Stat label="Expiring Today" value="1" sub="PTW-020" highlight="yellow" />
          <Stat label="Expired" value="3" sub="last 30 days" />
          <Stat label="Avg Duration" value="7d" sub="rolling 90 days" />
        </>
      }
      tabs={["All", "Active", "Expiring Soon", "Expired"]}
      onTabChange={setTab}
      siteOptions={siteOptionsOf(rows)}
      onSiteChange={setSite}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Type</Th>
          <Th>Description</Th>
          <Th>Location</Th>
          <Th>Issued</Th>
          <Th>Expires</Th>
          <Th>Status</Th>
          <Th>Issued By</Th>
        </TableHead>
        <tbody>
          {rows.filter(r => matchesTab(tab, r) && matchesSite(site, r)).map((r) => (
            <Tr key={r.ref}>
              <Td>
                <span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>
                  {r.ref}
                </span>
              </Td>
              <Td>
                <Badge
                  label={r.type}
                  bg={PERMIT_TYPES[r.type].bg}
                  color={PERMIT_TYPES[r.type].color}
                />
              </Td>
              <Td>
                <span style={{ color: "var(--b-text)" }}>{r.description}</span>
              </Td>
              <Td muted>{r.location}</Td>
              <Td muted>{r.issued}</Td>
              <Td>
                <span
                  style={{
                    color: r.expiringSoon
                      ? "var(--b-badge-yellow-text)"
                      : r.status === "Expired"
                      ? "#f06060"
                      : "var(--b-text-muted)",
                    fontSize: "12.5px",
                    fontWeight: r.expiringSoon ? 600 : undefined,
                  }}
                >
                  {r.expires}
                </span>
              </Td>
              <Td><StatusBadge v={r.status} /></Td>
              <Td muted>{r.issuedBy}</Td>
            </Tr>
          ))}
        </tbody>
      </table>
    </PageShell>
    <PermitDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => [{
      ref: `PTW-${22 + prev.length}`,
      type: PERMIT_TYPE_MAP[f.permitType] ?? "General Access",
      description: f.description || f.permitType || "Work permit",
      location: f.site || f.location || "Site 01",
      issued: f.plannedStart ? f.plannedStart.slice(0,10) : "Today",
      expires: f.plannedEnd ? f.plannedEnd.slice(0,10) : "—",
      status: "Active" as const,
      issuedBy: f.approvedBy || "—",
      expiringSoon: false,
    } as (typeof RECORDS)[number], ...prev])} />
    </>
  );
}