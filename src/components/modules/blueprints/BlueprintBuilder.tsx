"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, Check, Loader2, Database, FileText, Cpu, Zap } from "lucide-react";
import { STANDARDS, modelFor, SONNET, fmtAUD } from "@/config/blueprints";
import { useBlueprints, type Blueprint, type DocState } from "./store";
import { StandardChip, CATEGORY_COLOR } from "./shared";
import { BRIESA_SNAPSHOT, briesaCounts } from "@/lib/blueprints/briesaData";
import type { OrgContext, GenerateResult } from "@/lib/blueprints/types";

const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

function defaultOrg(standard: string, withBriesa: boolean): OrgContext {
  return {
    orgName: "Apex Construction Pty Ltd",
    abn: "54 123 456 789",
    industry: "Construction",
    state: "NSW",
    employeeCount: "42",
    sites: ["Site 01 — Parramatta", "Site 02 — Liverpool"],
    scopeDescription:
      standard === "ISO_45001"
        ? "Occupational health & safety management for commercial construction projects across all NSW sites."
        : standard === "ISO_14001"
        ? "Environmental management of construction operations, materials and waste across all sites."
        : "Provision of commercial construction and fit-out services including design coordination and site delivery.",
    existingCertifications: [],
    primaryContact: "Jordan Smith",
    briesaData: withBriesa ? BRIESA_SNAPSHOT : null,
  };
}

export function BlueprintBuilder() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const { blueprints, hydrated, get, update, updateDoc } = useBlueprints();

  if (!hydrated) return <Loading />;

  if (!id) {
    const pending = blueprints.filter((b) => b.status !== "COMPLETE");
    return (
      <div className="p-8 max-w-[1100px]">
        <Header />
        {pending.length === 0 ? (
          <Empty />
        ) : (
          <div className="space-y-2">
            {pending.map((b) => (
              <Link key={b.id} href={`/blueprints/builder?id=${b.id}`} className="flex items-center justify-between border px-4 py-3.5 transition-colors" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
                <div className="flex items-center gap-3"><StandardChip k={b.standard} /><span className="text-[13px]" style={{ color: "var(--b-text)" }}>{STANDARDS[b.standard].name}</span></div>
                <span className="text-[11.5px] px-2 py-0.5" style={{ background: "var(--b-bg-active)", color: "var(--b-text-muted)" }}>{b.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  const bp = get(id);
  if (!bp) return <div className="p-8"><Header /><Empty /></div>;

  return <BuilderForBlueprint key={bp.id} bp={bp} update={update} updateDoc={updateDoc} router={router} />;
}

function BuilderForBlueprint({
  bp, update, updateDoc, router,
}: {
  bp: Blueprint;
  update: (id: string, patch: Partial<Blueprint>) => void;
  updateDoc: (bpId: string, docId: string, patch: Partial<DocState>) => void;
  router: ReturnType<typeof useRouter>;
}) {
  const std = STANDARDS[bp.standard];
  const isOhs = bp.standard === "ISO_45001";
  const [useBriesa, setUseBriesa] = useState(isOhs);
  const [org, setOrg] = useState<OrgContext>(() => bp.org ?? defaultOrg(bp.standard, isOhs));

  // live generation state
  const [genIndex, setGenIndex] = useState(0);
  const [log, setLog] = useState<{ name: string; model: string; ok: boolean }[]>([]);
  const [tokens, setTokens] = useState(0);
  const [cost, setCost] = useState(0);
  const running = useRef(false);

  const phase = bp.status === "GENERATING" ? "generating" : bp.status === "COMPLETE" || bp.status === "REVIEW" ? "done" : "intake";

  function set<K extends keyof OrgContext>(k: K, v: OrgContext[K]) { setOrg((p) => ({ ...p, [k]: v })); }

  function toggleBriesa(v: boolean) {
    setUseBriesa(v);
    setOrg((p) => ({ ...p, briesaData: v ? BRIESA_SNAPSHOT : null }));
  }

  async function startGeneration() {
    const finalOrg: OrgContext = { ...org, briesaData: isOhs && useBriesa ? BRIESA_SNAPSHOT : null };
    update(bp.id, { org: finalOrg, status: "GENERATING" });
    runGeneration(finalOrg);
  }

  async function runGeneration(finalOrg: OrgContext) {
    if (running.current) return;
    running.current = true;
    setGenIndex(0); setLog([]); setTokens(0); setCost(0);
    let tkn = 0; let cst = 0;
    for (let i = 0; i < std.docs.length; i++) {
      const doc = std.docs[i];
      setGenIndex(i);
      updateDoc(bp.id, doc.id, { status: "GENERATING" });
      try {
        const res = await fetch("/api/blueprints/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ standard: bp.standard, docId: doc.id, org: finalOrg }),
        });
        const data = (await res.json()) as GenerateResult;
        tkn += data.tokensUsed; cst += data.costUsd;
        updateDoc(bp.id, doc.id, {
          status: "GENERATED", content: data.content, originalContent: data.content,
          aiModel: data.aiModel, tokensUsed: data.tokensUsed, costUsd: data.costUsd,
        });
        setLog((p) => [{ name: doc.name, model: data.aiModel, ok: true }, ...p]);
      } catch {
        setLog((p) => [{ name: doc.name, model: modelFor(doc), ok: false }, ...p]);
      }
      setTokens(tkn); setCost(cst);
    }
    update(bp.id, { status: "COMPLETE" });
    running.current = false;
    setGenIndex(std.docs.length);
  }

  // Resume if we land on a GENERATING blueprint that isn't actively running
  useEffect(() => {
    if (bp.status === "GENERATING" && !running.current) {
      const finalOrg = bp.org ?? org;
      runGeneration(finalOrg);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bp.status]);

  /* ── DONE ── */
  if (phase === "done") {
    const totalCost = bp.docs.reduce((s, d) => s + d.costUsd, 0);
    return (
      <div className="p-8 max-w-[900px]">
        <Header />
        <div className="border p-8 text-center" style={{ borderColor: "var(--b-accent-border)", background: "var(--b-bg-secondary)" }}>
          <div className="w-12 h-12 mx-auto flex items-center justify-center mb-4" style={{ background: "var(--b-badge-green-bg)" }}>
            <Check className="w-6 h-6" style={{ color: "var(--b-badge-green-text)" }} />
          </div>
          <h2 className="text-[18px] font-bold" style={{ color: "var(--b-text)" }}>{std.code} blueprint generated</h2>
          <p className="text-[13px] mt-1 mb-5" style={{ color: "var(--b-text-muted)" }}>
            {bp.docs.length} audit-ready documents created for {bp.org?.orgName}. Review, edit and export them in the Document Library.
          </p>
          <div className="flex items-center justify-center gap-6 mb-6 text-[12px]" style={{ color: "var(--b-text-muted)" }}>
            <span><strong style={{ color: "var(--b-text)" }}>{bp.docs.length}</strong> documents</span>
            <span><strong style={{ color: "var(--b-text)" }}>{(bp.docs.reduce((s, d) => s + d.tokensUsed, 0) / 1000).toFixed(0)}k</strong> tokens</span>
            <span><strong style={{ color: "var(--b-text)" }}>${totalCost.toFixed(2)}</strong> AI cost</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Link href={`/blueprints/library?id=${bp.id}`} className="b-btn-accent flex items-center gap-2 px-5 h-[40px] text-[13px] font-semibold">
              Open Document Library <ArrowRight className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} />
            </Link>
            <Link href={`/blueprints/gap-analysis?id=${bp.id}`} className="b-btn-ghost flex items-center gap-2 px-4 h-[40px] text-[13px]">
              Run Gap Analysis
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── GENERATING ── */
  if (phase === "generating") {
    const total = std.docs.length;
    const done = bp.docs.filter((d) => d.status === "GENERATED").length;
    const pct = Math.round((done / total) * 100);
    const current = std.docs[Math.min(genIndex, total - 1)];
    return (
      <div className="p-8 max-w-[900px]">
        <Header />
        <div className="border p-6" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
          <div className="flex items-center gap-2 mb-1">
            <StandardChip k={bp.standard} />
            <span className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>· {bp.org?.orgName}</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--b-accent-text)" }} />
            <h2 className="text-[16px] font-bold" style={{ color: "var(--b-text)" }}>
              Generating document {Math.min(done + 1, total)} of {total}…
            </h2>
          </div>

          {/* progress bar */}
          <div className="h-2 mb-2" style={{ background: "var(--b-bg-active)" }}>
            <div className="h-full transition-all" style={{ width: `${pct}%`, background: "var(--b-accent-text)" }} />
          </div>
          <div className="flex items-center justify-between text-[11.5px] mb-5" style={{ color: "var(--b-text-muted)" }}>
            <span>{current && done < total ? `${current.name} · ${modelFor(current) === SONNET ? "Sonnet 4.6" : "Haiku 4.5"}` : "Finalising…"}</span>
            <span>{pct}%</span>
          </div>

          {/* live stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            <Mini icon={FileText} label="Generated" value={`${done}/${total}`} />
            <Mini icon={Zap} label="Tokens" value={tokens > 0 ? `${(tokens / 1000).toFixed(0)}k` : "—"} />
            <Mini icon={Cpu} label="Prompt cache" value="Active" />
          </div>

          {/* live log */}
          <div className="border max-h-[260px] overflow-y-auto" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
            {log.length === 0 && <div className="px-4 py-3 text-[12px]" style={{ color: "var(--b-text-muted)" }}>Warming up the shared org-context cache…</div>}
            {log.map((l, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: "var(--b-border)" }}>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5" style={{ color: l.ok ? "var(--b-badge-green-text)" : "#f06060" }} />
                  <span className="text-[12px]" style={{ color: "var(--b-text-secondary)" }}>{l.name}</span>
                </div>
                <span className="font-mono text-[10px] px-1.5 py-0.5" style={{ background: "var(--b-bg-active)", color: "var(--b-text-muted)" }}>
                  {l.model.includes("sonnet") ? "Sonnet 4.6" : "Haiku 4.5"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── INTAKE ── */
  const bc = briesaCounts();
  return (
    <div className="p-8 max-w-[860px]">
      <Header />
      <div className="flex items-center gap-2 mb-1"><StandardChip k={bp.standard} size={13} /></div>
      <h1 className="text-[22px] font-bold tracking-tight" style={{ color: "var(--b-text)" }}>{std.name} — Intake</h1>
      <p className="text-[13px] mt-1 mb-6" style={{ color: "var(--b-text-muted)" }}>
        Tell us about your organisation. We&apos;ll tailor all {std.docs.length} documents to your scope, sites and data.
      </p>

      {/* Briesa pre-fill — hero feature for ISO 45001 */}
      {isOhs && (
        <div className="border mb-6 overflow-hidden" style={{ borderColor: useBriesa ? "var(--b-accent-border)" : "var(--b-border)" }}>
          <div className="flex items-start gap-3 p-4" style={{ background: useBriesa ? "var(--b-accent-bg)" : "var(--b-bg-secondary)" }}>
            <Database className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--b-accent-text)" }} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] font-bold" style={{ color: "var(--b-text)" }}>Pull from my Briesa data</span>
                <button
                  onClick={() => toggleBriesa(!useBriesa)}
                  className="relative w-10 h-[22px] transition-colors flex-shrink-0"
                  style={{ background: useBriesa ? "var(--b-accent-text)" : "var(--b-bg-active)" }}
                  aria-pressed={useBriesa}
                >
                  <span className="absolute top-[3px] w-4 h-4 transition-all" style={{ left: useBriesa ? "21px" : "3px", background: "#0a0a0a" }} />
                </button>
              </div>
              <p className="text-[12px] mt-1" style={{ color: "var(--b-text-secondary)" }}>
                We&apos;ll pre-populate your ISO 45001 system from the WHS data you already keep in Briesa — no re-entry.
              </p>
              {useBriesa && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    [`${bc.hazards} hazards`], [`${bc.riskAssessments} risk assessments`], [`${bc.incidents} incidents (12mo)`],
                    [`${bc.contractors} contractors`], [`${bc.training} training programs`],
                  ].map(([label]) => (
                    <span key={label} className="inline-flex items-center gap-1 text-[10.5px] font-medium px-2 py-1" style={{ background: "var(--b-bg)", color: "var(--b-accent-text)" }}>
                      <Check className="w-3 h-3" /> {label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Organisation name"><Input v={org.orgName} on={(v) => set("orgName", v)} /></Field>
          <Field label="ABN"><Input v={org.abn} on={(v) => set("abn", v)} /></Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Industry"><Input v={org.industry} on={(v) => set("industry", v)} /></Field>
          <Field label="State">
            <select value={org.state} onChange={(e) => set("state", e.target.value)} className="w-full h-10 px-3 text-[13px] border outline-none" style={inputStyle}>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Employees"><Input v={org.employeeCount} on={(v) => set("employeeCount", v)} /></Field>
        </div>
        <Field label="Sites (comma separated)">
          <Input v={org.sites.join(", ")} on={(v) => set("sites", v.split(",").map((x) => x.trim()).filter(Boolean))} />
        </Field>
        <Field label="Scope description">
          <textarea value={org.scopeDescription} onChange={(e) => set("scopeDescription", e.target.value)} rows={3} className="w-full px-3 py-2.5 text-[13px] border outline-none resize-none" style={inputStyle} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Existing certifications (comma separated)">
            <Input v={org.existingCertifications.join(", ")} on={(v) => set("existingCertifications", v.split(",").map((x) => x.trim()).filter(Boolean))} placeholder="e.g. ISO 9001" />
          </Field>
          <Field label="Primary contact"><Input v={org.primaryContact} on={(v) => set("primaryContact", v)} /></Field>
        </div>
      </div>

      {/* Document preview */}
      <div className="mt-6 border" style={{ borderColor: "var(--b-border)" }}>
        <div className="px-4 py-2.5 border-b flex items-center justify-between" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
          <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--b-text-muted)" }}>{std.docs.length} documents will be generated</span>
          <span className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>{std.docs.filter((d) => d.complex).length} complex · Sonnet 4.6</span>
        </div>
        <div className="max-h-[200px] overflow-y-auto p-3 grid grid-cols-2 gap-1.5">
          {std.docs.map((d) => (
            <div key={d.id} className="flex items-center gap-2 text-[11.5px] px-2 py-1">
              <span className="font-mono text-[9px] px-1 py-0.5 flex-shrink-0" style={{ background: CATEGORY_COLOR[d.category].bg, color: CATEGORY_COLOR[d.category].color }}>{d.clauseRef}</span>
              <span className="truncate" style={{ color: "var(--b-text-secondary)" }}>{d.name}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={startGeneration} className="b-btn-accent flex items-center justify-center gap-2 w-full h-[46px] text-[14px] font-semibold mt-6">
        <Sparkles className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} />
        Generate {std.docs.length} Documents
      </button>
    </div>
  );
}

/* ── bits ── */
function Header() {
  return (
    <Link href="/blueprints" className="b-icon-btn inline-flex items-center gap-1.5 text-[12px] mb-6">
      <ArrowLeft className="w-3.5 h-3.5" /> Blueprints
    </Link>
  );
}
function Loading() { return <div className="p-8 text-[13px]" style={{ color: "var(--b-text-muted)" }}>Loading…</div>; }
function Empty() {
  return (
    <div className="border border-dashed p-12 text-center" style={{ borderColor: "var(--b-border)" }}>
      <p className="text-[13.5px] font-medium" style={{ color: "var(--b-text-tertiary)" }}>No blueprint selected</p>
      <p className="text-[12px] mt-1 mb-4" style={{ color: "var(--b-text-muted)" }}>Purchase a blueprint from the store to start building.</p>
      <Link href="/blueprints/store" className="b-btn-accent inline-flex items-center gap-2 px-4 h-[36px] text-[13px] font-semibold">Browse Blueprint Store</Link>
    </div>
  );
}
function Mini({ icon: Icon, label, value }: { icon: typeof FileText; label: string; value: string }) {
  return (
    <div className="border p-3" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
      <Icon className="w-3.5 h-3.5 mb-1.5" style={{ color: "var(--b-text-muted)" }} />
      <div className="text-[15px] font-bold" style={{ color: "var(--b-text)" }}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--b-text-muted)" }}>{label}</div>
    </div>
  );
}
const inputStyle: React.CSSProperties = { background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" };
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--b-text-muted)" }}>{label}</label>
      {children}
    </div>
  );
}
function Input({ v, on, placeholder }: { v: string; on: (v: string) => void; placeholder?: string }) {
  return <input value={v} onChange={(e) => on(e.target.value)} placeholder={placeholder} className="w-full h-10 px-3 text-[13px] border outline-none" style={inputStyle} />;
}
