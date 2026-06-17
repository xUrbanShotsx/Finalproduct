"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, OptionGroup, Row, Col } from "../FormFields";

const TRADES = ["Carpenter","Concretor","Electrician","Plumber","Steelfixer","Scaffolder","Rigger","Plant Operator","Labourer","Other"];
const SITES = ["Site 01","Site 02","Site 03","All Sites"];

const INIT = { name:"", trade:"", site:"", cardNumber:"", rto:"", issueDate:"", verified:"" as "Verified"|"Pending"|"" };

export function WhiteCardDrawer({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd?: (f: typeof INIT) => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: (typeof INIT)[K]) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  const submit = () => { onAdd?.(f); reset(); };
  return (
    <Drawer open={open} onClose={reset} title="Add White Card" step={1} totalSteps={1}
      stepLabels={["Card Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={submit} submitLabel="Save Card">
      <Section>
        <Row>
          <Col><Label>Full Name *</Label><Input value={f.name} onChange={v => s("name", v)} placeholder="Worker full name" /></Col>
          <Col><Label>Trade *</Label><Select value={f.trade} onChange={v => s("trade", v)} placeholder="Select trade…" options={TRADES} /></Col>
        </Row>
      </Section>
      <Section>
        <Row>
          <Col><Label>Card Number *</Label><Input value={f.cardNumber} onChange={v => s("cardNumber", v)} placeholder="e.g. NSW-123456" /></Col>
          <Col><Label>Issue Date *</Label><Input type="date" value={f.issueDate} onChange={v => s("issueDate", v)} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Issuing RTO</Label>
        <Input value={f.rto} onChange={v => s("rto", v)} placeholder="e.g. TAFE NSW" />
      </Section>
      <Section>
        <Label>Site</Label>
        <Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} />
      </Section>
      <div>
        <Label>Verification Status</Label>
        <OptionGroup options={["Verified","Pending"] as const} value={f.verified} onChange={v => s("verified", v)} />
      </div>
    </Drawer>
  );
}
