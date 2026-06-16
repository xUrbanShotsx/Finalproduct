"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Row, Col } from "../FormFields";

const AGENTS = ["Noise","Respirable Silica","Nuisance Dust","Welding Fumes","Chemical Vapour","Hexavalent Chromium","UV Radiation","Vibration","Isocyanates"];
const SITES = ["Site 01","Site 02","Site 03","All Sites"];

const INIT = { agent:"", workerGroup:"", area:"", site:"", wes:"", measured:"", monitorDate:"", nextMonitor:"" };

export function HealthMonitoringDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  return (
    <Drawer open={open} onClose={reset} title="New Monitoring Record" step={1} totalSteps={1}
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
          <Col><Label>Area / Location</Label><Input value={f.area} onChange={v => s("area", v)} placeholder="e.g. Welding Bay A" /></Col>
        </Row>
      </Section>
      <Section>
        <Row>
          <Col><Label>WES Limit</Label><Input value={f.wes} onChange={v => s("wes", v)} placeholder="e.g. 85 dB(A)" /></Col>
          <Col><Label>Measured Level</Label><Input value={f.measured} onChange={v => s("measured", v)} placeholder="e.g. 82 dB(A)" /></Col>
        </Row>
      </Section>
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
