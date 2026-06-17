"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, OptionGroup, Row, Col, Textarea } from "../FormFields";

const PERMIT_TYPES = ["Hot Work","Confined Space","Isolation / Energy Control","Line Breaking","Working at Height","Electrical"];
const AREAS = ["Process Line A","Process Line B","Boiler House","Tank Farm","Warehouse","Utilities"];
const RISK = ["Low","Medium","High"] as const;

const INIT = { permitType:"", description:"", area:"", risk:"" as typeof RISK[number]|"", issuedTo:"", validFrom:"", validTo:"", isolations:"" };

export function PermitsToWorkDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: (typeof INIT)[K]) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  return (
    <Drawer open={open} onClose={reset} title="New Permit to Work" step={1} totalSteps={1}
      stepLabels={["Permit Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={reset} submitLabel="Issue Permit">
      <Section>
        <Row>
          <Col><Label>Permit Type *</Label><Select value={f.permitType} onChange={v => s("permitType", v)} placeholder="Select type…" options={PERMIT_TYPES} /></Col>
          <Col><Label>Risk Level *</Label><OptionGroup options={RISK} value={f.risk} onChange={v => s("risk", v)} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Task Description *</Label>
        <Textarea value={f.description} onChange={v => s("description", v)} placeholder="Describe the work to be carried out…" />
      </Section>
      <Section>
        <Row>
          <Col><Label>Area *</Label><Select value={f.area} onChange={v => s("area", v)} placeholder="Select area…" options={AREAS} /></Col>
          <Col><Label>Issued To</Label><Input value={f.issuedTo} onChange={v => s("issuedTo", v)} placeholder="Worker / contractor" /></Col>
        </Row>
      </Section>
      <Section>
        <Row>
          <Col><Label>Valid From</Label><Input type="datetime-local" value={f.validFrom} onChange={v => s("validFrom", v)} /></Col>
          <Col><Label>Valid To</Label><Input type="datetime-local" value={f.validTo} onChange={v => s("validTo", v)} /></Col>
        </Row>
      </Section>
      <div>
        <Label>Associated Isolations / LOTO</Label>
        <Input value={f.isolations} onChange={v => s("isolations", v)} placeholder="e.g. LOTO-014" />
      </div>
    </Drawer>
  );
}
