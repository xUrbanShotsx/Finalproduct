"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { SwmsDrawer } from "./SwmsDrawer";
import { PageShell, Stat, StatusBadge, Badge, TableHead, Th, Tr, Td } from "../shared";

const RECORDS = [
  {
    ref: "SWMS-103",
    title: "Working at Heights — Scaffold Erection",
    hrcw: ["Heights >2m", "Scaffolding"],
    version: "Rev 4",
    status: "Active" as const,
    reviewDue: "15 Jul 2024",
    overdue: false,
    dueSoon: true,
    author: "M. Jones",
  },
  {
    ref: "SWMS-098",
    title: "Excavation >1.5m — Trenching Works",
    hrcw: ["Excavation"],
    version: "Rev 2",
    status: "Active" as const,
    reviewDue: "22 Jul 2024",
    overdue: false,
    dueSoon: true,
    author: "K. Davis",
  },
  {
    ref: "SWMS-091",
    title: "Demolition of Non-Load-Bearing Walls",
    hrcw: ["Demolition"],
    version: "Rev 3",
    status: "Active" as const,
    reviewDue: "30 Aug 2024",
    overdue: false,
    dueSoon: false,
    author: "J. Smith",
  },
  {
    ref: "SWMS-087",
    title: "Concrete Pumping — Podium Deck",
    hrcw: ["Concrete Pumps"],
    version: "Rev 1",
    status: "Draft" as const,
    reviewDue: "—",
    overdue: false,
    dueSoon: false,
    author: "L. Brown",
  },
  {
    ref: "SWMS-082",
    title: "Confined Space Entry — Sewer Pit",
    hrcw: ["Confined Space"],
    version: "Rev 5",
    status: "Active" as const,
    reviewDue: "12 Sep 2024",
    overdue: false,
    dueSoon: false,
    author: "T. Walsh",
  },
  {
    ref: "SWMS-079",
    title: "Hot Work — Welding and Grinding",
    hrcw: ["Hot Work"],
    version: "Rev 2",
    status: "Active" as const,
    reviewDue: "01 Oct 2024",
    overdue: false,
    dueSoon: false,
    author: "J. Smith",
  },
  {
    ref: "SWMS-071",
    title: "Powered Mobile Plant — Crane Operations",
    hrcw: ["Cranes", "Heights >2m"],
    version: "Rev 6",
    status: "Active" as const,
    reviewDue: "28 Feb 2024",
    overdue: true,
    dueSoon: false,
    author: "M. Jones",
  },
];

export function SwmsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
    <PageShell
      back={{ href: "/safety", label: "Safety" }}
      title="SWMS"
      description="Safe Work Method Statements for high-risk construction work under WHS Regulations."
      cta="New SWMS"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            New SWMS
          </button>
        }
      stats={
        <>
          <Stat label="Active SWMS" value="24" sub="across all sites" />
          <Stat label="Due for Review" value="3" sub="within 30 days" highlight="yellow" />
          <Stat label="Overdue Review" value="1" sub="SWMS-071" highlight="red" />
          <Stat label="In Draft" value="2" sub="awaiting sign-off" />
        </>
      }
      tabs={["All", "Active", "Draft", "Due for Review", "Overdue"]}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Title</Th>
          <Th>HRCW Categories</Th>
          <Th>Version</Th>
          <Th>Status</Th>
          <Th>Review Due</Th>
          <Th>Author</Th>
        </TableHead>
        <tbody>
          {RECORDS.map((r) => (
            <Tr key={r.ref}>
              <Td>
                <span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>
                  {r.ref}
                </span>
              </Td>
              <Td>
                <span style={{ color: "var(--b-text)" }}>{r.title}</span>
              </Td>
              <Td>
                <div className="flex items-center gap-1 flex-wrap">
                  {r.hrcw.map((h) => (
                    <Badge
                      key={h}
                      label={h}
                      bg="var(--b-bg-active)"
                      color="var(--b-text-tertiary)"
                    />
                  ))}
                </div>
              </Td>
              <Td muted>{r.version}</Td>
              <Td><StatusBadge v={r.status} /></Td>
              <Td>
                <span
                  style={{
                    color: r.overdue
                      ? "#f06060"
                      : r.dueSoon
                      ? "var(--b-badge-yellow-text)"
                      : "var(--b-text-muted)",
                    fontSize: "12.5px",
                  }}
                >
                  {r.reviewDue}
                  {r.overdue && " ·  overdue"}
                  {r.dueSoon && !r.overdue && " · soon"}
                </span>
              </Td>
              <Td muted>{r.author}</Td>
            </Tr>
          ))}
        </tbody>
      </table>
    </PageShell>
    <SwmsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}