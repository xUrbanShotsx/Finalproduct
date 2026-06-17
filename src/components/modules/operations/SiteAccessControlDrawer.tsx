"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, OptionGroup, Row, Col } from "../FormFields";

const SITES = ["Site 01","Site 02","Site 03"];
const ZONES = ["Zone A — Public","Zone B — Contractors","Zone C — Restricted","Zone D — Exclusion"];
const ACCESS_LEVELS = ["Granted","Escorted","Denied"] as const;

const INIT = { name:"", company:"", site:"", zone:"", access:"" as typeof ACCESS_LEVELS[number]|"", purpose:"", induction:"" as "Yes"|"No"|"", signIn:"" };

export function SiteAccessControlDrawer({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd?: (f: typeof INIT) => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: (typeof INIT)[K]) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  const submit = () => { onAdd?.(f); reset(); };
  return (
    <Drawer open={open} onClose={reset} title="Manage Access" step={1} totalSteps={1}
      stepLabels={["Access Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={submit} submitLabel="Record Access">
      <Section>
        <Row>
          <Col><Label>Full Name *</Label><Input value={f.name} onChange={v => s("name", v)} placeholder="Full name" /></Col>
          <Col><Label>Company</Label><Input value={f.company} onChange={v => s("company", v)} placeholder="Organisation" /></Col>
        </Row>
      </Section>
      <Section>
        <Row>
          <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
          <Col><Label>Zone *</Label><Select value={f.zone} onChange={v => s("zone", v)} placeholder="Select zone…" options={ZONES} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Induction Completed?</Label>
        <OptionGroup options={["Yes","No"] as const} value={f.induction} onChange={v => s("induction", v)} />
      </Section>
      <Section>
        <Label>Access Decision *</Label>
        <OptionGroup options={ACCESS_LEVELS} value={f.access} onChange={v => s("access", v)} />
      </Section>
      <Section>
        <Label>Purpose of Visit *</Label>
        <Input value={f.purpose} onChange={v => s("purpose", v)} placeholder="e.g. Delivery, inspection, works" />
      </Section>
      <div>
        <Label>Sign-in Time</Label>
        <Input type="datetime-local" value={f.signIn} onChange={v => s("signIn", v)} />
      </div>
    </Drawer>
  );
}
