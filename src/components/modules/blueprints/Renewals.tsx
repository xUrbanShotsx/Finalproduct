"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw, CalendarClock, Check } from "lucide-react";
import { useState } from "react";
import { STANDARDS, RENEWAL_PRICE, fmtAUD } from "@/config/blueprints";
import { useBlueprints } from "./store";
import { StandardChip } from "./shared";

export function Renewals() {
  const { blueprints, hydrated } = useBlueprints();
  const [renewed, setRenewed] = useState<Set<string>>(new Set());
  const owned = blueprints.filter((b) => b.docs.some((d) => d.content));

  if (!hydrated) return <div className="p-8 text-[13px]" style={{ color: "var(--b-text-muted)" }}>Loading…</div>;

  return (
    <div className="p-8 max-w-[1000px]">
      <Link href="/blueprints" className="b-icon-btn inline-flex items-center gap-1.5 text-[12px] mb-6"><ArrowLeft className="w-3.5 h-3.5" /> Blueprints</Link>
      <h1 className="text-[22px] font-bold tracking-tight" style={{ color: "var(--b-text)" }}>Renewal & Updates</h1>
      <p className="text-[13px] mt-1 mb-6" style={{ color: "var(--b-text-muted)" }}>
        ISO standards and your operations change. Keep every blueprint audit-ready with an annual AI refresh — {fmtAUD(RENEWAL_PRICE)} per blueprint.
      </p>

      {owned.length === 0 ? (
        <div className="border border-dashed p-12 text-center" style={{ borderColor: "var(--b-border)" }}>
          <CalendarClock className="w-6 h-6 mx-auto mb-3" style={{ color: "var(--b-text-muted)" }} />
          <p className="text-[13.5px] font-medium" style={{ color: "var(--b-text-tertiary)" }}>No blueprints to renew yet</p>
          <p className="text-[12px] mt-1 mb-4" style={{ color: "var(--b-text-muted)" }}>Once you own a blueprint, annual refresh options appear here.</p>
          <Link href="/blueprints/store" className="b-btn-accent inline-flex items-center gap-2 px-4 h-[36px] text-[13px] font-semibold">Browse Blueprint Store</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {owned.map((b) => {
            const std = STANDARDS[b.standard];
            const created = new Date(b.createdAt);
            const renewal = new Date(created.getTime() + 365 * 864e5);
            const daysLeft = Math.round((renewal.getTime() - Date.now()) / 864e5);
            const isRenewed = renewed.has(b.id);
            return (
              <div key={b.id} className="border p-5 flex items-center justify-between" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
                <div>
                  <div className="flex items-center gap-2 mb-1"><StandardChip k={b.standard} /><span className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>{std.name}</span></div>
                  <div className="flex items-center gap-4 text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
                    <span>{b.docs.length} documents</span>
                    <span className="flex items-center gap-1"><CalendarClock className="w-3 h-3" /> {isRenewed ? "Renewed — next refresh in 12 months" : `Refresh due ${renewal.toLocaleDateString("en-AU", { month: "short", year: "numeric" })} (${daysLeft} days)`}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[18px] font-bold" style={{ color: "var(--b-text)" }}>{fmtAUD(RENEWAL_PRICE)}</div>
                    <div className="text-[10px]" style={{ color: "var(--b-text-muted)" }}>per year · AUD</div>
                  </div>
                  <button
                    onClick={() => setRenewed((p) => new Set(p).add(b.id))}
                    disabled={isRenewed}
                    className="flex items-center gap-1.5 px-4 h-[38px] text-[13px] font-semibold border transition-colors"
                    style={isRenewed
                      ? { borderColor: "var(--b-badge-green-text)", color: "var(--b-badge-green-text)", background: "var(--b-badge-green-bg)" }
                      : { borderColor: "var(--b-accent-border)", color: "var(--b-accent-text)", background: "var(--b-accent-bg)" }}
                  >
                    {isRenewed ? <><Check className="w-3.5 h-3.5" /> Renewal scheduled</> : <><RefreshCw className="w-3.5 h-3.5" /> Renew blueprint</>}
                  </button>
                </div>
              </div>
            );
          })}
          <p className="text-[11px] mt-2" style={{ color: "var(--b-text-muted)" }}>Billing isn&apos;t wired yet — renewals are scheduled here and invoiced on activation.</p>
        </div>
      )}
    </div>
  );
}
