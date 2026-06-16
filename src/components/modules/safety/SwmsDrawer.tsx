"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Textarea, Row, Col } from "../FormFields";
import { AiButton } from "../AiButton";

const HRCW = ["Cat 1 — Heights","Cat 2 — Confined Space","Cat 3 — Demolition","Cat 4 — Crane & Plant","Cat 5 — Pressurised","Cat 11 — Excavation","Cat 13 — Hot Work","Cat 14 — Tilt-up","Cat 15 — Electrical","Cat 16 — Overhead Lines"];
const SITES = ["Site 01","Site 02","Site 03","All Sites"];
const PEOPLE = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong","S. Lee","P. Nguyen"];

const INIT = { title:"", hrcw:"", site:"", location:"", description:"", preparedBy:"", reviewDate:"", approvedBy:"", version:"Rev 1" };

export function SwmsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setStep(1); setF(INIT); onClose(); };
  return (
    <Drawer open={open} onClose={reset} title="New SWMS" step={step} totalSteps={2}
      stepLabels={["Task & Hazards","Approval & Review"]}
      onStepChange={setStep} onBack={() => step === 1 ? reset() : setStep(1)}
      onNext={() => setStep(2)} onSubmit={reset} submitLabel="Create SWMS">
      {step === 1 && <>
        <Section>
          <Label>SWMS Title *</Label>
          <Input value={f.title} onChange={v => s("title", v)} placeholder="e.g. Working at Heights — Scaffold Erection" />
        </Section>
        <Section>
          <Label>HRCW Category *</Label>
          <Select value={f.hrcw} onChange={v => s("hrcw", v)} placeholder="Select category…" options={HRCW} />
        </Section>
        <Section>
          <Row>
            <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
            <Col><Label>Specific Location</Label><Input value={f.location} onChange={v => s("location", v)} placeholder="e.g. Level 3 East" /></Col>
          </Row>
        </Section>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label>Task Description & Key Hazards</Label>
            <AiButton
              disabled={!f.title && !f.hrcw}
              label="Draft with AI"
              prompt={`Write a SWMS task description for "${f.title || "the task"}" under HRCW category "${f.hrcw || "high-risk construction work"}" in Australia. Include: the work steps in sequence, the key hazards for each step, and the required controls. Write in plain prose, 3 to 4 sentences per section. Do not use bullet points or markdown.`}
              onStream={chunk => s("description", chunk ? f.description + chunk : "")}
            />
          </div>
          <Textarea rows={5} value={f.description} onChange={v => s("description", v)} placeholder="Describe the task, steps involved and key hazards identified…" />
        </div>
      </>}
      {step === 2 && <>
        <Section>
          <Row>
            <Col><Label>Prepared By *</Label><Select value={f.preparedBy} onChange={v => s("preparedBy", v)} placeholder="Select…" options={PEOPLE} /></Col>
            <Col><Label>Version</Label><Input value={f.version} onChange={v => s("version", v)} /></Col>
          </Row>
        </Section>
        <Section>
          <Label>Approved By</Label>
          <Select value={f.approvedBy} onChange={v => s("approvedBy", v)} placeholder="Select approver…" options={PEOPLE} />
        </Section>
        <div>
          <Label>Review Date</Label>
          <Input type="date" value={f.reviewDate} onChange={v => s("reviewDate", v)} />
        </div>
      </>}
    </Drawer>
  );
}
