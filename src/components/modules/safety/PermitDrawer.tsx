"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Textarea, Row, Col } from "../FormFields";
import { AiButton } from "../AiButton";

const TYPES = ["Excavation","Working at Heights","Confined Space","Hot Work","Electrical Isolation","General Work"];
const SITES = ["Site 01","Site 02","Site 03"];
const PEOPLE = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong","S. Lee","P. Nguyen"];

const INIT = { permitType:"", site:"", location:"", plannedStart:"", plannedEnd:"", description:"", controls:"", approvedBy:"" };

export function PermitDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setStep(1); setF(INIT); onClose(); };
  return (
    <Drawer open={open} onClose={reset} title="New Permit to Work" step={step} totalSteps={2}
      stepLabels={["Permit Details","Controls & Approval"]}
      onStepChange={setStep} onBack={() => step === 1 ? reset() : setStep(1)}
      onNext={() => setStep(2)} onSubmit={reset} submitLabel="Issue Permit">
      {step === 1 && <>
        <Section>
          <Label>Permit Type *</Label>
          <Select value={f.permitType} onChange={v => s("permitType", v)} placeholder="Select type…" options={TYPES} />
        </Section>
        <Section>
          <Row>
            <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
            <Col><Label>Specific Location *</Label><Input value={f.location} onChange={v => s("location", v)} placeholder="e.g. Grid H7 — 2m depth" /></Col>
          </Row>
        </Section>
        <Section>
          <Row>
            <Col><Label>Planned Start *</Label><Input type="datetime-local" value={f.plannedStart} onChange={v => s("plannedStart", v)} /></Col>
            <Col><Label>Planned End *</Label><Input type="datetime-local" value={f.plannedEnd} onChange={v => s("plannedEnd", v)} /></Col>
          </Row>
        </Section>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label>Works Description</Label>
            <AiButton
              disabled={!f.permitType}
              label="Draft with AI"
              prompt={`Write a works description for a ${f.permitType} permit to work at ${f.location || "the specified location"} on an Australian construction site. Describe the scope of works, the key activities, and any relevant site conditions. Two to three sentences. Plain text only.`}
              onStream={chunk => s("description", chunk ? f.description + chunk : "")}
            />
          </div>
          <Textarea rows={4} value={f.description} onChange={v => s("description", v)} placeholder="Describe the works to be carried out under this permit…" />
        </div>
      </>}
      {step === 2 && <>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label>Safety Controls Required</Label>
            <AiButton
              disabled={!f.permitType}
              label="Generate controls"
              prompt={`List the mandatory safety controls for a ${f.permitType} permit to work on an Australian construction site. Include isolation requirements, PPE, atmospheric testing, barriers, spotters, and emergency arrangements as applicable. Write as a plain numbered list, one control per line, no bullet symbols.`}
              onStream={chunk => s("controls", chunk ? f.controls + chunk : "")}
            />
          </div>
          <Textarea rows={5} value={f.controls} onChange={v => s("controls", v)} placeholder="e.g. Barricades in place, spotter assigned, atmospheric test completed…" />
        </div>
        <div className="mt-5">
          <Label>Approved By *</Label>
          <Select value={f.approvedBy} onChange={v => s("approvedBy", v)} placeholder="Select approver…" options={PEOPLE} />
        </div>
      </>}
    </Drawer>
  );
}
