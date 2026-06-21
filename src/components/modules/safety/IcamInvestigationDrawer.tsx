"use client";

import { useState, useEffect } from "react";
import {
  X, Plus, CheckCircle2, ChevronDown, ChevronRight,
  Shield, GitBranch, ArrowRight,
} from "lucide-react";
import { AiButton } from "../AiButton";

// ── Types ──────────────────────────────────────────────────────────────────

export interface IncidentRow {
  ref: string;
  date: string;
  time: string;
  type: string;
  location: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "Under Investigation" | "Closed";
  assignee: string;
  daysOpen: number | null;
  icamStatus?: "Not Started" | "In Progress" | "Complete";
}

interface TimelineEvent { time: string; description: string }
interface ActionRecord {
  id: string;
  description: string;
  icamCategory: string;
  taprootCategory: string;
  actionType: "Immediate" | "Systemic" | "Preventive";
  assignee: string;
  dueDate: string;
  status: "Open" | "Closed";
}
interface IcamState {
  sceneNotes: string;
  timelineEvents: TimelineEvent[];
  defences: string[];
  individualFactors: string[];
  orgFactors: string[];
  contributingFactors: string;
  taproot: string[];
  actions: ActionRecord[];
}

// ── Constants ──────────────────────────────────────────────────────────────

const DEFENCES = [
  { id: "barrier-absent",     label: "Physical barrier absent or not in place",         cat: "Physical" },
  { id: "barrier-failed",     label: "Physical barrier failed or was inadequate",        cat: "Physical" },
  { id: "warning-absent",     label: "Warning system absent or failed to activate",      cat: "Physical" },
  { id: "ppe-absent",         label: "PPE absent or not being worn",                     cat: "Physical" },
  { id: "procedure-absent",   label: "Procedure absent or not followed",                 cat: "Administrative" },
  { id: "permit-absent",      label: "Permit-to-work or authorisation not in place",     cat: "Administrative" },
  { id: "induction-absent",   label: "Induction or task briefing not completed",         cat: "Administrative" },
  { id: "supervision-absent", label: "Adequate supervision was absent",                  cat: "Administrative" },
  { id: "inspection-failed",  label: "Pre-task inspection did not identify the defect",  cat: "Human Detection" },
  { id: "recognition-failed", label: "Hazard was not recognised at the time",            cat: "Human Detection" },
  { id: "emergency-plan",     label: "Emergency response plan absent or inadequate",     cat: "Emergency/Recovery" },
];

const INDIVIDUAL_FACTORS = [
  { id: "task-demands",    label: "Task demands exceeded the worker's capabilities" },
  { id: "time-pressure",   label: "Time pressure or production priority applied" },
  { id: "fatigue",         label: "Worker fatigue or impaired alertness" },
  { id: "unfamiliar-task", label: "Worker unfamiliar with this task or equipment" },
  { id: "communication",   label: "Communication failure between workers or teams" },
  { id: "team-dynamics",   label: "Team dynamics, authority gradient or groupthink" },
  { id: "distraction",     label: "Distraction or loss of situational awareness" },
];

const ORG_FACTORS = [
  { id: "goal-conflict",       label: "Goals or priorities conflicted with safe work" },
  { id: "policy-absent",       label: "Policy, standard or procedure absent or inadequate" },
  { id: "training-inadequate", label: "Training, competency or verification inadequate" },
  { id: "equipment-selection", label: "Equipment selection, design or maintenance inadequate" },
  { id: "change-management",   label: "Change was not assessed or managed" },
  { id: "supervision-culture", label: "Safety leadership or culture inadequate" },
  { id: "contractor-mgmt",     label: "Contractor or subcontractor management inadequate" },
];

const TAPROOT_TREE = [
  {
    id: "equipment", label: "Equipment Difficulty", children: [
      { id: "eq-design",    label: "Poorly designed for the task or user" },
      { id: "eq-defective", label: "Equipment defective, worn or broken" },
      { id: "eq-wrong",     label: "Wrong equipment selected or used" },
      { id: "eq-maint",     label: "Maintenance programme inadequate" },
    ],
  },
  {
    id: "procedure", label: "Procedure Difficulty", children: [
      { id: "pr-absent",       label: "No procedure existed for this task" },
      { id: "pr-wrong",        label: "Procedure incorrect or incomplete" },
      { id: "pr-not-followed", label: "Procedure not followed correctly" },
      { id: "pr-impractical",  label: "Procedure impractical under conditions" },
    ],
  },
  {
    id: "training", label: "Training Difficulty", children: [
      { id: "tr-initial",   label: "Initial training was inadequate" },
      { id: "tr-refresher", label: "Refresher training not provided" },
      { id: "tr-verified",  label: "Competency not verified before task" },
      { id: "tr-ojt",       label: "On-the-job supervision inadequate" },
    ],
  },
  {
    id: "communications", label: "Communications", children: [
      { id: "cm-not-given",   label: "Instructions or information not given" },
      { id: "cm-not-recvd",   label: "Communication not received or understood" },
      { id: "cm-no-feedback", label: "No confirmation or feedback obtained" },
      { id: "cm-docs",        label: "Documentation not communicated" },
    ],
  },
  {
    id: "work-direction", label: "Work Direction", children: [
      { id: "wd-plan",   label: "Work not correctly planned or sequenced" },
      { id: "wd-super",  label: "Supervision inadequate or absent" },
      { id: "wd-permit", label: "Work authorisation not obtained" },
    ],
  },
  {
    id: "management", label: "Management System", children: [
      { id: "ms-standards",      label: "Standards or procedures not established" },
      { id: "ms-compliance",     label: "Compliance with standards not enforced" },
      { id: "ms-accountability", label: "Safety accountability not assigned" },
      { id: "ms-audit",          label: "Audit or review process inadequate" },
      { id: "ms-culture",        label: "Safety culture inadequate" },
    ],
  },
];

// ── Pre-populated demo investigation data ──────────────────────────────────

const DEMO_044: IcamState = {
  sceneNotes: "Level 3 north slab edge. No edge protection on the north face at time of incident. Temporary crash deck present on east/west faces only. Formwork stripping underway. Weather: overcast, dry. Lighting adequate.",
  timelineEvents: [
    { time: "08:00", description: "Morning toolbox talk completed — edge protection not discussed" },
    { time: "08:45", description: "Formwork stripping commenced on Level 3 north slab" },
    { time: "09:10", description: "Foreman noted programme pressure and instructed crew to advance toward north edge" },
    { time: "09:14", description: "Worker P. Nguyen carried 40 kg panel toward unprotected north edge, stumbled and nearly fell — caught by a colleague" },
    { time: "09:15", description: "Work immediately stopped; area isolated by J. Smith" },
    { time: "09:20", description: "Incident reported to site manager; regulator notification under review" },
  ],
  defences: ["barrier-absent", "permit-absent", "supervision-absent"],
  individualFactors: ["task-demands", "time-pressure", "unfamiliar-task"],
  orgFactors: ["goal-conflict", "policy-absent", "training-inadequate"],
  contributingFactors: "Level 3 works were operating under an accelerated programme following May weather delays. No specific edge protection procedure existed for the north building face. The worker involved had not previously worked above Level 2 on this project.",
  taproot: ["pr-absent", "pr-impractical", "wd-plan", "ms-standards", "tr-verified"],
  actions: [
    { id: "a1", description: "Install temporary edge protection on Level 3 north face — 2 m barriers with mid-rail and toe board before any works resume", icamCategory: "Absent/Failed Defence", taprootCategory: "Procedure Difficulty", actionType: "Immediate", assignee: "J. Smith", dueDate: "14 Jun 2024", status: "Open" },
    { id: "a2", description: "Develop specific SWMS for slab edge works with mandatory edge protection requirements prior to commencement", icamCategory: "Organisational Factor", taprootCategory: "Procedure Difficulty", actionType: "Systemic", assignee: "M. Jones", dueDate: "21 Jun 2024", status: "Open" },
    { id: "a3", description: "Competency assessment for all Level 3 workers — high-risk edge work induction required before returning to that zone", icamCategory: "Organisational Factor", taprootCategory: "Training Difficulty", actionType: "Systemic", assignee: "K. Davis", dueDate: "28 Jun 2024", status: "Open" },
    { id: "a4", description: "Programme review with senior management to eliminate time pressure on safety-critical tasks, with documented sign-off", icamCategory: "Organisational Factor", taprootCategory: "Management System", actionType: "Preventive", assignee: "Site Director", dueDate: "30 Jun 2024", status: "Open" },
  ],
};

const DEMO_043: IcamState = {
  sceneNotes: "Site 02 laydown area near B-Block entry. Worker tripped on exposed reo bar protruding from a steel bundle. First aid applied on site. Area congested due to unscheduled delivery.",
  timelineEvents: [
    { time: "13:38", description: "Unscheduled steel delivery arrived, creating congestion in laydown area" },
    { time: "13:40", description: "Worker directed to move mesh bundles to clear forklift path" },
    { time: "13:42", description: "Worker tripped on exposed reo bar, sustaining laceration to lower left leg" },
    { time: "13:45", description: "First aid applied by site first aider S. Lee" },
    { time: "14:00", description: "Incident reported; area cleared and inspected" },
  ],
  defences: ["barrier-absent", "inspection-failed"],
  individualFactors: ["distraction", "task-demands"],
  orgFactors: ["policy-absent"],
  contributingFactors: "The laydown area was congested due to an unscheduled delivery. A morning housekeeping inspection had not been conducted. The exposed reo bar had been left from the previous day's works without being flagged.",
  taproot: ["pr-wrong", "wd-plan"],
  actions: [
    { id: "b1", description: "Remove all exposed reo bars; implement mandatory daily laydown area inspection before works begin", icamCategory: "Absent/Failed Defence", taprootCategory: "Work Direction", actionType: "Immediate", assignee: "L. Brown", dueDate: "10 Jun 2024", status: "Closed" },
    { id: "b2", description: "Update delivery management procedure — all deliveries must be pre-scheduled and coordinated with site manager", icamCategory: "Organisational Factor", taprootCategory: "Procedure Difficulty", actionType: "Systemic", assignee: "M. Jones", dueDate: "17 Jun 2024", status: "Closed" },
  ],
};

const BLANK: IcamState = {
  sceneNotes: "", timelineEvents: [], defences: [], individualFactors: [],
  orgFactors: [], contributingFactors: "", taproot: [], actions: [],
};

function getInitialState(ref: string): IcamState {
  if (ref === "INC-044") return DEMO_044;
  if (ref === "INC-043") return DEMO_043;
  return BLANK;
}

// ── Sub-components ─────────────────────────────────────────────────────────

function Chk({
  checked, onChange, label, sub,
}: { checked: boolean; onChange: () => void; label: string; sub?: string }) {
  return (
    <label
      className="flex items-start gap-2.5 p-2.5 cursor-pointer transition-colors"
      style={{
        background: checked ? "var(--b-accent-bg)" : "transparent",
        border: `1px solid ${checked ? "var(--b-accent-border)" : "var(--b-border)"}`,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 w-3.5 h-3.5 flex-shrink-0 accent-[var(--b-accent-text)]"
      />
      <div>
        <div className="text-[12.5px] leading-snug" style={{ color: checked ? "var(--b-accent-text)" : "var(--b-text)" }}>{label}</div>
        {sub && <div className="text-[11px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>{sub}</div>}
      </div>
    </label>
  );
}

type TabId = "evidence" | "icam" | "taproot" | "actions";

const SEV_COLOR: Record<string, string> = {
  Critical: "#f06060", High: "#f06060",
  Medium: "var(--b-badge-yellow-text)", Low: "var(--b-badge-green-text)",
};
const SEV_BG: Record<string, string> = {
  Critical: "rgba(240,96,96,0.1)", High: "rgba(240,96,96,0.1)",
  Medium: "var(--b-badge-yellow-bg)", Low: "var(--b-badge-green-bg)",
};
const ACTION_STYLE: Record<string, { bg: string; color: string }> = {
  Immediate: { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  Systemic:  { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  Preventive:{ bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
};

// ── Main component ─────────────────────────────────────────────────────────

export function IcamInvestigationDrawer({
  open, onClose, incident,
}: {
  open: boolean;
  onClose: () => void;
  incident: IncidentRow | null;
}) {
  const [tab, setTab] = useState<TabId>("evidence");
  const [expanded, setExpanded] = useState<string[]>(["procedure", "training", "management"]);
  const [state, setState] = useState<IcamState>(BLANK);

  useEffect(() => {
    if (incident) {
      setState(getInitialState(incident.ref));
      setTab("evidence");
    }
  }, [incident?.ref]);

  function toggle(key: "defences" | "individualFactors" | "orgFactors" | "taproot", id: string) {
    setState(s => ({
      ...s,
      [key]: (s[key] as string[]).includes(id)
        ? (s[key] as string[]).filter(x => x !== id)
        : [...(s[key] as string[]), id],
    }));
  }

  function toggleSection(id: string) {
    setExpanded(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }

  if (!incident) return null;

  const totalIcam = state.defences.length + state.individualFactors.length + state.orgFactors.length;
  const phases = [
    state.timelineEvents.length > 0 || state.sceneNotes.length > 0,
    totalIcam > 0,
    state.taproot.length > 0,
    state.actions.length > 0,
  ];
  const completedPhases = phases.filter(Boolean).length;

  const divider: React.CSSProperties = { borderBottom: "1px solid var(--b-border)", paddingBottom: "1.25rem", marginBottom: "1.25rem" };
  const fieldBase: React.CSSProperties = { background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" };
  const lbl = "block text-[11px] font-semibold uppercase tracking-widest mb-1.5";
  const lblStyle: React.CSSProperties = { color: "var(--b-text-muted)" };

  const TABS: Array<{ id: TabId; label: string; count?: number }> = [
    { id: "evidence", label: "Evidence & SnapCharT" },
    { id: "icam",     label: "ICAM Analysis",      count: totalIcam },
    { id: "taproot",  label: "TapRooT RCA",         count: state.taproot.length },
    { id: "actions",  label: "Corrective Actions",  count: state.actions.length },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        background: "var(--b-bg-canvas)",
        opacity: open ? 1 : 0,
        transform: open ? "translateY(0)" : "translateY(10px)",
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 200ms ease, transform 200ms ease",
      }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center gap-3 px-4 sm:px-6 h-14 flex-shrink-0 border-b"
        style={{ background: "var(--b-bg)", borderColor: "var(--b-border)" }}
      >
        <button onClick={onClose} aria-label="Close" className="b-icon-btn w-9 h-9 flex items-center justify-center -ml-2">
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[15px] font-semibold" style={{ color: "var(--b-text)" }}>
              ICAM / TapRooT Investigation
            </span>
            <span
              className="font-mono text-[11.5px] px-2 py-0.5 border"
              style={{ background: "var(--b-bg-active)", borderColor: "var(--b-border)", color: "var(--b-text-muted)" }}
            >
              {incident.ref}
            </span>
            <span
              className="text-[11.5px] font-semibold px-2 py-0.5"
              style={{ background: SEV_BG[incident.severity], color: SEV_COLOR[incident.severity] }}
            >
              {incident.severity}
            </span>
          </div>
          <div className="text-[11.5px] mt-0.5 truncate" style={{ color: "var(--b-text-muted)" }}>
            {incident.type} · {incident.location} · {incident.date}
          </div>
        </div>
        {/* Progress */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>{completedPhases}/4 phases</span>
          <div className="w-20 h-1.5 overflow-hidden" style={{ background: "var(--b-border)" }}>
            <div
              className="h-full transition-all"
              style={{ width: `${(completedPhases / 4) * 100}%`, background: "var(--b-accent-text)" }}
            />
          </div>
        </div>
      </div>

      {/* ── Methodology bar ── */}
      <div
        className="flex-shrink-0 border-b px-4 sm:px-6 py-2 flex items-center gap-3 flex-wrap"
        style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}
      >
        <span className="text-[11px] font-medium" style={{ color: "var(--b-text-muted)" }}>
          Methodology:
        </span>
        <span
          className="text-[11px] font-semibold px-2 py-0.5 border"
          style={{ background: "var(--b-accent-bg)", borderColor: "var(--b-accent-border)", color: "var(--b-accent-text)" }}
        >
          ICAM — Incident Cause Analysis Method
        </span>
        <span className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>+</span>
        <span
          className="text-[11px] font-semibold px-2 py-0.5"
          style={{ background: "var(--b-badge-blue-bg)", color: "var(--b-badge-blue-text)", border: "1px solid var(--b-badge-blue-text)" }}
        >
          TapRooT® Root Cause Analysis
        </span>
      </div>

      {/* ── Tab bar ── */}
      <div
        className="flex-shrink-0 overflow-x-auto border-b"
        style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}
      >
        <div className="mx-auto max-w-[900px] flex">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 min-w-[120px] py-3 flex items-center justify-center gap-1.5 text-[12px] font-semibold transition-colors"
              style={{
                color: tab === t.id ? "var(--b-accent-text)" : "var(--b-text-muted)",
                borderBottom: tab === t.id ? "2px solid var(--b-accent-text)" : "2px solid transparent",
                background: tab === t.id ? "var(--b-accent-bg)" : "transparent",
              }}
            >
              {t.label}
              {t.count != null && t.count > 0 && (
                <span
                  className="px-1.5 py-0.5 text-[10px] font-bold"
                  style={{
                    background: tab === t.id ? "var(--b-accent-text)" : "var(--b-border-strong)",
                    color: tab === t.id ? "var(--b-bg)" : "var(--b-text-muted)",
                  }}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[900px] px-5 sm:px-8 py-7 pb-24">

          {/* ── Evidence & SnapCharT ── */}
          {tab === "evidence" && (
            <div>
              <div className="mb-6 p-3.5 border" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <GitBranch className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-accent-text)" }} />
                  <span className="text-[12px] font-semibold" style={{ color: "var(--b-text)" }}>TapRooT® SnapCharT™</span>
                </div>
                <p className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
                  The SnapCharT is the foundation of TapRooT analysis — a clear timeline of events leading to the incident. Build the sequence before completing the ICAM causal analysis.
                </p>
              </div>

              <div style={divider}>
                <label className={lbl} style={lblStyle}>Scene Notes</label>
                <textarea
                  rows={3}
                  value={state.sceneNotes}
                  onChange={e => setState(s => ({ ...s, sceneNotes: e.target.value }))}
                  placeholder="Describe the scene — location conditions, equipment state, environmental factors at time of incident…"
                  className="w-full px-3 py-2.5 text-[12.5px] border outline-none resize-none transition-colors focus:border-[var(--b-accent-text)]"
                  style={fieldBase}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={lbl} style={{ ...lblStyle, marginBottom: 0 }}>SnapCharT Timeline of Events</label>
                  <button
                    type="button"
                    onClick={() => setState(s => ({ ...s, timelineEvents: [...s.timelineEvents, { time: "", description: "" }] }))}
                    className="flex items-center gap-1 h-[28px] px-2.5 text-[11.5px] font-medium border transition-colors"
                    style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text-muted)" }}
                  >
                    <Plus className="w-3 h-3" /> Add Event
                  </button>
                </div>

                {state.timelineEvents.length === 0 ? (
                  <div
                    className="py-10 text-center border"
                    style={{ borderColor: "var(--b-border)", borderStyle: "dashed" }}
                  >
                    <p className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>
                      No events yet. Click "Add Event" to start building the SnapCharT.
                    </p>
                  </div>
                ) : (
                  <div className="relative pl-6">
                    <div
                      className="absolute left-[11px] top-2 bottom-2 w-px"
                      style={{ background: "var(--b-border-strong)" }}
                    />
                    <div className="space-y-3">
                      {state.timelineEvents.map((ev, idx) => (
                        <div key={idx} className="relative flex gap-2">
                          <div
                            className="absolute -left-[19px] top-2.5 w-2.5 h-2.5 border-2 flex-shrink-0"
                            style={{ background: "var(--b-bg)", borderColor: "var(--b-accent-text)" }}
                          />
                          <input
                            type="time"
                            value={ev.time}
                            onChange={e => setState(s => {
                              const evs = [...s.timelineEvents];
                              evs[idx] = { ...evs[idx], time: e.target.value };
                              return { ...s, timelineEvents: evs };
                            })}
                            className="h-[32px] px-2 text-[12px] border outline-none w-[90px] flex-shrink-0 font-mono transition-colors focus:border-[var(--b-accent-text)]"
                            style={fieldBase}
                          />
                          <input
                            type="text"
                            value={ev.description}
                            onChange={e => setState(s => {
                              const evs = [...s.timelineEvents];
                              evs[idx] = { ...evs[idx], description: e.target.value };
                              return { ...s, timelineEvents: evs };
                            })}
                            placeholder="Describe what happened at this time…"
                            className="flex-1 h-[32px] px-3 text-[12.5px] border outline-none transition-colors focus:border-[var(--b-accent-text)]"
                            style={fieldBase}
                          />
                          <button
                            type="button"
                            onClick={() => setState(s => ({ ...s, timelineEvents: s.timelineEvents.filter((_, i) => i !== idx) }))}
                            className="h-[32px] w-[32px] flex items-center justify-center flex-shrink-0"
                            style={{ color: "var(--b-text-muted)" }}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Next hint */}
              {(state.timelineEvents.length > 0 || state.sceneNotes) && (
                <div className="mt-8 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setTab("icam")}
                    className="flex items-center gap-1.5 text-[12px] font-medium"
                    style={{ color: "var(--b-accent-text)" }}
                  >
                    Proceed to ICAM Analysis <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── ICAM Analysis ── */}
          {tab === "icam" && (
            <div>
              <div className="mb-6 p-3.5 border" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-accent-text)" }} />
                  <span className="text-[12px] font-semibold" style={{ color: "var(--b-text)" }}>ICAM Causal Chain</span>
                </div>
                <p className="text-[11.5px] mb-3" style={{ color: "var(--b-text-muted)" }}>
                  ICAM analyses the full causal chain from organisational system failures down to the point of incident. Work through each layer to identify all contributing factors.
                </p>
                <div className="flex items-center gap-1 flex-wrap">
                  {[
                    { label: "C · Org. Factors",       bg: "var(--b-badge-blue-bg)",    c: "var(--b-badge-blue-text)" },
                    { label: "→",                       bg: "transparent",               c: "var(--b-text-muted)" },
                    { label: "B · Individual/Team",     bg: "var(--b-badge-yellow-bg)",  c: "var(--b-badge-yellow-text)" },
                    { label: "→",                       bg: "transparent",               c: "var(--b-text-muted)" },
                    { label: "A · Failed Defences",     bg: "rgba(240,96,96,0.1)",       c: "#f06060" },
                    { label: "→",                       bg: "transparent",               c: "var(--b-text-muted)" },
                    { label: "Incident",                bg: "var(--b-border)",           c: "var(--b-text)" },
                  ].map((item, i) => (
                    <span key={i} className="text-[11px] font-semibold px-2 py-0.5" style={{ background: item.bg, color: item.c }}>
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* A: Absent/Failed Defences */}
              <div style={divider}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: "rgba(240,96,96,0.1)", color: "#f06060" }}>A</span>
                  <h3 className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>Absent or Failed Defences</h3>
                  {state.defences.length > 0 && (
                    <span className="text-[11px] px-1.5 py-0.5" style={{ background: "rgba(240,96,96,0.1)", color: "#f06060" }}>
                      {state.defences.length} identified
                    </span>
                  )}
                </div>
                <p className="text-[11.5px] mb-3" style={{ color: "var(--b-text-muted)" }}>
                  What barriers or safeguards should have prevented this incident but were absent or failed?
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {DEFENCES.map(d => (
                    <Chk
                      key={d.id}
                      checked={state.defences.includes(d.id)}
                      onChange={() => toggle("defences", d.id)}
                      label={d.label}
                      sub={d.cat}
                    />
                  ))}
                </div>
              </div>

              {/* B: Individual/Team Actions */}
              <div style={divider}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" }}>B</span>
                  <h3 className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>Individual / Team Actions</h3>
                  {state.individualFactors.length > 0 && (
                    <span className="text-[11px] px-1.5 py-0.5" style={{ background: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" }}>
                      {state.individualFactors.length} identified
                    </span>
                  )}
                </div>
                <p className="text-[11.5px] mb-3" style={{ color: "var(--b-text-muted)" }}>
                  What actions, errors or task/environmental conditions at the individual or team level contributed?
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {INDIVIDUAL_FACTORS.map(f => (
                    <Chk
                      key={f.id}
                      checked={state.individualFactors.includes(f.id)}
                      onChange={() => toggle("individualFactors", f.id)}
                      label={f.label}
                    />
                  ))}
                </div>
              </div>

              {/* C: Organisational Factors */}
              <div style={divider}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: "var(--b-badge-blue-bg)", color: "var(--b-badge-blue-text)" }}>C</span>
                  <h3 className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>Organisational / Management Factors</h3>
                  {state.orgFactors.length > 0 && (
                    <span className="text-[11px] px-1.5 py-0.5" style={{ background: "var(--b-badge-blue-bg)", color: "var(--b-badge-blue-text)" }}>
                      {state.orgFactors.length} identified
                    </span>
                  )}
                </div>
                <p className="text-[11.5px] mb-3" style={{ color: "var(--b-text-muted)" }}>
                  What management system, organisational or cultural factors created conditions for this incident?
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {ORG_FACTORS.map(f => (
                    <Chk
                      key={f.id}
                      checked={state.orgFactors.includes(f.id)}
                      onChange={() => toggle("orgFactors", f.id)}
                      label={f.label}
                    />
                  ))}
                </div>
              </div>

              {/* D: Contributing Factors */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: "var(--b-bg-active)", color: "var(--b-text-muted)" }}>D</span>
                  <h3 className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>Contributing Factors (Narrative)</h3>
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
                    Additional context not captured in the checkboxes above.
                  </p>
                  <AiButton
                    prompt={`Write a concise ICAM contributing factors narrative (3–4 sentences, Australian WHS report style) for a ${incident.type} at ${incident.location} on ${incident.date}. ICAM factors identified — Absent/Failed Defences: ${DEFENCES.filter(d => state.defences.includes(d.id)).map(d => d.label).join(", ") || "none"}. Individual/Team Actions: ${INDIVIDUAL_FACTORS.filter(f => state.individualFactors.includes(f.id)).map(f => f.label).join(", ") || "none"}. Organisational Factors: ${ORG_FACTORS.filter(f => state.orgFactors.includes(f.id)).map(f => f.label).join(", ") || "none"}.`}
                    onStream={chunk => setState(s => ({ ...s, contributingFactors: chunk ? s.contributingFactors + chunk : "" }))}
                    label="AI Draft"
                  />
                </div>
                <textarea
                  rows={4}
                  value={state.contributingFactors}
                  onChange={e => setState(s => ({ ...s, contributingFactors: e.target.value }))}
                  placeholder="Describe broader context — programme pressures, environmental conditions, historical trends…"
                  className="w-full px-3 py-2.5 text-[12.5px] border outline-none resize-none transition-colors focus:border-[var(--b-accent-text)]"
                  style={fieldBase}
                />
              </div>

              {totalIcam > 0 && (
                <div className="mt-8 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setTab("taproot")}
                    className="flex items-center gap-1.5 text-[12px] font-medium"
                    style={{ color: "var(--b-accent-text)" }}
                  >
                    Proceed to TapRooT Root Cause Tree <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── TapRooT ── */}
          {tab === "taproot" && (
            <div>
              <div className="mb-6 p-3.5 border" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <GitBranch className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-badge-blue-text)" }} />
                  <span className="text-[12px] font-semibold" style={{ color: "var(--b-text)" }}>TapRooT® Root Cause Tree</span>
                </div>
                <p className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
                  For each causal factor identified in the ICAM Analysis, use the Root Cause Tree to determine WHY that factor existed. Selected root causes drive the corrective actions in the next tab.
                </p>
              </div>

              {/* ICAM factors for reference */}
              {totalIcam > 0 && (
                <div className="mb-6 p-3 border" style={{ borderColor: "var(--b-border-strong)", background: "var(--b-bg)" }}>
                  <div className="text-[11px] font-semibold uppercase tracking-widest mb-2.5" style={{ color: "var(--b-text-muted)" }}>
                    ICAM Causal Factors to Address ({totalIcam})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      ...DEFENCES.filter(d => state.defences.includes(d.id)).map(d => ({ label: d.label, bg: "rgba(240,96,96,0.1)", c: "#f06060" })),
                      ...INDIVIDUAL_FACTORS.filter(f => state.individualFactors.includes(f.id)).map(f => ({ label: f.label, bg: "var(--b-badge-yellow-bg)", c: "var(--b-badge-yellow-text)" })),
                      ...ORG_FACTORS.filter(f => state.orgFactors.includes(f.id)).map(f => ({ label: f.label, bg: "var(--b-badge-blue-bg)", c: "var(--b-badge-blue-text)" })),
                    ].map((item, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 leading-snug" style={{ background: item.bg, color: item.c }}>
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Root Cause Tree */}
              <div className="space-y-2">
                {TAPROOT_TREE.map(section => {
                  const checkedCount = section.children.filter(c => state.taproot.includes(c.id)).length;
                  const isExpanded = expanded.includes(section.id);
                  return (
                    <div key={section.id} className="border overflow-hidden" style={{ borderColor: "var(--b-border)" }}>
                      <button
                        type="button"
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                        style={{ background: isExpanded ? "var(--b-bg-active)" : "var(--b-bg)" }}
                      >
                        {isExpanded
                          ? <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />
                          : <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />
                        }
                        <span className="flex-1 text-[12.5px] font-semibold" style={{ color: "var(--b-text)" }}>
                          {section.label}
                        </span>
                        {checkedCount > 0 && (
                          <span
                            className="text-[11px] font-bold px-2 py-0.5"
                            style={{ background: "var(--b-accent-bg)", color: "var(--b-accent-text)", border: "1px solid var(--b-accent-border)" }}
                          >
                            {checkedCount} selected
                          </span>
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-3 border-t" style={{ borderColor: "var(--b-border)" }}>
                          <div className="h-2" />
                          <div className="grid grid-cols-1 gap-1.5">
                            {section.children.map(child => (
                              <Chk
                                key={child.id}
                                checked={state.taproot.includes(child.id)}
                                onChange={() => toggle("taproot", child.id)}
                                label={child.label}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {state.taproot.length > 0 && (
                <div className="mt-6 p-3.5 border" style={{ background: "var(--b-badge-green-bg)", borderColor: "var(--b-badge-green-text)" }}>
                  <div className="text-[12px] font-semibold mb-1" style={{ color: "var(--b-badge-green-text)" }}>
                    {state.taproot.length} root cause{state.taproot.length !== 1 ? "s" : ""} identified
                  </div>
                  <p className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
                    Each selected root cause should map to one or more corrective actions. Proceed to Corrective Actions to complete the investigation.
                  </p>
                  <button
                    type="button"
                    onClick={() => setTab("actions")}
                    className="mt-2.5 flex items-center gap-1.5 text-[12px] font-medium"
                    style={{ color: "var(--b-accent-text)" }}
                  >
                    Proceed to Corrective Actions <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Corrective Actions ── */}
          {tab === "actions" && (
            <div>
              <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                  <h3 className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>Corrective Actions</h3>
                  <p className="text-[11.5px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>
                    Each action is linked to an ICAM causal factor and TapRooT root cause to ensure systemic closure.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <AiButton
                    prompt={`Generate 3–4 corrective actions for an ICAM/TapRooT investigation of a ${incident.type} at ${incident.location}. ICAM causal factors: ${[...DEFENCES.filter(d => state.defences.includes(d.id)).map(d => d.label), ...INDIVIDUAL_FACTORS.filter(f => state.individualFactors.includes(f.id)).map(f => f.label), ...ORG_FACTORS.filter(f => state.orgFactors.includes(f.id)).map(f => f.label)].join("; ") || "none identified"}. TapRooT root causes: ${TAPROOT_TREE.flatMap(s => s.children).filter(c => state.taproot.includes(c.id)).map(c => c.label).join(", ") || "none identified"}. Format as a numbered list. Each line: action description (Type: Immediate|Systemic|Preventive).`}
                    onStream={() => {}}
                    label="AI Suggest"
                  />
                  <button
                    type="button"
                    onClick={() => setState(s => ({
                      ...s,
                      actions: [...s.actions, {
                        id: `new-${Date.now()}`,
                        description: "",
                        icamCategory: "",
                        taprootCategory: "",
                        actionType: "Systemic" as const,
                        assignee: "",
                        dueDate: "",
                        status: "Open" as const,
                      }],
                    }))}
                    className="flex items-center gap-1.5 h-[34px] px-3 text-[12px] font-medium border transition-colors"
                    style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text-muted)" }}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Action
                  </button>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 mb-5 text-[11px]" style={{ color: "var(--b-text-muted)" }}>
                <span>Action types:</span>
                {(["Immediate", "Systemic", "Preventive"] as const).map(type => (
                  <span key={type} className="px-2 py-0.5 font-semibold" style={ACTION_STYLE[type]}>{type}</span>
                ))}
              </div>

              {state.actions.length === 0 ? (
                <div
                  className="py-12 text-center border"
                  style={{ borderColor: "var(--b-border)", borderStyle: "dashed" }}
                >
                  <p className="text-[12px] mb-1" style={{ color: "var(--b-text-muted)" }}>No corrective actions yet.</p>
                  <p className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
                    Complete the ICAM and TapRooT tabs, then add actions that address each identified root cause.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {state.actions.map((action, idx) => (
                    <div
                      key={action.id}
                      className="border p-4"
                      style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-bold px-2 py-0.5" style={ACTION_STYLE[action.actionType]}>
                            {action.actionType}
                          </span>
                          {action.icamCategory && (
                            <span
                              className="text-[11px] px-2 py-0.5"
                              style={{ background: "var(--b-bg-secondary)", color: "var(--b-text-muted)", border: "1px solid var(--b-border)" }}
                            >
                              ICAM: {action.icamCategory}
                            </span>
                          )}
                          {action.taprootCategory && (
                            <span
                              className="text-[11px] px-2 py-0.5"
                              style={{ background: "var(--b-badge-blue-bg)", color: "var(--b-badge-blue-text)" }}
                            >
                              TapRooT: {action.taprootCategory}
                            </span>
                          )}
                          {action.status === "Closed" && (
                            <span
                              className="flex items-center gap-1 text-[11px] px-2 py-0.5"
                              style={{ background: "var(--b-badge-green-bg)", color: "var(--b-badge-green-text)" }}
                            >
                              <CheckCircle2 className="w-3 h-3" /> Closed
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setState(s => ({ ...s, actions: s.actions.filter((_, i) => i !== idx) }))}
                          className="flex-shrink-0"
                          style={{ color: "var(--b-text-muted)" }}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[12.5px] leading-snug mb-3" style={{ color: "var(--b-text)" }}>
                        {action.description || (
                          <span style={{ color: "var(--b-text-muted)" }}>No description entered</span>
                        )}
                      </p>
                      <div className="flex items-center gap-4 text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
                        <span>{action.assignee || "Unassigned"}</span>
                        <span>Due: {action.dueDate || "—"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {state.actions.length > 0 && (
                <div className="mt-6 p-4 border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
                  <div className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--b-text-muted)" }}>
                    Action Summary
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {(["Immediate", "Systemic", "Preventive"] as const).map(type => {
                      const count = state.actions.filter(a => a.actionType === type).length;
                      return (
                        <div key={type} className="text-center p-3" style={{ background: ACTION_STYLE[type].bg }}>
                          <div className="text-[22px] font-bold" style={{ color: ACTION_STYLE[type].color }}>{count}</div>
                          <div className="text-[11px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>{type}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── Footer ── */}
      <div className="border-t flex-shrink-0" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
        <div className="mx-auto max-w-[900px] px-5 sm:px-8 py-3.5 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="b-btn-ghost flex items-center gap-1.5 px-4 h-[40px] text-[13px] font-medium"
          >
            Close
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
              {completedPhases} of 4 phases complete
            </span>
            <button
              onClick={onClose}
              className="b-btn-accent flex items-center gap-1.5 px-6 h-[40px] text-[13px] font-semibold"
            >
              Save Investigation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
