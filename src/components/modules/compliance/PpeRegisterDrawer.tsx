"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, OptionGroup, Row, Col } from "../FormFields";

const PPE_TYPES = ["Safety Helmet","High-Vis Vest","Safety Boots","Safety Glasses","P2 Respirator","Half-face Respirator","Full-face Respirator","Hearing Protection","Fall Arrest Harness","Chemical Gloves","Cut-resistant Gloves","Safety Harness","Other"];
const SITES = ["Site 01","Site 02","Site 03","All Sites"];
const WORKERS = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong","S. Lee","P. Nguyen","M. Chen","R. Kim","J. Park"];

const INIT = { ppeType:"", serialNo:"", worker:"", site:"", issueDate:"", inspectionDue:"", expiryDate:"", fallArrest:"" as "Yes"|"No"|"" };

export function PpeRegisterDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: (typeof INIT)[K]) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  return (
    <Drawer open={open} onClose={reset} title="Issue PPE" step={1} totalSteps={1}
      stepLabels={["PPE Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={reset} submitLabel="Issue PPE">
      <Section>
        <Label>PPE Type *</Label>
        <Select value={f.ppeType} onChange={v => s("ppeType", v)} placeholder="Select PPE type…" options={PPE_TYPES} />
      </Section>
      <Section>
        <Row>
          <Col><Label>Worker *</Label><Select value={f.worker} onChange={v => s("worker", v)} placeholder="Select worker…" options={WORKERS} /></Col>
          <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Serial / Batch No.</Label>
        <Input value={f.serialNo} onChange={v => s("serialNo", v)} placeholder="e.g. HA-2024-0042" />
      </Section>
      <Section>
        <Row>
          <Col><Label>Issue Date *</Label><Input type="date" value={f.issueDate} onChange={v => s("issueDate", v)} /></Col>
          <Col><Label>Inspection Due</Label><Input type="date" value={f.inspectionDue} onChange={v => s("inspectionDue", v)} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Expiry Date</Label>
        <Input type="date" value={f.expiryDate} onChange={v => s("expiryDate", v)} />
      </Section>
      <div>
        <Label>Fall Arrest Equipment?</Label>
        <OptionGroup options={["Yes","No"] as const} value={f.fallArrest} onChange={v => s("fallArrest", v)} />
      </div>
    </Drawer>
  );
}
