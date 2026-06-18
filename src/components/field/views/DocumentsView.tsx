"use client";

import { useState } from "react";
import { FileText, Download, WifiOff, GitCompare, ChevronRight, AlertTriangle } from "lucide-react";
import { Screen, Card } from "../ui";

const DOCS = [
  { cat: "SDS", items: ["Diesel Fuel SDS", "Sodium Hypochlorite SDS", "Epoxy Resin SDS"] },
  { cat: "SWMS", items: ["Working at Heights — Scaffold", "Concrete Pumping", "Confined Space Entry"] },
  { cat: "Safe Work Procedures", items: ["Angle grinder use", "Manual handling", "Site traffic management"] },
];
const DRAWINGS = [
  { id: "A-101", title: "Ground Floor Plan", rev: "Rev D", prev: "Rev C", changes: ["Column grid B-4 relocated 300mm", "Penetration added at slab edge", "Stair 2 handrail spec updated"] },
  { id: "S-204", title: "Level 3 Structural", rev: "Rev B", prev: "Rev A", changes: ["Beam B12 size increased to 530UB", "Additional shear studs noted"] },
];
const EMERGENCY = ["Site Evacuation & Assembly Points", "Emergency Response Plan — Site 01", "First Aid & Medical Emergency", "Spill Response Procedure"];

export function DocumentsView({ back }: { back: () => void }) {
  const [tab, setTab] = useState<"docs" | "drawings" | "emergency">("docs");
  const [compare, setCompare] = useState<string | null>(null);

  const dwg = DRAWINGS.find((d) => d.id === compare);
  if (dwg) {
    return (
      <Screen title={`${dwg.id} ${dwg.rev}`} onBack={() => setCompare(null)}>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="border p-3 text-center" style={{ borderColor: "var(--b-border)" }}>
            <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--b-text-muted)" }}>Previous</div>
            <div className="text-[14px] font-bold" style={{ color: "var(--b-text-muted)" }}>{dwg.prev}</div>
            <div className="h-24 mt-2 flex items-center justify-center" style={{ background: "var(--b-bg-active)" }}><FileText className="w-7 h-7" style={{ color: "var(--b-text-muted)" }} /></div>
          </div>
          <div className="border p-3 text-center" style={{ borderColor: "var(--b-accent-border)" }}>
            <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--b-accent-text)" }}>Current</div>
            <div className="text-[14px] font-bold" style={{ color: "var(--b-text)" }}>{dwg.rev}</div>
            <div className="h-24 mt-2 flex items-center justify-center" style={{ background: "var(--b-accent-bg)" }}><FileText className="w-7 h-7" style={{ color: "var(--b-accent-text)" }} /></div>
          </div>
        </div>
        <div className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--b-text-muted)" }}>What changed</div>
        <div className="space-y-1.5">
          {dwg.changes.map((c, i) => (
            <div key={i} className="flex gap-2 text-[12.5px] border-l-2 pl-3 py-1" style={{ borderColor: "var(--b-accent-text)", color: "var(--b-text-secondary)" }}>{c}</div>
          ))}
        </div>
      </Screen>
    );
  }

  return (
    <Screen title="Documents & Drawings" onBack={back}>
      <div className="flex gap-1.5 mb-4">
        {([["docs", "Documents"], ["drawings", "Drawings"], ["emergency", "Emergency"]] as const).map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} className="flex-1 h-9 text-[12px] font-semibold border" style={{ borderColor: tab === k ? "var(--b-accent-border)" : "var(--b-border)", background: tab === k ? "var(--b-accent-bg)" : "transparent", color: tab === k ? "var(--b-accent-text)" : "var(--b-text-muted)" }}>{label}</button>
        ))}
      </div>

      {tab === "docs" && (
        <>
          <div className="flex items-center gap-1.5 text-[11px] mb-3 px-2.5 py-1.5 border" style={{ borderColor: "var(--b-border)", color: "var(--b-text-muted)" }}>
            <Download className="w-3.5 h-3.5" /> Pushed to every worker&apos;s device automatically — no printing.
          </div>
          {DOCS.map((g) => (
            <div key={g.cat} className="mb-4">
              <div className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--b-text-muted)" }}>{g.cat}</div>
              <div className="space-y-1.5">
                {g.items.map((it) => (
                  <Card key={it} className="p-3 flex items-center gap-3">
                    <FileText className="w-4 h-4 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />
                    <span className="text-[13px] flex-1" style={{ color: "var(--b-text-secondary)" }}>{it}</span>
                    <Download className="w-4 h-4" style={{ color: "var(--b-text-muted)" }} />
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {tab === "drawings" && (
        <>
          <div className="flex items-center gap-1.5 text-[11px] mb-3 px-2.5 py-1.5 border" style={{ borderColor: "var(--b-border)", color: "var(--b-text-muted)" }}>
            <GitCompare className="w-3.5 h-3.5" /> Version controlled — you always see the latest revision.
          </div>
          <div className="space-y-2">
            {DRAWINGS.map((d) => (
              <Card key={d.id} className="p-3.5">
                <button onClick={() => setCompare(d.id)} className="w-full flex items-center justify-between text-left">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[12px] font-bold" style={{ color: "var(--b-text)" }}>{d.id}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5" style={{ background: "var(--b-accent-bg)", color: "var(--b-accent-text)" }}>{d.rev} · latest</span>
                    </div>
                    <div className="text-[12.5px] mt-1" style={{ color: "var(--b-text-secondary)" }}>{d.title}</div>
                    <div className="text-[11px] mt-0.5 flex items-center gap-1" style={{ color: "var(--b-text-muted)" }}><GitCompare className="w-3 h-3" /> Compare with {d.prev}</div>
                  </div>
                  <ChevronRight className="w-4 h-4" style={{ color: "var(--b-text-muted)" }} />
                </button>
              </Card>
            ))}
          </div>
        </>
      )}

      {tab === "emergency" && (
        <>
          <div className="flex items-center gap-1.5 text-[11px] mb-3 px-2.5 py-1.5 border" style={{ borderColor: "var(--b-badge-green-text)", background: "var(--b-badge-green-bg)", color: "var(--b-badge-green-text)" }}>
            <WifiOff className="w-3.5 h-3.5" /> Cached on this device — available with zero signal.
          </div>
          <div className="space-y-1.5">
            {EMERGENCY.map((e) => (
              <Card key={e} className="p-3 flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: "#f06060" }} />
                <span className="text-[13px] flex-1" style={{ color: "var(--b-text-secondary)" }}>{e}</span>
                <span className="text-[10px] flex items-center gap-1" style={{ color: "var(--b-badge-green-text)" }}><WifiOff className="w-3 h-3" /> Offline</span>
              </Card>
            ))}
          </div>
        </>
      )}
    </Screen>
  );
}
