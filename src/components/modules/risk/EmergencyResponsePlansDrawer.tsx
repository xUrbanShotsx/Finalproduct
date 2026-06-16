"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Textarea, Row, Col } from "../FormFields";

const ERP_TYPES = ["Fire","Medical","Chemical Spill","Structural Failure","Evacuation","Flood","Electrical","Bomb Threat","Explosion"];
const SITES = ["Site 01","Site 02","Site 03","All Sites"];
const OWNERS = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong","S. Lee","P. Nguyen"];

const INIT = { erpType:"", title:"", site:"", owner:"", version:"Rev 1", approvalDate:"", reviewDate:"", drillDate:"", description:"" };

export function EmergencyResponsePlansDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  return (
    <Drawer open={open} onClose={reset} title="New ERP" step={1} totalSteps={1}
      stepLabels={["ERP Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={reset} submitLabel="Create ERP">
      <Section>
        <Row>
          <Col><Label>ERP Type *</Label><Select value={f.erpType} onChange={v => s("erpType", v)} placeholder="Select type…" options={ERP_TYPES} /></Col>
          <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>ERP Title *</Label>
        <Input value={f.title} onChange={v => s("title", v)} placeholder="e.g. ERP-003 Site Fire Emergency Response" />
      </Section>
      <Section>
        <Label>Overview / Scope</Label>
        <Textarea rows={3} value={f.description} onChange={v => s("description", v)} placeholder="Describe the emergency scenario this ERP covers…" />
      </Section>
      <Section>
        <Row>
          <Col><Label>Owner *</Label><Select value={f.owner} onChange={v => s("owner", v)} placeholder="Select owner…" options={OWNERS} /></Col>
          <Col><Label>Version</Label><Input value={f.version} onChange={v => s("version", v)} /></Col>
        </Row>
      </Section>
      <Section>
        <Row>
          <Col><Label>Approval Date</Label><Input type="date" value={f.approvalDate} onChange={v => s("approvalDate", v)} /></Col>
          <Col><Label>Review Date</Label><Input type="date" value={f.reviewDate} onChange={v => s("reviewDate", v)} /></Col>
        </Row>
      </Section>
      <div>
        <Label>Next Drill Date</Label>
        <Input type="date" value={f.drillDate} onChange={v => s("drillDate", v)} />
      </div>
    </Drawer>
  );
}
