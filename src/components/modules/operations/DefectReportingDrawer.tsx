"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Textarea, OptionGroup, Row, Col } from "../FormFields";

const ASSETS = ["Tower Crane TC-04","CAT 320 Excavator","Telehandler JLG","Boom Lift","Skid Steer","Concrete Pump","Hoist SC 32/33","Compactor","Other"];
const SITES = ["Site 01","Site 02","Site 03"];
const ASSIGNEES = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong","S. Lee","Workshop"];
const SEVERITY = ["Minor","Moderate","Major","Critical"] as const;

const INIT = { asset:"", site:"", severity:"" as typeof SEVERITY[number]|"", description:"", grounded:"" as "Yes"|"No"|"", assignee:"", dueDate:"", partNo:"" };

export function DefectReportingDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: (typeof INIT)[K]) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  return (
    <Drawer open={open} onClose={reset} title="Report Defect" step={1} totalSteps={1}
      stepLabels={["Defect Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={reset} submitLabel="Report Defect">
      <Section>
        <Row>
          <Col><Label>Asset *</Label><Select value={f.asset} onChange={v => s("asset", v)} placeholder="Select asset…" options={ASSETS} /></Col>
          <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Severity *</Label>
        <OptionGroup options={SEVERITY} value={f.severity} onChange={v => s("severity", v)} />
      </Section>
      {f.severity === "Major" || f.severity === "Critical" ? (
        <Section>
          <div className="p-3 mb-1 border" style={{ background: "rgba(240,96,96,0.06)", borderColor: "#f06060" }}>
            <span className="text-[12px] font-semibold" style={{ color: "#f06060" }}>
              {f.severity} defect — asset must be grounded until rectified.
            </span>
          </div>
        </Section>
      ) : null}
      <Section>
        <Label>Asset Grounded?</Label>
        <OptionGroup options={["Yes","No"] as const} value={f.grounded} onChange={v => s("grounded", v)} />
      </Section>
      <Section>
        <Label>Defect Description *</Label>
        <Textarea rows={3} value={f.description} onChange={v => s("description", v)} placeholder="Describe the defect observed…" />
      </Section>
      <Section>
        <Row>
          <Col><Label>Assigned To</Label><Select value={f.assignee} onChange={v => s("assignee", v)} placeholder="Select…" options={ASSIGNEES} /></Col>
          <Col><Label>Due Date</Label><Input type="date" value={f.dueDate} onChange={v => s("dueDate", v)} /></Col>
        </Row>
      </Section>
      <div>
        <Label>Part / Component No.</Label>
        <Input value={f.partNo} onChange={v => s("partNo", v)} placeholder="e.g. TC-04-HOOK-01" />
      </div>
    </Drawer>
  );
}
