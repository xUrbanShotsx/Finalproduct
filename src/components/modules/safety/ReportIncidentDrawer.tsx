"use client";

import { X, Plus, ChevronDown } from "lucide-react";
import { useState } from "react";
import { AiButton } from "../AiButton";

interface Props {
  open: boolean;
  onClose: () => void;
}

const INCIDENT_TYPES = [
  "Near Miss",
  "First Aid Injury",
  "Medical Treatment Injury",
  "Lost Time Injury",
  "Serious Injury or Illness",
  "Dangerous Incident",
  "Property Damage",
  "Environmental",
  "Fatality",
];

const SITES = ["Site 01", "Site 02", "Site 03", "All Sites", "Office"];
const SEVERITIES = ["Critical", "High", "Medium", "Low"] as const;
const ASSIGNEES = ["J. Smith", "M. Jones", "K. Davis", "T. Walsh", "D. Wong", "S. Lee", "P. Nguyen"];

/* ── Shared field styles ── */
const fieldBase: React.CSSProperties = {
  background: "var(--b-bg)",
  borderColor: "var(--b-border-strong)",
  color: "var(--b-text)",
};

/* ── Native select, stripped of browser chrome ── */
function Select({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[36px] pl-3 pr-8 text-[12.5px] border outline-none appearance-none cursor-pointer transition-colors focus:border-[var(--b-accent-text)]"
        style={{
          ...fieldBase,
          color: value ? "var(--b-text)" : "var(--b-text-placeholder)",
        }}
      >
        <option value="" disabled style={{ color: "var(--b-text-muted)", background: "var(--b-bg-secondary)" }}>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o} style={{ color: "var(--b-text)", background: "var(--b-bg-secondary)" }}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: "var(--b-text-muted)" }}
      />
    </div>
  );
}

/* ── Option group — matches field height/border/bg ── */
function OptionGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T | "";
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex">
      {options.map((opt, i) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="flex-1 h-[36px] text-[12.5px] transition-colors"
            style={{
              background: active ? "var(--b-accent-bg)" : "var(--b-bg)",
              color: active ? "var(--b-accent-text)" : "var(--b-text-muted)",
              border: "1px solid",
              borderColor: active ? "var(--b-accent-border)" : "var(--b-border-strong)",
              marginLeft: i === 0 ? 0 : -1,
              fontWeight: active ? 600 : 400,
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

/* ── Text input ── */
function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-[36px] px-3 text-[12.5px] border outline-none appearance-none transition-colors focus:border-[var(--b-accent-text)]"
      style={fieldBase}
    />
  );
}

/* ── Textarea ── */
function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 text-[12.5px] border outline-none appearance-none resize-none transition-colors focus:border-[var(--b-accent-text)]"
      style={fieldBase}
    />
  );
}

export function ReportIncidentDrawer({ open, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    incidentType: "",
    date: "",
    time: "",
    site: "",
    specificLocation: "",
    description: "",
    immediateActions: "",
    severity: "" as (typeof SEVERITIES)[number] | "",
    injuryOccurred: "" as "Yes" | "No" | "",
    injuredPerson: "",
    injuryType: "",
    notifiableIncident: "" as "Yes" | "No" | "",
    regulatorNotified: "" as "Notified" | "Not yet" | "",
    assignee: "",
    witnesses: "",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleClose() {
    setStep(1);
    setForm({
      incidentType: "", date: "", time: "", site: "", specificLocation: "",
      description: "", immediateActions: "", severity: "", injuryOccurred: "",
      injuredPerson: "", injuryType: "", notifiableIncident: "",
      regulatorNotified: "", assignee: "", witnesses: "",
    });
    onClose();
  }

  const labelClass = "block text-[11px] font-semibold uppercase tracking-widest mb-1.5";
  const labelStyle = { color: "var(--b-text-muted)" };
  const divider = { borderBottom: "1px solid var(--b-border)", paddingBottom: "1.25rem", marginBottom: "1.25rem" };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.55)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 z-50 h-full flex flex-col transition-transform duration-300"
        style={{
          width: "33.333%",
          background: "var(--b-bg-secondary)",
          borderLeft: "1px solid var(--b-border)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0 border-b"
          style={{ borderColor: "var(--b-border)" }}
        >
          <div>
            <div className="text-[15px] font-semibold" style={{ color: "var(--b-text)" }}>Report Incident</div>
            <div className="text-[11.5px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>Step {step} of 3</div>
          </div>
          <button onClick={handleClose} className="b-icon-btn w-8 h-8 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step tabs */}
        <div className="flex flex-shrink-0" style={{ borderBottom: "1px solid var(--b-border)" }}>
          {[
            { n: 1, label: "Incident Details" },
            { n: 2, label: "People & Injury" },
            { n: 3, label: "Assign & Submit" },
          ].map(({ n, label }) => (
            <div
              key={n}
              className="flex-1 py-2.5 text-center text-[11px] font-semibold cursor-pointer transition-colors"
              style={{
                color: step === n ? "var(--b-accent-text)" : "var(--b-text-muted)",
                borderBottom: step === n ? "2px solid var(--b-accent-text)" : "2px solid transparent",
                background: step === n ? "var(--b-accent-bg)" : "transparent",
              }}
              onClick={() => setStep(n)}
            >
              {n}. {label}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <div style={divider}>
                <label className={labelClass} style={labelStyle}>Incident Type *</label>
                <Select
                  value={form.incidentType}
                  onChange={(v) => set("incidentType", v)}
                  placeholder="Select type…"
                  options={INCIDENT_TYPES}
                />
              </div>

              <div style={divider}>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className={labelClass} style={labelStyle}>Date *</label>
                    <Input type="date" value={form.date} onChange={(v) => set("date", v)} />
                  </div>
                  <div className="flex-1">
                    <label className={labelClass} style={labelStyle}>Time *</label>
                    <Input type="time" value={form.time} onChange={(v) => set("time", v)} />
                  </div>
                </div>
              </div>

              <div style={divider}>
                <label className={labelClass} style={labelStyle}>Site *</label>
                <Select
                  value={form.site}
                  onChange={(v) => set("site", v)}
                  placeholder="Select site…"
                  options={SITES}
                />
                <div className="mt-3">
                  <label className={labelClass} style={labelStyle}>Specific Location</label>
                  <Input
                    value={form.specificLocation}
                    onChange={(v) => set("specificLocation", v)}
                    placeholder="e.g. Level 3 — North slab edge"
                  />
                </div>
              </div>

              <div style={divider}>
                <label className={labelClass} style={labelStyle}>Description *</label>
                <Textarea
                  rows={4}
                  value={form.description}
                  onChange={(v) => set("description", v)}
                  placeholder="Describe what happened, the sequence of events, and the outcome…"
                />
              </div>

              <div style={divider}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={labelClass} style={{ ...labelStyle, marginBottom: 0 }}>Immediate Actions Taken</label>
                  <AiButton
                    disabled={!form.incidentType}
                    label="Suggest actions"
                    prompt={`List the immediate actions that should be taken following a "${form.incidentType || "workplace incident"}"${form.severity ? ` rated ${form.severity} severity` : ""} on an Australian construction site. Include scene preservation, first aid, isolation, notification obligations under the WHS Act, and witness management. Write as a plain numbered list, one action per line.`}
                    onStream={chunk => set("immediateActions", chunk ? form.immediateActions + chunk : "")}
                  />
                </div>
                <Textarea
                  value={form.immediateActions}
                  onChange={(v) => set("immediateActions", v)}
                  placeholder="e.g. Area isolated, first aid applied, regulator notified…"
                />
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>Initial Severity Assessment *</label>
                <OptionGroup options={SEVERITIES} value={form.severity} onChange={(v) => set("severity", v)} />
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <div style={divider}>
                <label className={labelClass} style={labelStyle}>Was anyone injured?</label>
                <OptionGroup
                  options={["Yes", "No"] as const}
                  value={form.injuryOccurred}
                  onChange={(v) => set("injuryOccurred", v)}
                />
              </div>

              {form.injuryOccurred === "Yes" && (
                <div style={divider}>
                  <div className="mb-3">
                    <label className={labelClass} style={labelStyle}>Injured Person (name)</label>
                    <Input
                      value={form.injuredPerson}
                      onChange={(v) => set("injuredPerson", v)}
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className={labelClass} style={labelStyle}>Nature of Injury</label>
                    <Input
                      value={form.injuryType}
                      onChange={(v) => set("injuryType", v)}
                      placeholder="e.g. Laceration to right hand, sprain to left ankle"
                    />
                  </div>
                </div>
              )}

              <div style={divider}>
                <label className={labelClass} style={labelStyle}>Witnesses</label>
                <Input
                  value={form.witnesses}
                  onChange={(v) => set("witnesses", v)}
                  placeholder="Names of anyone who witnessed the incident"
                />
              </div>

              <div style={divider}>
                <label className={labelClass} style={labelStyle}>Is this a notifiable incident?</label>
                <p className="text-[11.5px] mb-2.5" style={{ color: "var(--b-text-muted)" }}>
                  Notifiable incidents include deaths, serious injuries, or dangerous incidents under WHS Act s35–37.
                </p>
                <OptionGroup
                  options={["Yes", "No"] as const}
                  value={form.notifiableIncident}
                  onChange={(v) => set("notifiableIncident", v)}
                />
              </div>

              {form.notifiableIncident === "Yes" && (
                <div className="p-3 mb-5 border" style={{ background: "rgba(240,96,96,0.06)", borderColor: "#f06060" }}>
                  <div className="text-[11.5px] font-semibold mb-2.5" style={{ color: "#f06060" }}>
                    Regulator must be notified immediately (WHS Act s38)
                  </div>
                  <OptionGroup
                    options={["Notified", "Not yet"] as const}
                    value={form.regulatorNotified}
                    onChange={(v) => set("regulatorNotified", v)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <div style={divider}>
                <label className={labelClass} style={labelStyle}>Assign Investigation To</label>
                <Select
                  value={form.assignee}
                  onChange={(v) => set("assignee", v)}
                  placeholder="Unassigned"
                  options={ASSIGNEES}
                />
              </div>

              <div className="mb-5">
                <div className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--b-text-muted)" }}>
                  Summary
                </div>
                <div className="border p-4 space-y-2.5" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
                  {[
                    ["Type",       form.incidentType || "—"],
                    ["Date / Time",form.date && form.time ? `${form.date} at ${form.time}` : form.date || "—"],
                    ["Site",       form.site || "—"],
                    ["Location",   form.specificLocation || "—"],
                    ["Severity",   form.severity || "—"],
                    ["Injured",    form.injuryOccurred === "Yes" ? (form.injuredPerson || "Yes — name not entered") : form.injuryOccurred === "No" ? "No" : "—"],
                    ["Notifiable", form.notifiableIncident || "—"],
                    ["Assignee",   form.assignee || "Unassigned"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-3 text-[12px]">
                      <span className="w-24 flex-shrink-0 font-medium" style={{ color: "var(--b-text-muted)" }}>{k}</span>
                      <span style={{ color: "var(--b-text)" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {form.notifiableIncident === "Yes" && form.regulatorNotified !== "Notified" && (
                <div className="p-3 mb-4 border" style={{ background: "rgba(240,96,96,0.06)", borderColor: "#f06060" }}>
                  <span className="text-[12px] font-semibold" style={{ color: "#f06060" }}>
                    ⚠ Regulator has not been notified — action required before submitting.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0 border-t"
          style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}
        >
          <button
            onClick={step === 1 ? handleClose : () => setStep((s) => s - 1)}
            className="b-btn-ghost px-4 h-[34px] text-[12.5px] font-medium"
          >
            {step === 1 ? "Cancel" : "← Back"}
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="b-btn-accent flex items-center gap-1.5 px-5 h-[34px] text-[12.5px] font-medium"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="b-btn-accent flex items-center gap-1.5 px-5 h-[34px] text-[12.5px] font-medium"
            >
              <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
              Submit Incident
            </button>
          )}
        </div>
      </div>
    </>
  );
}
