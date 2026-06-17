"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Textarea, Row, Col } from "../FormFields";

const SITES = ["Site 01","Site 02","Site 03","All Sites"];
const SUPERVISORS = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong","S. Lee","P. Nguyen"];
const TRADES = ["Concretor","Carpenter","Steelfixer","Electrician","Plumber","Scaffolder","Rigger","Demolition","Civil","General"];
const PRIORITIES = ["Scheduled","Urgent","Hold"];

const INIT = { title:"", site:"", supervisor:"", trade:"", priority:"", plannedStart:"", plannedEnd:"", swmsRef:"", permitRef:"", description:"" };

export function WorkPlanningDrawer({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd?: (f: typeof INIT) => void }) {
  const [step, setStep] = useState(1);
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setStep(1); setF(INIT); onClose(); };
  const submit = () => { onAdd?.(f); reset(); };
  return (
    <Drawer open={open} onClose={reset} title="New Work Plan" step={step} totalSteps={2}
      stepLabels={["Work Details","Controls & Refs"]}
      onStepChange={setStep} onBack={() => step === 1 ? reset() : setStep(1)}
      onNext={() => setStep(2)} onSubmit={submit} submitLabel="Create Work Plan">
      {step === 1 && <>
        <Section>
          <Label>Work Plan Title *</Label>
          <Input value={f.title} onChange={v => s("title", v)} placeholder="e.g. Concrete pour — Level 4 slab" />
        </Section>
        <Section>
          <Row>
            <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
            <Col><Label>Trade *</Label><Select value={f.trade} onChange={v => s("trade", v)} placeholder="Select trade…" options={TRADES} /></Col>
          </Row>
        </Section>
        <Section>
          <Row>
            <Col><Label>Planned Start *</Label><Input type="date" value={f.plannedStart} onChange={v => s("plannedStart", v)} /></Col>
            <Col><Label>Planned End *</Label><Input type="date" value={f.plannedEnd} onChange={v => s("plannedEnd", v)} /></Col>
          </Row>
        </Section>
        <Section>
          <Row>
            <Col><Label>Supervisor *</Label><Select value={f.supervisor} onChange={v => s("supervisor", v)} placeholder="Select…" options={SUPERVISORS} /></Col>
            <Col><Label>Priority</Label><Select value={f.priority} onChange={v => s("priority", v)} placeholder="Select…" options={PRIORITIES} /></Col>
          </Row>
        </Section>
        <div>
          <Label>Scope Description</Label>
          <Textarea rows={3} value={f.description} onChange={v => s("description", v)} placeholder="Describe the work scope and key activities…" />
        </div>
      </>}
      {step === 2 && <>
        <Section>
          <Label>SWMS Reference</Label>
          <Input value={f.swmsRef} onChange={v => s("swmsRef", v)} placeholder="e.g. SWMS-103" />
        </Section>
        <div>
          <Label>Permit Reference</Label>
          <Input value={f.permitRef} onChange={v => s("permitRef", v)} placeholder="e.g. PTW-021" />
        </div>
      </>}
    </Drawer>
  );
}
