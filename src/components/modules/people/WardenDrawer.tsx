"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Row, Col } from "../FormFields";

const ROLES = ["Chief Warden","Deputy Chief Warden","Floor Warden","Area Warden","First Aid Officer"];
const SITES = ["Site 01","Site 02","Site 03","All Sites"];

const INIT = { name:"", role:"", site:"", floor:"", phone:"", trainingDate:"", trainingExpiry:"" };

export function WardenDrawer({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd?: (f: typeof INIT) => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  const submit = () => { onAdd?.(f); reset(); };
  return (
    <Drawer open={open} onClose={reset} title="Add Warden" step={1} totalSteps={1}
      stepLabels={["Warden Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={submit} submitLabel="Add Warden">
      <Section>
        <Row>
          <Col><Label>Full Name *</Label><Input value={f.name} onChange={v => s("name", v)} placeholder="Full name" /></Col>
          <Col><Label>Phone *</Label><Input value={f.phone} onChange={v => s("phone", v)} placeholder="04XX XXX XXX" /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Warden Role *</Label>
        <Select value={f.role} onChange={v => s("role", v)} placeholder="Select role…" options={ROLES} />
      </Section>
      <Section>
        <Row>
          <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
          <Col><Label>Floor / Area</Label><Input value={f.floor} onChange={v => s("floor", v)} placeholder="e.g. Level 3" /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Training Date</Label>
        <Input type="date" value={f.trainingDate} onChange={v => s("trainingDate", v)} />
      </Section>
      <div>
        <Label>Training Expiry</Label>
        <Input type="date" value={f.trainingExpiry} onChange={v => s("trainingExpiry", v)} />
      </div>
    </Drawer>
  );
}
