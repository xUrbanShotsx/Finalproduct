"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, OptionGroup, Row, Col } from "../FormFields";

const ESM_TYPES = ["Exit Signs","Emergency Lighting","Fire Doors","Sprinkler System","Fire Hydrant / Hose Reel","Smoke Detection","Fire Extinguisher","Occupant Warning System","Mechanical Air-Handling (ESD)","Path of Travel"];
const SITES = ["Site 01","Site 02","Site 03"];
const INSPECTORS = ["J. Smith","M. Jones","K. Davis","T. Walsh","External Inspector"];
const RESULTS = ["Pass","Defect Found","Not Inspected"] as const;

const INIT = { esmType:"", site:"", inspector:"", inspectionDate:"", result:"" as typeof RESULTS[number]|"", defectDetail:"", rectifyDate:"", annualReportDue:"" };

export function EssentialSafetyMeasuresDrawer({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd?: (f: typeof INIT) => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: (typeof INIT)[K]) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  const submit = () => { onAdd?.(f); reset(); };
  return (
    <Drawer open={open} onClose={reset} title="Record Inspection" step={1} totalSteps={1}
      stepLabels={["Inspection Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={submit} submitLabel="Save Inspection">
      <Section>
        <Row>
          <Col><Label>ESM Type *</Label><Select value={f.esmType} onChange={v => s("esmType", v)} placeholder="Select type…" options={ESM_TYPES} /></Col>
          <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
        </Row>
      </Section>
      <Section>
        <Row>
          <Col><Label>Inspector *</Label><Select value={f.inspector} onChange={v => s("inspector", v)} placeholder="Select…" options={INSPECTORS} /></Col>
          <Col><Label>Inspection Date *</Label><Input type="date" value={f.inspectionDate} onChange={v => s("inspectionDate", v)} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Result *</Label>
        <OptionGroup options={RESULTS} value={f.result} onChange={v => s("result", v)} />
      </Section>
      {f.result === "Defect Found" && <>
        <Section>
          <Label>Defect Detail *</Label>
          <Input value={f.defectDetail} onChange={v => s("defectDetail", v)} placeholder="Describe the defect…" />
        </Section>
        <Section>
          <Label>Rectification Due</Label>
          <Input type="date" value={f.rectifyDate} onChange={v => s("rectifyDate", v)} />
        </Section>
      </>}
      <div>
        <Label>Annual Report Due Date</Label>
        <Input type="date" value={f.annualReportDue} onChange={v => s("annualReportDue", v)} />
      </div>
    </Drawer>
  );
}
