"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Textarea, OptionGroup, Row, Col } from "../FormFields";

const OBL_TYPES = ["Occupancy Certificate","ESM Annual Report","Insurance","WHS Notice / Notification","Licence / Permit","Regulator Return","Environmental","Other"];
const SITES = ["Site 01","Site 02","Site 03","All Sites"];
const OWNERS = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong","S. Lee","P. Nguyen"];
const FREQUENCY = ["Annual","Six-Monthly","Quarterly","Monthly","One-off","Ongoing"];

const INIT = { oblType:"", title:"", site:"", owner:"", frequency:"", dueDate:"", description:"", notified:"" as "Yes"|"No"|"" };

export function StatutoryObligationsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: (typeof INIT)[K]) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  return (
    <Drawer open={open} onClose={reset} title="Add Obligation" step={1} totalSteps={1}
      stepLabels={["Obligation Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={reset} submitLabel="Add Obligation">
      <Section>
        <Row>
          <Col><Label>Type *</Label><Select value={f.oblType} onChange={v => s("oblType", v)} placeholder="Select type…" options={OBL_TYPES} /></Col>
          <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Obligation Title *</Label>
        <Input value={f.title} onChange={v => s("title", v)} placeholder="e.g. Occupancy Certificate — Building A" />
      </Section>
      <Section>
        <Label>Description</Label>
        <Textarea rows={2} value={f.description} onChange={v => s("description", v)} placeholder="Describe the statutory obligation and relevant legislation…" />
      </Section>
      <Section>
        <Row>
          <Col><Label>Owner *</Label><Select value={f.owner} onChange={v => s("owner", v)} placeholder="Select owner…" options={OWNERS} /></Col>
          <Col><Label>Frequency *</Label><Select value={f.frequency} onChange={v => s("frequency", v)} placeholder="Select…" options={FREQUENCY} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Due Date *</Label>
        <Input type="date" value={f.dueDate} onChange={v => s("dueDate", v)} />
      </Section>
      <div>
        <Label>Regulator / Authority Notified?</Label>
        <OptionGroup options={["Yes","No"] as const} value={f.notified} onChange={v => s("notified", v)} />
      </div>
    </Drawer>
  );
}
