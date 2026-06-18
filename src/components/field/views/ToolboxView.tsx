"use client";

import { useState } from "react";
import { Megaphone, Check, ChevronRight, WifiOff, Users } from "lucide-react";
import { Screen, Card, Btn } from "../ui";

const TEMPLATES = [
  "Working at Heights refresher", "Silica dust controls", "Manual handling", "Heat & fatigue", "Traffic management", "Emergency procedures",
];
const CREW = ["Jordan Smith", "M. Jones", "K. Davis", "T. Walsh", "S. Lee", "P. Nguyen", "D. Wong", "R. Kim"];

export function ToolboxView({ back }: { back: () => void }) {
  const [topic, setTopic] = useState<string | null>(null);
  const [present, setPresent] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);
  const offline = false;

  if (saved) return (
    <Screen title="Talk recorded" onBack={back}>
      <div className="text-center py-10">
        <div className="w-14 h-14 mx-auto flex items-center justify-center mb-4" style={{ background: "var(--b-accent-bg)" }}><Check className="w-7 h-7" style={{ color: "var(--b-accent-text)" }} /></div>
        <div className="text-[16px] font-bold" style={{ color: "var(--b-text)" }}>{topic}</div>
        <p className="text-[13px] mt-1" style={{ color: "var(--b-text-muted)" }}>{present.size} attendees signed on digitally.</p>
        <Btn className="mt-6" onClick={back}>Done</Btn>
      </div>
    </Screen>
  );

  if (topic) {
    return (
      <Screen title="Attendance" onBack={() => setTopic(null)}>
        <Card className="p-3 mb-3">
          <div className="flex items-center gap-2"><Megaphone className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} /><span className="text-[13.5px] font-semibold" style={{ color: "var(--b-text)" }}>{topic}</span></div>
          <div className="text-[11.5px] mt-1 flex items-center gap-1.5" style={{ color: "var(--b-text-muted)" }}><Users className="w-3 h-3" /> {present.size} of {CREW.length} present · tap to sign on</div>
        </Card>
        <div className="space-y-1.5 mb-4">
          {CREW.map((w) => {
            const on = present.has(w);
            return (
              <button key={w} onClick={() => setPresent((p) => { const n = new Set(p); n.has(w) ? n.delete(w) : n.add(w); return n; })} className="w-full flex items-center justify-between px-3 h-12 border" style={{ borderColor: on ? "var(--b-accent-border)" : "var(--b-border)", background: on ? "var(--b-accent-bg)" : "var(--b-bg)" }}>
                <span className="text-[13.5px]" style={{ color: "var(--b-text)" }}>{w}</span>
                <span className="w-6 h-6 flex items-center justify-center" style={{ background: on ? "var(--b-accent-text)" : "transparent", border: on ? "none" : "1px solid var(--b-border-strong)" }}>
                  {on && <Check className="w-4 h-4" style={{ color: "#0a0a0a" }} />}
                </span>
              </button>
            );
          })}
        </div>
        {offline && <div className="flex items-center gap-1.5 text-[11.5px] mb-3" style={{ color: "var(--b-badge-yellow-text)" }}><WifiOff className="w-3.5 h-3.5" /> Offline — will sync when reconnected</div>}
        <Btn className="w-full" disabled={present.size === 0} onClick={() => setSaved(true)}><Check className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} /> Record talk &amp; attendance</Btn>
      </Screen>
    );
  }

  return (
    <Screen title="Toolbox & Meetings" onBack={back}>
      <p className="text-[12.5px] mb-3" style={{ color: "var(--b-text-muted)" }}>Run a toolbox talk from a template — digital sign-on, no paper register.</p>
      <div className="flex items-center gap-1.5 text-[11px] mb-4 px-2.5 py-1.5 border" style={{ borderColor: "var(--b-border)", color: "var(--b-text-muted)", background: "var(--b-bg)" }}>
        <WifiOff className="w-3.5 h-3.5" /> Works offline — captures attendance with no signal, syncs automatically when reconnected.
      </div>
      <div className="space-y-2">
        {TEMPLATES.map((t) => (
          <Card key={t} className="p-3.5">
            <button onClick={() => { setTopic(t); setPresent(new Set()); }} className="w-full flex items-center justify-between text-left">
              <span className="text-[13.5px] font-medium" style={{ color: "var(--b-text)" }}>{t}</span>
              <ChevronRight className="w-4 h-4" style={{ color: "var(--b-text-muted)" }} />
            </button>
          </Card>
        ))}
      </div>
    </Screen>
  );
}
