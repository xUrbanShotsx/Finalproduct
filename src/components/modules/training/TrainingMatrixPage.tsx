"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, Clock, Minus, Sparkles, Loader2 } from "lucide-react";
import { PageShell, Stat } from "../shared";

type CellStatus = "Current" | "Expiring" | "Expired" | "Missing";

interface Worker { name: string; role: string }
interface Competency { id: string; name: string; required: boolean }

const WORKERS: Worker[] = [
  { name: "J. Smith",   role: "Rigger"              },
  { name: "M. Jones",   role: "Site Supervisor"      },
  { name: "K. Davis",   role: "First Aid Officer"    },
  { name: "L. Brown",   role: "Traffic Controller"   },
  { name: "T. Walsh",   role: "Formwork Carpenter"   },
  { name: "A. Chen",    role: "Apprentice"           },
  { name: "R. Patel",   role: "Confined Space Tech"  },
  { name: "S. Nguyen",  role: "Emergency Warden"     },
];

const COMPETENCIES: Competency[] = [
  { id: "wah",   name: "Working at Heights",  required: true  },
  { id: "wc",    name: "White Card",          required: true  },
  { id: "fa",    name: "First Aid",           required: false },
  { id: "tm",    name: "Traffic Mgmt",        required: false },
  { id: "asb",   name: "Asbestos Aware",      required: true  },
  { id: "mh",    name: "Manual Handling",     required: true  },
  { id: "cs",    name: "Confined Space",      required: false },
  { id: "ew",    name: "Emer. Warden",        required: false },
];

// Matrix data [workerIdx][compIdx]
const MATRIX: CellStatus[][] = [
  // J. Smith
  ["Current",  "Current",  "Missing",  "Missing",  "Current",  "Current",  "Missing",  "Missing" ],
  // M. Jones
  ["Missing",  "Current",  "Expired",  "Missing",  "Current",  "Current",  "Missing",  "Missing" ],
  // K. Davis
  ["Missing",  "Current",  "Current",  "Missing",  "Current",  "Current",  "Missing",  "Missing" ],
  // L. Brown
  ["Missing",  "Current",  "Missing",  "Current",  "Current",  "Current",  "Missing",  "Missing" ],
  // T. Walsh
  ["Expiring", "Current",  "Missing",  "Missing",  "Current",  "Current",  "Missing",  "Missing" ],
  // A. Chen
  ["Missing",  "Current",  "Missing",  "Missing",  "Missing",  "Expiring", "Missing",  "Missing" ],
  // R. Patel
  ["Missing",  "Current",  "Missing",  "Missing",  "Current",  "Current",  "Current",  "Missing" ],
  // S. Nguyen
  ["Missing",  "Current",  "Missing",  "Missing",  "Current",  "Current",  "Missing",  "Current" ],
];

const STATUS_STYLE: Record<CellStatus, { bg: string; border: string; icon: React.ReactNode }> = {
  Current:  {
    bg: "var(--b-badge-green-bg)",
    border: "var(--b-badge-green-text)",
    icon: <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--b-badge-green-text)" }} />,
  },
  Expiring: {
    bg: "var(--b-badge-yellow-bg)",
    border: "var(--b-badge-yellow-text)",
    icon: <Clock className="w-3.5 h-3.5" style={{ color: "var(--b-badge-yellow-text)" }} />,
  },
  Expired: {
    bg: "rgba(240,96,96,0.12)",
    border: "#f06060",
    icon: <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#f06060" }} />,
  },
  Missing: {
    bg: "var(--b-bg-secondary)",
    border: "var(--b-border)",
    icon: <Minus className="w-3 h-3" style={{ color: "var(--b-text-muted)" }} />,
  },
};

function complianceScore(workerIdx: number): { score: number; label: "Compliant" | "Partial" | "Non-Compliant" } {
  const required = COMPETENCIES.filter(c => c.required);
  const statuses = required.map((c, ci) => {
    const fullIdx = COMPETENCIES.indexOf(c);
    return MATRIX[workerIdx][fullIdx];
  });
  const passing = statuses.filter(s => s === "Current" || s === "Expiring").length;
  const score = Math.round((passing / required.length) * 100);
  if (score === 100) return { score, label: "Compliant" };
  if (score >= 50)   return { score, label: "Partial" };
  return { score, label: "Non-Compliant" };
}

export function TrainingMatrixPage() {
  const [aiSummary, setAiSummary] = useState<Record<number, string>>({});
  const [aiLoading, setAiLoading] = useState<Record<number, boolean>>({});

  async function generateSummary(workerIdx: number) {
    const w = WORKERS[workerIdx];
    const statuses = COMPETENCIES.map((c, ci) => `${c.name}: ${MATRIX[workerIdx][ci]}`).join(", ");
    const prompt = `You are a WHS training coordinator. Write a 2-3 sentence compliance summary for ${w.name} (${w.role}):
Competency statuses: ${statuses}
Highlight what's missing or expiring and any recommended actions. Plain text, no bullet points.`;

    setAiLoading(prev => ({ ...prev, [workerIdx]: true }));
    setAiSummary(prev => ({ ...prev, [workerIdx]: "" }));

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok || !res.body) throw new Error();
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setAiSummary(prev => ({ ...prev, [workerIdx]: (prev[workerIdx] ?? "") + chunk }));
      }
    } catch {
      setAiSummary(prev => ({ ...prev, [workerIdx]: "Error generating summary." }));
    } finally {
      setAiLoading(prev => ({ ...prev, [workerIdx]: false }));
    }
  }

  const [tab, setTab] = useState("");
  const fullCount    = WORKERS.filter((_, i) => complianceScore(i).label === "Compliant").length;
  const partialCount = WORKERS.filter((_, i) => complianceScore(i).label === "Partial").length;
  const nonCount     = WORKERS.filter((_, i) => complianceScore(i).label === "Non-Compliant").length;

  return (
    <PageShell
      back={{ href: "/training", label: "Training" }}
      title="Training Matrix"
      description="At-a-glance view of each worker's competency currency across required training."
      cta=""
      stats={
        <>
          <Stat label="Fully Compliant"    value={`${fullCount}`}    sub="all required current"   highlight="green"  />
          <Stat label="Partial"            value={`${partialCount}`} sub="some gaps or expiring"  highlight="yellow" />
          <Stat label="Non-Compliant"      value={`${nonCount}`}     sub="missing required certs" highlight="red"    />
          <Stat label="Workers Tracked"    value={`${WORKERS.length}`} sub="on this matrix"                          />
        </>
      }
      tabs={["All Workers", "Compliant", "Partial", "Non-Compliant"]}
      onTabChange={setTab}
    >
      <div className="p-6 overflow-x-auto">

        {/* Legend */}
        <div className="flex items-center gap-4 mb-4">
          {(["Current","Expiring","Expired","Missing"] as CellStatus[]).map(s => (
            <div key={s} className="flex items-center gap-1.5">
              <div className="w-5 h-5 flex items-center justify-center border" style={{ background: STATUS_STYLE[s].bg, borderColor: STATUS_STYLE[s].border }}>
                {STATUS_STYLE[s].icon}
              </div>
              <span className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>{s}</span>
            </div>
          ))}
          <div className="flex items-center gap-1 ml-4">
            <div className="w-2 h-2 rounded-full" style={{ background: "var(--b-badge-blue-text)" }} />
            <span className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>Required</span>
          </div>
        </div>

        <div className="border overflow-hidden" style={{ borderColor: "var(--b-border)" }}>
          {/* Column headers */}
          <div className="flex border-b" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
            <div className="w-52 flex-shrink-0 px-4 py-2.5 border-r" style={{ borderColor: "var(--b-border)" }}>
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--b-text-muted)" }}>Worker</span>
            </div>
            {COMPETENCIES.map(c => (
              <div key={c.id} className="flex-1 min-w-[90px] px-2 py-2.5 text-center border-r last:border-r-0" style={{ borderColor: "var(--b-border)" }}>
                <div className="text-[10px] font-semibold leading-tight" style={{ color: c.required ? "var(--b-badge-blue-text)" : "var(--b-text-muted)" }}>
                  {c.name}
                </div>
              </div>
            ))}
            <div className="w-28 flex-shrink-0 px-2 py-2.5 text-center border-l" style={{ borderColor: "var(--b-border)" }}>
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--b-text-muted)" }}>Score</span>
            </div>
            <div className="w-24 flex-shrink-0 px-2 py-2.5 text-center border-l" style={{ borderColor: "var(--b-border)" }}>
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--b-text-muted)" }}>AI</span>
            </div>
          </div>

          {/* Worker rows */}
          {WORKERS.map((w, wi) => {
            const { score, label } = complianceScore(wi);
            if (tab && tab !== "All Workers" && label !== tab) return null;
            const scoreColor = label === "Compliant" ? "var(--b-badge-green-text)" : label === "Partial" ? "var(--b-badge-yellow-text)" : "#f06060";
            return (
              <div key={w.name}>
                <div
                  className="flex border-b transition-colors"
                  style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--b-bg-hover)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--b-bg)"}
                >
                  {/* Worker name */}
                  <div className="w-52 flex-shrink-0 px-4 py-3 border-r" style={{ borderColor: "var(--b-border)" }}>
                    <div className="text-[12.5px] font-semibold" style={{ color: "var(--b-text)" }}>{w.name}</div>
                    <div className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>{w.role}</div>
                  </div>

                  {/* Cells */}
                  {MATRIX[wi].map((cellStatus, ci) => {
                    const s = STATUS_STYLE[cellStatus];
                    return (
                      <div key={ci} className="flex-1 min-w-[90px] px-2 py-3 border-r last:border-r-0 flex items-center justify-center" style={{ borderColor: "var(--b-border)" }}>
                        <div
                          title={cellStatus}
                          className="w-7 h-7 flex items-center justify-center border"
                          style={{ background: s.bg, borderColor: s.border }}
                        >
                          {s.icon}
                        </div>
                      </div>
                    );
                  })}

                  {/* Score */}
                  <div className="w-28 flex-shrink-0 px-2 py-3 flex flex-col items-center justify-center border-l" style={{ borderColor: "var(--b-border)" }}>
                    <div className="text-[14px] font-bold" style={{ color: scoreColor }}>{score}%</div>
                    <div className="text-[9.5px] font-semibold" style={{ color: scoreColor }}>{label}</div>
                  </div>

                  {/* AI summary button */}
                  <div className="w-24 flex-shrink-0 px-2 py-3 flex items-center justify-center border-l" style={{ borderColor: "var(--b-border)" }}>
                    <button
                      onClick={() => generateSummary(wi)}
                      disabled={aiLoading[wi]}
                      className="flex items-center gap-1 px-2 h-[26px] text-[11px] font-medium border transition-colors disabled:opacity-50"
                      style={{ background: "var(--b-accent-bg)", borderColor: "var(--b-accent-border)", color: "var(--b-accent-text)" }}
                    >
                      {aiLoading[wi] ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      {aiLoading[wi] ? "…" : "AI"}
                    </button>
                  </div>
                </div>

                {/* AI summary expansion */}
                {aiSummary[wi] && (
                  <div className="px-6 py-2.5 border-b" style={{ borderColor: "var(--b-border)", background: "var(--b-accent-bg)" }}>
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: "var(--b-accent-text)" }} />
                      <p className="text-[12px] leading-relaxed" style={{ color: "var(--b-text-secondary)" }}>{aiSummary[wi]}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
