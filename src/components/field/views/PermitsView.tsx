"use client";

import { useState } from "react";
import { FileSignature, Check, ChevronRight, Users, Plus, ShieldCheck } from "lucide-react";
import { Screen, Card, Btn, fieldInput } from "../ui";

interface Doc { id: string; type: "SWMS" | "JSA" | "Permit"; title: string; ref: string; steps: string[]; }
const ASSIGNED: Doc[] = [
  { id: "d1", type: "SWMS", ref: "SWMS-103", title: "Working at Heights — Scaffold Erection", steps: ["Inspect harness & anchor points before use", "Establish exclusion zone below work area", "Erect from a stable, level base", "Install guardrails at each lift", "Tag scaffold before handover"] },
  { id: "d2", type: "JSA", ref: "JSA-088", title: "Crane Lift over Pedestrian Path", steps: ["Confirm lift plan & SWL", "Barricade & spotter for exclusion zone", "Check tag & dogman comms", "No load over people at any time"] },
  { id: "d3", type: "Permit", ref: "PTW-034", title: "Confined Space Entry — Pit B", steps: ["Atmospheric test before entry", "Standby person at all times", "Continuous monitoring", "Rescue plan briefed"] },
];
const ROSTER = [
  { name: "Jordan Smith", signed: true }, { name: "M. Jones", signed: true }, { name: "K. Davis", signed: false },
  { name: "T. Walsh", signed: true }, { name: "S. Lee", signed: false },
];

export function PermitsView({ back }: { back: () => void }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [signed, setSigned] = useState<Record<string, boolean>>({});
  const [supervisor, setSupervisor] = useState(false);
  const [raising, setRaising] = useState(false);

  const doc = ASSIGNED.find((d) => d.id === openId);

  if (raising) return <RaisePermit onDone={() => setRaising(false)} />;

  if (doc) {
    const isSigned = signed[doc.id];
    return (
      <Screen title={`${doc.ref}`} onBack={() => setOpenId(null)}>
        <div className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--b-accent-text)" }}>{doc.type}</div>
        <h2 className="text-[16px] font-bold mb-4" style={{ color: "var(--b-text)" }}>{doc.title}</h2>
        <div className="space-y-2 mb-5">
          {doc.steps.map((s, i) => (
            <div key={i} className="flex gap-3 border p-3" style={{ borderColor: "var(--b-border)" }}>
              <span className="font-mono text-[12px] flex-shrink-0" style={{ color: "var(--b-accent-text)" }}>{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[13px]" style={{ color: "var(--b-text-secondary)" }}>{s}</span>
            </div>
          ))}
        </div>
        {isSigned ? (
          <div className="flex items-center justify-center gap-2 h-12 border text-[14px] font-semibold" style={{ borderColor: "var(--b-badge-green-text)", background: "var(--b-badge-green-bg)", color: "var(--b-badge-green-text)" }}>
            <Check className="w-5 h-5" /> Signed {new Date().toLocaleString("en-AU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
          </div>
        ) : (
          <Btn className="w-full" onClick={() => setSigned((s) => ({ ...s, [doc.id]: true }))}><FileSignature className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} /> I have read &amp; I sign</Btn>
        )}
      </Screen>
    );
  }

  return (
    <Screen title="Permits, SWMS & JSA" onBack={back} action={
      <button onClick={() => setRaising(true)} className="w-9 h-9 flex items-center justify-center" style={{ color: "var(--b-accent-text)" }}><Plus className="w-5 h-5" /></button>
    }>
      <div className="flex gap-1.5 mb-4">
        <button onClick={() => setSupervisor(false)} className="flex-1 h-9 text-[12.5px] font-semibold border" style={{ borderColor: !supervisor ? "var(--b-accent-border)" : "var(--b-border)", background: !supervisor ? "var(--b-accent-bg)" : "transparent", color: !supervisor ? "var(--b-accent-text)" : "var(--b-text-muted)" }}>My documents</button>
        <button onClick={() => setSupervisor(true)} className="flex-1 h-9 text-[12.5px] font-semibold border" style={{ borderColor: supervisor ? "var(--b-accent-border)" : "var(--b-border)", background: supervisor ? "var(--b-accent-bg)" : "transparent", color: supervisor ? "var(--b-accent-text)" : "var(--b-text-muted)" }}>Sign-off status</button>
      </div>

      {!supervisor ? (
        <div className="space-y-2">
          {ASSIGNED.map((d) => (
            <Card key={d.id} className="p-3.5">
              <button onClick={() => setOpenId(d.id)} className="w-full flex items-center justify-between text-left">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold px-1.5 py-0.5" style={{ background: "var(--b-bg-active)", color: "var(--b-text-secondary)" }}>{d.type}</span>
                    <span className="font-mono text-[11px]" style={{ color: "var(--b-text-muted)" }}>{d.ref}</span>
                    {signed[d.id] && <Check className="w-3.5 h-3.5" style={{ color: "var(--b-badge-green-text)" }} />}
                  </div>
                  <div className="text-[13.5px] font-semibold mt-1" style={{ color: "var(--b-text)" }}>{d.title}</div>
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />
              </button>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3 text-[12px] font-semibold" style={{ color: "var(--b-text)" }}><Users className="w-4 h-4" /> SWMS-103 — crew sign-off</div>
          {ROSTER.map((w) => (
            <div key={w.name} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "var(--b-border)" }}>
              <span className="text-[13px]" style={{ color: "var(--b-text-secondary)" }}>{w.name}</span>
              {w.signed
                ? <span className="text-[11px] flex items-center gap-1" style={{ color: "var(--b-badge-green-text)" }}><Check className="w-3.5 h-3.5" /> Signed</span>
                : <span className="text-[11px] flex items-center gap-1" style={{ color: "#f06060" }}>Not signed</span>}
            </div>
          ))}
          <div className="flex items-center gap-1.5 mt-3 text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
            <ShieldCheck className="w-3.5 h-3.5" /> 3 of 5 signed — work cannot start until all sign.
          </div>
        </Card>
      )}
    </Screen>
  );
}

function RaisePermit({ onDone }: { onDone: () => void }) {
  const [done, setDone] = useState(false);
  const [type, setType] = useState("Hot Work");
  if (done) return (
    <Screen title="Permit raised" onBack={onDone}>
      <div className="text-center py-10">
        <div className="w-14 h-14 mx-auto flex items-center justify-center mb-4" style={{ background: "var(--b-accent-bg)" }}><Check className="w-7 h-7" style={{ color: "var(--b-accent-text)" }} /></div>
        <div className="text-[16px] font-bold" style={{ color: "var(--b-text)" }}>Routed for approval</div>
        <p className="text-[13px] mt-1" style={{ color: "var(--b-text-muted)" }}>Your {type} permit has been sent to the supervisor for sign-off.</p>
        <Btn className="mt-6" onClick={onDone}>Done</Btn>
      </div>
    </Screen>
  );
  return (
    <Screen title="Raise a permit" onBack={onDone}>
      <label className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: "var(--b-text-muted)" }}>Permit type</label>
      <select value={type} onChange={(e) => setType(e.target.value)} style={{ ...fieldInput, margin: "6px 0 14px" }}>
        {["Hot Work", "Confined Space", "Working at Heights", "Isolation / Energy", "Excavation"].map((t) => <option key={t}>{t}</option>)}
      </select>
      <label className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: "var(--b-text-muted)" }}>Task description</label>
      <textarea rows={3} placeholder="What work needs the permit?" style={{ ...fieldInput, height: "auto", padding: "10px 12px", resize: "none", margin: "6px 0 16px" }} />
      <Btn className="w-full" onClick={() => setDone(true)}><FileSignature className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} /> Submit for approval</Btn>
    </Screen>
  );
}
