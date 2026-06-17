"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Textarea, Row, Col } from "../FormFields";

const ZONE_TYPES = ["Traffic Management", "Exclusion Zone", "Crane Swing Zone", "Laydown Area", "Pedestrian Corridor", "Hoarding / Fence Line", "No-Go Zone"];
const SITES = ["Site 01", "Site 02", "Site 03"];
const SUPERVISORS = ["J. Smith", "M. Jones", "K. Davis", "T. Walsh", "D. Wong", "S. Lee"];
const SEPARATION_TYPES = ["Concrete barriers", "Temporary fencing", "Barrier tape", "Jersey barriers", "Hoarding", "Witches hats + bunting", "Exclusion zone signage"];

const INIT = {
  zoneRef: "", zoneType: "", site: "", location: "", area: "",
  activeFrom: "", activeTo: "", supervisor: "",
  separationMethod: "", speedLimit: "", accessRoute: "", notes: "",
  tmpRef: "", tmpApprovedBy: "",
};

export function WorkZoneDrawer({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd?: (f: typeof INIT) => void }) {
  const [step, setStep] = useState(1);
  const [f, setF] = useState(INIT);
  const s = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setStep(1); setF(INIT); onClose(); };

  const submit = () => { onAdd?.(f); reset(); };
  return (
    <Drawer
      open={open} onClose={reset} title="New Work Zone" step={step} totalSteps={2}
      stepLabels={["Zone Details", "Controls & TMP"]}
      onStepChange={setStep} onBack={() => step === 1 ? reset() : setStep(1)}
      onNext={() => setStep(2)} onSubmit={submit} submitLabel="Create Work Zone"
    >
      {step === 1 && <>
        <Section>
          <Row>
            <Col><Label>Zone Reference *</Label><Input placeholder="WZ-2024-043" value={f.zoneRef} onChange={v => s("zoneRef", v)} /></Col>
            <Col><Label>Zone Type *</Label><Select value={f.zoneType} onChange={v => s("zoneType", v)} placeholder="Select type…" options={ZONE_TYPES} /></Col>
          </Row>
        </Section>
        <Section>
          <Row>
            <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
            <Col><Label>Area / Grid Ref</Label><Input placeholder="Grid H4–H7" value={f.area} onChange={v => s("area", v)} /></Col>
          </Row>
        </Section>
        <Section>
          <Label>Location Description *</Label>
          <Textarea rows={2} placeholder="Describe the work zone location and boundaries…" value={f.location} onChange={v => s("location", v)} />
        </Section>
        <Section>
          <Row>
            <Col><Label>Active From *</Label><Input type="datetime-local" value={f.activeFrom} onChange={v => s("activeFrom", v)} /></Col>
            <Col><Label>Active To</Label><Input type="datetime-local" value={f.activeTo} onChange={v => s("activeTo", v)} /></Col>
          </Row>
        </Section>
        <Section>
          <Label>Zone Supervisor *</Label>
          <Select value={f.supervisor} onChange={v => s("supervisor", v)} placeholder="Select supervisor…" options={SUPERVISORS} />
        </Section>
      </>}

      {step === 2 && <>
        <Section>
          <Label>Separation / Barricade Method *</Label>
          <Select value={f.separationMethod} onChange={v => s("separationMethod", v)} placeholder="Select method…" options={SEPARATION_TYPES} />
        </Section>
        <Section>
          <Row>
            <Col><Label>Speed Limit (km/h)</Label><Input placeholder="10" value={f.speedLimit} onChange={v => s("speedLimit", v)} /></Col>
            <Col><Label>Alternate Access Route</Label><Input placeholder="Via Gate 3 — Grid B2" value={f.accessRoute} onChange={v => s("accessRoute", v)} /></Col>
          </Row>
        </Section>
        <Section>
          <Label>Traffic Management Plan Ref</Label>
          <Input placeholder="TMP-2024-007" value={f.tmpRef} onChange={v => s("tmpRef", v)} />
        </Section>
        <Section>
          <Label>TMP Approved By</Label>
          <Input placeholder="Traffic controller / engineer name" value={f.tmpApprovedBy} onChange={v => s("tmpApprovedBy", v)} />
        </Section>
        <Section>
          <Label>Notes / Special Conditions</Label>
          <Textarea rows={3} placeholder="Any special access conditions, hours of operation or community impact…" value={f.notes} onChange={v => s("notes", v)} />
        </Section>
      </>}
    </Drawer>
  );
}
