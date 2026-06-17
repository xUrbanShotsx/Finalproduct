"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, OptionGroup, Row, Col } from "../FormFields";

const HRCW_CATS = ["Cat 1 — Heights","Cat 2 — Confined Space","Cat 3 — Demolition","Cat 4 — Cranes","Cat 5 — Pressurised","Cat 11 — Excavation","Cat 13 — Hot Work","Cat 14 — Tilt-up","Cat 15 — Electrical","Cat 16 — Overhead Lines"];
const EVIDENCE_TYPES = ["SWMS","Permit to Work","Notification to Regulator","Training Record","Inspection Report"] as const;
const SITES = ["Site 01","Site 02","Site 03","All Sites"];
const ASSIGNEES = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong","S. Lee"];

const INIT = { hrcwCat:"", evidenceType:"" as typeof EVIDENCE_TYPES[number]|"", site:"", ref:"", date:"", compliant:"" as "Yes"|"No"|"", assignee:"", notes:"" };

export function HrcwComplianceDrawer({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd?: (f: typeof INIT) => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: (typeof INIT)[K]) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  const submit = () => { onAdd?.(f); reset(); };
  return (
    <Drawer open={open} onClose={reset} title="Add Evidence" step={1} totalSteps={1}
      stepLabels={["Evidence Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={submit} submitLabel="Add Evidence">
      <Section>
        <Row>
          <Col><Label>HRCW Category *</Label><Select value={f.hrcwCat} onChange={v => s("hrcwCat", v)} placeholder="Select category…" options={HRCW_CATS} /></Col>
          <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Evidence Type *</Label>
        <OptionGroup options={EVIDENCE_TYPES} value={f.evidenceType} onChange={v => s("evidenceType", v)} />
      </Section>
      <Section>
        <Row>
          <Col><Label>Reference No.</Label><Input value={f.ref} onChange={v => s("ref", v)} placeholder="e.g. SWMS-103" /></Col>
          <Col><Label>Date *</Label><Input type="date" value={f.date} onChange={v => s("date", v)} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Compliant?</Label>
        <OptionGroup options={["Yes","No"] as const} value={f.compliant} onChange={v => s("compliant", v)} />
      </Section>
      <Section>
        <Label>Assigned To</Label>
        <Select value={f.assignee} onChange={v => s("assignee", v)} placeholder="Select…" options={ASSIGNEES} />
      </Section>
      <div>
        <Label>Notes</Label>
        <Input value={f.notes} onChange={v => s("notes", v)} placeholder="Additional context…" />
      </div>
    </Drawer>
  );
}
