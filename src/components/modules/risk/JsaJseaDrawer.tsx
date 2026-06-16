"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Textarea, OptionGroup, Row, Col } from "../FormFields";

const SITES = ["Site 01","Site 02","Site 03","All Sites"];
const SUPERVISORS = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong","S. Lee","P. Nguyen"];
const TYPES = ["JSA","JSEA"] as const;

const INIT = { type:"" as typeof TYPES[number]|"", task:"", site:"", supervisor:"", date:"", hazardCount:"", stepCount:"", approved:"" as "Yes"|"No"|"" };

export function JsaJseaDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: (typeof INIT)[K]) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  const highHazards = parseInt(f.hazardCount || "0") >= 8;
  return (
    <Drawer open={open} onClose={reset} title="New JSA" step={1} totalSteps={1}
      stepLabels={["JSA Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={reset} submitLabel="Create JSA">
      <Section>
        <Row>
          <Col><Label>Type *</Label><OptionGroup options={TYPES} value={f.type} onChange={v => s("type", v)} /></Col>
          <Col><Label>Date *</Label><Input type="date" value={f.date} onChange={v => s("date", v)} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Task / Activity *</Label>
        <Textarea rows={2} value={f.task} onChange={v => s("task", v)} placeholder="Describe the task being assessed…" />
      </Section>
      <Section>
        <Row>
          <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
          <Col><Label>Supervisor *</Label><Select value={f.supervisor} onChange={v => s("supervisor", v)} placeholder="Select…" options={SUPERVISORS} /></Col>
        </Row>
      </Section>
      <Section>
        <Row>
          <Col><Label>Step Count</Label><Input value={f.stepCount} onChange={v => s("stepCount", v)} placeholder="e.g. 7" /></Col>
          <Col><Label>Hazard Count</Label><Input value={f.hazardCount} onChange={v => s("hazardCount", v)} placeholder="e.g. 4" /></Col>
        </Row>
      </Section>
      {highHazards && (
        <Section>
          <div className="p-3 border" style={{ background: "rgba(240,96,96,0.06)", borderColor: "#f06060" }}>
            <span className="text-[12px] font-semibold" style={{ color: "#f06060" }}>
              ≥8 hazards identified — escalate to formal Risk Assessment before proceeding.
            </span>
          </div>
        </Section>
      )}
      <div>
        <Label>Approved by Supervisor?</Label>
        <OptionGroup options={["Yes","No"] as const} value={f.approved} onChange={v => s("approved", v)} />
      </div>
    </Drawer>
  );
}
