"use client";

import { useState } from "react";
import { FileText, Plus, X, ChevronDown, Zap, CheckCircle2, AlertTriangle, Download } from "lucide-react";

const YELLOW = "#ffd600";
const GREEN  = "#1a8a4a";

const SWMS_TEMPLATES = [
  "Bathroom renovation — full replumb",
  "Hot water system replacement",
  "Blocked drain — high pressure jetting",
  "Roof plumbing — gutters & downpipes",
  "Rough-in — new construction",
  "Gas appliance installation",
  "Pool / spa plumbing",
  "Custom task…",
];

const TOOLBOX_TOPICS = [
  "Working in confined spaces",
  "Manual handling & back care",
  "Electrical safety on site",
  "Working at heights — ladders",
  "Chemical handling — glues & solvents",
  "Dehydration & heat stress",
  "Custom topic…",
];

interface Doc { ref: string; name: string; type: string; date: string; }

const RECENT_DOCS: Doc[] = [
  { ref: "SWMS-007", name: "SWMS — Bathroom Reno, Morrison",  type: "SWMS",     date: "22 Jun 2024" },
  { ref: "TBX-006",  name: "Toolbox — Working at Heights",    type: "Toolbox",  date: "21 Jun 2024" },
  { ref: "INC-003",  name: "Incident Report — Near Miss",     type: "Incident", date: "15 Jun 2024" },
  { ref: "SWMS-005", name: "SWMS — Hot Water Replacement",    type: "SWMS",     date: "10 Jun 2024" },
];

const TYPE_STYLE: Record<string, { bg: string; color: string }> = {
  SWMS:     { bg: "rgba(255,214,0,0.1)",    color: YELLOW },
  Toolbox:  { bg: "rgba(80,130,255,0.08)",  color: "var(--b-badge-blue-text)" },
  Incident: { bg: "rgba(240,96,96,0.08)",   color: "#f06060" },
};

type DrawerType = "swms" | "toolbox" | "incident" | null;

export function TradieSafety() {
  const [drawer, setDrawer]     = useState<DrawerType>(null);
  const [docs, setDocs]         = useState<Doc[]>(RECENT_DOCS);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated]   = useState(false);

  /* SWMS form */
  const [swmsTask, setSwmsTask] = useState(SWMS_TEMPLATES[0]);
  const [swmsLocation, setSwmsLocation] = useState("");

  /* Toolbox form */
  const [tbxTopic, setTbxTopic] = useState(TOOLBOX_TOPICS[0]);

  /* Incident form */
  const [incType,  setIncType]  = useState("Near Miss");
  const [incDesc,  setIncDesc]  = useState("");
  const [incDate,  setIncDate]  = useState(new Date().toISOString().slice(0,10));

  function generate(type: string) {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      const refs: Record<string, string> = { swms: "SWMS", toolbox: "TBX", incident: "INC" };
      const ref = `${refs[type]}-${String(docs.length + 1).padStart(3,"0")}`;
      const name =
        type === "swms"     ? `SWMS — ${swmsTask.replace("Custom task…","Custom")}` :
        type === "toolbox"  ? `Toolbox — ${tbxTopic.replace("Custom topic…","Custom")}` :
        `Incident Report — ${incType}`;
      setDocs(prev => [{
        ref, name, type: refs[type] === "SWMS" ? "SWMS" : refs[type] === "TBX" ? "Toolbox" : "Incident",
        date: new Date().toLocaleDateString("en-AU", { day:"numeric", month:"short", year:"numeric" }),
      }, ...prev]);
    }, 2200);
  }

  function closeDrawer() { setDrawer(null); setGenerating(false); setGenerated(false); }

  return (
    <div className="p-5 max-w-[860px]">
      <div className="mb-5">
        <h1 className="text-[20px] font-[800] tracking-tight" style={{ color: "var(--b-text)" }}>Safety</h1>
        <p className="text-[12px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>Generate SWMS, toolbox talks and incident reports for your jobs.</p>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          {
            type: "swms" as DrawerType,
            title: "Generate SWMS",
            desc: "AI-drafted Safe Work Method Statement for any task in under 60 seconds.",
            color: YELLOW,
            icon: FileText,
          },
          {
            type: "toolbox" as DrawerType,
            title: "Toolbox Talk",
            desc: "Create a site safety briefing tailored to your trade and today's tasks.",
            color: "var(--b-badge-blue-text)",
            icon: CheckCircle2,
          },
          {
            type: "incident" as DrawerType,
            title: "Report Incident",
            desc: "Log a near miss, injury or property damage quickly on site.",
            color: "#f06060",
            icon: AlertTriangle,
          },
        ].map(({ type, title, desc, color, icon: Icon }) => (
          <button
            key={type}
            onClick={() => { setDrawer(type); setGenerating(false); setGenerated(false); }}
            className="flex flex-col items-start gap-2 border p-4 text-left transition-all"
            style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = color; }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--b-border)"; }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
            <p className="text-[13px] font-[700]" style={{ color: "var(--b-text)" }}>{title}</p>
            <p className="text-[11.5px] leading-relaxed" style={{ color: "var(--b-text-muted)" }}>{desc}</p>
            <span className="text-[11px] font-[700] flex items-center gap-1 mt-auto" style={{ color }}>
              <Zap className="w-3 h-3" /> AI-powered
            </span>
          </button>
        ))}
      </div>

      {/* Recent documents */}
      <div className="border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: "var(--b-border)" }}>
          <span className="text-[12px] font-[700]" style={{ color: "var(--b-text)" }}>Recent Documents</span>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--b-border)" }}>
          {docs.map(d => {
            const st = TYPE_STYLE[d.type] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-muted)" };
            return (
              <div key={d.ref} className="flex items-center gap-3 px-4 py-3">
                <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />
                <span className="font-mono text-[10.5px]" style={{ color: "var(--b-text-muted)" }}>{d.ref}</span>
                <span className="flex-1 text-[12px] font-[500]" style={{ color: "var(--b-text-secondary)" }}>{d.name}</span>
                <span className="text-[10.5px] font-[600] px-1.5 py-px" style={{ background: st.bg, color: st.color }}>{d.type}</span>
                <span className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>{d.date}</span>
                <button style={{ color: "var(--b-text-muted)" }}><Download className="w-3.5 h-3.5" /></button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Drawer ── */}
      {drawer && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="flex flex-col border-l h-full" style={{ width: 420, background: "var(--b-bg)", borderColor: "var(--b-border-strong)" }}>
            <div className="flex items-center gap-3 px-5 py-4 border-b flex-shrink-0" style={{ borderColor: "var(--b-border)" }}>
              <span className="text-[13px] font-[700]" style={{ color: "var(--b-text)" }}>
                {drawer === "swms" ? "Generate SWMS" : drawer === "toolbox" ? "Toolbox Talk" : "Report Incident"}
              </span>
              <button onClick={closeDrawer} className="ml-auto" style={{ color: "var(--b-text-muted)" }}><X className="w-4 h-4" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {/* AI badge */}
              <div className="flex items-center gap-2 px-3 py-2 border-l-2" style={{ borderLeftColor: YELLOW, background: "rgba(255,214,0,0.06)" }}>
                <Zap className="w-3.5 h-3.5 flex-shrink-0" style={{ color: YELLOW }} />
                <span className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
                  Briesa AI will draft this for you using Australian WHS legislation.
                </span>
              </div>

              {/* SWMS form */}
              {drawer === "swms" && (
                <>
                  <div>
                    <label className="block text-[11px] font-[700] uppercase tracking-wide mb-1.5" style={{ color: "var(--b-text-muted)" }}>Task / Activity *</label>
                    <div className="relative">
                      <select
                        className="w-full px-3 h-[36px] border text-[12.5px] outline-none appearance-none"
                        style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }}
                        value={swmsTask} onChange={e => setSwmsTask(e.target.value)}
                      >
                        {SWMS_TEMPLATES.map(t => <option key={t}>{t}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--b-text-muted)" }} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-[700] uppercase tracking-wide mb-1.5" style={{ color: "var(--b-text-muted)" }}>Job Address</label>
                    <input
                      className="w-full px-3 h-[36px] border text-[12.5px] outline-none"
                      style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }}
                      placeholder="e.g. 14 Elm St, Mosman"
                      value={swmsLocation} onChange={e => setSwmsLocation(e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Toolbox form */}
              {drawer === "toolbox" && (
                <div>
                  <label className="block text-[11px] font-[700] uppercase tracking-wide mb-1.5" style={{ color: "var(--b-text-muted)" }}>Safety Topic *</label>
                  <div className="relative">
                    <select
                      className="w-full px-3 h-[36px] border text-[12.5px] outline-none appearance-none"
                      style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }}
                      value={tbxTopic} onChange={e => setTbxTopic(e.target.value)}
                    >
                      {TOOLBOX_TOPICS.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--b-text-muted)" }} />
                  </div>
                </div>
              )}

              {/* Incident form */}
              {drawer === "incident" && (
                <>
                  <div>
                    <label className="block text-[11px] font-[700] uppercase tracking-wide mb-1.5" style={{ color: "var(--b-text-muted)" }}>Incident Type *</label>
                    <div className="relative">
                      <select className="w-full px-3 h-[36px] border text-[12.5px] outline-none appearance-none" style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }} value={incType} onChange={e => setIncType(e.target.value)}>
                        {["Near Miss","First Aid Injury","Medical Treatment Injury","Property Damage","Environmental"].map(t => <option key={t}>{t}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--b-text-muted)" }} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-[700] uppercase tracking-wide mb-1.5" style={{ color: "var(--b-text-muted)" }}>Date of Incident</label>
                    <input type="date" className="w-full px-3 h-[36px] border text-[12.5px] outline-none" style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }} value={incDate} onChange={e => setIncDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-[700] uppercase tracking-wide mb-1.5" style={{ color: "var(--b-text-muted)" }}>Description *</label>
                    <textarea className="w-full px-3 py-2 border text-[12.5px] outline-none resize-none" rows={4} style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)", fontFamily: "inherit", lineHeight: 1.6 }} placeholder="Describe what happened, where, and any injuries or damage…" value={incDesc} onChange={e => setIncDesc(e.target.value)} />
                  </div>
                </>
              )}

              {/* Generated confirmation */}
              {generated && (
                <div className="flex items-center gap-2 px-3 py-2.5 border" style={{ borderColor: "rgba(26,138,74,0.3)", background: "rgba(26,138,74,0.06)" }}>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: GREEN }} />
                  <span className="text-[12px] font-[600]" style={{ color: GREEN }}>Document created and saved to your library.</span>
                </div>
              )}
            </div>

            <div className="px-5 py-4 border-t flex gap-2 flex-shrink-0" style={{ borderColor: "var(--b-border)" }}>
              <button onClick={closeDrawer} className="flex-1 h-9 border text-[12.5px] font-[600]" style={{ borderColor: "var(--b-border-strong)", color: "var(--b-text-muted)" }}>Cancel</button>
              <button
                onClick={() => !generated && generate(drawer)}
                className="flex-1 h-9 text-[12.5px] font-[700] flex items-center justify-center gap-2"
                style={{ background: generated ? GREEN : YELLOW, color: "#0a0a0a" }}
              >
                {generating ? <><Zap className="w-3.5 h-3.5 animate-pulse" /> Generating…</> : generated ? <><CheckCircle2 className="w-3.5 h-3.5" /> Done</> : <><Zap className="w-3.5 h-3.5" /> Generate with AI</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
