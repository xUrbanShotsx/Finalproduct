"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Textarea, Row, Col } from "../FormFields";

const ISO_TYPES = ["Electrical LOTO","Mechanical LOTO","Hydraulic","Pneumatic","Gravity","Thermal","Chemical","Multi-energy"];
const SITES = ["Site 01","Site 02","Site 03"];
const WORKERS = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong","S. Lee","P. Nguyen"];

const INIT = { isoType:"", equipment:"", site:"", location:"", ptwRef:"", isolatedBy:"", verifiedBy:"", plannedStart:"", plannedRestore:"", description:"", energySource:"" };

export function IsolationShutdownDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setStep(1); setF(INIT); onClose(); };
  return (
    <Drawer open={open} onClose={reset} title="New Isolation" step={step} totalSteps={2}
      stepLabels={["Isolation Details","Personnel & Schedule"]}
      onStepChange={setStep} onBack={() => step === 1 ? reset() : setStep(1)}
      onNext={() => setStep(2)} onSubmit={reset} submitLabel="Create Isolation">
      {step === 1 && <>
        <Section>
          <Label>Isolation Type *</Label>
          <Select value={f.isoType} onChange={v => s("isoType", v)} placeholder="Select type…" options={ISO_TYPES} />
        </Section>
        <Section>
          <Row>
            <Col><Label>Equipment / Asset *</Label><Input value={f.equipment} onChange={v => s("equipment", v)} placeholder="e.g. MCC Panel 3B" /></Col>
            <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
          </Row>
        </Section>
        <Section>
          <Label>Specific Location</Label>
          <Input value={f.location} onChange={v => s("location", v)} placeholder="e.g. Sub-basement Level 2" />
        </Section>
        <Section>
          <Label>PTW Reference</Label>
          <Input value={f.ptwRef} onChange={v => s("ptwRef", v)} placeholder="e.g. PTW-021" />
        </Section>
        <div>
          <Label>Energy Source / Description *</Label>
          <Textarea rows={3} value={f.description} onChange={v => s("description", v)} placeholder="Describe the energy source(s) to be isolated and isolation method…" />
        </div>
      </>}
      {step === 2 && <>
        <Section>
          <Row>
            <Col><Label>Isolated By *</Label><Select value={f.isolatedBy} onChange={v => s("isolatedBy", v)} placeholder="Select…" options={WORKERS} /></Col>
            <Col><Label>Verified By</Label><Select value={f.verifiedBy} onChange={v => s("verifiedBy", v)} placeholder="Select…" options={WORKERS} /></Col>
          </Row>
        </Section>
        <Section>
          <Label>Planned Start *</Label>
          <Input type="datetime-local" value={f.plannedStart} onChange={v => s("plannedStart", v)} />
        </Section>
        <div>
          <Label>Planned Restoration *</Label>
          <Input type="datetime-local" value={f.plannedRestore} onChange={v => s("plannedRestore", v)} />
        </div>
      </>}
    </Drawer>
  );
}
