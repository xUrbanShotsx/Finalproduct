"use client";

import Link from "next/link";
import { Store, Wand2, Library, ShieldCheck, RefreshCw, ArrowRight, Sparkles, FileText } from "lucide-react";
import { STANDARDS } from "@/config/blueprints";
import { useBlueprints } from "./store";
import { StandardChip } from "./shared";

const SUBMODULES = [
  { id: "store", icon: Store, name: "Blueprint Store", desc: "Browse ISO standards, bundles and pricing." },
  { id: "builder", icon: Wand2, name: "Blueprint Builder", desc: "AI generation wizard with Briesa pre-fill." },
  { id: "library", icon: Library, name: "Document Library", desc: "View, edit and export generated documents." },
  { id: "gap-analysis", icon: ShieldCheck, name: "Gap Analysis", desc: "AI compliance scoring and critical gaps." },
  { id: "renewals", icon: RefreshCw, name: "Renewal & Updates", desc: "Annual refresh to stay audit-ready." },
];

export function BlueprintOverview() {
  const { blueprints, hydrated } = useBlueprints();

  return (
    <div className="p-8 max-w-[1100px]">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-mono text-[11px] font-bold tracking-widest uppercase" style={{ color: "var(--b-text-muted)" }}>[ BLUEPRINTS ]</span>
      </div>
      <h1 className="text-[26px] font-bold tracking-tight" style={{ color: "var(--b-text)" }}>ISO Management Systems</h1>
      <p className="text-[13.5px] mt-1 mb-7 max-w-[640px]" style={{ color: "var(--b-text-muted)" }}>
        Buy AI-generated, audit-ready document packs for ISO 9001, 14001 and 45001 — tailored to your organisation and pre-filled from your live Briesa data.
      </p>

      {/* Owned blueprints */}
      {hydrated && blueprints.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--b-text-muted)" }}>Your Blueprints</h2>
          <div className="space-y-2">
            {blueprints.map((b) => {
              const std = STANDARDS[b.standard];
              const done = b.docs.filter((d) => d.content).length;
              const pct = Math.round((done / b.docs.length) * 100);
              const href = b.status === "COMPLETE" ? `/blueprints/library?id=${b.id}` : `/blueprints/builder?id=${b.id}`;
              return (
                <Link key={b.id} href={href} className="flex items-center gap-4 border px-4 py-3.5 transition-colors" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
                  <StandardChip k={b.standard} />
                  <span className="text-[13px] flex-1" style={{ color: "var(--b-text)" }}>{std.name}</span>
                  <div className="w-32 h-1.5" style={{ background: "var(--b-bg-active)" }}>
                    <div className="h-full" style={{ width: `${pct}%`, background: pct === 100 ? "var(--b-badge-green-text)" : "var(--b-accent-text)" }} />
                  </div>
                  <span className="text-[11px] w-24 text-right" style={{ color: "var(--b-text-muted)" }}>{done}/{b.docs.length} docs</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5" style={{ background: b.status === "COMPLETE" ? "var(--b-badge-green-bg)" : "var(--b-badge-yellow-bg)", color: b.status === "COMPLETE" ? "var(--b-badge-green-text)" : "var(--b-badge-yellow-text)" }}>{b.status}</span>
                  <ArrowRight className="w-3.5 h-3.5" style={{ color: "var(--b-text-muted)" }} />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      <Link href="/blueprints/store" className="flex items-center justify-between border p-5 mb-8 transition-colors" style={{ borderColor: "var(--b-accent-border)", background: "var(--b-accent-bg)" }}>
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5" style={{ color: "var(--b-accent-text)" }} />
          <div>
            <div className="text-[14px] font-bold" style={{ color: "var(--b-text)" }}>Start a new blueprint</div>
            <div className="text-[12px]" style={{ color: "var(--b-text-secondary)" }}>From $1,750 — single standard. Triple bundle $4,500.</div>
          </div>
        </div>
        <span className="b-btn-accent flex items-center gap-2 px-4 h-[38px] text-[13px] font-semibold">Open Store <ArrowRight className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} /></span>
      </Link>

      {/* Submodule grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SUBMODULES.map(({ id, icon: Icon, name, desc }) => (
          <Link key={id} href={`/blueprints/${id}`} className="border p-4 transition-colors hover:border-[var(--b-border-hover)]" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
            <Icon className="w-4 h-4 mb-2.5" style={{ color: "var(--b-accent-text)" }} />
            <div className="text-[13px] font-semibold mb-0.5" style={{ color: "var(--b-text)" }}>{name}</div>
            <div className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>{desc}</div>
          </Link>
        ))}
        <div className="border p-4 flex flex-col justify-center" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
          <FileText className="w-4 h-4 mb-2.5" style={{ color: "var(--b-text-muted)" }} />
          <div className="text-[13px] font-semibold mb-0.5" style={{ color: "var(--b-text)" }}>55 documents</div>
          <div className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>in a full triple bundle, each mapped to ISO clauses.</div>
        </div>
      </div>
    </div>
  );
}
