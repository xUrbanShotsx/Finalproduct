"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Row, Col } from "../FormFields";

const ENERGY_SOURCES = ["Electrical","Hydraulic","Pneumatic","Thermal","Chemical","Mechanical","Gravity"];
const EQUIPMENT = ["Conveyor B","Pump 3","Boiler 1","Compressor A","Mixer 2","Packing Line"];

const INIT = { equipment:"", energySource:"", isolationPoints:"", lockHolder:"", appliedAt:"", permit:"" };

export function LotoDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: (typeof INIT)[K]) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  return (
    <Drawer open={open} onClose={reset} title="New LOTO Record" step={1} totalSteps={1}
      stepLabels={["Isolation Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={reset} submitLabel="Apply Lockout">
      <Section>
        <Row>
          <Col><Label>Equipment *</Label><Select value={f.equipment} onChange={v => s("equipment", v)} placeholder="Select equipment…" options={EQUIPMENT} /></Col>
          <Col><Label>Energy Source *</Label><Select value={f.energySource} onChange={v => s("energySource", v)} placeholder="Select source…" options={ENERGY_SOURCES} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Isolation Points *</Label>
        <Input value={f.isolationPoints} onChange={v => s("isolationPoints", v)} placeholder="e.g. MDB-04 breaker, valve V-12" />
      </Section>
      <Section>
        <Row>
          <Col><Label>Lock Holder *</Label><Input value={f.lockHolder} onChange={v => s("lockHolder", v)} placeholder="Authorised person" /></Col>
          <Col><Label>Applied At</Label><Input type="datetime-local" value={f.appliedAt} onChange={v => s("appliedAt", v)} /></Col>
        </Row>
      </Section>
      <div>
        <Label>Associated Permit</Label>
        <Input value={f.permit} onChange={v => s("permit", v)} placeholder="e.g. PTW-034" />
      </div>
    </Drawer>
  );
}
