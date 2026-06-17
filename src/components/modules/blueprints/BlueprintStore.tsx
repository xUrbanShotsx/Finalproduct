"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Sparkles, FileText, ShieldCheck } from "lucide-react";
import { ALL_STANDARDS, STANDARDS, priceFor, bundleLabel, docCount, fmtAUD, type ISOStandard } from "@/config/blueprints";
import { useBlueprints } from "./store";
import { briesaCounts } from "@/lib/blueprints/briesaData";

export function BlueprintStore() {
  const router = useRouter();
  const { addBlueprints } = useBlueprints();
  const [selected, setSelected] = useState<Set<ISOStandard>>(new Set());

  function toggle(k: ISOStandard) {
    setSelected((p) => { const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); return n; });
  }

  const count = selected.size;
  const price = priceFor(count);
  const totalDocs = [...selected].reduce((s, k) => s + docCount(k), 0);
  const bc = briesaCounts();
  const briesaTotal = bc.hazards + bc.riskAssessments + bc.incidents + bc.contractors + bc.training;

  function purchase() {
    if (count === 0) return;
    const created = addBlueprints([...selected]);
    // Go straight into the builder for the first purchased blueprint.
    router.push(`/blueprints/builder?id=${created[0].id}`);
  }

  return (
    <div className="p-8 max-w-[1100px]">
      <Link href="/blueprints" className="b-icon-btn inline-flex items-center gap-1.5 text-[12px] mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Blueprints
      </Link>

      <div className="flex items-center gap-2 mb-2">
        <span className="font-mono text-[11px] font-bold tracking-widest uppercase" style={{ color: "var(--b-text-muted)" }}>[ ISO MANAGEMENT SYSTEMS ]</span>
      </div>
      <h1 className="text-[26px] font-bold tracking-tight" style={{ color: "var(--b-text)" }}>Blueprint Store</h1>
      <p className="text-[13.5px] mt-1 mb-7" style={{ color: "var(--b-text-muted)" }}>
        AI-generated, audit-ready ISO document packs. One-off purchase — own the documents, certify with confidence.
      </p>

      {/* Standard cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {ALL_STANDARDS.map((k) => {
          const s = STANDARDS[k];
          const sel = selected.has(k);
          const isOhs = k === "ISO_45001";
          return (
            <button
              key={k}
              onClick={() => toggle(k)}
              className="text-left border p-5 transition-all relative"
              style={{
                background: sel ? "var(--b-bg-secondary)" : "var(--b-bg)",
                borderColor: sel ? s.color : "var(--b-border)",
                boxShadow: sel ? `inset 0 0 0 1px ${s.color}` : "none",
              }}
            >
              <div className="h-[3px] -mx-5 -mt-5 mb-4" style={{ background: sel ? s.color : "transparent" }} />
              <div className="flex items-start justify-between mb-3">
                <div className="font-mono text-[12px] font-bold tracking-wide" style={{ color: s.color }}>{s.code}<span style={{ color: "var(--b-text-muted)" }}>{s.year}</span></div>
                <div className="w-5 h-5 flex items-center justify-center border" style={{ borderColor: sel ? s.color : "var(--b-border-strong)", background: sel ? s.color : "transparent" }}>
                  {sel && <Check className="w-3 h-3" style={{ color: "#0a0a0a" }} />}
                </div>
              </div>
              <div className="text-[15px] font-bold mb-1" style={{ color: "var(--b-text)" }}>{s.name}</div>
              <p className="text-[12px] leading-relaxed mb-4" style={{ color: "var(--b-text-muted)" }}>{s.tagline}</p>
              <div className="flex items-center gap-1.5 text-[11.5px]" style={{ color: "var(--b-text-tertiary)" }}>
                <FileText className="w-3.5 h-3.5" /> {docCount(k)} documents
              </div>
              {isOhs && (
                <div className="mt-3 flex items-center gap-1.5 px-2 py-1.5 text-[10.5px] font-medium" style={{ background: "var(--b-accent-bg)", color: "var(--b-accent-text)" }}>
                  <Sparkles className="w-3 h-3" /> Pre-fills from your Briesa data
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Pricing bar */}
      <div className="border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
        <div className="grid grid-cols-3 divide-x" style={{ borderColor: "var(--b-border)" }}>
          {[1, 2, 3].map((n) => {
            const active = count === n;
            return (
              <div key={n} className="p-4 text-center" style={{ borderColor: "var(--b-border)", background: active ? "var(--b-bg-active)" : "transparent" }}>
                <div className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: active ? "var(--b-text)" : "var(--b-text-muted)" }}>{bundleLabel(n)}</div>
                <div className="text-[22px] font-bold" style={{ color: active ? "var(--b-text)" : "var(--b-text-tertiary)" }}>{fmtAUD(priceFor(n))}</div>
                <div className="text-[10.5px]" style={{ color: "var(--b-text-muted)" }}>{n} standard{n > 1 ? "s" : ""} · AUD</div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t" style={{ borderColor: "var(--b-border)" }}>
          <div>
            <div className="text-[13px]" style={{ color: "var(--b-text-secondary)" }}>
              {count === 0 ? "Select one or more standards above" : `${bundleLabel(count)} — ${totalDocs} documents`}
            </div>
            {count > 0 && (
              <div className="text-[11.5px] mt-0.5 flex items-center gap-1.5" style={{ color: "var(--b-text-muted)" }}>
                <Sparkles className="w-3 h-3" style={{ color: "var(--b-accent-text)" }} />
                AI-generated · audit-ready · editable · export to PDF & Word
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            {count > 0 && <div className="text-[24px] font-bold" style={{ color: "var(--b-text)" }}>{fmtAUD(price)}</div>}
            <button
              onClick={purchase}
              disabled={count === 0}
              className="b-btn-accent flex items-center gap-2 px-5 h-[42px] text-[13px] font-semibold disabled:opacity-40"
            >
              Get Blueprint <ArrowRight className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} />
            </button>
          </div>
        </div>
      </div>

      {/* Trust row */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[
          { icon: ShieldCheck, t: "Audit-ready", d: "Mapped to the exact ISO clauses certifiers check." },
          { icon: Sparkles, t: "AI-generated for you", d: "Tailored to your org, sites, scope and real WHS data." },
          { icon: FileText, t: `${briesaTotal}+ data points reused`, d: "ISO 45001 pre-fills from your existing Briesa records." },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="border p-4" style={{ borderColor: "var(--b-border)" }}>
            <Icon className="w-4 h-4 mb-2" style={{ color: "var(--b-accent-text)" }} />
            <div className="text-[12.5px] font-semibold" style={{ color: "var(--b-text)" }}>{t}</div>
            <div className="text-[11.5px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>{d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
