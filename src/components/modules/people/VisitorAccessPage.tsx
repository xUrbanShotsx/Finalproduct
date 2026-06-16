"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { VisitorDrawer } from "./VisitorDrawer";
import { PageShell, Stat, Badge, TableHead, Th, Tr, Td } from "../shared";

type VisitPurpose  = "Contractor" | "Client" | "Delivery" | "Inspection" | "Maintenance" | "Interview";
type AccessStatus  = "On Site" | "Signed Out" | "Overstay" | "Denied";

const PURPOSE_COLORS: Record<VisitPurpose, { bg: string; color: string }> = {
  "Contractor":  { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Client":      { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Delivery":    { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Inspection":  { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Maintenance": { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Interview":   { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
};

const STATUS_COLORS: Record<AccessStatus, { bg: string; color: string }> = {
  "On Site":     { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Signed Out":  { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Overstay":    { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Denied":      { bg: "rgba(240,96,96,0.15)",     color: "#f06060" },
};

const RECORDS: Array<{
  ref: string; visitor: string; company: string; host: string;
  purpose: VisitPurpose; signIn: string; signOut: string;
  badge: string; status: AccessStatus;
}> = [
  { ref: "VIS-240613-008", visitor: "Chris Hammond",   company: "Apex Electrical",       host: "S. Walsh",   purpose: "Contractor",  signIn: "08:14", signOut: "—",    badge: "V-08", status: "On Site"    },
  { ref: "VIS-240613-007", visitor: "Karen Fowler",    company: "BuildCorp Clients",     host: "M. Jones",   purpose: "Client",      signIn: "09:30", signOut: "11:45",badge: "V-07", status: "Signed Out" },
  { ref: "VIS-240613-006", visitor: "Derek Shaw",      company: "WorkSafe NSW",          host: "J. Smith",   purpose: "Inspection",  signIn: "10:00", signOut: "—",    badge: "V-06", status: "On Site"    },
  { ref: "VIS-240613-005", visitor: "Mia Lombardi",    company: "Office Supplies Co",    host: "Reception",  purpose: "Delivery",    signIn: "11:15", signOut: "11:22",badge: "V-05", status: "Signed Out" },
  { ref: "VIS-240613-004", visitor: "Harry Nguyen",    company: "HVAC Solutions",        host: "S. Walsh",   purpose: "Maintenance", signIn: "12:00", signOut: "—",    badge: "V-04", status: "On Site"    },
  { ref: "VIS-240613-003", visitor: "Julia Park",      company: "HR Consulting Group",   host: "K. Davis",   purpose: "Interview",   signIn: "13:30", signOut: "14:15",badge: "V-03", status: "Signed Out" },
  { ref: "VIS-240613-002", visitor: "Unknown",         company: "—",                     host: "—",          purpose: "Contractor",  signIn: "14:00", signOut: "—",    badge: "—",    status: "Denied"     },
  { ref: "VIS-240613-001", visitor: "Steve Reynolds",  company: "Fire Inspection Aust.", host: "S. Walsh",   purpose: "Inspection",  signIn: "06:30", signOut: "—",    badge: "V-01", status: "Overstay"   },
];

export function VisitorAccessPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const onSite = RECORDS.filter(r => r.status === "On Site").length;

  return (
    <>
    <PageShell
      back={{ href: "/people", label: "People" }}
      title="Visitor & Access Management"
      description="Visitor sign-in, badge tracking and site access control records."
      cta="Sign In Visitor"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Sign In
          </button>
        }
      stats={
        <>
          <Stat label="On Site Now"    value={String(onSite)} sub="signed in"           highlight="green"  />
          <Stat label="Overstay"       value="1"              sub="expected out at 07:30" highlight="red"  />
          <Stat label="Total Today"    value="8"              sub="since 06:00"                            />
          <Stat label="Avg Visit"      value="2.3h"           sub="rolling 7 days"                        />
        </>
      }
      tabs={["Today", "On Site", "Signed Out", "Overstay", "Denied"]}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Visitor</Th>
          <Th>Company</Th>
          <Th>Host</Th>
          <Th>Purpose</Th>
          <Th>Sign-in</Th>
          <Th>Sign-out</Th>
          <Th>Badge</Th>
          <Th>Status</Th>
        </TableHead>
        <tbody>
          {RECORDS.map((r) => {
            const purposeStyle = PURPOSE_COLORS[r.purpose];
            const statusStyle  = STATUS_COLORS[r.status];
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[11px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.visitor}</span></Td>
                <Td muted>{r.company}</Td>
                <Td muted>{r.host}</Td>
                <Td><Badge label={r.purpose} bg={purposeStyle.bg} color={purposeStyle.color} /></Td>
                <Td mono muted>{r.signIn}</Td>
                <Td mono>
                  <span style={{
                    color: r.status === "Overstay" ? "#f06060" : "var(--b-text-muted)",
                    fontSize: "12.5px",
                    fontWeight: r.status === "Overstay" ? 600 : undefined,
                  }}>
                    {r.signOut}
                  </span>
                </Td>
                <Td mono muted>{r.badge}</Td>
                <Td><Badge label={r.status} bg={statusStyle.bg} color={statusStyle.color} /></Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <VisitorDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}