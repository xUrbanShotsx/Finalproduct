"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Textarea, Row, Col } from "../FormFields";

const CATEGORIES = ["Working at Heights","Confined Space","Manual Handling","Electrical Work","Chemical Handling","Traffic Management","Emergency Response","Hot Work","Plant Operation","General Works"];
const SITES = ["Site 01","Site 02","Site 03","All Sites"];
const OWNERS = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong","S. Lee","P. Nguyen"];

const INIT = { title:"", category:"", site:"", owner:"", version:"Rev 1", reviewDate:"", description:"" };

export function SafeWorkProceduresDrawer({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd?: (f: typeof INIT) => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  const submit = () => { onAdd?.(f); reset(); };
  return (
    <Drawer open={open} onClose={reset} title="New Procedure" step={1} totalSteps={1}
      stepLabels={["Procedure Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={submit} submitLabel="Create Procedure">
      <Section>
        <Label>Procedure Title *</Label>
        <Input value={f.title} onChange={v => s("title", v)} placeholder="e.g. SWP-014 Elevated Work Platform Operation" />
      </Section>
      <Section>
        <Row>
          <Col><Label>Category *</Label><Select value={f.category} onChange={v => s("category", v)} placeholder="Select category…" options={CATEGORIES} /></Col>
          <Col><Label>Site</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Scope / Purpose</Label>
        <Textarea rows={3} value={f.description} onChange={v => s("description", v)} placeholder="Describe what this procedure covers and when it applies…" />
      </Section>
      <Section>
        <Row>
          <Col><Label>Owner *</Label><Select value={f.owner} onChange={v => s("owner", v)} placeholder="Select owner…" options={OWNERS} /></Col>
          <Col><Label>Version</Label><Input value={f.version} onChange={v => s("version", v)} /></Col>
        </Row>
      </Section>
      <div>
        <Label>Review Date</Label>
        <Input type="date" value={f.reviewDate} onChange={v => s("reviewDate", v)} />
      </div>
    </Drawer>
  );
}
