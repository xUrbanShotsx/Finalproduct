"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Textarea, OptionGroup, Row, Col } from "../FormFields";

const CRC_TYPES = ["Working at Heights","Isolation & LOTO","Confined Space","Dropped Objects","Ground Conditions","Lifting Operations","Explosives","Hot Work","Electrical Hazards","Traffic Management"];
const SITES = ["Site 01","Site 02","Site 03","All Sites"];
const VERIFIERS = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong","S. Lee","P. Nguyen"];
const RESULT = ["Verified","Partial","Failed"] as const;

const INIT = { crcType:"", site:"", description:"", verifier:"", date:"", result:"" as typeof RESULT[number]|"", notes:"" };

export function CriticalRiskControlsDrawer({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd?: (f: typeof INIT) => void }) {
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: (typeof INIT)[K]) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setF(INIT); onClose(); };
  const submit = () => { onAdd?.(f); reset(); };
  return (
    <Drawer open={open} onClose={reset} title="Verify Controls" step={1} totalSteps={1}
      stepLabels={["Verification Details"]} onStepChange={() => {}} onBack={reset}
      onNext={() => {}} onSubmit={submit} submitLabel="Save Verification">
      <Section>
        <Row>
          <Col><Label>CRC Type *</Label><Select value={f.crcType} onChange={v => s("crcType", v)} placeholder="Select type…" options={CRC_TYPES} /></Col>
          <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Control Description</Label>
        <Textarea rows={2} value={f.description} onChange={v => s("description", v)} placeholder="Describe the critical control being verified…" />
      </Section>
      <Section>
        <Row>
          <Col><Label>Verified By *</Label><Select value={f.verifier} onChange={v => s("verifier", v)} placeholder="Select…" options={VERIFIERS} /></Col>
          <Col><Label>Date *</Label><Input type="date" value={f.date} onChange={v => s("date", v)} /></Col>
        </Row>
      </Section>
      <Section>
        <Label>Verification Result *</Label>
        <OptionGroup options={RESULT} value={f.result} onChange={v => s("result", v)} />
      </Section>
      {(f.result === "Partial" || f.result === "Failed") && (
        <Section>
          <div className="p-3 border" style={{ background: "rgba(240,96,96,0.06)", borderColor: "#f06060" }}>
            <span className="text-[12px] font-semibold" style={{ color: "#f06060" }}>
              {f.result} — raise a corrective action and notify the site supervisor.
            </span>
          </div>
        </Section>
      )}
      <div>
        <Label>Notes / Observations</Label>
        <Textarea rows={3} value={f.notes} onChange={v => s("notes", v)} placeholder="Record any deficiencies, observations or actions required…" />
      </div>
    </Drawer>
  );
}
