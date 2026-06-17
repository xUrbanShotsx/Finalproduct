"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, OptionGroup, Row, Col } from "../FormFields";

const GHS_CLASSES = ["Flammable","Corrosive","Toxic","Oxidising","Compressed Gas","Harmful","Environmental","Non-hazardous"];
const SIGNAL_WORDS = ["DANGER","WARNING"] as const;
const LOCATIONS = ["Plant Room","Cleaners Store","Pool Plant","Loading Dock","Roof Plant","Workshop"];
const UNITS = ["L","mL","kg","g","cyl"];

const INIT = { productName:"", ghsClass:"", signalWord:"" as typeof SIGNAL_WORDS[number]|"", location:"", store:"", quantity:"", unit:"", sdsExpiry:"", supplier:"" };

export function HazardousMaterialsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: (typeof INIT)[K]) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  return (
    <Drawer open={open} onClose={reset} title="Add Material" step={1} totalSteps={1}
      stepLabels={["Material Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={reset} submitLabel="Add to Register">
      <Section>
        <Label>Product Name *</Label>
        <Input value={f.productName} onChange={v => s("productName", v)} placeholder="e.g. Sodium Hypochlorite 12.5%" />
      </Section>
      <Section>
        <Row>
          <Col><Label>GHS Class *</Label><Select value={f.ghsClass} onChange={v => s("ghsClass", v)} placeholder="Select class…" options={GHS_CLASSES} /></Col>
          <Col><Label>Signal Word *</Label><OptionGroup options={SIGNAL_WORDS} value={f.signalWord} onChange={v => s("signalWord", v)} /></Col>
        </Row>
      </Section>
      <Section>
        <Row>
          <Col><Label>Location *</Label><Select value={f.location} onChange={v => s("location", v)} placeholder="Select location…" options={LOCATIONS} /></Col>
          <Col><Label>Storage Detail</Label><Input value={f.store} onChange={v => s("store", v)} placeholder="e.g. Bunded cabinet B" /></Col>
        </Row>
      </Section>
      <Section>
        <Row>
          <Col><Label>Quantity</Label><Input value={f.quantity} onChange={v => s("quantity", v)} placeholder="0" /></Col>
          <Col><Label>Unit</Label><Select value={f.unit} onChange={v => s("unit", v)} placeholder="Select unit…" options={UNITS} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Supplier</Label>
        <Input value={f.supplier} onChange={v => s("supplier", v)} placeholder="Supplier name" />
      </Section>
      <div>
        <Label>SDS Expiry Date</Label>
        <Input type="date" value={f.sdsExpiry} onChange={v => s("sdsExpiry", v)} />
      </div>
    </Drawer>
  );
}
