"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { WhiteCardDrawer } from "./WhiteCardDrawer";
import { PageShell, Stat, StatusBadge, Badge, TableHead, Th, Tr, Td } from "../shared";

const RECORDS = [
  { ref: "WC-2024-038", name: "Marcus Chen",   cardNo: "NSW-2019-04882", rto: "TAFE NSW",        issued: "14 Mar 2019", verified: "03 Jun 2024", verifiedBy: "S. Walsh",  status: "Active"  as const },
  { ref: "WC-2024-037", name: "Sophie Walsh",  cardNo: "VIC-2021-07341", rto: "RMIT",            issued: "09 Jul 2021", verified: "01 Jun 2024", verifiedBy: "J. Smith",  status: "Active"  as const },
  { ref: "WC-2024-036", name: "James Tran",    cardNo: "NSW-2020-06129", rto: "TAFE NSW",        issued: "22 Nov 2020", verified: "28 May 2024", verifiedBy: "M. Jones",  status: "Active"  as const },
  { ref: "WC-2024-035", name: "Priya Patel",   cardNo: "QLD-2022-09814", rto: "TAFE QLD",        issued: "05 Feb 2022", verified: "21 May 2024", verifiedBy: "K. Davis",  status: "Active"  as const },
  { ref: "WC-2024-034", name: "Ryan O'Brien",  cardNo: "NSW-2018-02947", rto: "Construction Skills", issued: "17 Jun 2018", verified: "15 May 2024", verifiedBy: "S. Walsh", status: "Active" as const },
  { ref: "WC-2024-033", name: "Natalie Kim",   cardNo: "NSW-2023-11204", rto: "TAFE NSW",        issued: "03 Oct 2023", verified: "10 May 2024", verifiedBy: "M. Jones",  status: "Active"  as const },
  { ref: "WC-2024-032", name: "David Huang",   cardNo: "VIC-2020-05663", rto: "Holmesglen",      issued: "28 Aug 2020", verified: "05 May 2024", verifiedBy: "J. Smith",  status: "Active"  as const },
  { ref: "WC-2024-031", name: "Lisa Nguyen",   cardNo: "NSW-2017-01388", rto: "TAFE NSW",        issued: "11 Apr 2017", verified: "—",            verifiedBy: "—",         status: "Pending" as const },
  { ref: "WC-2024-030", name: "Tom Barker",    cardNo: "SA-2016-00419",  rto: "TAFE SA",         issued: "30 Jan 2016", verified: "—",            verifiedBy: "—",         status: "Pending" as const },
  { ref: "WC-2024-029", name: "Amy Foster",    cardNo: "NSW-2015-00082", rto: "Construction Skills", issued: "02 Dec 2015", verified: "12 Jun 2023", verifiedBy: "K. Davis", status: "Expired" as const },
];

export function WhiteCardPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  return (
    <>
    <PageShell
      back={{ href: "/people", label: "People" }}
      title="White Card Register"
      description="Construction Induction Card (White Card) verification records under WHS Regulations."
      cta="Add White Card"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Add White Card
          </button>
        }
      stats={
        <>
          <Stat label="Verified"           value="38" sub="current and valid"       highlight="green"  />
          <Stat label="Pending Verify"     value="2"  sub="documents not yet sighted" highlight="yellow" />
          <Stat label="Expired Records"    value="1"  sub="re-verification needed"  highlight="red"    />
          <Stat label="RTOs Represented"   value="6"  sub="across the workforce"                       />
        </>
      }
      tabs={["All", "Verified", "Pending Verification", "Expired"]}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Worker</Th>
          <Th>Card Number</Th>
          <Th>RTO</Th>
          <Th>Card Issued</Th>
          <Th>Verified</Th>
          <Th>Verified By</Th>
          <Th>Status</Th>
        </TableHead>
        <tbody>
          {rows.map((r) => (
            <Tr key={r.ref}>
              <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
              <Td><span style={{ color: "var(--b-text)" }}>{r.name}</span></Td>
              <Td mono muted>{r.cardNo}</Td>
              <Td muted>{r.rto}</Td>
              <Td muted>{r.issued}</Td>
              <Td>
                <span style={{
                  color: r.verified === "—" ? "var(--b-text-muted)"
                    : r.status === "Expired" ? "#f06060"
                    : "var(--b-text-muted)",
                  fontSize: "12.5px",
                }}>
                  {r.verified}
                </span>
              </Td>
              <Td muted>{r.verifiedBy}</Td>
              <Td><StatusBadge v={r.status} /></Td>
            </Tr>
          ))}
        </tbody>
      </table>
    </PageShell>
    <WhiteCardDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}