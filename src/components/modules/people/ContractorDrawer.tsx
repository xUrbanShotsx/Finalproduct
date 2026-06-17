"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Row, Col } from "../FormFields";

const LICENCE_TYPES = ["Builder (Unlimited)","Builder (Restricted)","Electrician","Plumber","Rigger / Dogman","Scaffolder","Asbestos Removalist","Demolition","Other"];
const SITES = ["Site 01","Site 02","Site 03","All Sites"];

const INIT = { company:"", abn:"", contact:"", phone:"", site:"", licenceType:"", licenceNo:"", licenceExpiry:"", insuranceExpiry:"", wcoExpiry:"" };

export function ContractorDrawer({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd?: (f: typeof INIT) => void }) {
  const [step, setStep] = useState(1);
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setStep(1); setF(INIT); onClose(); };
  const submit = () => { onAdd?.(f); reset(); };
  return (
    <Drawer open={open} onClose={reset} title="Add Contractor" step={step} totalSteps={2}
      stepLabels={["Company Details","Licences & Insurance"]}
      onStepChange={setStep} onBack={() => step === 1 ? reset() : setStep(1)}
      onNext={() => setStep(2)} onSubmit={submit} submitLabel="Save Contractor">
      {step === 1 && <>
        <Section>
          <Label>Company Name *</Label>
          <Input value={f.company} onChange={v => s("company", v)} placeholder="Trading name" />
        </Section>
        <Section>
          <Row>
            <Col><Label>ABN</Label><Input value={f.abn} onChange={v => s("abn", v)} placeholder="XX XXX XXX XXX" /></Col>
            <Col><Label>Site</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
          </Row>
        </Section>
        <Section>
          <Label>Primary Contact</Label>
          <Input value={f.contact} onChange={v => s("contact", v)} placeholder="Full name" />
        </Section>
        <div>
          <Label>Contact Phone</Label>
          <Input value={f.phone} onChange={v => s("phone", v)} placeholder="04XX XXX XXX" />
        </div>
      </>}
      {step === 2 && <>
        <Section>
          <Row>
            <Col><Label>Licence Type</Label><Select value={f.licenceType} onChange={v => s("licenceType", v)} placeholder="Select type…" options={LICENCE_TYPES} /></Col>
            <Col><Label>Licence No.</Label><Input value={f.licenceNo} onChange={v => s("licenceNo", v)} placeholder="Licence number" /></Col>
          </Row>
        </Section>
        <Section>
          <Label>Licence Expiry</Label>
          <Input type="date" value={f.licenceExpiry} onChange={v => s("licenceExpiry", v)} />
        </Section>
        <Section>
          <Label>Public Liability Insurance Expiry</Label>
          <Input type="date" value={f.insuranceExpiry} onChange={v => s("insuranceExpiry", v)} />
        </Section>
        <div>
          <Label>Workers Comp Insurance Expiry</Label>
          <Input type="date" value={f.wcoExpiry} onChange={v => s("wcoExpiry", v)} />
        </div>
      </>}
    </Drawer>
  );
}
