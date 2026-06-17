"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Row, Col } from "../FormFields";

const SITES = ["Site 01","Site 02","Site 03"];
const HOSTS = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong","S. Lee","P. Nguyen"];
const PURPOSES = ["Client / Owner","Supplier Visit","Regulator / Inspector","Consultant","Delivery","Other"];

const INIT = { visitorName:"", company:"", site:"", host:"", purpose:"", badgeNo:"", signIn:"", expectedOut:"" };

export function VisitorDrawer({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd?: (f: typeof INIT) => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  const submit = () => { onAdd?.(f); reset(); };
  return (
    <Drawer open={open} onClose={reset} title="Sign In Visitor" step={1} totalSteps={1}
      stepLabels={["Visitor Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={submit} submitLabel="Sign In">
      <Section>
        <Row>
          <Col><Label>Visitor Name *</Label><Input value={f.visitorName} onChange={v => s("visitorName", v)} placeholder="Full name" /></Col>
          <Col><Label>Company</Label><Input value={f.company} onChange={v => s("company", v)} placeholder="Organisation" /></Col>
        </Row>
      </Section>
      <Section>
        <Row>
          <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
          <Col><Label>Badge No.</Label><Input value={f.badgeNo} onChange={v => s("badgeNo", v)} placeholder="VIS-XXX" /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Purpose of Visit *</Label>
        <Select value={f.purpose} onChange={v => s("purpose", v)} placeholder="Select purpose…" options={PURPOSES} />
      </Section>
      <Section>
        <Label>Host *</Label>
        <Select value={f.host} onChange={v => s("host", v)} placeholder="Select host…" options={HOSTS} />
      </Section>
      <Section>
        <Label>Sign-in Time *</Label>
        <Input type="datetime-local" value={f.signIn} onChange={v => s("signIn", v)} />
      </Section>
      <div>
        <Label>Expected Departure</Label>
        <Input type="datetime-local" value={f.expectedOut} onChange={v => s("expectedOut", v)} />
      </div>
    </Drawer>
  );
}
