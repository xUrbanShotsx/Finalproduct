"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Textarea, OptionGroup, Row, Col } from "../FormFields";

const HAZARD_TYPES = ["Wet Floor","Uneven Surface","Obstructed Walkway","Poor Lighting","Damaged Flooring","Loose Mat / Rug","Spill / Contamination","Trailing Cable","Steep Gradient","Other"];
const SITES = ["Site 01","Site 02","Site 03"];
const SURFACE_TYPES = ["Concrete","Tiles","Carpet","Timber","Asphalt","Steel Grating","Dirt / Gravel","Other"];
const ASSIGNEES = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong","S. Lee","P. Nguyen"];

const INIT = { hazardType:"", surface:"", site:"", location:"", description:"", controls:"", inspectionDue:"" as "Overdue"|"Due Soon"|"OK"|"", assignee:"", dueDate:"" };

export function SlipTripFallDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: (typeof INIT)[K]) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  return (
    <Drawer open={open} onClose={reset} title="Report Hazard" step={1} totalSteps={1}
      stepLabels={["Hazard Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={reset} submitLabel="Report Hazard">
      <Section>
        <Row>
          <Col><Label>Hazard Type *</Label><Select value={f.hazardType} onChange={v => s("hazardType", v)} placeholder="Select type…" options={HAZARD_TYPES} /></Col>
          <Col><Label>Surface Type *</Label><Select value={f.surface} onChange={v => s("surface", v)} placeholder="Select surface…" options={SURFACE_TYPES} /></Col>
        </Row>
      </Section>
      <Section>
        <Row>
          <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
          <Col><Label>Location</Label><Input value={f.location} onChange={v => s("location", v)} placeholder="e.g. Level 2 corridor" /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Hazard Description *</Label>
        <Textarea rows={3} value={f.description} onChange={v => s("description", v)} placeholder="Describe the hazard in detail…" />
      </Section>
      <Section>
        <Label>Interim Controls Applied</Label>
        <Textarea rows={2} value={f.controls} onChange={v => s("controls", v)} placeholder="e.g. Warning signs placed, area cordoned off…" />
      </Section>
      <Section>
        <Label>Inspection Status</Label>
        <OptionGroup options={["Overdue","Due Soon","OK"] as const} value={f.inspectionDue} onChange={v => s("inspectionDue", v)} />
      </Section>
      <Section>
        <Label>Assignee</Label>
        <Select value={f.assignee} onChange={v => s("assignee", v)} placeholder="Select…" options={ASSIGNEES} />
      </Section>
      <div>
        <Label>Rectification Due</Label>
        <Input type="date" value={f.dueDate} onChange={v => s("dueDate", v)} />
      </div>
    </Drawer>
  );
}
