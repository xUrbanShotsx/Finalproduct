"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { X, ChevronRight, ChevronLeft, Check, Sparkles, Play, RotateCcw, Map } from "lucide-react";
import type { Industry } from "@/config/modules";

/* ── Types ─────────────────────────────────────────────────────────────── */
interface TourStep {
  id: string;
  path: string;        // navigate here
  targetId?: string;   // spotlight this element
  title: string;
  body: string;
  placement?: "top" | "bottom" | "right";
  group: string;       // shown in tooltip header
}

interface ChecklistItem {
  id: string;
  label: string;
  href?: string;
}

type Phase = "welcome" | "touring" | "checklist" | "done";
interface Rect { top: number; left: number; width: number; height: number }

const PAD          = 10;
const LS_PHASE     = "briesa-tour-phase";
const LS_CHECKED   = "briesa-tour-checked";

/* ── Step builder (industry-aware) ─────────────────────────────────────── */
function buildSteps(industry: Industry): TourStep[] {
  const industryStepsSafety: TourStep =
    industry === "industrial"
      ? { id: "loto",    path: "/safety/loto",              targetId: "tour-page-shell", group: "Safety",     title: "Lockout / Tagout",        body: "Lockout/tagout procedures for isolating hazardous energy — applied at the point of work before any maintenance begins.",               placement: "bottom" }
      : industry === "facilities"
      ? { id: "hazmats", path: "/safety/hazardous-materials",targetId: "tour-page-shell", group: "Safety",     title: "Hazardous Materials",      body: "SDS register, chemical storage locations, handling procedures, and spill response plans for every chemical on site.",                  placement: "bottom" }
      : { id: "swms",    path: "/safety/swms",               targetId: "tour-page-shell", group: "Safety",     title: "SWMS",                    body: "Safe Work Method Statements for high-risk construction work — version-controlled, with AI-generated content and digital sign-off.",    placement: "bottom" };

  const industryStepsOps: TourStep =
    industry === "industrial"
      ? { id: "op-readiness", path: "/operations/operational-readiness", targetId: "tour-page-shell", group: "Operations", title: "Operational Readiness", body: "Pre-task and pre-production safety checks before commencing high-risk operations — ensuring controls are in place before work begins.", placement: "bottom" }
      : industry === "facilities"
      ? { id: "isolation",    path: "/operations/isolation-shutdown",     targetId: "tour-page-shell", group: "Operations", title: "Isolation & Shutdown",  body: "Safe isolation procedures for building systems during maintenance — documented, signed-off, and linked to the work order.",           placement: "bottom" }
      : { id: "plant",        path: "/operations/plant-equipment",        targetId: "tour-page-shell", group: "Operations", title: "Plant & Equipment",     body: "Pre-op inspections, daily checks, and defect logging for mobile plant and construction equipment — all from a mobile device.",         placement: "bottom" };

  const opsIntroPath =
    industry === "industrial" ? "/operations/operational-readiness"
    : industry === "facilities" ? "/operations/isolation-shutdown"
    : "/operations/plant-equipment";

  return [
    /* ── Dashboard ── */
    {
      id: "dash-stats",
      path: "/dashboard",
      targetId: "tour-stat-cards",
      group: "Dashboard",
      title: "Operational snapshot",
      body: "Four live metrics covering audit readiness, open incidents, documents due, and induction compliance — always current across every site.",
      placement: "bottom",
    },
    {
      id: "dash-ai",
      path: "/dashboard",
      targetId: "tour-ai-banner",
      group: "Dashboard",
      title: "AI has one thing for you",
      body: "Every morning, Briesa identifies the single highest-impact action and pre-drafts it — ready to approve in minutes, not hours.",
      placement: "bottom",
    },
    {
      id: "dash-insights",
      path: "/dashboard",
      targetId: "tour-ai-insights",
      group: "Dashboard",
      title: "Predictive AI insights",
      body: "Briesa analyses patterns across your registers and proactively flags risks, quick wins, and emerging trends — before they need your attention.",
      placement: "top",
    },
    {
      id: "dash-tasks",
      path: "/dashboard",
      targetId: "tour-tasks",
      group: "Dashboard",
      title: "Your tasks today",
      body: "All sign-offs, approvals, and corrective actions from every module — prioritised and centralised so nothing falls through the cracks.",
      placement: "top",
    },

    /* ── Safety ── */
    {
      id: "safety-intro",
      path: "/safety/incidents",
      targetId: "tour-nav-safety",
      group: "Safety",
      title: "Safety module",
      body: "The central hub for all WHS operations — incidents, corrective actions, toolbox talks, pre-starts, permits, and work method statements.",
      placement: "right",
    },
    {
      id: "incidents",
      path: "/safety/incidents",
      targetId: "tour-page-shell",
      group: "Safety",
      title: "Incidents",
      body: "Log, investigate, and close out injuries, near-misses, and property damage. AI-assisted root-cause analysis and investigation workflows built in.",
      placement: "bottom",
    },
    {
      id: "actions",
      path: "/safety/actions",
      targetId: "tour-page-shell",
      group: "Safety",
      title: "Actions",
      body: "Corrective and preventive actions with assigned owners, priorities, and due dates — automatically generated from incidents, audits, and inspections.",
      placement: "bottom",
    },
    {
      id: "toolbox",
      path: "/safety/toolbox",
      targetId: "tour-page-shell",
      group: "Safety",
      title: "Toolbox Talks",
      body: "Safety briefings, shift communications, and digital attendance sign-offs — delivered in the field and recorded against each worker.",
      placement: "bottom",
    },
    {
      id: "prestart",
      path: "/safety/prestart",
      targetId: "tour-page-shell",
      group: "Safety",
      title: "Prestart Checks",
      body: "Pre-shift safety checks completed before work begins — flagging defects, hazards, and control requirements before workers are exposed.",
      placement: "bottom",
    },
    industryStepsSafety,

    /* ── People ── */
    {
      id: "people-intro",
      path: "/people/inductions",
      targetId: "tour-nav-people",
      group: "People",
      title: "People module",
      body: "Manage your entire workforce — inductions, contractor onboarding, competency records, fatigue, health monitoring, and return-to-work.",
      placement: "right",
    },
    {
      id: "inductions",
      path: "/people/inductions",
      targetId: "tour-page-shell",
      group: "People",
      title: "Inductions",
      body: "Site, building, and role-specific induction records for staff, contractors, and visitors — with digital sign-off and automatic expiry tracking.",
      placement: "bottom",
    },
    {
      id: "contractors",
      path: "/people/contractor-management",
      targetId: "tour-page-shell",
      group: "People",
      title: "Contractor Management",
      body: "Contractor prequalification, insurance verification, onboarding workflows, and site access controls — all linked to their induction and licence records.",
      placement: "bottom",
    },
    {
      id: "health-wellbeing",
      path: "/people/health-wellbeing",
      targetId: "tour-page-shell",
      group: "People",
      title: "Health & Wellbeing",
      body: "Wellness programs, mental health support, early intervention, and return-to-work coordination — tracked against individual workers.",
      placement: "bottom",
    },
    {
      id: "return-to-work",
      path: "/people/return-to-work",
      targetId: "tour-page-shell",
      group: "People",
      title: "Return to Work",
      body: "Injury-based RTW plans, suitable duties registers, and rehabilitation milestone tracking — linked directly to the incident that triggered them.",
      placement: "bottom",
    },

    /* ── Operations ── */
    {
      id: "ops-intro",
      path: opsIntroPath,
      targetId: "tour-nav-operations",
      group: "Operations",
      title: "Operations module",
      body: "Safe work procedures, site access controls, plant inspections, and work zone management — linked to the workers performing the tasks.",
      placement: "right",
    },
    industryStepsOps,
    {
      id: "site-access",
      path: "/operations/site-access-control",
      targetId: "tour-page-shell",
      group: "Operations",
      title: "Site Access Control",
      body: "Manage who can enter work areas, restricted zones, and after-hours access — with digital check-in and automatic compliance checks.",
      placement: "bottom",
    },

    /* ── Risk ── */
    {
      id: "risk-intro",
      path: "/risk/hazard-register",
      targetId: "tour-nav-risk",
      group: "Risk",
      title: "Risk Management",
      body: "Identify, assess, and control hazards before they cause harm — hazard registers, formal risk assessments, and critical risk verification.",
      placement: "right",
    },
    {
      id: "hazard-register",
      path: "/risk/hazard-register",
      targetId: "tour-page-shell",
      group: "Risk",
      title: "Hazard Register",
      body: "Log and track hazards across sites with control measures, risk ratings, owner assignment, and ongoing review schedules.",
      placement: "bottom",
    },
    {
      id: "risk-assessments",
      path: "/risk/risk-assessments",
      targetId: "tour-page-shell",
      group: "Risk",
      title: "Risk Assessments",
      body: "Formal risk assessments using likelihood × consequence matrices, control hierarchies, and review workflows — with AI-assisted content generation.",
      placement: "bottom",
    },
    {
      id: "erp",
      path: "/risk/emergency-response-plans",
      targetId: "tour-page-shell",
      group: "Risk",
      title: "Emergency Response Plans",
      body: "Documented ERPs for fire, medical, bomb threat, and site-specific emergency scenarios — version-controlled and accessible from any device.",
      placement: "bottom",
    },
    {
      id: "critical-controls",
      path: "/risk/critical-risk-controls",
      targetId: "tour-page-shell",
      group: "Risk",
      title: "Critical Risk Controls",
      body: "Verification of life-critical controls — fire suppression, exits, fall prevention — with scheduled checks and automatic overdue alerts.",
      placement: "bottom",
    },

    /* ── Compliance ── */
    {
      id: "compliance-intro",
      path: "/compliance/inspections-audits",
      targetId: "tour-nav-compliance",
      group: "Compliance",
      title: "Compliance module",
      body: "Inspections, audits, legislative registers, PPE tracking, and regulator notices — your complete compliance engine in one place.",
      placement: "right",
    },
    {
      id: "inspections",
      path: "/compliance/inspections-audits",
      targetId: "tour-page-shell",
      group: "Compliance",
      title: "Inspections & Audits",
      body: "Schedule and complete compliance inspections with digital checklists, photo evidence, and automatic corrective actions raised on failure.",
      placement: "bottom",
    },
    {
      id: "legislative",
      path: "/compliance/legislative-register",
      targetId: "tour-page-shell",
      group: "Compliance",
      title: "Legislative Register",
      body: "Acts, regulations, and codes of practice mapped to your operations — Briesa flags relevant legislative changes as they occur.",
      placement: "bottom",
    },
    {
      id: "ppe-register",
      path: "/compliance/ppe-register",
      targetId: "tour-page-shell",
      group: "Compliance",
      title: "PPE Register",
      body: "PPE issue records, inspection logs, and expiry tracking for every worker — with automatic alerts before items fall out of compliance.",
      placement: "bottom",
    },

    /* ── Training ── */
    {
      id: "training-intro",
      path: "/training/training-register",
      targetId: "tour-nav-training",
      group: "Training",
      title: "Training module",
      body: "Build courses, track completion, manage licences, and maintain a full competency register — with AI-generated course content and induction programs.",
      placement: "right",
    },
    {
      id: "training-register",
      path: "/training/training-register",
      targetId: "tour-page-shell",
      group: "Training",
      title: "Training Register",
      body: "A complete record of training completed by every worker, contractor, and visitor — with expiry alerts and competency gap identification.",
      placement: "bottom",
    },
    {
      id: "competency",
      path: "/training/competency-licences",
      targetId: "tour-page-shell",
      group: "Training",
      title: "Competency & Licences",
      body: "Track high-risk work licences, White Cards, first aid certificates, and role-based competencies across your entire workforce.",
      placement: "bottom",
    },
    {
      id: "training-matrix",
      path: "/training/training-matrix",
      targetId: "tour-page-shell",
      group: "Training",
      title: "Training Matrix",
      body: "At-a-glance compliance matrix showing each worker's current, expiring, and missing competencies — instantly exported for audits.",
      placement: "bottom",
    },
    {
      id: "course-builder",
      path: "/training/course-builder",
      targetId: "tour-page-shell",
      group: "Training",
      title: "Course Builder",
      body: "Build and publish training courses with AI-generated content, learning objectives, and assessment criteria — no instructional design experience needed.",
      placement: "bottom",
    },
    {
      id: "induction-builder",
      path: "/training/induction-builder",
      targetId: "tour-page-shell",
      group: "Training",
      title: "Induction Builder",
      body: "Build site and role-specific induction programs with AI-generated module content, video embeds, and digital sign-off at the end.",
      placement: "bottom",
    },

    /* ── Insights ── */
    {
      id: "insights-intro",
      path: "/insights/whs-dashboard",
      targetId: "tour-nav-insights",
      group: "Insights",
      title: "Insights module",
      body: "Live WHS analytics, incident reporting, compliance dashboards, and custom report builder — executive-ready and always up to date.",
      placement: "right",
    },
    {
      id: "whs-dashboard",
      path: "/insights/whs-dashboard",
      targetId: "tour-page-shell",
      group: "Insights",
      title: "WHS Dashboard",
      body: "TRIFR, LTIFR, audit scores, and safety performance trends in one live view — shareable with leadership and regulators in one click.",
      placement: "bottom",
    },
    {
      id: "incident-analytics",
      path: "/insights/incident-analytics",
      targetId: "tour-page-shell",
      group: "Insights",
      title: "Incident Analytics",
      body: "Deep-dive analytics on incident frequency, severity, type, and location — with industry benchmarking and predictive trend models.",
      placement: "bottom",
    },
    {
      id: "leading-lagging",
      path: "/insights/leading-lagging",
      targetId: "tour-page-shell",
      group: "Insights",
      title: "Leading & Lagging Indicators",
      body: "Balance proactive and reactive safety measurement — track toolbox rates, inspection frequency, and hazard reports alongside incident data.",
      placement: "bottom",
    },
    {
      id: "overdue-alerts",
      path: "/insights/overdue-alerts",
      targetId: "tour-page-shell",
      group: "Insights",
      title: "Overdue & Alerts",
      body: "One consolidated view of everything overdue across every module — actions, inspections, licences, and trainings — so nothing is missed.",
      placement: "bottom",
    },
  ];
}

/* ── Checklist items ─────────────────────────────────────────────────── */
const CHECKLIST: ChecklistItem[] = [
  { id: "view-dashboard",   label: "View your dashboard" },
  { id: "review-insight",   label: "Review an AI insight" },
  { id: "log-incident",     label: "Explore the Incidents register",    href: "/safety/incidents" },
  { id: "check-actions",    label: "Check open actions",                href: "/safety/actions" },
  { id: "view-inductions",  label: "View induction records",            href: "/people/inductions" },
  { id: "hazard-register",  label: "Open the Hazard Register",          href: "/risk/hazard-register" },
  { id: "compliance-check", label: "Run an inspection or audit",        href: "/compliance/inspections-audits" },
  { id: "training-matrix",  label: "Review the Training Matrix",        href: "/training/training-matrix" },
  { id: "whs-dashboard",    label: "View WHS analytics dashboard",      href: "/insights/whs-dashboard" },
  { id: "open-task",        label: "Complete a task from your list" },
];

/* ── Component ───────────────────────────────────────────────────────── */
export function DashboardOnboarding({ industry }: { industry: Industry }) {
  const router   = useRouter();
  const pathname = usePathname();

  const steps = buildSteps(industry);

  const [phase, setPhase]           = useState<Phase | null>(null);
  const [stepIdx, setStepIdx]       = useState(0);
  const [rect, setRect]             = useState<Rect | null>(null);
  const [navigating, setNavigating] = useState(false);
  const [checked, setChecked]       = useState<Set<string>>(new Set(["view-dashboard"]));
  const [panelOpen, setPanelOpen]   = useState(true);

  /* Hydrate from localStorage */
  useEffect(() => {
    const storedPhase = localStorage.getItem(LS_PHASE) as Phase | null;
    setPhase(storedPhase ?? "welcome");
    try {
      const raw = localStorage.getItem(LS_CHECKED);
      if (raw) setChecked(new Set(JSON.parse(raw)));
    } catch { /* ignore */ }
  }, []);

  /* Compute spotlight rect */
  const computeRect = useCallback(() => {
    if (phase !== "touring") { setRect(null); return; }
    const step = steps[stepIdx];
    if (!step?.targetId) { setRect(null); return; }
    const el = document.getElementById(step.targetId);
    if (!el) { setTimeout(computeRect, 80); return; }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 });
  }, [phase, stepIdx, steps]);

  /* Recompute on resize */
  useEffect(() => {
    window.addEventListener("resize", computeRect);
    return () => window.removeEventListener("resize", computeRect);
  }, [computeRect]);

  /* Navigate when step changes */
  useEffect(() => {
    if (phase !== "touring") return;
    const step = steps[stepIdx];
    if (!step) return;
    if (step.path !== pathname) {
      setRect(null);
      setNavigating(true);
      router.push(step.path);
    } else {
      setNavigating(false);
      setTimeout(computeRect, 60);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIdx, phase]);

  /* After navigation completes */
  useEffect(() => {
    if (phase !== "touring" || !navigating) return;
    const step = steps[stepIdx];
    if (!step) return;
    if (pathname === step.path) {
      setNavigating(false);
      setTimeout(computeRect, 80);
    }
  }, [pathname, navigating, phase, stepIdx, steps, computeRect]);

  /* Helpers */
  function persist(p: Phase) {
    setPhase(p);
    localStorage.setItem(LS_PHASE, p);
  }

  function startTour(fromIdx = 0) {
    setStepIdx(fromIdx);
    setRect(null);
    setNavigating(false);
    persist("touring");
  }

  function goNext() {
    if (stepIdx < steps.length - 1) setStepIdx((i) => i + 1);
    else persist("checklist");
  }

  function goBack() { setStepIdx((i) => Math.max(0, i - 1)); }

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
    switch (step.placement) {
      case "right":
        return { top: r.top + r.height / 2, left: r.left + r.width + 14, transform: "translateY(-50%)" };
      case "top":
        return { top: r.top - 14, left: Math.max(8, Math.min(r.left + r.width / 2 - 160, window.innerWidth - 336)), transform: "translateY(-100%)" };
      default: // bottom
        return { top: r.top + r.height + 14, left: Math.max(8, Math.min(r.left + r.width / 2 - 160, window.innerWidth - 336)) };
    }
  }

  /* Group colours */
  const GROUP_COLORS: Record<string, string> = {
    Dashboard:   "var(--b-badge-blue-text)",
    Safety:      "#f06060",
    People:      "var(--b-badge-green-text)",
    Operations:  "var(--b-badge-yellow-text)",
    Risk:        "#f06060",
    Compliance:  "var(--b-badge-blue-text)",
    Training:    "var(--b-badge-green-text)",
    Insights:    "var(--b-accent-text)",
  };

  if (!phase || phase === "done") return null;

  const step = steps[stepIdx];
  const allDone = CHECKLIST.every((i) => checked.has(i.id));

  /* ── Welcome ─────────────────────────────────────────────────── */
  if (phase === "welcome") {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.65)" }}>
        <div className="w-full max-w-[440px] border relative" style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)" }}>
          <button onClick={() => persist("done")} className="absolute top-4 right-4 p-1.5" style={{ color: "var(--b-text-muted)" }}>
            <X className="w-4 h-4" />
          </button>

          <div className="p-8">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} />
              <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "var(--b-text-muted)" }}>
                Welcome to Briesa
              </span>
            </div>
            <h2 className="text-[22px] font-semibold mb-2" style={{ color: "var(--b-text)" }}>Let&apos;s show you around</h2>
            <p className="text-[13px] leading-relaxed mb-6" style={{ color: "var(--b-text-muted)" }}>
              Take a full walkthrough of every module and submodule, then follow the interactive checklist to get hands-on with key features.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => startTour(0)}
                className="b-btn-accent flex items-center justify-center gap-2 w-full h-[42px] text-[13.5px] font-semibold"
              >
                <Play className="w-3.5 h-3.5" />
                Start full product tour
              </button>
              <button
                onClick={() => persist("checklist")}
                className="b-btn-ghost flex items-center justify-center gap-2 w-full h-[42px] text-[13px]"
              >
                Skip to checklist
              </button>
            </div>
          </div>

          <div className="flex border-t divide-x" style={{ borderColor: "var(--b-border)" }}>
            {[
              { n: String(steps.length), label: "tour steps" },
              { n: "8 modules",          label: "covered" },
              { n: String(CHECKLIST.length), label: "key actions" },
            ].map(({ n, label }) => (
              <div key={label} className="flex-1 py-4 text-center">
                <div className="text-[17px] font-bold leading-none mb-1" style={{ color: "var(--b-text)" }}>{n}</div>
                <div className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Touring ─────────────────────────────────────────────────── */
  if (phase === "touring") {
    const tPos = tooltipPos(step, rect);
    const groupColor = GROUP_COLORS[step.group] ?? "var(--b-text-muted)";

    return (
      <>
        {/* Full-screen click-blocker (transparent) */}
        <div className="fixed inset-0 z-[9997]" />

        {/* Spotlight (box-shadow = dark surround) */}
        {rect && !navigating && (
          <div
            className="fixed z-[9998] pointer-events-none border-2"
            style={{
              top: rect.top, left: rect.left, width: rect.width, height: rect.height,
              borderColor: "var(--b-accent-text)",
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)",
              transition: "top 0.22s ease, left 0.22s ease, width 0.22s ease, height 0.22s ease",
            }}
          />
        )}

        {/* Dark overlay while navigating (no hole) */}
        {navigating && (
          <div className="fixed inset-0 z-[9998] pointer-events-none" style={{ background: "rgba(0,0,0,0.6)" }} />
        )}

        {/* Tooltip */}
        <div
          className="fixed z-[9999] w-80 border p-5"
          style={{ ...tPos, background: "var(--b-bg)", borderColor: "var(--b-border-strong)" }}
        >
          {/* Group + step counter */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: groupColor }}>
                {step.group}
              </span>
              <span className="text-[10px]" style={{ color: "var(--b-text-muted)" }}>
                · {stepIdx + 1} / {steps.length}
              </span>
            </div>
            <button onClick={() => persist("checklist")} style={{ color: "var(--b-text-muted)" }}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {navigating ? (
            <div className="py-4 text-center">
              <div className="text-[13px] font-semibold mb-1" style={{ color: "var(--b-text)" }}>{step.title}</div>
              <div className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>Navigating…</div>
            </div>
          ) : (
            <>
              <h3 className="text-[15px] font-semibold mb-2" style={{ color: "var(--b-text)" }}>{step.title}</h3>
              <p className="text-[12.5px] leading-relaxed mb-4" style={{ color: "var(--b-text-muted)" }}>{step.body}</p>
            </>
          )}

          {/* Segmented progress bar — grouped by module */}
          <div className="flex gap-0.5 mb-4">
            {steps.map((s, i) => (
              <div
                key={s.id}
                className="h-[3px] flex-1 transition-colors duration-200"
                style={{ background: i <= stepIdx ? "var(--b-accent-text)" : "var(--b-border-strong)" }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {stepIdx > 0 && (
              <button onClick={goBack} className="b-btn-ghost flex items-center gap-1.5 px-3 h-[34px] text-[12.5px]">
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}
            <button
              onClick={goNext}
              className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium ml-auto"
            >
              {stepIdx === steps.length - 1 ? "Finish tour" : "Next"}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ── Checklist ───────────────────────────────────────────────── */
  return (
    <div
      className="fixed bottom-6 right-6 z-[9990] w-72 border shadow-lg"
      style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b cursor-pointer"
        style={{ borderColor: "var(--b-border)" }}
        onClick={() => setPanelOpen((p) => !p)}
      >
        <div className="flex items-center gap-2">
          <Map className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
          <span className="text-[12.5px] font-semibold" style={{ color: "var(--b-text)" }}>Getting started</span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5" style={{ background: "var(--b-badge-green-bg)", color: "var(--b-badge-green-text)" }}>
            {checked.size}/{CHECKLIST.length}
          </span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); persist("done"); }} style={{ color: "var(--b-text-muted)" }}>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {panelOpen && (
        <div className="p-3">
          {/* Progress */}
          <div className="h-[3px] mb-3" style={{ background: "var(--b-border-strong)" }}>
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${(checked.size / CHECKLIST.length) * 100}%`, background: "var(--b-badge-green-text)" }}
            />
          </div>

          <div className="space-y-px max-h-72 overflow-y-auto">
            {CHECKLIST.map((item) => {
              const done = checked.has(item.id);
              const inner = (
                <div
                  className="flex items-center gap-3 px-2 py-2 cursor-pointer"
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
                  <span className="text-[12px] flex-1" style={{ color: done ? "var(--b-text-muted)" : "var(--b-text-secondary)", textDecoration: done ? "line-through" : "none" }}>
                    {item.label}
                  </span>
                  {item.href && !done && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />}
                </div>
              );
              return item.href && !done ? (
                <Link key={item.id} href={item.href} className="block" onClick={() => toggleCheck(item.id)}>{inner}</Link>
              ) : (
                <div key={item.id}>{inner}</div>
              );
            })}
          </div>

          {allDone && (
            <div className="flex items-center gap-2 px-2 py-2 mt-1 border-t" style={{ borderColor: "var(--b-border)" }}>
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-accent-text)" }} />
              <span className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>All done — you&apos;re fully set up!</span>
            </div>
          )}

          <div className="border-t pt-2 mt-2" style={{ borderColor: "var(--b-border)" }}>
            <button
              onClick={() => startTour(0)}
              className="flex items-center gap-1.5 px-2 text-[11.5px] transition-colors"
              style={{ color: "var(--b-text-muted)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--b-text-secondary)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--b-text-muted)")}
            >
              <RotateCcw className="w-3 h-3" /> Replay full tour
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
