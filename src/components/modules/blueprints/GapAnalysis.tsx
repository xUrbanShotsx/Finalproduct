"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Sparkles, Loader2, Plus, Check, ShieldAlert, ShieldCheck } from "lucide-react";
import { STANDARDS } from "@/config/blueprints";
import { useBlueprints, type Blueprint } from "./store";
import { StandardChip } from "./shared";
import type { GapReport, GapFinding } from "@/lib/blueprints/types";
import { addExtraAction } from "@/lib/safetyActions";

const STATUS_STYLE: Record<GapFinding["status"], { bg: string; color: string }> = {
  Conformant: { bg: "var(--b-badge-green-bg)", color: "var(--b-badge-green-text)" },
  Partial: { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  Gap: { bg: "rgba(240,96,96,0.1)", color: "#f06060" },
};
const SEV_COLOR: Record<string, string> = { Critical: "#f06060", Major: "var(--b-badge-yellow-text)", Minor: "var(--b-text-muted)" };

export function GapAnalysis() {
  const params = useSearchParams();
  const idParam = params.get("id");
  const { blueprints, hydrated, update } = useBlueprints();
  const completed = useMemo(() => blueprints.filter((b) => b.docs.some((d) => d.content)), [blueprints]);
  const [activeId, setActiveId] = useState<string | null>(idParam);
  const active = completed.find((b) => b.id === (activeId ?? idParam)) ?? completed[0];

  if (!hydrated) return <div className="p-8 text-[13px]" style={{ color: "var(--b-text-muted)" }}>Loading…</div>;

  if (completed.length === 0) {
    return (
      <div className="p-8 max-w-[1100px]">
        <Back />
        <div className="border border-dashed p-12 text-center" style={{ borderColor: "var(--b-border)" }}>
          <ShieldAlert className="w-6 h-6 mx-auto mb-3" style={{ color: "var(--b-text-muted)" }} />
          <p className="text-[13.5px] font-medium" style={{ color: "var(--b-text-tertiary)" }}>Nothing to analyse yet</p>
          <p className="text-[12px] mt-1 mb-4" style={{ color: "var(--b-text-muted)" }}>Generate a blueprint, then run a compliance gap analysis.</p>
          <Link href="/blueprints/store" className="b-btn-accent inline-flex items-center gap-2 px-4 h-[36px] text-[13px] font-semibold">Browse Blueprint Store</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1100px]">
      <Back />
      {completed.length > 1 && (
        <div className="flex items-center gap-2 mb-4">
          {completed.map((b) => (
            <button key={b.id} onClick={() => setActiveId(b.id)} className="px-3 py-1.5 border text-[12px]" style={{ borderColor: active?.id === b.id ? "var(--b-accent-border)" : "var(--b-border)", background: active?.id === b.id ? "var(--b-accent-bg)" : "transparent" }}>{STANDARDS[b.standard].code}</button>
          ))}
        </div>
      )}
      {active && <GapView key={active.id} bp={active} save={(gap) => update(active.id, { gap })} />}
    </div>
  );
}

function GapView({ bp, save }: { bp: Blueprint; save: (g: GapReport) => void }) {
  const std = STANDARDS[bp.standard];
  const [running, setRunning] = useState(false);
  const [created, setCreated] = useState<Set<string>>(new Set());
  const report = bp.gap;

  async function run() {
    setRunning(true);
    try {
      const res = await fetch("/api/blueprints/gap-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ standard: bp.standard, org: bp.org, docTitles: bp.docs.filter((d) => d.content).map((d) => d.name) }),
      });
      const data = (await res.json()) as GapReport;
      save(data);
    } finally {
      setRunning(false);
    }
  }

  function createAction(title: string, detail: string, clauseRef: string, severity: string) {
    const ref = `ACT-${Math.floor(100 + Math.random() * 800)}`;
    addExtraAction({
      ref,
      source: "Audit",
      sourceRef: `${std.code} ${clauseRef}`,
      description: `${title} — ${detail}`,
      site: bp.org?.sites?.[0] ?? "All Sites",
      assignee: bp.org?.primaryContact ?? "Unassigned",
      due: new Date(Date.now() + 14 * 864e5).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" }),
      priority: severity === "Critical" ? "High" : severity === "Major" ? "Medium" : "Low",
      status: "Open",
    });
    setCreated((p) => new Set(p).add(title));
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-1"><StandardChip k={bp.standard} size={13} /></div>
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight" style={{ color: "var(--b-text)" }}>Gap Analysis</h1>
          <p className="text-[12.5px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>AI compliance scoring for {bp.org?.orgName} against {std.code}.</p>
        </div>
        <button onClick={run} disabled={running} className="b-btn-accent flex items-center gap-2 px-4 h-[38px] text-[13px] font-semibold disabled:opacity-50">
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} />}
          {report ? "Re-run analysis" : "Run Gap Analysis"}
        </button>
      </div>

      {!report && !running && (
        <div className="border border-dashed p-12 text-center" style={{ borderColor: "var(--b-border)" }}>
          <ShieldCheck className="w-7 h-7 mx-auto mb-3" style={{ color: "var(--b-accent-text)" }} />
          <p className="text-[13.5px] font-medium" style={{ color: "var(--b-text-secondary)" }}>Ready to assess certification readiness</p>
          <p className="text-[12px] mt-1" style={{ color: "var(--b-text-muted)" }}>Claude Sonnet 4.6 reviews your {bp.docs.filter((d) => d.content).length} documents{bp.org?.briesaData ? " plus your live Briesa data" : ""} and scores you clause-by-clause.</p>
        </div>
      )}

      {running && !report && (
        <div className="border p-12 text-center" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
          <Loader2 className="w-7 h-7 mx-auto mb-3 animate-spin" style={{ color: "var(--b-accent-text)" }} />
          <p className="text-[13px]" style={{ color: "var(--b-text-secondary)" }}>Auditing documents against {std.code} clauses…</p>
        </div>
      )}

      {report && (
        <div className="space-y-5">
          {/* Score */}
          <div className="grid gap-5" style={{ gridTemplateColumns: "260px 1fr" }}>
            <div className="border p-5 flex flex-col items-center justify-center text-center" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
              <ScoreRing score={report.score} />
              <div className="text-[11px] uppercase tracking-widest mt-3" style={{ color: "var(--b-text-muted)" }}>Readiness Score</div>
            </div>
            <div className="border p-5" style={{ borderColor: "var(--b-border)" }}>
              <div className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--b-text-muted)" }}>Summary</div>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--b-text-secondary)" }}>{report.summary}</p>
              <div className="flex gap-4 mt-4 text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
                <span><strong style={{ color: "var(--b-badge-green-text)" }}>{report.findings.filter((f) => f.status === "Conformant").length}</strong> conformant</span>
                <span><strong style={{ color: "var(--b-badge-yellow-text)" }}>{report.findings.filter((f) => f.status === "Partial").length}</strong> partial</span>
                <span><strong style={{ color: "#f06060" }}>{report.findings.filter((f) => f.status === "Gap").length}</strong> gaps</span>
              </div>
            </div>
          </div>

          {/* Critical gaps */}
          <div>
            <h2 className="text-[13px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--b-text)" }}>Prioritised Critical Gaps</h2>
            <div className="space-y-2">
              {report.criticalGaps.map((g) => {
                const done = created.has(g.title);
                return (
                  <div key={g.title} className="border p-4 flex items-start justify-between gap-4" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="w-1.5 h-1.5 mt-2 flex-shrink-0" style={{ background: SEV_COLOR[g.severity] }} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>{g.title}</span>
                          <span className="font-mono text-[10px] px-1.5 py-0.5" style={{ background: "var(--b-bg-active)", color: "var(--b-text-muted)" }}>{g.clauseRef}</span>
                          <span className="text-[10px] font-semibold" style={{ color: SEV_COLOR[g.severity] }}>{g.severity}</span>
                        </div>
                        <p className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>{g.detail}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => createAction(g.title, g.detail, g.clauseRef, g.severity)}
                      disabled={done}
                      className="flex items-center gap-1.5 px-3 h-[32px] text-[12px] font-semibold flex-shrink-0 border transition-colors"
                      style={done
                        ? { borderColor: "var(--b-badge-green-text)", color: "var(--b-badge-green-text)", background: "var(--b-badge-green-bg)" }
                        : { borderColor: "var(--b-accent-border)", color: "var(--b-accent-text)", background: "var(--b-accent-bg)" }}
                    >
                      {done ? <><Check className="w-3.5 h-3.5" /> Action created</> : <><Plus className="w-3.5 h-3.5" /> Create Action</>}
                    </button>
                  </div>
                );
              })}
            </div>
            {created.size > 0 && (
              <p className="text-[11.5px] mt-2" style={{ color: "var(--b-text-muted)" }}>
                {created.size} action{created.size > 1 ? "s" : ""} created in <Link href="/safety/actions" className="underline" style={{ color: "var(--b-accent-text)" }}>Safety → Actions</Link>.
              </p>
            )}
          </div>

          {/* Clause findings */}
          <div>
            <h2 className="text-[13px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--b-text)" }}>Clause-by-Clause Findings</h2>
            <div className="border" style={{ borderColor: "var(--b-border)" }}>
              {report.findings.map((f, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0" style={{ borderColor: "var(--b-border)" }}>
                  <span className="font-mono text-[11px] w-10 flex-shrink-0" style={{ color: "var(--b-text-muted)" }}>{f.clauseRef}</span>
                  <span className="text-[12.5px] w-48 flex-shrink-0 truncate" style={{ color: "var(--b-text)" }}>{f.area}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 flex-shrink-0" style={{ background: STATUS_STYLE[f.status].bg, color: STATUS_STYLE[f.status].color }}>{f.status}</span>
                  <span className="text-[12px] flex-1" style={{ color: "var(--b-text-muted)" }}>{f.finding}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "var(--b-badge-green-text)" : score >= 60 ? "var(--b-badge-yellow-text)" : "#f06060";
  const r = 46; const c = 2 * Math.PI * r; const off = c - (score / 100) * c;
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--b-bg-active)" strokeWidth="10" />
      <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 60 60)" />
      <text x="60" y="58" textAnchor="middle" fontSize="30" fontWeight="800" fill="var(--b-text)">{score}</text>
      <text x="60" y="76" textAnchor="middle" fontSize="11" fill="var(--b-text-muted)">/ 100</text>
    </svg>
  );
}

function Back() {
  return <Link href="/blueprints" className="b-icon-btn inline-flex items-center gap-1.5 text-[12px] mb-6"><ArrowLeft className="w-3.5 h-3.5" /> Blueprints</Link>;
}
