"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, OptionGroup, Row, Col } from "../FormFields";

const TRADES = ["Carpenter","Concretor","Electrician","Plumber","Steelfixer","Scaffolder","Rigger","Crane Operator","Plant Operator","Labourer","Site Manager","Safety Officer","Other"];
const SITES = ["Site 01","Site 02","Site 03","All Sites"];
const INDUCTION_TYPES = ["Site Induction","WHS Induction","HRCW Induction","Visitor Induction"] as const;

const INIT = { name:"", trade:"", company:"", site:"", inductionType:"" as typeof INDUCTION_TYPES[number]|"", date:"", whiteCard:"", accessGranted:"" as "Yes"|"No"|"" };

export function InductionDrawer({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd?: (f: typeof INIT) => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: (typeof INIT)[K]) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  const submit = () => { onAdd?.(f); reset(); };
  return (
    <Drawer open={open} onClose={reset} title="New Induction" step={1} totalSteps={1}
      stepLabels={["Induction Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={submit} submitLabel="Record Induction">
      <Section>
        <Row>
          <Col><Label>Full Name *</Label><Input value={f.name} onChange={v => s("name", v)} placeholder="Worker full name" /></Col>
          <Col><Label>Date *</Label><Input type="date" value={f.date} onChange={v => s("date", v)} /></Col>
        </Row>
      </Section>
      <Section>
        <Row>
          <Col><Label>Trade / Role *</Label><Select value={f.trade} onChange={v => s("trade", v)} placeholder="Select trade…" options={TRADES} /></Col>
          <Col><Label>Company</Label><Input value={f.company} onChange={v => s("company", v)} placeholder="Employer name" /></Col>
        </Row>
      </Section>
      <Section>
        <Row>
          <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
          <Col><Label>Induction Type *</Label><Select value={f.inductionType} onChange={v => s("inductionType", v as typeof INIT["inductionType"])} placeholder="Select type…" options={[...INDUCTION_TYPES]} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>White Card Number</Label>
        <Input value={f.whiteCard} onChange={v => s("whiteCard", v)} placeholder="e.g. QLD-XXXX-XXXX" />
      </Section>
      <div>
        <Label>Site Access Granted?</Label>
        <OptionGroup options={["Yes","No"] as const} value={f.accessGranted} onChange={v => s("accessGranted", v)} />
      </div>
    </Drawer>
  );
}
