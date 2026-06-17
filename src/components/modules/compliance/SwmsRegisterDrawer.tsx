"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Textarea, Row, Col } from "../FormFields";

const HRCW = ["Heights >2m","Confined Space","Demolition","Cranes & Plant","Pressurised","Excavation >1.5m","Hot Work","Tilt-up","Electrical","Overhead Lines"];
const SITES = ["Site 01","Site 02","Site 03","All Sites"];
const PEOPLE = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong","S. Lee","P. Nguyen"];

const INIT = { title:"", hrcw:"", site:"", location:"", description:"", preparedBy:"", reviewDate:"", version:"Rev 1" };

export function SwmsRegisterDrawer({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd?: (f: typeof INIT) => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  const submit = () => { onAdd?.(f); reset(); };
  return (
    <Drawer open={open} onClose={reset} title="New SWMS" step={1} totalSteps={1}
      stepLabels={["SWMS Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={submit} submitLabel="Create SWMS">
      <Section>
        <Label>SWMS Title *</Label>
        <Input value={f.title} onChange={v => s("title", v)} placeholder="e.g. Working at Heights — Scaffold Erection" />
      </Section>
      <Section>
        <Row>
          <Col><Label>HRCW Category *</Label><Select value={f.hrcw} onChange={v => s("hrcw", v)} placeholder="Select category…" options={HRCW} /></Col>
          <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Specific Location</Label>
        <Input value={f.location} onChange={v => s("location", v)} placeholder="e.g. Level 3 East" />
      </Section>
      <Section>
        <Label>Task Description *</Label>
        <Textarea rows={3} value={f.description} onChange={v => s("description", v)} placeholder="Describe the task, steps and key hazards…" />
      </Section>
      <Section>
        <Row>
          <Col><Label>Prepared By *</Label><Select value={f.preparedBy} onChange={v => s("preparedBy", v)} placeholder="Select…" options={PEOPLE} /></Col>
          <Col><Label>Version</Label><Input value={f.version} onChange={v => s("version", v)} /></Col>
        </Row>
      </Section>
      <div>
        <Label>Review Date</Label>
        <Input type="date" value={f.reviewDate} onChange={v => s("reviewDate", v)} />
      </div>
    </Drawer>
  );
}
