"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { X, ChevronRight, ChevronLeft, Check, Sparkles, Play, RotateCcw, Map } from "lucide-react";
import type { Industry } from "@/config/modules";

/* ── Types ─────────────────────────────────────────────────────────────── */
interface TourStep {
  id: string;
  path: string;
  targetId?: string;
  title: string;
  body: string;
  placement?: "top" | "bottom" | "right";
  group: string;
}

interface ChecklistItem { id: string; label: string; href?: string }
type Phase = "welcome" | "touring" | "checklist" | "done";
interface Rect { top: number; left: number; width: number; height: number }

const PAD        = 10;
const TW         = 320; // tooltip width
const TH         = 260; // approximate tooltip height
const GAP        = 14;
const LS_PHASE   = "briesa-tour-phase";
const LS_CHECKED = "briesa-tour-checked";

/* ── Step builder ────────────────────────────────────────────────────── */
function buildSteps(industry: Industry): TourStep[] {
  const isSub: TourStep =
    industry === "industrial"
      ? { id: "loto",    path: "/safety/loto",               targetId: "tour-page-title", group: "Safety",     title: "Lockout / Tagout (LOTO)",  body: "LOTO procedures applied at the point of work before any maintenance begins. Workers complete them on mobile — the lock-off record and authorisation are instant and tamper-proof.",                                    placement: "bottom" }
      : industry === "facilities"
      ? { id: "hazmats", path: "/safety/hazardous-materials", targetId: "tour-page-title", group: "Safety",     title: "Hazardous Materials",       body: "SDS register, chemical storage maps, handling procedures, and spill response plans — all searchable by product name or location. Briesa flags when an SDS is due for review or has been superseded.",      placement: "bottom" }
      : { id: "swms",    path: "/safety/swms",                targetId: "tour-page-title", group: "Safety",     title: "SWMS",                     body: "Safe Work Method Statements with version control, digital sign-off, and AI-generated content. Workers sign on mobile before the task starts — the record is timestamped and linked to the relevant WHS legislation.",   placement: "bottom" };

  const opsSubIndustry: TourStep =
    industry === "industrial"
      ? { id: "op-ready",  path: "/operations/operational-readiness", targetId: "tour-page-title", group: "Operations", title: "Operational Readiness",  body: "Pre-production safety checklists completed before high-risk operations begin. Any unresolved item blocks the shift start — preventing the 'we'll sort it once we're running' workaround that causes most plant incidents.",    placement: "bottom" }
      : industry === "facilities"
      ? { id: "isolation", path: "/operations/isolation-shutdown",     targetId: "tour-page-title", group: "Operations", title: "Isolation & Shutdown",   body: "Safe isolation procedures for building systems during maintenance — documented, witnessed, and signed off before any work begins. Linked directly to the maintenance work order so the paper trail is automatic.",          placement: "bottom" }
      : { id: "plant",     path: "/operations/plant-equipment",        targetId: "tour-page-title", group: "Operations", title: "Plant & Equipment",      body: "Pre-op checks completed on mobile before any plant is started. A defect flagged here immediately suspends the plant from use and raises a corrective action — no paper defect books, no missed faults.",                          placement: "bottom" };

  const opsIntroPath =
    industry === "industrial" ? "/operations/operational-readiness"
    : industry === "facilities" ? "/operations/isolation-shutdown"
    : "/operations/plant-equipment";

  return [
    /* ── Dashboard ── */
    {
      id: "dash-stats", path: "/dashboard", targetId: "tour-stat-cards", group: "Dashboard",
      title: "Your live WHS scorecard",
      body: "Four real-time metrics across audit readiness, open incidents, documents due, and induction compliance. The 82% audit readiness score tracks 70 of 85 controls — click any card to drill into the underlying data and see exactly what's dragging the score down.",
      placement: "bottom",
    },
    {
      id: "dash-ai", path: "/dashboard", targetId: "tour-ai-banner", group: "Dashboard",
      title: "One AI action, every morning",
      body: "Briesa detected that the silica exposure standard was halved and pre-drafted updates to 2 policies and 6 SWMS. Your estimated review time: 4 minutes. No manual scanning of regulatory updates, no briefing a consultant — Briesa does it and waits for your approval.",
      placement: "bottom",
    },
    {
      id: "dash-insights", path: "/dashboard", targetId: "tour-ai-insights", group: "Dashboard",
      title: "Predictive AI insights",
      body: "Three AI-generated insights, each with a confidence score. The licence expiry cluster was flagged 14 days before any manual review would have caught it. The quick-win card shows exactly which 2 uploads and 1 action close-out would push your audit score from 82 → 88.",
      placement: "top",
    },
    {
      id: "dash-tasks", path: "/dashboard", targetId: "tour-tasks", group: "Dashboard",
      title: "Everything that needs you today",
      body: "Sign-offs, approvals, and corrective actions pulled from every module into one prioritised list. No more checking 6 different registers — if it needs your attention, it's here. Click any item to action it directly.",
      placement: "top",
    },

    /* ── Safety ── */
    {
      id: "safety-intro", path: "/safety/incidents", targetId: "tour-nav-safety", group: "Safety",
      title: "Safety — the core of Briesa",
      body: "The most-used module across every industry. Incidents, corrective actions, toolbox talks, pre-starts, permits, and method statements — all interconnected so data flows automatically. An incident raises actions. An audit raises actions. Everything links.",
      placement: "right",
    },
    {
      id: "incidents", path: "/safety/incidents", targetId: "tour-page-title", group: "Safety",
      title: "Incident Register",
      body: "Log an incident in under 90 seconds. Briesa auto-generates the investigation workflow, assigns corrective actions to the right owners, and notifies supervisors — all without manual setup. Every field you see is mapped to a WHS reporting obligation.",
      placement: "bottom",
    },
    {
      id: "actions", path: "/safety/actions", targetId: "tour-page-title", group: "Safety",
      title: "Actions Register",
      body: "Every incident, audit, inspection, and hazard report automatically raises corrective actions here. Each one has an owner, a due date, a priority, and an escalation path. Overdue actions are flagged automatically — you'll never lose track of an open CAPA again.",
      placement: "bottom",
    },
    {
      id: "toolbox", path: "/safety/toolbox", targetId: "tour-page-title", group: "Safety",
      title: "Toolbox Talks",
      body: "Digital toolbox records completed on mobile before each shift. Attendance sign-off, topic covered, and who signed — all timestamped and stored automatically. No more paper sign-on sheets that get lost between the site office and head office.",
      placement: "bottom",
    },
    {
      id: "prestart", path: "/safety/prestart", targetId: "tour-page-title", group: "Safety",
      title: "Prestart Checks",
      body: "Workers complete prestart checks before a single tool is picked up. Any 'fail' response instantly raises a corrective action and prevents the shift proceeding — removing the most common excuse for unsafe starts: 'I didn't think it was that bad'.",
      placement: "bottom",
    },
    isSub,

    /* ── People ── */
    {
      id: "people-intro", path: "/people/inductions", targetId: "tour-nav-people", group: "People",
      title: "People — your whole workforce",
      body: "Everyone who steps on site: employees, contractors, visitors. Inductions, licences, health records, and return-to-work plans — all linked to the individual. If someone isn't inducted or their licence has expired, Briesa stops them from being cleared for site.",
      placement: "right",
    },
    {
      id: "inductions", path: "/people/inductions", targetId: "tour-page-title", group: "People",
      title: "Induction Records",
      body: "Site, building, and role-specific induction records for every person on site. Expiry dates tracked automatically — Briesa alerts you 30 days before anyone lapses. For the demo, 94% induction compliance means 12 workers need attention before the next audit.",
      placement: "bottom",
    },
    {
      id: "contractors", path: "/people/contractor-management", targetId: "tour-page-title", group: "People",
      title: "Contractor Management",
      body: "Contractor prequalification, insurance verification, and site access — all in one workflow. Briesa checks that their public liability is current, their workers are inducted, and their SWMS is approved before they're cleared to start. One dashboard, zero paperwork.",
      placement: "bottom",
    },
    {
      id: "health-wellbeing", path: "/people/health-wellbeing", targetId: "tour-page-title", group: "People",
      title: "Health & Wellbeing",
      body: "Wellness check-ins, EAP referrals, and early intervention tracking — built into the same platform as your safety records. When a mental health concern flags in a toolbox talk, it flows here automatically. No separate HR system needed.",
      placement: "bottom",
    },
    {
      id: "return-to-work", path: "/people/return-to-work", targetId: "tour-page-title", group: "People",
      title: "Return to Work",
      body: "RTW plans, suitable duties, and rehabilitation milestones linked directly to the incident that triggered them. GP communications, insurer updates, and claim status tracked in one place — reducing the average return-to-work duration by keeping nothing in email inboxes.",
      placement: "bottom",
    },

    /* ── Operations ── */
    {
      id: "ops-intro", path: opsIntroPath, targetId: "tour-nav-operations", group: "Operations",
      title: "Operations — work, done safely",
      body: "Safe work procedures, site access controls, plant inspections, and zone management — all connected to the specific workers and tasks they apply to. When a procedure changes, everyone who uses it is notified automatically.",
      placement: "right",
    },
    opsSubIndustry,
    {
      id: "site-access", path: "/operations/site-access-control", targetId: "tour-page-title", group: "Operations",
      title: "Site Access Control",
      body: "Real-time visibility of who is on site, in which zones, and whether their induction, PPE, and licence requirements are met before they pass through. Restricted zones check credentials automatically — no manual gatekeeping required.",
      placement: "bottom",
    },

    /* ── Risk ── */
    {
      id: "risk-intro", path: "/risk/hazard-register", targetId: "tour-nav-risk", group: "Risk",
      title: "Risk Management",
      body: "From everyday hazard reporting to critical control verification — a complete risk management system that workers actually use because it takes less than 60 seconds to log a hazard from their phone.",
      placement: "right",
    },
    {
      id: "hazard-register", path: "/risk/hazard-register", targetId: "tour-page-title", group: "Risk",
      title: "Hazard Register",
      body: "Workers log hazards from their phone in 30 seconds. Each entry is risk-rated, assigned a control owner, and scheduled for review. Nothing sits unaddressed — Briesa escalates any hazard that hasn't had a control applied within the set timeframe.",
      placement: "bottom",
    },
    {
      id: "risk-assessments", path: "/risk/risk-assessments", targetId: "tour-page-title", group: "Risk",
      title: "Risk Assessments",
      body: "Formal likelihood × consequence risk assessments with control hierarchies following the WHS hierarchy of controls. AI suggests controls based on your hazard type, your industry, and what similar organisations have applied. Reviewed, approved, and version-controlled.",
      placement: "bottom",
    },
    {
      id: "erp", path: "/risk/emergency-response-plans", targetId: "tour-page-title", group: "Risk",
      title: "Emergency Response Plans",
      body: "Documented ERPs for fire, medical, spill, and site-specific emergencies — version-controlled, linked to the warden register, and accessible offline on any device. Updated when your site layout or personnel changes.",
      placement: "bottom",
    },
    {
      id: "critical-controls", path: "/risk/critical-risk-controls", targetId: "tour-page-title", group: "Risk",
      title: "Critical Risk Controls",
      body: "The controls that, if they fail, someone gets seriously hurt. Fire suppression, exit lighting, fall protection — scheduled verification checks with automatic escalation if a check is missed or a control fails. Your most important safety net.",
      placement: "bottom",
    },

    /* ── Compliance ── */
    {
      id: "compliance-intro", path: "/compliance/inspections-audits", targetId: "tour-nav-compliance", group: "Compliance",
      title: "Compliance — always audit-ready",
      body: "Inspections, audits, legislative registers, PPE records, and regulator notices — your complete compliance engine. The 82% audit readiness score on your dashboard is calculated live from every record in this module.",
      placement: "right",
    },
    {
      id: "inspections", path: "/compliance/inspections-audits", targetId: "tour-page-title", group: "Compliance",
      title: "Inspections & Audits",
      body: "Schedule inspections, complete them digitally with photos and signatures, and automatically raise corrective actions for every failed item. When SafeWork shows up unannounced, you can pull up your last 12 months of inspection records in under 30 seconds.",
      placement: "bottom",
    },
    {
      id: "legislative", path: "/compliance/legislative-register", targetId: "tour-page-title", group: "Compliance",
      title: "Legislative Register",
      body: "Every Act, Regulation, and Code of Practice mapped to your operations and automatically updated as the law changes. The silica standard update on your dashboard was flagged here first — Briesa monitors every Australian and state WHS regulator's gazette in real time.",
      placement: "bottom",
    },
    {
      id: "ppe-register", path: "/compliance/ppe-register", targetId: "tour-page-title", group: "Compliance",
      title: "PPE Register",
      body: "Every item of PPE issued to every worker — type, issue date, last inspection, expiry. Briesa sends alerts before any item falls out of compliance. At audit time, the entire PPE register is a single report: who has what, when it was checked, and when it expires.",
      placement: "bottom",
    },

    /* ── Training ── */
    {
      id: "training-intro", path: "/training/training-register", targetId: "tour-nav-training", group: "Training",
      title: "Training — competency, tracked",
      body: "Build courses with AI-generated content, deliver inductions on mobile, and maintain a complete training register — all in one platform. No more spreadsheet training matrices. No more chasing workers for their certificate copies.",
      placement: "right",
    },
    {
      id: "training-register", path: "/training/training-register", targetId: "tour-page-title", group: "Training",
      title: "Training Register",
      body: "Every training completion for every worker, contractor, and visitor — with the certificate stored against the record. Expiry tracked automatically, gaps identified, and renewal reminders sent 30/60/90 days out. Audit-ready in one click.",
      placement: "bottom",
    },
    {
      id: "competency", path: "/training/competency-licences", targetId: "tour-page-title", group: "Training",
      title: "Competency & Licences",
      body: "High-risk work licences, White Cards, first aid certificates, and role-based competencies tracked for your entire workforce. A worker whose licence has lapsed is flagged on the dashboard, blocked from induction sign-off, and alerted before the shift starts.",
      placement: "bottom",
    },
    {
      id: "training-matrix", path: "/training/training-matrix", targetId: "tour-page-title", group: "Training",
      title: "Training Matrix",
      body: "A colour-coded grid showing every worker's competency status across every required training — green (current), amber (expiring), red (lapsed), grey (not yet completed). Export for auditors or regulators in one click. No spreadsheet maintenance required.",
      placement: "bottom",
    },
    {
      id: "course-builder", path: "/training/course-builder", targetId: "tour-page-title", group: "Training",
      title: "Course Builder",
      body: "Describe a training need and Briesa generates the full course outline, learning objectives, and assessment questions. Edit, publish, and assign to workers — all within the platform. No instructional design experience or third-party LMS required.",
      placement: "bottom",
    },
    {
      id: "induction-builder", path: "/training/induction-builder", targetId: "tour-page-title", group: "Training",
      title: "Induction Builder",
      body: "Build site-specific inductions with videos, documents, and knowledge checks. Workers complete them on their phone before arriving on site — the completion record is timestamped, the pass/fail is recorded, and you can see who still hasn't done it.",
      placement: "bottom",
    },

    /* ── Insights ── */
    {
      id: "insights-intro", path: "/insights/whs-dashboard", targetId: "tour-nav-insights", group: "Insights",
      title: "Insights — data that drives decisions",
      body: "Live analytics across every module. Board-ready safety dashboards, regulatory incident reports, leading and lagging indicator tracking — all automated. When a safety manager spends 2 hours a month on reporting instead of 20, this is why.",
      placement: "right",
    },
    {
      id: "whs-dashboard", path: "/insights/whs-dashboard", targetId: "tour-page-title", group: "Insights",
      title: "WHS Performance Dashboard",
      body: "TRIFR, LTIFR, audit scores, and leading indicators updated in real time. One click generates a regulator-ready safety performance report in PDF. Leadership finally gets accurate WHS data without waiting for a monthly manually compiled spreadsheet.",
      placement: "bottom",
    },
    {
      id: "incident-analytics", path: "/insights/incident-analytics", targetId: "tour-page-title", group: "Insights",
      title: "Incident Analytics",
      body: "Incident frequency by type, location, severity, cause, and time of day — visualised with trend lines and industry benchmarks. The patterns that take a safety manager weeks to find manually are visible here at a glance, updated every time a new record is added.",
      placement: "bottom",
    },
    {
      id: "leading-lagging", path: "/insights/leading-lagging", targetId: "tour-page-title", group: "Insights",
      title: "Leading & Lagging Indicators",
      body: "Balance reactive incident data with proactive safety activity — toolbox completion rates, hazard report frequency, inspection scores. A site with high toolbox completion and high hazard reporting is a safe site. This view shows you which sites are which.",
      placement: "bottom",
    },
    {
      id: "overdue-alerts", path: "/insights/overdue-alerts", targetId: "tour-page-title", group: "Insights",
      title: "Overdue & Alerts",
      body: "One consolidated list of everything overdue across every module — actions, inspections, licence renewals, toolbox schedules. If it's falling through the cracks on your current system, it shows up here. Nothing is hidden in a module you didn't think to check.",
      placement: "bottom",
    },
  ];
}

/* ── Checklist ─────────────────────────────────────────────────────────── */
const CHECKLIST: ChecklistItem[] = [
  { id: "view-dashboard",   label: "Review your live dashboard" },
  { id: "log-incident",     label: "Open the Incidents register",         href: "/safety/incidents" },
  { id: "check-actions",    label: "Check your open corrective actions",  href: "/safety/actions" },
  { id: "view-inductions",  label: "View induction compliance",           href: "/people/inductions" },
  { id: "hazard-register",  label: "Open the Hazard Register",            href: "/risk/hazard-register" },
  { id: "compliance-check", label: "Review an inspection or audit",       href: "/compliance/inspections-audits" },
  { id: "training-matrix",  label: "Check the Training Matrix",           href: "/training/training-matrix" },
  { id: "whs-dashboard",    label: "View WHS analytics",                  href: "/insights/whs-dashboard" },
  { id: "review-insight",   label: "Review an AI insight on the dashboard", href: "/dashboard" },
  { id: "open-task",        label: "Action a task from your list" },
];

/* ── Component ─────────────────────────────────────────────────────────── */
export function DashboardOnboarding({ industry }: { industry: Industry }) {
  const router   = useRouter();
  const pathname = usePathname();
  const steps    = buildSteps(industry);

  const [phase, setPhase]           = useState<Phase | null>(null);
  const [stepIdx, setStepIdx]       = useState(0);
  const [rect, setRect]             = useState<Rect | null>(null);
  const [navigating, setNavigating] = useState(false);
  const [checked, setChecked]       = useState<Set<string>>(new Set(["view-dashboard"]));
  const [panelOpen, setPanelOpen]   = useState(true);

  /* Hydrate */
  useEffect(() => {
    const p = localStorage.getItem(LS_PHASE) as Phase | null;
    setPhase(p ?? "welcome");
    try {
      const raw = localStorage.getItem(LS_CHECKED);
      if (raw) setChecked(new Set(JSON.parse(raw)));
    } catch { /* ignore */ }
  }, []);

  /* Spotlight rect */
  const computeRect = useCallback(() => {
    if (phase !== "touring") { setRect(null); return; }
    const step = steps[stepIdx];
    if (!step?.targetId) { setRect(null); return; }
    const el = document.getElementById(step.targetId);
    if (!el) { setTimeout(computeRect, 80); return; }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 });
  }, [phase, stepIdx, steps]);

  useEffect(() => {
    window.addEventListener("resize", computeRect);
    return () => window.removeEventListener("resize", computeRect);
  }, [computeRect]);

  /* Navigate on step change */
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

  /* Re-compute after navigation */
  useEffect(() => {
    if (phase !== "touring" || !navigating) return;
    const step = steps[stepIdx];
    if (step && pathname === step.path) {
      setNavigating(false);
      setTimeout(computeRect, 80);
    }
  }, [pathname, navigating, phase, stepIdx, steps, computeRect]);

  /* Helpers */
  function persist(p: Phase) { setPhase(p); localStorage.setItem(LS_PHASE, p); }
  function startTour() { setStepIdx(0); setRect(null); setNavigating(false); persist("touring"); }
  function goNext() { stepIdx < steps.length - 1 ? setStepIdx((i) => i + 1) : persist("checklist"); }
  function goBack() { setStepIdx((i) => Math.max(0, i - 1)); }
  function toggleCheck(id: string) {
    setChecked((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      localStorage.setItem(LS_CHECKED, JSON.stringify([...n]));
      return n;
    });
  }

  /* Smart tooltip positioning — never goes off-screen */
  function tooltipPos(step: TourStep, r: Rect | null): React.CSSProperties {
    if (!r) return { top: "50%", left: "50%", transform: "translate(-50%,-50%)" };

    const W = typeof window !== "undefined" ? window.innerWidth  : 1200;
    const H = typeof window !== "undefined" ? window.innerHeight : 800;
    const clampX = (v: number) => Math.max(8, Math.min(v, W - TW - 8));
    const centerX = clampX(r.left + r.width / 2 - TW / 2);

    if (step.placement === "right") {
      return {
        top:  Math.max(8, Math.min(r.top + r.height / 2 - TH / 2, H - TH - 8)),
        left: r.left + r.width + GAP,
      };
    }

    const canBelow = r.top + r.height + GAP + TH <= H;
    const canAbove = r.top - GAP - TH >= 0;

    // "bottom" — prefer below, fall back above, fall back inside-top
    if (step.placement !== "top") {
      if (canBelow) return { top: r.top + r.height + GAP, left: centerX };
      if (canAbove) return { top: r.top - GAP, left: centerX, transform: "translateY(-100%)" };
      return { top: Math.max(8, r.top + 16), left: centerX }; // inside spotlight
    }

    // "top" — prefer above, fall back below, fall back inside-top
    if (canAbove) return { top: r.top - GAP, left: centerX, transform: "translateY(-100%)" };
    if (canBelow) return { top: r.top + r.height + GAP, left: centerX };
    return { top: Math.max(8, r.top + 16), left: centerX };
  }

  const GROUP_COLORS: Record<string, string> = {
    Dashboard: "var(--b-badge-blue-text)",
    Safety:    "#f06060",
    People:    "var(--b-badge-green-text)",
    Operations:"var(--b-badge-yellow-text)",
    Risk:      "#f06060",
    Compliance:"var(--b-badge-blue-text)",
    Training:  "var(--b-badge-green-text)",
    Insights:  "var(--b-accent-text)",
  };

  if (!phase || phase === "done") return null;
  const step    = steps[stepIdx];
  const allDone = CHECKLIST.every((i) => checked.has(i.id));

  /* ── Welcome ─────────────────────────────────────────────────────── */
  if (phase === "welcome") return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.65)" }}>
      <div className="w-full max-w-[440px] border" style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)" }}>
        <button onClick={() => persist("done")} className="absolute" style={{ top: 16, right: 16, color: "var(--b-text-muted)" }}>
          <X className="w-4 h-4" />
        </button>
        <div className="p-8 relative">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} />
            <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "var(--b-text-muted)" }}>
              Briesa · Live Demo Workspace
            </span>
          </div>
          <h2 className="text-[22px] font-semibold mb-2" style={{ color: "var(--b-text)" }}>
            Let&apos;s show you around
          </h2>
          <p className="text-[13px] leading-relaxed mb-6" style={{ color: "var(--b-text-muted)" }}>
            This is a live Construction workspace pre-loaded with real demo data. Take the full walkthrough to see every module in action — incidents, risk, compliance, training, and more.
          </p>
          <div className="flex flex-col gap-2">
            <button onClick={startTour} className="b-btn-accent flex items-center justify-center gap-2 w-full h-[42px] text-[13.5px] font-semibold">
              <Play className="w-3.5 h-3.5" /> Start full product tour
            </button>
            <button onClick={() => persist("checklist")} className="b-btn-ghost flex items-center justify-center gap-2 w-full h-[42px] text-[13px]">
              Skip to interactive checklist
            </button>
          </div>
        </div>
        <div className="flex border-t divide-x" style={{ borderColor: "var(--b-border)" }}>
          {[
            { n: String(steps.length), label: "tour steps" },
            { n: "8",                  label: "modules covered" },
            { n: String(CHECKLIST.length), label: "hands-on tasks" },
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

  /* ── Touring ─────────────────────────────────────────────────────── */
  if (phase === "touring") {
    const tPos       = tooltipPos(step, rect);
    const groupColor = GROUP_COLORS[step.group] ?? "var(--b-text-muted)";
    return (
      <>
        {/* Click-blocker */}
        <div className="fixed inset-0 z-[9997]" />

        {/* Spotlight */}
        {rect && !navigating && (
          <div
            className="fixed z-[9998] pointer-events-none border-2"
            style={{
              top: rect.top, left: rect.left, width: rect.width, height: rect.height,
              borderColor: "var(--b-accent-text)",
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)",
              transition: "top 0.22s ease,left 0.22s ease,width 0.22s ease,height 0.22s ease",
            }}
          />
        )}

        {/* Navigating overlay */}
        {navigating && <div className="fixed inset-0 z-[9998] pointer-events-none" style={{ background: "rgba(0,0,0,0.6)" }} />}

        {/* Tooltip */}
        <div
          className="fixed z-[9999] border p-5"
          style={{ ...tPos, width: TW, background: "var(--b-bg)", borderColor: "var(--b-border-strong)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: groupColor }}>{step.group}</span>
              <span className="text-[10px]" style={{ color: "var(--b-text-muted)" }}>· {stepIdx + 1} / {steps.length}</span>
            </div>
            <button onClick={() => persist("checklist")} style={{ color: "var(--b-text-muted)" }}><X className="w-3.5 h-3.5" /></button>
          </div>

          {navigating ? (
            <div className="py-3">
              <div className="text-[13px] font-semibold mb-1" style={{ color: "var(--b-text)" }}>{step.title}</div>
              <div className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>Navigating…</div>
            </div>
          ) : (
            <>
              <h3 className="text-[15px] font-semibold mb-2" style={{ color: "var(--b-text)" }}>{step.title}</h3>
              <p className="text-[12.5px] leading-relaxed mb-4" style={{ color: "var(--b-text-muted)" }}>{step.body}</p>
            </>
          )}

          {/* Progress bar */}
          <div className="flex gap-0.5 mb-4">
            {steps.map((s, i) => (
              <div key={s.id} className="h-[3px] flex-1 transition-colors duration-200"
                style={{ background: i <= stepIdx ? "var(--b-accent-text)" : "var(--b-border-strong)" }} />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {stepIdx > 0 && (
              <button onClick={goBack} className="b-btn-ghost flex items-center gap-1.5 px-3 h-[34px] text-[12.5px]">
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}
            <button onClick={goNext} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium ml-auto">
              {stepIdx === steps.length - 1 ? "Finish tour" : "Next"}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ── Checklist ───────────────────────────────────────────────────── */
  return (
    <div className="fixed bottom-6 right-6 z-[9990] w-72 border shadow-lg" style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)" }}>
      <div className="flex items-center justify-between px-4 py-3 border-b cursor-pointer" style={{ borderColor: "var(--b-border)" }}
        onClick={() => setPanelOpen((p) => !p)}>
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
          <div className="h-[3px] mb-3" style={{ background: "var(--b-border-strong)" }}>
            <div className="h-full transition-all duration-500"
              style={{ width: `${(checked.size / CHECKLIST.length) * 100}%`, background: "var(--b-badge-green-text)" }} />
          </div>

          <div className="space-y-px max-h-72 overflow-y-auto">
            {CHECKLIST.map((item) => {
              const done = checked.has(item.id);
              const inner = (
                <div className="flex items-center gap-3 px-2 py-2 cursor-pointer" onClick={() => toggleCheck(item.id)}>
                  <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 border transition-colors"
                    style={{ background: done ? "var(--b-badge-green-bg)" : "transparent", borderColor: done ? "var(--b-badge-green-text)" : "var(--b-border-strong)" }}>
                    {done && <Check className="w-2.5 h-2.5" style={{ color: "var(--b-badge-green-text)" }} />}
                  </div>
                  <span className="text-[12px] flex-1"
                    style={{ color: done ? "var(--b-text-muted)" : "var(--b-text-secondary)", textDecoration: done ? "line-through" : "none" }}>
                    {item.label}
                  </span>
                  {item.href && !done && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />}
                </div>
              );
              return item.href && !done
                ? <Link key={item.id} href={item.href} className="block" onClick={() => toggleCheck(item.id)}>{inner}</Link>
                : <div key={item.id}>{inner}</div>;
            })}
          </div>

          {allDone && (
            <div className="flex items-center gap-2 px-2 py-2 mt-1 border-t" style={{ borderColor: "var(--b-border)" }}>
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-accent-text)" }} />
              <span className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>All done — you&apos;re fully set up!</span>
            </div>
          )}

          <div className="border-t pt-2 mt-2" style={{ borderColor: "var(--b-border)" }}>
            <button onClick={startTour}
              className="flex items-center gap-1.5 px-2 text-[11.5px] transition-colors"
              style={{ color: "var(--b-text-muted)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--b-text-secondary)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--b-text-muted)")}>
              <RotateCcw className="w-3 h-3" /> Replay full tour
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
