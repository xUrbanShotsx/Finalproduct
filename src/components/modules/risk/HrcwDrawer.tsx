"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Textarea, Row, Col } from "../FormFields";

const HRCW_CATS = ["Cat 1 — Heights >2m","Cat 2 — Confined Space","Cat 3 — Demolition","Cat 4 — Cranes & Plant","Cat 5 — Pressurised","Cat 11 — Excavation >1.5m","Cat 13 — Hot Work","Cat 14 — Tilt-up","Cat 15 — Electrical","Cat 16 — Overhead Lines"];
const SITES = ["Site 01","Site 02","Site 03","All Sites"];
const OWNERS = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong","S. Lee","P. Nguyen"];

const INIT = { hrcwCat:"", site:"", regRef:"", swmsRef:"", workDescription:"", owner:"", startDate:"", endDate:"", notifiable:"" };

export function HrcwDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  return (
    <Drawer open={open} onClose={reset} title="New HRCW Record" step={1} totalSteps={1}
      stepLabels={["HRCW Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={reset} submitLabel="Add HRCW Record">
      <Section>
        <Label>HRCW Category *</Label>
        <Select value={f.hrcwCat} onChange={v => s("hrcwCat", v)} placeholder="Select category…" options={HRCW_CATS} />
      </Section>
      <Section>
        <Row>
          <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
          <Col><Label>Regulation Ref.</Label><Input value={f.regRef} onChange={v => s("regRef", v)} placeholder="e.g. WHS Reg 291(1)(a)" /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Work Description *</Label>
        <Textarea rows={3} value={f.workDescription} onChange={v => s("workDescription", v)} placeholder="Describe the high-risk construction work being undertaken…" />
      </Section>
      <Section>
        <Label>SWMS Reference</Label>
        <Input value={f.swmsRef} onChange={v => s("swmsRef", v)} placeholder="e.g. SWMS-103" />
      </Section>
      <Section>
        <Row>
          <Col><Label>Start Date *</Label><Input type="date" value={f.startDate} onChange={v => s("startDate", v)} /></Col>
          <Col><Label>End Date</Label><Input type="date" value={f.endDate} onChange={v => s("endDate", v)} /></Col>
        </Row>
      </Section>
      <div>
        <Label>Owner / Responsible Person</Label>
        <Select value={f.owner} onChange={v => s("owner", v)} placeholder="Select owner…" options={OWNERS} />
      </div>
    </Drawer>
  );
}
