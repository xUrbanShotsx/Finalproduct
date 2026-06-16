"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Textarea, OptionGroup, Row, Col } from "../FormFields";

const CAPACITY = ["25%","50%","75%","Full Duties"] as const;
const COORDINATORS = ["J. Smith","M. Jones","K. Davis","T. Walsh","HR Team"];

const INIT = { worker:"", incidentRef:"", rtwStart:"", capacity:"" as typeof CAPACITY[number]|"", restrictions:"", practitioner:"", coordinator:"", notes:"" };

export function ReturnToWorkDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: (typeof INIT)[K]) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  return (
    <Drawer open={open} onClose={reset} title="New RTW Plan" step={1} totalSteps={1}
      stepLabels={["RTW Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={reset} submitLabel="Create RTW Plan">
      <Section>
        <Row>
          <Col><Label>Worker *</Label><Input value={f.worker} onChange={v => s("worker", v)} placeholder="Full name" /></Col>
          <Col><Label>Incident Ref.</Label><Input value={f.incidentRef} onChange={v => s("incidentRef", v)} placeholder="e.g. INC-044" /></Col>
        </Row>
      </Section>
      <Section>
        <Row>
          <Col><Label>RTW Start Date *</Label><Input type="date" value={f.rtwStart} onChange={v => s("rtwStart", v)} /></Col>
          <Col><Label>RTW Coordinator</Label><Select value={f.coordinator} onChange={v => s("coordinator", v)} placeholder="Select…" options={COORDINATORS} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Work Capacity *</Label>
        <OptionGroup options={CAPACITY} value={f.capacity} onChange={v => s("capacity", v)} />
      </Section>
      <Section>
        <Label>Restrictions / Duties</Label>
        <Textarea rows={3} value={f.restrictions} onChange={v => s("restrictions", v)} placeholder="e.g. No lifting >5kg, seated duties only, max 4h per day…" />
      </Section>
      <div>
        <Label>Treating Practitioner</Label>
        <Input value={f.practitioner} onChange={v => s("practitioner", v)} placeholder="Dr name / clinic" />
      </div>
    </Drawer>
  );
}
