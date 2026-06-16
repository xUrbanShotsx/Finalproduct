"use client";

import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Input, Select, Textarea, Row, Col, OptionGroup } from "../FormFields";
import { AiButton } from "../AiButton";

const LICENCE_TYPES = [
  "High Risk Work Licence — EWP",
  "High Risk Work Licence — Scaffolding",
  "High Risk Work Licence — Rigging",
  "High Risk Work Licence — Dogging",
  "High Risk Work Licence — Crane",
  "White Card (Construction Induction)",
  "First Aid Certificate (HLTAID011)",
  "Traffic Controller Licence",
  "Electrical Licence",
  "Plumbing Licence",
  "Forklift Licence (LF)",
  "Explosive Powered Tool",
  "Asbestos Removalist Licence",
];

const VERIFICATION = ["Verified", "Pending Verification", "Unverified"] as const;

interface Props { open: boolean; onClose: () => void }

export function CompetencyLicencesDrawer({ open, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [workerName,    setWorkerName]    = useState("");
  const [role,          setRole]          = useState("");
  const [licenceType,   setLicenceType]   = useState("");
  const [licenceNo,     setLicenceNo]     = useState("");
  const [issueDate,     setIssueDate]     = useState("");
  const [expiryDate,    setExpiryDate]    = useState("");
  const [issuingBody,   setIssuingBody]   = useState("");
  const [verification,  setVerification]  = useState<typeof VERIFICATION[number] | "">("");
  const [notes,         setNotes]         = useState("");
  const [suggestedRoles, setSuggestedRoles] = useState("");

  function reset() { setStep(1); setWorkerName(""); setRole(""); setLicenceType(""); setLicenceNo(""); setIssueDate(""); setExpiryDate(""); setIssuingBody(""); setVerification(""); setNotes(""); setSuggestedRoles(""); }
  function close() { reset(); onClose(); }

  const aiPrompt = `You are a WHS compliance advisor for Australian construction.
List the typical licences, certifications and competencies required for the role: "${role || "a construction worker"}".
Include HRWL categories, White Card, first aid requirements, and any other mandatory tickets for this role in Australian construction.
Keep it concise — bullet points only, one per line.`;

  return (
    <Drawer
      open={open} onClose={close}
      title="Add Licence / Competency"
      step={step} totalSteps={2}
      stepLabels={["Worker & Licence", "Dates & Verification"]}
      onStepChange={setStep}
      onBack={() => step === 1 ? close() : setStep(s => s - 1)}
      onNext={() => setStep(s => s + 1)}
      onSubmit={() => { alert("Licence record saved (demo)"); close(); }}
      submitLabel="Save Licence"
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
                <Input value={role} onChange={setRole} placeholder="e.g. Rigger" />
              </Col>
            </Row>
          </Section>
          <Section>
            <div className="flex items-center justify-between mb-1.5">
              <Label>Required Licences for Role</Label>
              <AiButton
                prompt={aiPrompt}
                label="Suggest licences"
                disabled={!role}
                onStream={chunk => setSuggestedRoles(prev => prev + chunk)}
                onDone={() => {}}
              />
            </div>
            {suggestedRoles ? (
              <div className="px-3 py-2.5 border text-[12px] leading-relaxed whitespace-pre-wrap" style={{ background: "var(--b-accent-bg)", borderColor: "var(--b-accent-border)", color: "var(--b-text-secondary)" }}>
                {suggestedRoles}
              </div>
            ) : (
              <div className="px-3 py-2.5 border text-[12px]" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)", color: "var(--b-text-muted)" }}>
                Enter a role above, then click Suggest licences to see required tickets.
              </div>
            )}
          </Section>
          <div>
            <Label>Licence Type</Label>
            <Select value={licenceType} onChange={setLicenceType} placeholder="Select licence type" options={LICENCE_TYPES} />
          </div>
          <div>
            <Label>Licence Number</Label>
            <Input value={licenceNo} onChange={setLicenceNo} placeholder="e.g. HRWL-0012345" />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Section>
            <Row>
              <Col>
                <Label>Issue Date</Label>
                <Input value={issueDate} onChange={setIssueDate} type="date" />
              </Col>
              <Col>
                <Label>Expiry Date</Label>
                <Input value={expiryDate} onChange={setExpiryDate} type="date" />
              </Col>
            </Row>
          </Section>
          <Section>
            <Label>Issuing Body / Regulator</Label>
            <Input value={issuingBody} onChange={setIssuingBody} placeholder="e.g. SafeWork NSW" />
          </Section>
          <Section>
            <Label>Verification Status</Label>
            <OptionGroup options={VERIFICATION} value={verification} onChange={setVerification} />
          </Section>
          <div>
            <Label>Notes</Label>
            <Textarea value={notes} onChange={setNotes} placeholder="Any conditions, restrictions or follow-up…" rows={3} />
          </div>
        </div>
      )}
    </Drawer>
  );
}
