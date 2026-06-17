"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Textarea, Row, Col } from "../FormFields";

const ASSESSMENT_TYPES = ["Pre-task JSA","Formal Risk Assessment","Change Risk Assessment","Design Risk Review","Emergency Risk Assessment","HRCW Risk Assessment"];
const SITES = ["Site 01","Site 02","Site 03","All Sites"];
const OWNERS = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong","S. Lee","P. Nguyen"];
const LIKELIHOOD = ["1 — Rare","2 — Unlikely","3 — Possible","4 — Likely","5 — Almost Certain"];
const CONSEQUENCE = ["1 — Negligible","2 — Minor","3 — Moderate","4 — Major","5 — Catastrophic"];
const HOC = ["Elimination","Substitution","Engineering","Administrative","PPE"];

const INIT = { assessmentType:"", title:"", site:"", activity:"", likelihood:"", consequence:"", hoc:"", owner:"", date:"", reviewDate:"" };

export function RiskAssessmentsDrawer({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd?: (f: typeof INIT) => void }) {
  const [step, setStep] = useState(1);
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setStep(1); setF(INIT); onClose(); };
  const submit = () => { onAdd?.(f); reset(); };
  return (
    <Drawer open={open} onClose={reset} title="New Assessment" step={step} totalSteps={2}
      stepLabels={["Assessment Details","Ratings & Controls"]}
      onStepChange={setStep} onBack={() => step === 1 ? reset() : setStep(1)}
      onNext={() => setStep(2)} onSubmit={submit} submitLabel="Create Assessment">
      {step === 1 && <>
        <Section>
          <Label>Assessment Type *</Label>
          <Select value={f.assessmentType} onChange={v => s("assessmentType", v)} placeholder="Select type…" options={ASSESSMENT_TYPES} />
        </Section>
        <Section>
          <Label>Assessment Title *</Label>
          <Input value={f.title} onChange={v => s("title", v)} placeholder="e.g. RA-041 Elevated work platform operations" />
        </Section>
        <Section>
          <Row>
            <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
            <Col><Label>Date *</Label><Input type="date" value={f.date} onChange={v => s("date", v)} /></Col>
          </Row>
        </Section>
        <div>
          <Label>Activity / Task Description</Label>
          <Textarea rows={3} value={f.activity} onChange={v => s("activity", v)} placeholder="Describe the task or activity being assessed…" />
        </div>
      </>}
      {step === 2 && <>
        <Section>
          <Row>
            <Col><Label>Likelihood</Label><Select value={f.likelihood} onChange={v => s("likelihood", v)} placeholder="Select…" options={LIKELIHOOD} /></Col>
            <Col><Label>Consequence</Label><Select value={f.consequence} onChange={v => s("consequence", v)} placeholder="Select…" options={CONSEQUENCE} /></Col>
          </Row>
        </Section>
        <Section>
          <Label>Highest Order Control (HOC)</Label>
          <Select value={f.hoc} onChange={v => s("hoc", v)} placeholder="Select HOC level…" options={HOC} />
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
