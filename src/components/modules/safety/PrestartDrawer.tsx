"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, OptionGroup, Row, Col } from "../FormFields";
import { AiButton } from "../AiButton";

const ASSETS = ["Tower Crane TC-04","CAT 320 Excavator","JLG 4017 Telehandler","Genie S-65 Boom Lift","Schwing BP 600 Pump","Bobcat S650 Skid Steer","Alimak Hoist SC 32/33","Dynapac CA250D"];
const SITES = ["Site 01","Site 02","Site 03"];
const OPERATORS = ["M. Chen","T. Walsh","R. Kim","P. Nguyen","D. Wong","S. Lee","K. Davis"];
const CHECKS = ["Fuel / fluid levels","Engine oil","Tyres / tracks","Brakes","Lights & horn","Safety devices","Guards in place","No visible leaks","Controls functional","Emergency stop"] as const;
type Check = typeof CHECKS[number];
type Result = "Pass" | "Fail" | "";

const INIT_CHECKS = Object.fromEntries(CHECKS.map(c => [c, "" as Result])) as Record<Check, Result>;
const INIT = { asset:"", site:"", operator:"", date:"", notes:"" };

export function PrestartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [f, setF] = useState(INIT);
  const [checks, setChecks] = useState(INIT_CHECKS);
  const s = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));
  const reset = () => { setStep(1); setF(INIT); setChecks(INIT_CHECKS); onClose(); };
  const failedChecks = CHECKS.filter(c => checks[c] === "Fail");
  const fails = failedChecks.length;
  return (
    <Drawer open={open} onClose={reset} title="Start Prestart Check" step={step} totalSteps={2}
      stepLabels={["Asset & Operator","Checklist"]}
      onStepChange={setStep} onBack={() => step === 1 ? reset() : setStep(1)}
      onNext={() => setStep(2)} onSubmit={reset} submitLabel="Submit Prestart">
      {step === 1 && <>
        <Section>
          <Label>Asset / Plant *</Label>
          <Select value={f.asset} onChange={v => s("asset", v)} placeholder="Select asset…" options={ASSETS} />
        </Section>
        <Section>
          <Row>
            <Col><Label>Site *</Label><Select value={f.site} onChange={v => s("site", v)} placeholder="Select site…" options={SITES} /></Col>
            <Col><Label>Date *</Label><Input type="date" value={f.date} onChange={v => s("date", v)} /></Col>
          </Row>
        </Section>
        <div>
          <Label>Operator *</Label>
          <Select value={f.operator} onChange={v => s("operator", v)} placeholder="Select operator…" options={OPERATORS} />
        </div>
      </>}
      {step === 2 && <>
        {fails > 0 && (
          <div className="p-3 mb-4 border" style={{ background: "rgba(240,96,96,0.06)", borderColor: "#f06060" }}>
            <span className="text-[12px] font-semibold" style={{ color: "#f06060" }}>
              {fails} check{fails > 1 ? "s" : ""} failed — asset must be grounded until defects are rectified.
            </span>
          </div>
        )}
        <div className="space-y-3 mb-5">
          {CHECKS.map(c => (
            <div key={c}>
              <Label>{c}</Label>
              <OptionGroup options={["Pass","Fail"] as const} value={checks[c]} onChange={v => setChecks(p => ({ ...p, [c]: v }))} />
            </div>
          ))}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label>Notes / Defects Observed</Label>
            {fails > 0 && (
              <AiButton
                label="Summarise defects"
                prompt={`Write a brief defect summary for a plant prestart check on ${f.asset || "plant equipment"} at an Australian construction site. The following checks failed: ${failedChecks.join(", ")}. For each failed item, write one sentence describing the likely defect and the required rectification action. Plain text, numbered list.`}
                onStream={chunk => s("notes", chunk ? f.notes + chunk : "")}
              />
            )}
          </div>
          <textarea
            rows={4}
            value={f.notes}
            onChange={e => s("notes", e.target.value)}
            placeholder={fails > 0 ? "Use AI to summarise defects, or describe manually…" : "Describe any defects or observations…"}
            className="w-full px-3 py-2.5 text-[12.5px] border outline-none resize-none transition-colors focus:border-[var(--b-accent-text)]"
            style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }}
          />
        </div>
      </>}
    </Drawer>
  );
}
