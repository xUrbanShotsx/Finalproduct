"use client";
import { useState } from "react";
import { Plus, Check, AlertTriangle, X, Minus } from "lucide-react";
import { PageShell, Stat, Badge, TableHead, Th, Tr, Td, matchesTab } from "../shared";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Row, Col } from "../FormFields";

type TStatus = "Current" | "Expiring" | "Expired" | "Missing";

const STATUS_STYLE: Record<TStatus, { bg: string; color: string }> = {
  Current:  { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  Expiring: { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  Expired:  { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  Missing:  { bg: "var(--b-bg-active)",        color: "var(--b-text-muted)" },
};

/* Required competencies (matrix columns) */
const COMPETENCIES = ["White Card", "Working at Heights", "First Aid", "Confined Space", "EWP", "Traffic Mgmt"];

interface Worker { name: string; role: string; }
const WORKERS: Worker[] = [
  { name: "J. Smith",   role: "Rigger" },
  { name: "M. Jones",   role: "Site Supervisor" },
  { name: "K. Davis",   role: "First Aid Officer" },
  { name: "T. Walsh",   role: "Formwork Carpenter" },
  { name: "S. Lee",     role: "Traffic Controller" },
  { name: "D. Wong",    role: "Plant Operator" },
  { name: "R. Kim",     role: "Labourer" },
];

/* matrix[worker][competency] */
const MATRIX: TStatus[][] = [
  ["Current","Current","Expiring","Current","Current","Missing"],
  ["Current","Current","Current","Current","Missing","Current"],
  ["Current","Expiring","Current","Missing","Missing","Missing"],
  ["Current","Current","Expired","Current","Current","Missing"],
  ["Current","Missing","Current","Missing","Missing","Current"],
  ["Current","Current","Missing","Missing","Current","Missing"],
  ["Current","Missing","Missing","Missing","Missing","Missing"],
];

interface Rec { id: string; worker: string; role: string; course: string; completed: string; expiry: string; status: TStatus; }
const RECORDS: Rec[] = [
  { id: "TRN-061", worker: "J. Smith", role: "Rigger",            course: "Working at Heights",      completed: "10 Jun 2024", expiry: "10 Jun 2026", status: "Current" },
  { id: "TRN-060", worker: "K. Davis", role: "First Aid Officer", course: "First Aid (HLTAID011)",   completed: "01 Mar 2024", expiry: "01 Mar 2027", status: "Current" },
  { id: "TRN-059", worker: "C. Davis", role: "First Aid Officer", course: "Working at Heights",       completed: "12 May 2023", expiry: "12 May 2025", status: "Expiring" },
  { id: "TRN-058", worker: "T. Walsh", role: "Formwork Carpenter",course: "First Aid (HLTAID011)",   completed: "08 Jun 2021", expiry: "08 Jun 2024", status: "Expired" },
  { id: "TRN-057", worker: "S. Lee",   role: "Traffic Controller",course: "Traffic Management — L1", completed: "22 May 2024", expiry: "22 May 2026", status: "Current" },
  { id: "TRN-056", worker: "D. Wong",  role: "Plant Operator",    course: "EWP (WP)",                completed: "15 Apr 2024", expiry: "15 Apr 2029", status: "Current" },
  { id: "TRN-055", worker: "M. Jones", role: "Site Supervisor",   course: "White Card",              completed: "02 Feb 2022", expiry: "—",           status: "Current" },
  { id: "TRN-054", worker: "R. Kim",   role: "Labourer",          course: "White Card",              completed: "18 Jan 2024", expiry: "—",           status: "Current" },
];

const COURSES = ["White Card", "Working at Heights", "First Aid (HLTAID011)", "Confined Space Entry", "EWP (WP)", "Traffic Management — L1", "Asbestos Awareness"];
const PEOPLE = WORKERS.map((w) => w.name);
const INIT = { worker: "", role: "", course: "", completed: "", expiry: "" };

export function TrainingMatrixRegisterPage() {
  const [tab, setTab] = useState("Register");
  const [rows, setRows] = useState(RECORDS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [f, setF] = useState(INIT);
  const sf = <K extends keyof typeof INIT>(k: K, v: string) => setF((p) => ({ ...p, [k]: v }));

  function closeDrawer() { setF(INIT); setDrawerOpen(false); }
  function saveRecord() {
    setRows((prev) => [{
      id: `TRN-${62 + prev.length}`, worker: f.worker || "—", role: f.role || "—", course: f.course || "—",
      completed: f.completed || new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" }),
      expiry: f.expiry || "—", status: "Current",
    }, ...prev]);
    closeDrawer();
  }

  const isMatrix = tab === "Matrix";
  const expiring = rows.filter((r) => r.status === "Expiring").length;
  const expired = rows.filter((r) => r.status === "Expired").length;

  return (
    <>
    <PageShell
      back={{ href: "/people", label: "People" }}
      title="Training Matrix & Register"
      description="Worker training records and an at-a-glance competency matrix across required courses."
      cta="Record Training"
      ctaSlot={
        <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
          <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
          Record Training
        </button>
      }
      stats={
        <>
          <Stat label="Workers" value={String(WORKERS.length)} sub="on this matrix" />
          <Stat label="Records" value={String(rows.length)} sub="training completions" />
          <Stat label="Expiring" value={String(expiring)} sub="within 30 days" highlight="yellow" />
          <Stat label="Expired / Missing" value={String(expired)} sub="action required" highlight="red" />
        </>
      }
      tabs={["Register", "Matrix", "Expiring", "Expired"]}
      onTabChange={setTab}
    >
      {isMatrix ? (
        <div className="p-4 sm:p-6 overflow-x-auto">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            {(["Current","Expiring","Expired","Missing"] as TStatus[]).map((s) => (
              <div key={s} className="flex items-center gap-1.5">
                <span className="w-4 h-4 flex items-center justify-center" style={{ background: STATUS_STYLE[s].bg }}>
                  <Cell s={s} small />
                </span>
                <span className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>{s}</span>
              </div>
            ))}
          </div>
          <div className="border" style={{ borderColor: "var(--b-border)", minWidth: "640px" }}>
            <div className="flex border-b" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
              <div className="w-44 flex-shrink-0 px-3 py-2.5 border-r text-[10px] font-semibold uppercase tracking-widest" style={{ borderColor: "var(--b-border)", color: "var(--b-text-muted)" }}>Worker</div>
              {COMPETENCIES.map((c) => (
                <div key={c} className="flex-1 min-w-[80px] px-1 py-2.5 text-center text-[10px] font-semibold leading-tight border-r last:border-r-0" style={{ borderColor: "var(--b-border)", color: "var(--b-text-secondary)" }}>{c}</div>
              ))}
            </div>
            {WORKERS.map((w, wi) => (
              <div key={w.name} className="flex border-b last:border-b-0" style={{ borderColor: "var(--b-border)" }}>
                <div className="w-44 flex-shrink-0 px-3 py-2.5 border-r" style={{ borderColor: "var(--b-border)" }}>
                  <div className="text-[12.5px] font-semibold" style={{ color: "var(--b-text)" }}>{w.name}</div>
                  <div className="text-[10.5px]" style={{ color: "var(--b-text-muted)" }}>{w.role}</div>
                </div>
                {MATRIX[wi].map((cell, ci) => (
                  <div key={ci} className="flex-1 min-w-[80px] px-1 py-2.5 flex items-center justify-center border-r last:border-r-0" style={{ borderColor: "var(--b-border)" }}>
                    <span className="w-7 h-7 flex items-center justify-center" style={{ background: STATUS_STYLE[cell].bg }} title={cell}>
                      <Cell s={cell} />
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <table className="w-full">
          <TableHead>
            <Th>Reference</Th><Th>Worker</Th><Th>Role</Th><Th>Course</Th><Th>Completed</Th><Th>Expiry</Th><Th>Status</Th>
          </TableHead>
          <tbody>
            {rows.filter((r) => matchesTab(tab, r as unknown as Record<string, unknown>)).map((r) => (
              <Tr key={r.id}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.id}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.worker}</span></Td>
                <Td muted>{r.role}</Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.course}</span></Td>
                <Td muted>{r.completed}</Td>
                <Td>
                  <span style={{ color: r.status === "Expired" ? "#f06060" : r.status === "Expiring" ? "var(--b-badge-yellow-text)" : "var(--b-text-muted)", fontSize: "12.5px" }}>{r.expiry}</span>
                </Td>
                <Td><Badge label={r.status} bg={STATUS_STYLE[r.status].bg} color={STATUS_STYLE[r.status].color} /></Td>
              </Tr>
            ))}
          </tbody>
        </table>
      )}
    </PageShell>

    <Drawer open={drawerOpen} onClose={closeDrawer} title="Record Training" step={1} totalSteps={1}
      stepLabels={["Training Details"]} onStepChange={() => {}} onBack={closeDrawer} onNext={() => {}}
      onSubmit={saveRecord} submitLabel="Save Record">
      <Section>
        <Row>
          <Col><Label>Worker *</Label><Select value={f.worker} onChange={(v) => sf("worker", v)} placeholder="Select worker…" options={PEOPLE} /></Col>
          <Col><Label>Role</Label><Input value={f.role} onChange={(v) => sf("role", v)} placeholder="e.g. Rigger" /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Course / Competency *</Label>
        <Select value={f.course} onChange={(v) => sf("course", v)} placeholder="Select course…" options={COURSES} />
      </Section>
      <Section>
        <Row>
          <Col><Label>Date completed</Label><Input type="date" value={f.completed} onChange={(v) => sf("completed", v)} /></Col>
          <Col><Label>Expiry date</Label><Input type="date" value={f.expiry} onChange={(v) => sf("expiry", v)} /></Col>
        </Row>
      </Section>
    </Drawer>
    </>
  );
}

function Cell({ s, small }: { s: TStatus; small?: boolean }) {
  const sz = small ? "w-2.5 h-2.5" : "w-3.5 h-3.5";
  if (s === "Current") return <Check className={sz} style={{ color: "var(--b-badge-green-text)" }} />;
  if (s === "Expiring") return <AlertTriangle className={sz} style={{ color: "var(--b-badge-yellow-text)" }} />;
  if (s === "Expired") return <X className={sz} style={{ color: "#f06060" }} />;
  return <Minus className={sz} style={{ color: "var(--b-text-muted)" }} />;
}

