"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, OptionGroup, Row, Col } from "../FormFields";

const INSTRUMENT_TYPES = ["Act","Regulation","Code of Practice","Australian Standard","Guidance Note","License / Permit"] as const;
const JURISDICTIONS = ["Commonwealth","NSW","VIC","QLD","SA","WA","TAS","NT","ACT"];
const STATUSES = ["Current","Amendment Pending","Superseded"] as const;

const INIT = { instrType:"" as typeof INSTRUMENT_TYPES[number]|"", jurisdiction:"", title:"", ref:"", status:"" as typeof STATUSES[number]|"", commencement:"", reviewDate:"", amendmentPending:"" as "Yes"|"No"|"" };

export function LegislativeRegisterDrawer({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd?: (f: typeof INIT) => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: (typeof INIT)[K]) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  const submit = () => { onAdd?.(f); reset(); };
  return (
    <Drawer open={open} onClose={reset} title="Add Instrument" step={1} totalSteps={1}
      stepLabels={["Instrument Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={submit} submitLabel="Add to Register">
      <Section>
        <Row>
          <Col><Label>Type *</Label><Select value={f.instrType} onChange={v => s("instrType", v as typeof INIT["instrType"])} placeholder="Select type…" options={[...INSTRUMENT_TYPES]} /></Col>
          <Col><Label>Jurisdiction *</Label><Select value={f.jurisdiction} onChange={v => s("jurisdiction", v)} placeholder="Select…" options={JURISDICTIONS} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Title *</Label>
        <Input value={f.title} onChange={v => s("title", v)} placeholder="e.g. Work Health and Safety Act 2011" />
      </Section>
      <Section>
        <Label>Reference No.</Label>
        <Input value={f.ref} onChange={v => s("ref", v)} placeholder="e.g. No. 137, 2011" />
      </Section>
      <Section>
        <Row>
          <Col><Label>Commencement</Label><Input type="date" value={f.commencement} onChange={v => s("commencement", v)} /></Col>
          <Col><Label>Review Date</Label><Input type="date" value={f.reviewDate} onChange={v => s("reviewDate", v)} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Status *</Label>
        <OptionGroup options={STATUSES} value={f.status} onChange={v => s("status", v)} />
      </Section>
      <div>
        <Label>Amendment Pending?</Label>
        <OptionGroup options={["Yes","No"] as const} value={f.amendmentPending} onChange={v => s("amendmentPending", v)} />
      </div>
    </Drawer>
  );
}
