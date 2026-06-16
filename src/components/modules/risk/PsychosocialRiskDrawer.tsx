"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Textarea, OptionGroup, Row, Col } from "../FormFields";

const HAZARD_TYPES = ["Workload / Demands","Bullying & Harassment","Trauma Exposure","Shift Work / Fatigue","Isolation","Violence & Aggression","Role Ambiguity","Organisational Change","Interpersonal Conflict","Other"];
const SITES = ["Site 01","Site 02","Site 03","All Sites"];
const SUPPORT = ["No action required","EAP Referral","Counselling","Peer Support","Management Review","HR Referral","Investigation"];

const INIT = { hazardType:"", site:"", anonymous:"" as "Yes"|"No"|"", eapReferral:"" as "Yes"|"No"|"", support:"", description:"", date:"" };

export function PsychosocialRiskDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: (typeof INIT)[K]) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  return (
    <Drawer open={open} onClose={reset} title="Report Hazard" step={1} totalSteps={1}
      stepLabels={["Report Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={reset} submitLabel="Submit Report">
      <Section>
        <Row>
          <Col><Label>Hazard Type *</Label><Select value={f.hazardType} onChange={v => s("hazardType", v)} placeholder="Select type…" options={HAZARD_TYPES} /></Col>
          <Col><Label>Date *</Label><Input type="date" value={f.date} onChange={v => s("date", v)} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Site</Label>
        <Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} />
      </Section>
      <Section>
        <Label>Submit Anonymously?</Label>
        <OptionGroup options={["Yes","No"] as const} value={f.anonymous} onChange={v => s("anonymous", v)} />
      </Section>
      <Section>
        <Label>Description</Label>
        <Textarea rows={4} value={f.description} onChange={v => s("description", v)} placeholder="Describe the psychosocial hazard or concern (confidential)…" />
      </Section>
      <Section>
        <Label>EAP Referral?</Label>
        <OptionGroup options={["Yes","No"] as const} value={f.eapReferral} onChange={v => s("eapReferral", v)} />
      </Section>
      <div>
        <Label>Support Provided</Label>
        <Select value={f.support} onChange={v => s("support", v)} placeholder="Select support…" options={SUPPORT} />
      </div>
    </Drawer>
  );
}
