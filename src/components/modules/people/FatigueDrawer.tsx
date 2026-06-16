"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, OptionGroup, Row, Col } from "../FormFields";

const WORKERS = ["M. Chen","T. Walsh","R. Kim","P. Nguyen","D. Wong","S. Lee","K. Davis","J. Park","J. Smith","M. Jones"];
const SITES = ["Site 01","Site 02","Site 03"];
const RISK = ["Low","Moderate","High","Critical"] as const;

const INIT = { worker:"", site:"", shiftStart:"", shiftEnd:"", consecutiveDays:"", riskLevel:"" as typeof RISK[number]|"", flagged:"" as "Yes"|"No"|"" };

export function FatigueDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: (typeof INIT)[K]) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  return (
    <Drawer open={open} onClose={reset} title="Log Fatigue Record" step={1} totalSteps={1}
      stepLabels={["Fatigue Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={reset} submitLabel="Save Record">
      <Section>
        <Row>
          <Col><Label>Worker *</Label><Select value={f.worker} onChange={v => s("worker", v)} placeholder="Select worker…" options={WORKERS} /></Col>
          <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
        </Row>
      </Section>
      <Section>
        <Row>
          <Col><Label>Shift Start *</Label><Input type="datetime-local" value={f.shiftStart} onChange={v => s("shiftStart", v)} /></Col>
          <Col><Label>Shift End *</Label><Input type="datetime-local" value={f.shiftEnd} onChange={v => s("shiftEnd", v)} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Consecutive Days Worked</Label>
        <Input value={f.consecutiveDays} onChange={v => s("consecutiveDays", v)} placeholder="e.g. 6" />
      </Section>
      <Section>
        <Label>Fatigue Risk Level</Label>
        <OptionGroup options={RISK} value={f.riskLevel} onChange={v => s("riskLevel", v)} />
      </Section>
      <div>
        <Label>Flagged for Review?</Label>
        <OptionGroup options={["Yes","No"] as const} value={f.flagged} onChange={v => s("flagged", v)} />
      </div>
    </Drawer>
  );
}
