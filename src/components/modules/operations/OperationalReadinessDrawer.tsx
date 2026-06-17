"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, OptionGroup, Row, Col } from "../FormFields";

const SITES = ["Site 01","Site 02","Site 03"];
const SHIFTS = ["Day","Afternoon","Night"] as const;
const SUPERVISORS = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong"];
const CHECKS = ["PPE available","First aid kit stocked","Emergency contacts displayed","Site access controlled","Pre-start checklists complete","Work area inspected","Comms system operational"] as const;
type Check = typeof CHECKS[number];
type Result = "Pass" | "Fail" | "";

const INIT_CHECKS = Object.fromEntries(CHECKS.map(c => [c, "" as Result])) as Record<Check, Result>;
const INIT = { site:"", supervisor:"", shift:"" as typeof SHIFTS[number]|"", date:"" };

export function OperationalReadinessDrawer({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd?: (f: typeof INIT) => void }) {
  const [f, setF] = useState(INIT);
  const [checks, setChecks] = useState(INIT_CHECKS);
  const s = <K extends keyof typeof INIT>(k: K, v: (typeof INIT)[K]) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); setChecks(INIT_CHECKS); onClose(); };
  const submit = () => { onAdd?.(f); reset(); };
  const fails = Object.values(checks).filter(v => v === "Fail").length;
  return (
    <Drawer open={open} onClose={reset} title="Readiness Check" step={1} totalSteps={1}
      stepLabels={["Check Items"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={submit} submitLabel="Submit Check">
      <Section>
        <Row>
          <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
          <Col><Label>Date *</Label><Input type="date" value={f.date} onChange={v => s("date", v)} /></Col>
        </Row>
      </Section>
      <Section>
        <Row>
          <Col><Label>Shift *</Label><OptionGroup options={SHIFTS} value={f.shift} onChange={v => s("shift", v)} /></Col>
          <Col><Label>Supervisor *</Label><Select value={f.supervisor} onChange={v => s("supervisor", v)} placeholder="Select…" options={SUPERVISORS} /></Col>
        </Row>
      </Section>
      {fails > 0 && (
        <Section>
          <div className="p-3 border" style={{ background: "rgba(240,96,96,0.06)", borderColor: "#f06060" }}>
            <span className="text-[12px] font-semibold" style={{ color: "#f06060" }}>
              {fails} item{fails > 1 ? "s" : ""} failed — conditional start only. Raise actions before commencing work.
            </span>
          </div>
        </Section>
      )}
      <div className="space-y-3">
        {CHECKS.map(c => (
          <div key={c}>
            <Label>{c}</Label>
            <OptionGroup options={["Pass","Fail"] as const} value={checks[c]} onChange={v => setChecks(p => ({ ...p, [c]: v }))} />
          </div>
        ))}
      </div>
    </Drawer>
  );
}
