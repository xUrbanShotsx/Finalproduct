"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { WardenDrawer } from "./WardenDrawer";
import { PageShell, Stat, Badge, TableHead, Th, Tr, Td, matchesTab, matchesSite, siteOptionsOf } from "../shared";

type WardenRole = "Chief Warden" | "Floor Warden" | "Deputy Warden" | "First Aid Officer";
type TrainingStatus = "Current" | "Expiring Soon" | "Expired" | "Not Trained";

const ROLE_COLORS: Record<WardenRole, { bg: string; color: string }> = {
  "Chief Warden":      { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Floor Warden":      { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Deputy Warden":     { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "First Aid Officer": { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
};

const TRAINING_COLORS: Record<TrainingStatus, { bg: string; color: string }> = {
  "Current":      { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Expiring Soon":{ bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Expired":      { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Not Trained":  { bg: "var(--b-bg-active)",        color: "var(--b-text-muted)" },
};

const RECORDS: Array<{
  ref: string; name: string; role: WardenRole; floor: string;
  lastTraining: string; trainingExpiry: string; certIssuer: string;
  trainingStatus: TrainingStatus; contact: string;
}> = [
  { ref: "WR-012", name: "Sophie Walsh",  role: "Chief Warden",      floor: "All Floors",  lastTraining: "14 Jan 2024", trainingExpiry: "14 Jan 2026", certIssuer: "Fire & Safety Aust.", trainingStatus: "Current",       contact: "0412 000 001" },
  { ref: "WR-011", name: "Marcus Chen",   role: "Floor Warden",      floor: "Level 8",     lastTraining: "14 Jan 2024", trainingExpiry: "14 Jan 2026", certIssuer: "Fire & Safety Aust.", trainingStatus: "Current",       contact: "0412 000 002" },
  { ref: "WR-010", name: "Priya Patel",   role: "First Aid Officer",  floor: "Level 7–8",   lastTraining: "22 Feb 2024", trainingExpiry: "22 Feb 2025", certIssuer: "St John Ambulance",  trainingStatus: "Current",       contact: "0412 000 003" },
  { ref: "WR-009", name: "James Tran",    role: "Floor Warden",      floor: "Level 6",     lastTraining: "14 Jan 2024", trainingExpiry: "14 Jan 2026", certIssuer: "Fire & Safety Aust.", trainingStatus: "Current",       contact: "0412 000 004" },
  { ref: "WR-008", name: "Natalie Kim",   role: "Deputy Warden",     floor: "Level 5–6",   lastTraining: "08 Mar 2023", trainingExpiry: "08 Mar 2025", certIssuer: "Fire & Safety Aust.", trainingStatus: "Expiring Soon", contact: "0412 000 005" },
  { ref: "WR-007", name: "David Huang",   role: "Floor Warden",      floor: "Level 5",     lastTraining: "14 Jan 2024", trainingExpiry: "14 Jan 2026", certIssuer: "Fire & Safety Aust.", trainingStatus: "Current",       contact: "0412 000 006" },
  { ref: "WR-006", name: "Lisa Nguyen",   role: "First Aid Officer",  floor: "Level 3–4",   lastTraining: "22 Feb 2024", trainingExpiry: "22 Feb 2025", certIssuer: "St John Ambulance",  trainingStatus: "Current",       contact: "0412 000 007" },
  { ref: "WR-005", name: "Tom Barker",    role: "Floor Warden",      floor: "Level 4",     lastTraining: "11 May 2022", trainingExpiry: "11 May 2024", certIssuer: "Fire & Safety Aust.", trainingStatus: "Expired",       contact: "0412 000 008" },
  { ref: "WR-004", name: "Ryan O'Brien",  role: "Floor Warden",      floor: "Level 3",     lastTraining: "14 Jan 2024", trainingExpiry: "14 Jan 2026", certIssuer: "Fire & Safety Aust.", trainingStatus: "Current",       contact: "0412 000 009" },
  { ref: "WR-003", name: "Amy Foster",    role: "Deputy Warden",     floor: "Level 1–2",   lastTraining: "—",           trainingExpiry: "—",           certIssuer: "—",                  trainingStatus: "Not Trained",   contact: "0412 000 010" },
];

export function WardenRegisterPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const [tab, setTab] = useState("");
  const [site, setSite] = useState("");
  return (
    <>
    <PageShell
      back={{ href: "/people", label: "People" }}
      title="Warden Register"
      description="Building warden assignments, training currency and contact details for emergency response."
      cta="Add Warden"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Add Warden
          </button>
        }
      stats={
        <>
          <Stat label="Wardens Registered" value="12"   sub="across all floors"             />
          <Stat label="Training Current"    value="10"   sub="certified and valid" highlight="green"  />
          <Stat label="Expiring Soon"       value="2"    sub="within 90 days"      highlight="yellow" />
          <Stat label="Floors Covered"      value="8/8"  sub="full building coverage"                 />
        </>
      }
      tabs={["All", "Chief Wardens", "Floor Wardens", "First Aid", "Training Due"]}
      onTabChange={setTab}
      siteOptions={siteOptionsOf(rows)}
      onSiteChange={setSite}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Warden</Th>
          <Th>Role</Th>
          <Th>Floor / Zone</Th>
          <Th>Last Training</Th>
          <Th>Training Expiry</Th>
          <Th>Issuer</Th>
          <Th>Training Status</Th>
          <Th>Contact</Th>
        </TableHead>
        <tbody>
          {rows.filter(r => matchesTab(tab, r) && matchesSite(site, r)).map((r) => {
            const roleStyle     = ROLE_COLORS[r.role];
            const trainingStyle = TRAINING_COLORS[r.trainingStatus];
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.name}</span></Td>
                <Td><Badge label={r.role} bg={roleStyle.bg} color={roleStyle.color} /></Td>
                <Td muted>{r.floor}</Td>
                <Td muted>{r.lastTraining}</Td>
                <Td>
                  <span style={{
                    color: r.trainingStatus === "Expired" ? "#f06060" : r.trainingStatus === "Expiring Soon" ? "var(--b-badge-yellow-text)" : "var(--b-text-muted)",
                    fontSize: "12.5px",
                  }}>
                    {r.trainingExpiry}
                  </span>
                </Td>
                <Td muted>{r.certIssuer}</Td>
                <Td><Badge label={r.trainingStatus} bg={trainingStyle.bg} color={trainingStyle.color} /></Td>
                <Td mono muted>{r.contact}</Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <WardenDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}