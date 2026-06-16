"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Textarea, Row, Col } from "../FormFields";

const HAZARD_TYPES = ["Physical","Biological","Chemical","Ergonomic","Psychosocial","Environmental","Radiation","Electrical","Gravity / Falls","Other"];
const SITES = ["Site 01","Site 02","Site 03","All Sites"];
const LIKELIHOOD = ["Rare","Unlikely","Possible","Likely","Almost Certain"];
const CONSEQUENCE = ["Negligible","Minor","Moderate","Major","Catastrophic"];
const OWNERS = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong","S. Lee","P. Nguyen"];

const INIT = { hazardType:"", title:"", site:"", location:"", likelihood:"", consequence:"", controls:"", owner:"", reviewDate:"" };

export function HazardRegisterDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setStep(1); setF(INIT); onClose(); };
  return (
    <Drawer open={open} onClose={reset} title="Add Hazard" step={step} totalSteps={2}
      stepLabels={["Hazard Details","Risk Rating"]}
      onStepChange={setStep} onBack={() => step === 1 ? reset() : setStep(1)}
      onNext={() => setStep(2)} onSubmit={reset} submitLabel="Add to Register">
      {step === 1 && <>
        <Section>
          <Label>Hazard Title *</Label>
          <Input value={f.title} onChange={v => s("title", v)} placeholder="e.g. Silica dust from concrete cutting" />
        </Section>
        <Section>
          <Row>
            <Col><Label>Hazard Type *</Label><Select value={f.hazardType} onChange={v => s("hazardType", v)} placeholder="Select type…" options={HAZARD_TYPES} /></Col>
            <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
          </Row>
        </Section>
        <Section>
          <Label>Specific Location</Label>
          <Input value={f.location} onChange={v => s("location", v)} placeholder="e.g. Slab cutting area — Level 3" />
        </Section>
        <div>
          <Label>Existing Controls</Label>
          <Textarea rows={3} value={f.controls} onChange={v => s("controls", v)} placeholder="Describe controls currently in place…" />
        </div>
      </>}
      {step === 2 && <>
        <Section>
          <Label>Likelihood</Label>
          <Select value={f.likelihood} onChange={v => s("likelihood", v)} placeholder="Select likelihood…" options={LIKELIHOOD} />
        </Section>
        <Section>
          <Label>Consequence</Label>
          <Select value={f.consequence} onChange={v => s("consequence", v)} placeholder="Select consequence…" options={CONSEQUENCE} />
        </Section>
        <Section>
          <Label>Owner *</Label>
          <Select value={f.owner} onChange={v => s("owner", v)} placeholder="Select owner…" options={OWNERS} />
        </Section>
        <div>
          <Label>Review Date</Label>
          <Input type="date" value={f.reviewDate} onChange={v => s("reviewDate", v)} />
        </div>
      </>}
    </Drawer>
  );
}
