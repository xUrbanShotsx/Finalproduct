"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Textarea, Row, Col } from "../FormFields";

const PROC_TYPES = ["Fire","Medical","Structural Collapse","Chemical Spill","Confined Space Rescue","Flood","Electrical Emergency","Bomb Threat","Explosion","Environmental"];
const SITES = ["Site 01","Site 02","Site 03","All Sites"];
const OWNERS = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong","S. Lee","P. Nguyen"];

const INIT = { procType:"", title:"", site:"", owner:"", reviewDate:"", drillDate:"", version:"Rev 1", description:"", keyContacts:"" };

export function EmergencyProceduresDrawer({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd?: (f: typeof INIT) => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  const submit = () => { onAdd?.(f); reset(); };
  return (
    <Drawer open={open} onClose={reset} title="New Procedure" step={1} totalSteps={1}
      stepLabels={["Procedure Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={submit} submitLabel="Create Procedure">
      <Section>
        <Row>
          <Col><Label>Procedure Type *</Label><Select value={f.procType} onChange={v => s("procType", v)} placeholder="Select type…" options={PROC_TYPES} /></Col>
          <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Procedure Title *</Label>
        <Input value={f.title} onChange={v => s("title", v)} placeholder="e.g. Fire Emergency Response Procedure" />
      </Section>
      <Section>
        <Label>Overview / Scope</Label>
        <Textarea rows={3} value={f.description} onChange={v => s("description", v)} placeholder="Describe the emergency scenario and response actions…" />
      </Section>
      <Section>
        <Row>
          <Col><Label>Owner *</Label><Select value={f.owner} onChange={v => s("owner", v)} placeholder="Select owner…" options={OWNERS} /></Col>
          <Col><Label>Version</Label><Input value={f.version} onChange={v => s("version", v)} /></Col>
        </Row>
      </Section>
      <Section>
        <Row>
          <Col><Label>Review Date</Label><Input type="date" value={f.reviewDate} onChange={v => s("reviewDate", v)} /></Col>
          <Col><Label>Next Drill Date</Label><Input type="date" value={f.drillDate} onChange={v => s("drillDate", v)} /></Col>
        </Row>
      </Section>
      <div>
        <Label>Key Contacts / Assembly Points</Label>
        <Textarea rows={2} value={f.keyContacts} onChange={v => s("keyContacts", v)} placeholder="Emergency contacts, assembly points, relevant phone numbers…" />
      </div>
    </Drawer>
  );
}
