"use client";

import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Row, Col } from "../FormFields";
import { AlertTriangle } from "lucide-react";

const HAZARD_TYPES  = ["Physical","Chemical","Mechanical","Ergonomic","Psychosocial","Electrical","Biological","Environmental"];
const RISK_LEVELS   = ["Critical","High","Medium","Low"];
const SITES         = ["Site 01","Site 02","Site 03","All Sites"];
const OWNERS        = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong","S. Lee","P. Nguyen"];

export interface RaiseRiskSource {
  /** Human-readable module label, e.g. "Incident INC-044" or "CRC-014" */
  sourceRef:   string;
  /** Pre-fill hazard title */
  title?:      string;
  /** Pre-fill location */
  location?:   string;
  /** Pre-fill site */
  site?:       string;
  /** Pre-fill inherent risk level */
  riskLevel?:  string;
  /** Source module route for the breadcrumb badge */
  sourceRoute?: string;
}

interface Props {
  open:     boolean;
  onClose:  () => void;
  source:   RaiseRiskSource | null;
  onSaved?: (ref: string) => void;
}

const INIT = { hazardType: "", site: "", title: "", description: "", location: "", inherentRisk: "", controls: "", owner: "", reviewDate: "" };

export function RaiseRiskDrawer({ open, onClose, source, onSaved }: Props) {
  const [step, setStep]   = useState(1);
  const [f, setF]         = useState(INIT);
  const set = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));

  function reset() { setStep(1); setF(INIT); onClose(); }

  function submit() {
    const newRef = `HAZ-${1000 + Math.floor(Math.random() * 900)}`;
    onSaved?.(newRef);
    reset();
  }

  /* Pre-fill from source when opening */
  const title    = f.title    || source?.title    || "";
  const site     = f.site     || source?.site     || "";
  const riskLevel = f.inherentRisk || source?.riskLevel || "";

  return (
    <Drawer
      open={open}
      onClose={reset}
      title="Raise to Risk Register"
      step={step}
      totalSteps={2}
      stepLabels={["Hazard Details", "Risk Rating & Controls"]}
      onStepChange={setStep}
      onBack={() => step === 1 ? reset() : setStep(1)}
      onNext={() => setStep(2)}
      onSubmit={submit}
      submitLabel="Log to Hazard Register"
    >
      {/* Source badge */}
      {source && (
        <div
          className="flex items-center gap-2 px-3 py-2 mb-5 text-[11.5px] border-l-2"
          style={{ borderLeftColor: "var(--b-accent)", background: "var(--b-accent-bg)", color: "var(--b-text-muted)" }}
        >
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-accent-text)" }} />
          <span>Raised from <strong style={{ color: "var(--b-text)" }}>{source.sourceRef}</strong> — details pre-filled from source record.</span>
        </div>
      )}

      {step === 1 && (
        <>
          <Section>
            <Label>Hazard Title *</Label>
            <input
              className="w-full border px-3 h-[36px] text-[12.5px] outline-none"
              style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }}
              value={title}
              onChange={e => set("title", e.target.value)}
              placeholder="Describe the hazard in one line…"
            />
          </Section>
          <Section>
            <Row>
              <Col>
                <Label>Hazard Type *</Label>
                <Select value={f.hazardType} onChange={v => set("hazardType", v)} placeholder="Select type…" options={HAZARD_TYPES} />
              </Col>
              <Col>
                <Label>Site *</Label>
                <Select value={site} onChange={v => set("site", v)} placeholder="Select site…" options={SITES} />
              </Col>
            </Row>
          </Section>
          <Section>
            <Label>Location / Specific Area</Label>
            <input
              className="w-full border px-3 h-[36px] text-[12.5px] outline-none"
              style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }}
              value={f.location || source?.location || ""}
              onChange={e => set("location", e.target.value)}
              placeholder="e.g. Level 3, north scaffold face"
            />
          </Section>
          <div>
            <Label>Description / Background</Label>
            <textarea
              className="w-full border px-3 py-2 text-[12.5px] outline-none resize-none"
              rows={4}
              style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)", fontFamily: "inherit", lineHeight: 1.6 }}
              value={f.description}
              onChange={e => set("description", e.target.value)}
              placeholder="What happened or what is the hazard? Include any relevant context from the source record…"
            />
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <Section>
            <Row>
              <Col>
                <Label>Inherent Risk *</Label>
                <Select value={riskLevel} onChange={v => set("inherentRisk", v)} placeholder="Select…" options={RISK_LEVELS} />
              </Col>
              <Col>
                <Label>Residual Risk *</Label>
                <Select value={f.inherentRisk} onChange={v => set("inherentRisk", v)} placeholder="After controls…" options={RISK_LEVELS} />
              </Col>
            </Row>
          </Section>
          <Section>
            <Label>Controls in Place</Label>
            <textarea
              className="w-full border px-3 py-2 text-[12.5px] outline-none resize-none"
              rows={3}
              style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)", fontFamily: "inherit", lineHeight: 1.6 }}
              value={f.controls}
              onChange={e => set("controls", e.target.value)}
              placeholder="List existing controls, e.g. barrier, PPE, permit…"
            />
          </Section>
          <Section>
            <Row>
              <Col>
                <Label>Owner *</Label>
                <Select value={f.owner} onChange={v => set("owner", v)} placeholder="Select owner…" options={OWNERS} />
              </Col>
              <Col>
                <Label>Next Review Date</Label>
                <Input type="date" value={f.reviewDate} onChange={v => set("reviewDate", v)} />
              </Col>
            </Row>
          </Section>

          {/* Risk register note */}
          <div className="mt-1 p-3 border" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}>
            <p className="text-[11.5px] leading-relaxed" style={{ color: "var(--b-text-muted)" }}>
              This will create a new entry in the <strong style={{ color: "var(--b-text)" }}>Hazard Register</strong> under Risk Management.
              {source && <> The source reference <strong style={{ color: "var(--b-text)" }}>{source.sourceRef}</strong> will be linked to the new hazard.</>}
            </p>
          </div>
        </>
      )}
    </Drawer>
  );
}
