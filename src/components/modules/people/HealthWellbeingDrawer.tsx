"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Textarea, OptionGroup, Row, Col } from "../FormFields";

const CATEGORIES = ["Fatigue","Psychosocial","Physical Injury","Mental Health","EAP Referral","Occupational Illness","Other"];
const SUPPORT = ["EAP Referral","Return to Work Plan","Counselling","Peer Support","Medical Referral","No Action Required"];

const INIT = { category:"", anonymous:"" as "Yes"|"No"|"", date:"", support:"", outcome:"", notes:"" };

export function HealthWellbeingDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: (typeof INIT)[K]) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  return (
    <Drawer open={open} onClose={reset} title="New H&W Record" step={1} totalSteps={1}
      stepLabels={["Record Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={reset} submitLabel="Save Record">
      <Section>
        <Row>
          <Col><Label>Category *</Label><Select value={f.category} onChange={v => s("category", v)} placeholder="Select category…" options={CATEGORIES} /></Col>
          <Col><Label>Date *</Label><Input type="date" value={f.date} onChange={v => s("date", v)} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Anonymous Record?</Label>
        <OptionGroup options={["Yes","No"] as const} value={f.anonymous} onChange={v => s("anonymous", v)} />
      </Section>
      <Section>
        <Label>Support Provided</Label>
        <Select value={f.support} onChange={v => s("support", v)} placeholder="Select support type…" options={SUPPORT} />
      </Section>
      <Section>
        <Label>Outcome</Label>
        <Input value={f.outcome} onChange={v => s("outcome", v)} placeholder="e.g. Returned to work, ongoing monitoring" />
      </Section>
      <div>
        <Label>Notes</Label>
        <Textarea rows={3} value={f.notes} onChange={v => s("notes", v)} placeholder="Additional context or observations (keep confidential)…" />
      </div>
    </Drawer>
  );
}
