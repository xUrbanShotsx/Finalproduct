"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { ContractorDrawer } from "./ContractorDrawer";
import { PageShell, Stat, StatusBadge, Badge, TableHead, Th, Tr, Td } from "../shared";

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  "Electrical":    { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Plumbing":      { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Scaffolding":   { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Civil":         { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Demolition":    { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Crane Hire":    { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Formwork":      { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Fire Protect.": { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
};

const RECORDS = [
  { ref: "CON-012", company: "Apex Electrical Pty Ltd",     type: "Electrical",    abn: "47 123 456 789", licence: "EC-7841",    insuranceExpiry: "31 Dec 2024", prequal: "Active"  as const, contact: "B. Watts"     },
  { ref: "CON-011", company: "Summit Scaffolding Co",        type: "Scaffolding",   abn: "61 234 567 890", licence: "SC-3329",    insuranceExpiry: "30 Sep 2024", prequal: "Active"  as const, contact: "T. Frame"     },
  { ref: "CON-010", company: "Bluestone Civil",              type: "Civil",         abn: "33 345 678 901", licence: "CDB-U 12847",insuranceExpiry: "28 Feb 2025", prequal: "Active"  as const, contact: "A. Rock"      },
  { ref: "CON-009", company: "National Crane Hire",          type: "Crane Hire",    abn: "58 456 789 012", licence: "CR-4410",    insuranceExpiry: "15 Jun 2024", prequal: "Expired" as const, contact: "N. Lift"     },
  { ref: "CON-008", company: "ProForm Formwork",             type: "Formwork",      abn: "72 567 890 123", licence: "CDB-U 09912",insuranceExpiry: "31 Mar 2025", prequal: "Active"  as const, contact: "P. Mould"    },
  { ref: "CON-007", company: "Clearflow Plumbing",           type: "Plumbing",      abn: "19 678 901 234", licence: "PL-6602",    insuranceExpiry: "31 Oct 2024", prequal: "Active"  as const, contact: "C. Pipe"     },
  { ref: "CON-006", company: "Demolition Specialists QLD",   type: "Demolition",    abn: "84 789 012 345", licence: "DL-1183",    insuranceExpiry: "30 Jun 2024", prequal: "Pending" as const, contact: "D. Break"   },
  { ref: "CON-005", company: "Firetech Protection Services", type: "Fire Protect.",  abn: "27 890 123 456", licence: "FSL-774",    insuranceExpiry: "31 Jan 2025", prequal: "Active"  as const, contact: "F. Spray"   },
  { ref: "CON-004", company: "SteelCo Reinforcing",          type: "Civil",         abn: "53 901 234 567", licence: "CDB-U 08531",insuranceExpiry: "31 Aug 2024", prequal: "Active"  as const, contact: "S. Bar"     },
  { ref: "CON-003", company: "Rapid Electrical Services",    type: "Electrical",    abn: "66 012 345 678", licence: "EC-5519",    insuranceExpiry: "30 Apr 2024", prequal: "Expired" as const, contact: "R. Volt"    },
];

export function ContractorManagementPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
    <PageShell
      back={{ href: "/people", label: "People" }}
      title="Contractor Management"
      description="Contractor prequalification, licence currency and insurance compliance register."
      cta="Add Contractor"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Add Contractor
          </button>
        }
      stats={
        <>
          <Stat label="Active Contractors" value="12" sub="prequalified"             highlight="green"  />
          <Stat label="Expired Insurance"   value="3"  sub="immediate action needed" highlight="red"    />
          <Stat label="Pending Review"      value="2"  sub="awaiting documents"      highlight="yellow" />
          <Stat label="Licences Tracked"    value="28" sub="across all contractors"                     />
        </>
      }
      tabs={["All", "Active", "Expired Documents", "Pending Review"]}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Company</Th>
          <Th>Type</Th>
          <Th>ABN</Th>
          <Th>Licence</Th>
          <Th>Insurance Expiry</Th>
          <Th>Prequalification</Th>
          <Th>Contact</Th>
        </TableHead>
        <tbody>
          {RECORDS.map((r) => {
            const typeStyle = TYPE_COLORS[r.type] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.company}</span></Td>
                <Td><Badge label={r.type} bg={typeStyle.bg} color={typeStyle.color} /></Td>
                <Td mono muted>{r.abn}</Td>
                <Td mono muted>{r.licence}</Td>
                <Td>
                  <span style={{
                    color: r.prequal === "Expired" ? "#f06060" : "var(--b-text-muted)",
                    fontSize: "12.5px",
                    fontWeight: r.prequal === "Expired" ? 600 : undefined,
                  }}>
                    {r.insuranceExpiry}
                  </span>
                </Td>
                <Td><StatusBadge v={r.prequal} /></Td>
                <Td muted>{r.contact}</Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <ContractorDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}