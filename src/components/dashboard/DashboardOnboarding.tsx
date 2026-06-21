"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { X, ChevronRight, ChevronLeft, Check, Sparkles, Play, RotateCcw, Map } from "lucide-react";

/* ── Types ── */
interface TourStep {
  id: string;
  targetId: string;
  title: string;
  body: string;
  placement: "top" | "bottom";
}

interface ChecklistItem {
  id: string;
  label: string;
  href?: string;
}

type Phase = "welcome" | "touring" | "checklist" | "done";

interface Rect { top: number; left: number; width: number; height: number }

/* ── Data ── */
const TOUR_STEPS: TourStep[] = [
  {
    id: "stat-cards",
    targetId: "tour-stat-cards",
    title: "Operational snapshot",
    body: "Four live metrics covering audit readiness, open incidents, documents due, and induction compliance — always current.",
    placement: "bottom",
  },
  {
    id: "ai-banner",
    targetId: "tour-ai-banner",
    title: "AI has one thing for you",
    body: "Briesa surfaces the single highest-impact action for your day — pre-drafted and ready to approve in minutes, not hours.",
    placement: "bottom",
  },
  {
    id: "ai-insights",
    targetId: "tour-ai-insights",
    title: "Predictive insights",
    body: "Patterns across your registers surface risks, quick wins, and trends automatically — before they need your attention.",
    placement: "top",
  },
  {
    id: "tasks",
    targetId: "tour-tasks",
    title: "Your tasks today",
    body: "All sign-offs, approvals, and actions from every module — prioritised in one list.",
    placement: "top",
  },
];

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "view-dashboard",  label: "View your dashboard" },
  { id: "review-insight",  label: "Review an AI insight" },
  { id: "open-task",       label: "Open a task" },
  { id: "explore-safety",  label: "Explore the Safety module",   href: "/safety" },
  { id: "create-record",   label: "Create your first record",    href: "/safety/actions" },
];

const PAD = 10; // spotlight padding in px
const LS_STATE    = "briesa-onboarding-phase";
const LS_CHECKED  = "briesa-onboarding-checked";

/* ── Component ── */
export function DashboardOnboarding() {
  const [phase, setPhase]               = useState<Phase | null>(null); // null = not yet hydrated
  const [stepIdx, setStepIdx]           = useState(0);
  const [rect, setRect]                 = useState<Rect | null>(null);
  const [checked, setChecked]           = useState<Set<string>>(new Set(["view-dashboard"]));
  const [checklistOpen, setChecklistOpen] = useState(true);

  /* Restore state from localStorage after hydration */
  useEffect(() => {
    const stored = localStorage.getItem(LS_STATE) as Phase | null;
    setPhase(stored ?? "welcome");
    const raw = localStorage.getItem(LS_CHECKED);
    if (raw) {
      try { setChecked(new Set(JSON.parse(raw))); } catch { /* ignore */ }
    }
  }, []);

  /* Compute spotlight rect for current tour step */
  const updateRect = useCallback(() => {
    if (phase !== "touring") { setRect(null); return; }
    const step = TOUR_STEPS[stepIdx];
    const el = document.getElementById(step.targetId);
    if (!el) { setRect(null); return; }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 });
  }, [phase, stepIdx]);

  useEffect(() => {
    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, [updateRect]);

  /* Helpers */
  function persist(p: Phase) {
    setPhase(p);
    localStorage.setItem(LS_STATE, p);
  }

  function startTour() {
    setStepIdx(0);
    persist("touring");
  }

  function next() {
    if (stepIdx < TOUR_STEPS.length - 1) setStepIdx((i) => i + 1);
    else persist("checklist");
  }

  function back() { setStepIdx((i) => Math.max(0, i - 1)); }

  function toggleCheck(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem(LS_CHECKED, JSON.stringify([...next]));
      return next;
    });
  }

  /* Tooltip position */
  function tooltipPos(step: TourStep, r: Rect | null): React.CSSProperties {
    if (!r) return { top: "50%", left: "50%", transform: "translate(-50%,-50%)" };
    if (step.placement === "bottom") {
      return { top: r.top + r.height + 14, left: Math.max(8, r.left + r.width / 2 - 160) };
    }
    return { top: r.top - 14, left: Math.max(8, r.left + r.width / 2 - 160), transform: "translateY(-100%)" };
  }

  if (!phase || phase === "done") return null;

  const allDone = CHECKLIST_ITEMS.every((i) => checked.has(i.id));

  /* ── Welcome modal ── */
  if (phase === "welcome") {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
        <div
          className="w-full max-w-[420px] p-8 border relative"
          style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)" }}
        >
          <button
            onClick={() => persist("done")}
            className="absolute top-4 right-4 p-1.5 transition-colors"
            style={{ color: "var(--b-text-muted)" }}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} />
            <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "var(--b-text-muted)" }}>
              Welcome to Briesa
            </span>
          </div>

          <h2 className="text-[21px] font-semibold mb-2" style={{ color: "var(--b-text)" }}>
            Let&apos;s get you set up
          </h2>
          <p className="text-[13px] leading-relaxed mb-6" style={{ color: "var(--b-text-muted)" }}>
            Take a quick tour to learn the key features, then follow the interactive checklist to get the most out of your WHS platform.
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={startTour}
              className="b-btn-accent flex items-center justify-center gap-2 w-full h-[42px] text-[13.5px] font-semibold"
            >
              <Play className="w-3.5 h-3.5" />
              Start product tour
            </button>
            <button
              onClick={() => persist("checklist")}
              className="b-btn-ghost flex items-center justify-center gap-2 w-full h-[42px] text-[13px]"
            >
              Skip to checklist
            </button>
          </div>

          <div
            className="flex items-center gap-0 mt-5 pt-5 border-t divide-x"
            style={{ borderColor: "var(--b-border)", color: "var(--b-border)" }}
          >
            {[
              { n: String(TOUR_STEPS.length), label: "tour steps" },
              { n: "2 min",                   label: "to complete" },
              { n: String(CHECKLIST_ITEMS.length), label: "key actions" },
            ].map(({ n, label }) => (
              <div key={label} className="flex-1 text-center px-3">
                <div className="text-[18px] font-bold leading-none mb-1" style={{ color: "var(--b-text)" }}>{n}</div>
                <div className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Guided tour ── */
  if (phase === "touring") {
    const step = TOUR_STEPS[stepIdx];
    const tPos = tooltipPos(step, rect);

    return (
      <>
        {/* Click-blocker overlay (transparent, just blocks page interaction) */}
        <div className="fixed inset-0 z-[9997]" style={{ background: "transparent" }} />

        {/* Spotlight — box-shadow creates the dark surround */}
        {rect && (
          <div
            className="fixed z-[9998] pointer-events-none border-2"
            style={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              borderColor: "var(--b-accent-text)",
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.58)",
              transition: "top 0.25s ease, left 0.25s ease, width 0.25s ease, height 0.25s ease",
            }}
          />
        )}

        {/* Tooltip card */}
        <div
          className="fixed z-[9999] w-80 border p-5"
          style={{
            ...tPos,
            background: "var(--b-bg)",
            borderColor: "var(--b-border-strong)",
          }}
        >
          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "var(--b-text-muted)" }}>
              Step {stepIdx + 1} of {TOUR_STEPS.length}
            </span>
            <button onClick={() => persist("checklist")} style={{ color: "var(--b-text-muted)" }}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <h3 className="text-[15px] font-semibold mb-2" style={{ color: "var(--b-text)" }}>
            {step.title}
          </h3>
          <p className="text-[12.5px] leading-relaxed mb-4" style={{ color: "var(--b-text-muted)" }}>
            {step.body}
          </p>

          {/* Progress bar */}
          <div className="flex gap-1 mb-4">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className="h-[3px] flex-1 transition-colors"
                style={{ background: i <= stepIdx ? "var(--b-accent-text)" : "var(--b-border-strong)" }}
              />
            ))}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center gap-2">
            {stepIdx > 0 && (
              <button
                onClick={back}
                className="b-btn-ghost flex items-center gap-1.5 px-3 h-[34px] text-[12.5px]"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Back
              </button>
            )}
            <button
              onClick={next}
              className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium ml-auto"
            >
              {stepIdx === TOUR_STEPS.length - 1 ? "Finish tour" : "Next"}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ── Interactive checklist ── */
  return (
    <div
      className="fixed bottom-6 right-6 z-[9990] w-72 border shadow-lg"
      style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)" }}
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b cursor-pointer"
        style={{ borderColor: "var(--b-border)" }}
        onClick={() => setChecklistOpen((p) => !p)}
      >
        <div className="flex items-center gap-2">
          <Map className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
          <span className="text-[12.5px] font-semibold" style={{ color: "var(--b-text)" }}>Getting started</span>
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5"
            style={{ background: "var(--b-badge-green-bg)", color: "var(--b-badge-green-text)" }}
          >
            {checked.size}/{CHECKLIST_ITEMS.length}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); persist("done"); }}
          style={{ color: "var(--b-text-muted)" }}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {checklistOpen && (
        <div className="p-3">
          {/* Progress bar */}
          <div className="h-[3px] mb-3" style={{ background: "var(--b-border-strong)" }}>
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${(checked.size / CHECKLIST_ITEMS.length) * 100}%`,
                background: "var(--b-badge-green-text)",
              }}
            />
          </div>

          {/* Items */}
          <div className="space-y-px">
            {CHECKLIST_ITEMS.map((item) => {
              const done = checked.has(item.id);
              const content = (
                <div
                  className="flex items-center gap-3 px-2 py-2 transition-colors"
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleCheck(item.id)}
                >
                  <div
                    className="w-4 h-4 flex items-center justify-center flex-shrink-0 border transition-colors"
                    style={{
                      background: done ? "var(--b-badge-green-bg)" : "transparent",
                      borderColor: done ? "var(--b-badge-green-text)" : "var(--b-border-strong)",
                    }}
                  >
                    {done && <Check className="w-2.5 h-2.5" style={{ color: "var(--b-badge-green-text)" }} />}
                  </div>
                  <span
                    className="text-[12.5px] flex-1"
                    style={{
                      color: done ? "var(--b-text-muted)" : "var(--b-text-secondary)",
                      textDecoration: done ? "line-through" : "none",
                    }}
                  >
                    {item.label}
                  </span>
                  {item.href && !done && (
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />
                  )}
                </div>
              );

              return item.href && !done ? (
                <Link key={item.id} href={item.href} className="block" onClick={() => toggleCheck(item.id)}>
                  {content}
                </Link>
              ) : (
                <div key={item.id}>{content}</div>
              );
            })}
          </div>

          {/* All done message */}
          {allDone && (
            <div
              className="flex items-center gap-2 px-2 py-2 mt-2 border-t"
              style={{ borderColor: "var(--b-border)" }}
            >
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-accent-text)" }} />
              <span className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>All done — you&apos;re set up!</span>
            </div>
          )}

          {/* Replay tour */}
          <div className="border-t pt-2 mt-2" style={{ borderColor: "var(--b-border)" }}>
            <button
              onClick={startTour}
              className="flex items-center gap-1.5 px-2 text-[11.5px] transition-colors"
              style={{ color: "var(--b-text-muted)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--b-text-secondary)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--b-text-muted)")}
            >
              <RotateCcw className="w-3 h-3" />
              Replay tour
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
