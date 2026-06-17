"use client";

import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Input, Select, Textarea, Row, Col, OptionGroup } from "../FormFields";
import { AiButton } from "../AiButton";

const INDUSTRIES = ["Construction", "Industrial", "Facilities", "All Industries"];
const DELIVERY   = ["In-Person", "Online", "Hybrid"] as const;
const SIGN_OFF   = ["Digital Signature", "Paper Sign-off", "No Sign-off"] as const;

interface Props { open: boolean; onClose: () => void; onAdd?: (f: Record<string, string>) => void }

export function InductionBuilderDrawer({ open, onClose, onAdd }: Props) {
  const [step,       setStep]      = useState(1);
  const [title,      setTitle]     = useState("");
  const [industry,   setIndustry]  = useState("");
  const [roles,      setRoles]     = useState("");
  const [delivery,   setDelivery]  = useState<typeof DELIVERY[number] | "">("");
  const [duration,   setDuration]  = useState("");
  const [content,    setContent]   = useState("");
  const [signOff,    setSignOff]   = useState<typeof SIGN_OFF[number] | "">("");
  const [notes,      setNotes]     = useState("");

  function reset() { setStep(1); setTitle(""); setIndustry(""); setRoles(""); setDelivery(""); setDuration(""); setContent(""); setSignOff(""); setNotes(""); }
  function close() { reset(); onClose(); }

  const aiPrompt = `You are a WHS training specialist. Generate induction module content for:
Induction: "${title || "a site safety induction"}"
Industry: ${industry || "Construction"}
Target roles: ${roles || "all workers"}

List 6–8 induction modules with a 1-sentence description each. Cover key WHS topics relevant to Australian construction/industrial sites — emergency procedures, hazard reporting, PPE, site rules, etc.
Output: numbered list only. No headers or markdown.`;

  return (
    <Drawer
      open={open} onClose={close}
      title="Build Induction"
      step={step} totalSteps={2}
      stepLabels={["Induction Setup", "Modules & Sign-off"]}
      onStepChange={setStep}
      onBack={() => step === 1 ? close() : setStep(s => s - 1)}
      onNext={() => setStep(s => s + 1)}
      onSubmit={() => { onAdd?.({ title, industry, roles, signOff }); close(); }}
      submitLabel="Save Induction"
    >
      {step === 1 && (
        <div className="space-y-4">
          <Section>
            <Label>Induction Title</Label>
            <Input value={title} onChange={setTitle} placeholder="e.g. Site Safety Induction — Site 01" />
          </Section>
          <Section>
            <Row>
              <Col>
                <Label>Industry</Label>
                <Select value={industry} onChange={setIndustry} placeholder="Select industry" options={INDUSTRIES} />
              </Col>
              <Col>
                <Label>Duration (minutes)</Label>
                <Input value={duration} onChange={setDuration} placeholder="e.g. 45" type="number" />
              </Col>
            </Row>
          </Section>
          <Section>
            <Label>Target Roles</Label>
            <Input value={roles} onChange={setRoles} placeholder="e.g. All new site workers, contractors, visitors" />
          </Section>
          <div>
            <Label>Delivery Method</Label>
            <OptionGroup options={DELIVERY} value={delivery} onChange={setDelivery} />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Section>
            <div className="flex items-center justify-between mb-1.5">
              <Label>Induction Modules</Label>
              <AiButton
                prompt={aiPrompt}
                label="Generate modules"
                disabled={!title}
                onStream={chunk => setContent(prev => prev + chunk)}
                onDone={() => {}}
              />
            </div>
            <Textarea
              value={content}
              onChange={setContent}
              placeholder="List the induction modules and what each one covers…"
              rows={9}
            />
          </Section>
          <Section>
            <Label>Sign-off Method</Label>
            <OptionGroup options={SIGN_OFF} value={signOff} onChange={setSignOff} />
          </Section>
          <div>
            <Label>Notes / Instructions for Facilitator</Label>
            <Textarea value={notes} onChange={setNotes} placeholder="Presenter notes, resources needed, room setup…" rows={3} />
          </div>
        </div>
      )}
    </Drawer>
  );
}
