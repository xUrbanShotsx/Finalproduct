"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, OptionGroup, Row, Col } from "../FormFields";

const ASSET_TYPES = ["Tower Crane","Mobile Crane","Excavator","Telehandler","Boom Lift","Scissor Lift","Skid Steer","Compactor","Concrete Pump","Forklift","Hoist","EWP","Generator","Compressor","Other"];
const SITES = ["Site 01","Site 02","Site 03"];
const OPERATORS = ["M. Chen","T. Walsh","R. Kim","P. Nguyen","D. Wong","S. Lee","K. Davis"];
const CHECKS = ["Fluid levels","Engine & hydraulics","Tyres / tracks","Safety devices","Lights & indicators","ROPS / FOPS","Load charts visible","Logbook current","No visible damage"] as const;
type Check = typeof CHECKS[number];
type Result = "Pass" | "Fail" | "";

const INIT_CHECKS = Object.fromEntries(CHECKS.map(c => [c, "" as Result])) as Record<Check, Result>;
const INIT = { assetType:"", assetId:"", site:"", operator:"", date:"" };

export function PlantEquipmentDrawer({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd?: (f: typeof INIT) => void }) {
  const [f, setF] = useState(INIT);
  const [checks, setChecks] = useState(INIT_CHECKS);
  const s = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); setChecks(INIT_CHECKS); onClose(); };
  const submit = () => { onAdd?.(f); reset(); };
  const fails = Object.values(checks).filter(v => v === "Fail").length;
  return (
    <Drawer open={open} onClose={reset} title="Pre-op Check" step={1} totalSteps={1}
      stepLabels={["Pre-op Checklist"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={submit} submitLabel="Submit Pre-op">
      <Section>
        <Row>
          <Col><Label>Asset Type *</Label><Select value={f.assetType} onChange={v => s("assetType", v)} placeholder="Select type…" options={ASSET_TYPES} /></Col>
          <Col><Label>Asset ID *</Label><Input value={f.assetId} onChange={v => s("assetId", v)} placeholder="e.g. TC-04" /></Col>
        </Row>
      </Section>
      <Section>
        <Row>
          <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
          <Col><Label>Date *</Label><Input type="date" value={f.date} onChange={v => s("date", v)} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Operator *</Label>
        <Select value={f.operator} onChange={v => s("operator", v)} placeholder="Select operator…" options={OPERATORS} />
      </Section>
      {fails > 0 && (
        <Section>
          <div className="p-3 border" style={{ background: "rgba(240,96,96,0.06)", borderColor: "#f06060" }}>
            <span className="text-[12px] font-semibold" style={{ color: "#f06060" }}>
              {fails} check{fails > 1 ? "s" : ""} failed — asset must be grounded. Raise defect report.
            </span>
          </div>
        </Section>
      )}
      <div className="space-y-3">
        {CHECKS.map(c => (
          <div key={c}>
            <Label>{c}</Label>
            <OptionGroup options={["Pass","Fail"] as const} value={checks[c]} onChange={v => setChecks(p => ({ ...p, [c]: v }))} />
          </div>
        ))}
      </div>
    </Drawer>
  );
}
