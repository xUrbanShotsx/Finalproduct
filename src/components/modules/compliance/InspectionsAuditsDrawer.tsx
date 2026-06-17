"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, OptionGroup, Row, Col } from "../FormFields";

const AUDIT_TYPES = ["Internal Audit","External Audit","Site Inspection","Regulatory Inspection","Management Review","Supplier Audit"];
const SITES = ["Site 01","Site 02","Site 03","All Sites"];
const AUDITORS = ["J. Smith","M. Jones","K. Davis","T. Walsh","External Auditor","Regulator"];
const STATUS = ["Scheduled","In Progress","Complete"] as const;

const INIT = { auditType:"", site:"", auditor:"", plannedDate:"", status:"" as typeof STATUS[number]|"", scope:"" };

export function InspectionsAuditsDrawer({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd?: (f: typeof INIT) => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: (typeof INIT)[K]) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  const submit = () => { onAdd?.(f); reset(); };
  return (
    <Drawer open={open} onClose={reset} title="Schedule Audit" step={1} totalSteps={1}
      stepLabels={["Audit Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={submit} submitLabel="Schedule Audit">
      <Section>
        <Row>
          <Col><Label>Audit Type *</Label><Select value={f.auditType} onChange={v => s("auditType", v)} placeholder="Select type…" options={AUDIT_TYPES} /></Col>
          <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
        </Row>
      </Section>
      <Section>
        <Row>
          <Col><Label>Auditor *</Label><Select value={f.auditor} onChange={v => s("auditor", v)} placeholder="Select auditor…" options={AUDITORS} /></Col>
          <Col><Label>Planned Date *</Label><Input type="date" value={f.plannedDate} onChange={v => s("plannedDate", v)} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Status *</Label>
        <OptionGroup options={STATUS} value={f.status} onChange={v => s("status", v)} />
      </Section>
      <div>
        <Label>Scope / Focus Areas</Label>
        <Input value={f.scope} onChange={v => s("scope", v)} placeholder="e.g. SWMS compliance, PPE, site access…" />
      </div>
    </Drawer>
  );
}
