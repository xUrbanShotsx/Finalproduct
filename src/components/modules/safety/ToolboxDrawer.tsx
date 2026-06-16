"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Textarea, Row, Col } from "../FormFields";
import { AiButton } from "../AiButton";

const TOPICS = ["Working at Heights","Confined Space Safety","Hot Work Controls","Manual Handling","Electrical Safety","Traffic Management","Housekeeping","Incident Review","Near Miss Reporting","Heat & Fatigue","Chemical Handling","Emergency Procedures"];
const SITES = ["Site 01","Site 02","Site 03","All Sites"];
const FACILITATORS = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong","S. Lee","P. Nguyen"];

const INIT = { topic:"", site:"", facilitator:"", date:"", time:"", duration:"", attendees:"", keyPoints:"" };

export function ToolboxDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setStep(1); setF(INIT); onClose(); };
  return (
    <Drawer open={open} onClose={reset} title="New Toolbox Talk" step={step} totalSteps={2}
      stepLabels={["Talk Details","Attendees & Notes"]}
      onStepChange={setStep} onBack={() => step === 1 ? reset() : setStep(1)}
      onNext={() => setStep(2)} onSubmit={reset} submitLabel="Record Talk">
      {step === 1 && <>
        <Section>
          <Label>Topic *</Label>
          <Select value={f.topic} onChange={v => s("topic", v)} placeholder="Select topic…" options={TOPICS} />
        </Section>
        <Section>
          <Row>
            <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
            <Col><Label>Facilitator *</Label><Select value={f.facilitator} onChange={v => s("facilitator", v)} placeholder="Select…" options={FACILITATORS} /></Col>
          </Row>
        </Section>
        <Section>
          <Row>
            <Col><Label>Date *</Label><Input type="date" value={f.date} onChange={v => s("date", v)} /></Col>
            <Col><Label>Time</Label><Input type="time" value={f.time} onChange={v => s("time", v)} /></Col>
          </Row>
        </Section>
        <div>
          <Label>Duration</Label>
          <Input value={f.duration} onChange={v => s("duration", v)} placeholder="e.g. 15 minutes" />
        </div>
      </>}
      {step === 2 && <>
        <Section>
          <Label>Attendees</Label>
          <Textarea rows={3} value={f.attendees} onChange={v => s("attendees", v)} placeholder="List names of all attendees (one per line or comma-separated)…" />
        </Section>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label>Key Points for Speaker</Label>
            <AiButton
              disabled={!f.topic}
              label="Generate speaker notes"
              prompt={`Write 6 concise speaker talking points for a toolbox talk on "${f.topic}" for Australian construction workers. Each point should be a single sentence the facilitator can say out loud. Cover the main hazards, legal obligations, and practical controls. Number each point 1 to 6.`}
              onStream={chunk => s("keyPoints", chunk ? f.keyPoints + chunk : "")}
            />
          </div>
          <Textarea rows={6} value={f.keyPoints} onChange={v => s("keyPoints", v)} placeholder={f.topic ? `Select "Generate speaker notes" to draft talking points for ${f.topic}…` : "Select a topic first, then generate speaker notes with AI…"} />
        </div>
      </>}
    </Drawer>
  );
}
