"use client";

import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Input, Select, Textarea, Row, Col, OptionGroup } from "../FormFields";
import { AiButton } from "../AiButton";

const CATEGORIES = ["Safety", "Compliance", "Health & Wellbeing", "Operations", "Emergency Response", "Leadership"];
const DELIVERY   = ["Online", "Face-to-Face", "Blended"] as const;
const ASSESSMENT = ["Quiz / MCQ", "Practical Assessment", "Observation Checklist", "Written Assignment", "No Assessment"];

interface Props { open: boolean; onClose: () => void; onAdd?: (f: Record<string, string>) => void }

export function CourseBuilderDrawer({ open, onClose, onAdd }: Props) {
  const [step, setStep] = useState(1);
  const [title,       setTitle]       = useState("");
  const [category,    setCategory]    = useState("");
  const [delivery,    setDelivery]    = useState<typeof DELIVERY[number] | "">("");
  const [duration,    setDuration]    = useState("");
  const [standard,    setStandard]    = useState("");
  const [objectives,  setObjectives]  = useState("");
  const [assessment,  setAssessment]  = useState("");
  const [passMark,    setPassMark]    = useState("");
  const [validity,    setValidity]    = useState("");
  const [notes,       setNotes]       = useState("");

  function reset() { setStep(1); setTitle(""); setCategory(""); setDelivery(""); setDuration(""); setStandard(""); setObjectives(""); setAssessment(""); setPassMark(""); setValidity(""); setNotes(""); }
  function close() { reset(); onClose(); }

  const aiPrompt = `You are a WHS training content designer. Generate a structured course outline for:
Course title: ${title || "a construction safety course"}
Category: ${category || "Safety"}
Delivery mode: ${delivery || "Face-to-Face"}

Output numbered modules (4–6 modules) with 2–3 learning objectives each. Keep it practical, Australian construction context. Plain text, no markdown headers.`;

  return (
    <Drawer
      open={open} onClose={close}
      title="Build New Course"
      step={step} totalSteps={2}
      stepLabels={["Course Details", "Content & Assessment"]}
      onStepChange={setStep}
      onBack={() => step === 1 ? close() : setStep(s => s - 1)}
      onNext={() => setStep(s => s + 1)}
      onSubmit={() => { onAdd?.({ title, category, delivery, durationHrs: duration }); close(); }}
      submitLabel="Create Course"
    >
      {step === 1 && (
        <div className="space-y-4">
          <Section>
            <Label>Course Title</Label>
            <Input value={title} onChange={setTitle} placeholder="e.g. Working at Heights — Awareness" />
          </Section>
          <Section>
            <Row>
              <Col>
                <Label>Category</Label>
                <Select value={category} onChange={setCategory} placeholder="Select category" options={CATEGORIES} />
              </Col>
              <Col>
                <Label>Duration (hours)</Label>
                <Input value={duration} onChange={setDuration} placeholder="e.g. 8" type="number" />
              </Col>
            </Row>
          </Section>
          <Section>
            <Label>Delivery Mode</Label>
            <OptionGroup options={DELIVERY} value={delivery} onChange={setDelivery} />
          </Section>
          <div>
            <Label>Competency Standard (optional)</Label>
            <Input value={standard} onChange={setStandard} placeholder="e.g. RIIWHS204E — Work Safely at Heights" />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Section>
            <div className="flex items-center justify-between mb-1.5">
              <Label>Learning Objectives & Outline</Label>
              <AiButton
                prompt={aiPrompt}
                label="Generate outline"
                disabled={!title}
                onStream={chunk => setObjectives(prev => prev + chunk)}
                onDone={() => {}}
              />
            </div>
            <Textarea
              value={objectives}
              onChange={setObjectives}
              placeholder="Describe the modules and what workers will learn…"
              rows={8}
            />
          </Section>
          <Section>
            <Row>
              <Col>
                <Label>Assessment Type</Label>
                <Select value={assessment} onChange={setAssessment} placeholder="Select type" options={ASSESSMENT} />
              </Col>
              <Col>
                <Label>Pass Mark (%)</Label>
                <Input value={passMark} onChange={setPassMark} placeholder="e.g. 80" type="number" />
              </Col>
            </Row>
          </Section>
          <Section>
            <Label>Certificate Validity (years)</Label>
            <Input value={validity} onChange={setValidity} placeholder="e.g. 3" type="number" />
          </Section>
          <div>
            <Label>Notes</Label>
            <Textarea value={notes} onChange={setNotes} placeholder="Facilitator notes, prerequisites, special requirements…" rows={3} />
          </div>
        </div>
      )}
    </Drawer>
  );
}
