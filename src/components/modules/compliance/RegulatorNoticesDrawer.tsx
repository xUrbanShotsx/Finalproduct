"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Textarea, OptionGroup, Row, Col } from "../FormFields";

const NOTICE_TYPES = ["Improvement Notice","Prohibition Notice","Infringement Notice"] as const;
const REGULATORS = ["SafeWork NSW","WorkSafe VIC","Workplace Health and Safety QLD","SafeWork SA","WorkSafe WA","WorkSafe TAS","NT WorkSafe","WorkSafe ACT","Comcare"];
const SITES = ["Site 01","Site 02","Site 03"];
const ASSIGNEES = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong"];

const INIT = { noticeType:"" as typeof NOTICE_TYPES[number]|"", noticeNo:"", regulator:"", site:"", issueDate:"", complianceDate:"", description:"", assignee:"" };

export function RegulatorNoticesDrawer({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd?: (f: typeof INIT) => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: (typeof INIT)[K]) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  const submit = () => { onAdd?.(f); reset(); };
  return (
    <Drawer open={open} onClose={reset} title="Record Notice" step={1} totalSteps={1}
      stepLabels={["Notice Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={submit} submitLabel="Record Notice">
      {f.noticeType === "Prohibition Notice" && (
        <Section>
          <div className="p-3 border" style={{ background: "rgba(240,96,96,0.06)", borderColor: "#f06060" }}>
            <span className="text-[12px] font-semibold" style={{ color: "#f06060" }}>
              Prohibition Notice — work must STOP immediately. Do not resume until inspector lifts the notice.
            </span>
          </div>
        </Section>
      )}
      <Section>
        <Label>Notice Type *</Label>
        <OptionGroup options={NOTICE_TYPES} value={f.noticeType} onChange={v => s("noticeType", v)} />
      </Section>
      <Section>
        <Row>
          <Col><Label>Notice No. *</Label><Input value={f.noticeNo} onChange={v => s("noticeNo", v)} placeholder="e.g. IN-2024-00312" /></Col>
          <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Regulator / Inspector *</Label>
        <Select value={f.regulator} onChange={v => s("regulator", v)} placeholder="Select regulator…" options={REGULATORS} />
      </Section>
      <Section>
        <Label>Description of Issue</Label>
        <Textarea rows={3} value={f.description} onChange={v => s("description", v)} placeholder="Summarise the breach or issue identified by the inspector…" />
      </Section>
      <Section>
        <Row>
          <Col><Label>Issue Date *</Label><Input type="date" value={f.issueDate} onChange={v => s("issueDate", v)} /></Col>
          <Col><Label>Compliance Date *</Label><Input type="date" value={f.complianceDate} onChange={v => s("complianceDate", v)} /></Col>
        </Row>
      </Section>
      <div>
        <Label>Assigned To</Label>
        <Select value={f.assignee} onChange={v => s("assignee", v)} placeholder="Select…" options={ASSIGNEES} />
      </div>
    </Drawer>
  );
}
