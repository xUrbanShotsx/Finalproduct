"use client";

import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Input, Select, Textarea, Row, Col } from "../FormFields";

const CERT_TYPES = [
  "Working at Heights",
  "White Card (Construction Induction)",
  "First Aid (HLTAID011)",
  "Traffic Controller",
  "High Risk Work Licence — EWP",
  "High Risk Work Licence — Scaffolding",
  "High Risk Work Licence — Rigging",
  "Confined Space Entry",
  "Asbestos Removal",
  "Forklift Licence (LF)",
  "Emergency Warden",
  "Manual Handling",
  "Other",
];

interface Props { open: boolean; onClose: () => void }

export function CertificatesRecordsDrawer({ open, onClose }: Props) {
  const [step,        setStep]       = useState(1);
  const [certName,    setCertName]   = useState("");
  const [holder,      setHolder]     = useState("");
  const [certNo,      setCertNo]     = useState("");
  const [issuingBody, setIssuingBody]= useState("");
  const [issueDate,   setIssueDate]  = useState("");
  const [expiryDate,  setExpiryDate] = useState("");
  const [courseLink,  setCourseLink] = useState("");
  const [fileRef,     setFileRef]    = useState("");
  const [notes,       setNotes]      = useState("");

  function reset() { setStep(1); setCertName(""); setHolder(""); setCertNo(""); setIssuingBody(""); setIssueDate(""); setExpiryDate(""); setCourseLink(""); setFileRef(""); setNotes(""); }
  function close() { reset(); onClose(); }

  return (
    <Drawer
      open={open} onClose={close}
      title="Add Certificate"
      step={step} totalSteps={2}
      stepLabels={["Certificate Details", "Dates & Filing"]}
      onStepChange={setStep}
      onBack={() => step === 1 ? close() : setStep(s => s - 1)}
      onNext={() => setStep(s => s + 1)}
      onSubmit={() => { alert("Certificate saved (demo)"); close(); }}
      submitLabel="Save Certificate"
    >
      {step === 1 && (
        <div className="space-y-4">
          <Section>
            <Label>Certificate Type</Label>
            <Select value={certName} onChange={setCertName} placeholder="Select certificate type" options={CERT_TYPES} />
          </Section>
          <Section>
            <Label>Certificate Holder</Label>
            <Input value={holder} onChange={setHolder} placeholder="Full name of the certificate holder" />
          </Section>
          <Section>
            <Label>Certificate / Licence Number</Label>
            <Input value={certNo} onChange={setCertNo} placeholder="e.g. HRWL-0012345 or CERT-20240610" />
          </Section>
          <div>
            <Label>Issuing Body / RTO</Label>
            <Input value={issuingBody} onChange={setIssuingBody} placeholder="e.g. SafeWork NSW, St John Ambulance" />
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
            <Label>Linked Course (optional)</Label>
            <Input value={courseLink} onChange={setCourseLink} placeholder="e.g. COUR-001 — Working at Heights" />
          </Section>
          <Section>
            <Label>File / Document Reference</Label>
            <Input value={fileRef} onChange={setFileRef} placeholder="e.g. Scan on SharePoint: /certs/JSmith_WAH.pdf" />
          </Section>
          <div>
            <Label>Notes</Label>
            <Textarea value={notes} onChange={setNotes} placeholder="Conditions, restrictions or renewal reminders…" rows={3} />
          </div>
        </div>
      )}
    </Drawer>
  );
}
