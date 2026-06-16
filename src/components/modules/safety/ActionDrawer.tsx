"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Textarea, Row, Col } from "../FormFields";
import { AiButton } from "../AiButton";

const SOURCES = ["Incident","Near Miss","Audit","Inspection","SWMS","Risk Assessment","Regulator Notice","Other"];
const ASSIGNEES = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong","S. Lee","P. Nguyen"];
const PRIORITIES = ["Critical","High","Medium","Low"];

const INIT = { title:"", source:"", sourceRef:"", priority:"", dueDate:"", assignee:"", description:"" };

export function ActionDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  return (
    <Drawer open={open} onClose={reset} title="New Action" step={1} totalSteps={1}
      stepLabels={["Action Details"]}
      onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={reset} submitLabel="Create Action">
      <Section>
        <Label>Action Title *</Label>
        <Input value={f.title} onChange={v => s("title", v)} placeholder="Brief description of the required action" />
      </Section>
      <Section>
        <Row>
          <Col><Label>Source *</Label><Select value={f.source} onChange={v => s("source", v)} placeholder="Select source…" options={SOURCES} /></Col>
          <Col><Label>Source Ref.</Label><Input value={f.sourceRef} onChange={v => s("sourceRef", v)} placeholder="e.g. INC-044" /></Col>
        </Row>
      </Section>
      <Section>
        <Row>
          <Col><Label>Priority *</Label><Select value={f.priority} onChange={v => s("priority", v)} placeholder="Select…" options={PRIORITIES} /></Col>
          <Col><Label>Due Date *</Label><Input type="date" value={f.dueDate} onChange={v => s("dueDate", v)} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Assignee *</Label>
        <Select value={f.assignee} onChange={v => s("assignee", v)} placeholder="Select assignee…" options={ASSIGNEES} />
      </Section>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label>Description</Label>
          <AiButton
            disabled={!f.title && !f.source}
            label="Draft with AI"
            prompt={`Write a corrective action description for an Australian WHS management system. Action title: "${f.title || "corrective action"}". Source: ${f.source || "safety finding"}${f.sourceRef ? ` (ref: ${f.sourceRef})` : ""}. Priority: ${f.priority || "unset"}. Describe: what needs to be done, why it is important for safety compliance, and what a successful outcome looks like. Three sentences maximum. Plain text only.`}
            onStream={chunk => s("description", chunk ? f.description + chunk : "")}
          />
        </div>
        <Textarea rows={4} value={f.description} onChange={v => s("description", v)} placeholder="Describe what needs to be done, why, and what a successful outcome looks like…" />
      </div>
    </Drawer>
  );
}
