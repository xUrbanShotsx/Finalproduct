"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, OptionGroup, Row, Col } from "../FormFields";

const AGENTS = ["Noise","Respirable Silica","Welding Fumes","Isocyanates","Chemical Vapour","Hexavalent Chromium","UV Radiation","Hand-Arm Vibration","Whole-Body Vibration"];
const SITES = ["Site 01","Site 02","Site 03"];

const INIT = { agent:"", workerGroup:"", site:"", area:"", wes:"", measured:"", aboveWes:"" as "Yes"|"No"|"", monitorDate:"", nextMonitor:"" };

export function ExposureMonitoringDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: (typeof INIT)[K]) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  return (
    <Drawer open={open} onClose={reset} title="New Monitor" step={1} totalSteps={1}
      stepLabels={["Monitoring Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={reset} submitLabel="Save Record">
      <Section>
        <Row>
          <Col><Label>Agent *</Label><Select value={f.agent} onChange={v => s("agent", v)} placeholder="Select agent…" options={AGENTS} /></Col>
          <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
        </Row>
      </Section>
      <Section>
        <Row>
          <Col><Label>Worker Group *</Label><Input value={f.workerGroup} onChange={v => s("workerGroup", v)} placeholder="e.g. Concrete cutters" /></Col>
          <Col><Label>Area / Location</Label><Input value={f.area} onChange={v => s("area", v)} placeholder="e.g. Level 3 slab" /></Col>
        </Row>
      </Section>
      <Section>
        <Row>
          <Col><Label>WES Limit</Label><Input value={f.wes} onChange={v => s("wes", v)} placeholder="e.g. 0.05 mg/m³" /></Col>
          <Col><Label>Measured Level</Label><Input value={f.measured} onChange={v => s("measured", v)} placeholder="e.g. 0.04 mg/m³" /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Above WES?</Label>
        <OptionGroup options={["Yes","No"] as const} value={f.aboveWes} onChange={v => s("aboveWes", v)} />
      </Section>
      {f.aboveWes === "Yes" && (
        <Section>
          <div className="p-3 border" style={{ background: "rgba(240,96,96,0.06)", borderColor: "#f06060" }}>
            <span className="text-[12px] font-semibold" style={{ color: "#f06060" }}>
              Exposure exceeds WES — implement additional controls immediately.
            </span>
          </div>
        </Section>
      )}
      <Section>
        <Label>Monitoring Date *</Label>
        <Input type="date" value={f.monitorDate} onChange={v => s("monitorDate", v)} />
      </Section>
      <div>
        <Label>Next Monitor Date</Label>
        <Input type="date" value={f.nextMonitor} onChange={v => s("nextMonitor", v)} />
      </div>
    </Drawer>
  );
}
