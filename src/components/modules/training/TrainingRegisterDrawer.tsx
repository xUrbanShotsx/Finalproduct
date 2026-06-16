"use client";

import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Input, Select, Textarea, Row, Col, OptionGroup } from "../FormFields";

const COURSES   = ["Working at Heights — Awareness", "Asbestos Awareness", "Traffic Management — Level 1", "Manual Handling & Ergonomics", "Confined Space Entry & Rescue", "First Aid (HLTAID011)", "Emergency Warden", "Psychosocial Risk Awareness"];
const RESULTS   = ["Pass", "Fail", "In Progress", "Withdrawn"] as const;

interface Props { open: boolean; onClose: () => void }

export function TrainingRegisterDrawer({ open, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [workerName, setWorkerName] = useState("");
  const [role,       setRole]       = useState("");
  const [course,     setCourse]     = useState("");
  const [dateComp,   setDateComp]   = useState("");
  const [result,     setResult]     = useState<typeof RESULTS[number] | "">("");
  const [provider,   setProvider]   = useState("");
  const [certNo,     setCertNo]     = useState("");
  const [expiry,     setExpiry]     = useState("");
  const [notes,      setNotes]      = useState("");

  function reset() { setStep(1); setWorkerName(""); setRole(""); setCourse(""); setDateComp(""); setResult(""); setProvider(""); setCertNo(""); setExpiry(""); setNotes(""); }
  function close() { reset(); onClose(); }

  return (
    <Drawer
      open={open} onClose={close}
      title="Record Training"
      step={step} totalSteps={2}
      stepLabels={["Worker & Course", "Result & Certificate"]}
      onStepChange={setStep}
      onBack={() => step === 1 ? close() : setStep(s => s - 1)}
      onNext={() => setStep(s => s + 1)}
      onSubmit={() => { alert("Training record saved (demo)"); close(); }}
      submitLabel="Save Record"
    >
      {step === 1 && (
        <div className="space-y-4">
          <Section>
            <Row>
              <Col>
                <Label>Worker Name</Label>
                <Input value={workerName} onChange={setWorkerName} placeholder="Full name" />
              </Col>
              <Col>
                <Label>Role / Trade</Label>
                <Input value={role} onChange={setRole} placeholder="e.g. Formwork Carpenter" />
              </Col>
            </Row>
          </Section>
          <Section>
            <Label>Course</Label>
            <Select value={course} onChange={setCourse} placeholder="Select course" options={COURSES} />
          </Section>
          <div>
            <Label>Date Completed</Label>
            <Input value={dateComp} onChange={setDateComp} type="date" />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Section>
            <Label>Result</Label>
            <OptionGroup options={RESULTS} value={result} onChange={setResult} />
          </Section>
          <Section>
            <Row>
              <Col>
                <Label>Training Provider</Label>
                <Input value={provider} onChange={setProvider} placeholder="e.g. SafeWork Training RTO" />
              </Col>
              <Col>
                <Label>Certificate / Statement No.</Label>
                <Input value={certNo} onChange={setCertNo} placeholder="e.g. CERT-20240610" />
              </Col>
            </Row>
          </Section>
          <Section>
            <Label>Certificate Expiry Date</Label>
            <Input value={expiry} onChange={setExpiry} type="date" />
          </Section>
          <div>
            <Label>Notes</Label>
            <Textarea value={notes} onChange={setNotes} placeholder="Any observations or follow-up required…" rows={3} />
          </div>
        </div>
      )}
    </Drawer>
  );
}
