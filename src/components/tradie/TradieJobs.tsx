"use client";

import { useState } from "react";
import { Plus, MapPin, Clock, X, ChevronDown } from "lucide-react";

const YELLOW = "#ffd600";
const GREEN  = "#1a8a4a";

type Status = "Scheduled" | "In Progress" | "Done" | "Invoiced";

interface Job {
  id: number;
  date: string;
  client: string;
  address: string;
  type: string;
  status: Status;
  hours: number;
  notes: string;
}

const SEED: Job[] = [
  { id: 1, date: "22 Jun 2024", client: "Morrison Residence",   address: "14 Elm St, Mosman",         type: "Plumbing",        status: "In Progress", hours: 3,   notes: "Fix leaking tap + replace flexi hoses under sink." },
  { id: 2, date: "22 Jun 2024", client: "Blue Bay Apartments",  address: "88 Pacific Ave, Manly",      type: "Plumbing",        status: "Scheduled",   hours: 2,   notes: "Blocked drain — unit 4B." },
  { id: 3, date: "21 Jun 2024", client: "Hendry Property",      address: "32 Outlook Dr, Balgowlah",   type: "Hot Water",       status: "Done",        hours: 1.5, notes: "Replace Rinnai Infinity 26." },
  { id: 4, date: "20 Jun 2024", client: "Rideaux Build Co.",    address: "109 George St, Redfern",     type: "Rough-in",        status: "Invoiced",    hours: 8,   notes: "2-storey residential rough-in. Stage 1 complete." },
  { id: 5, date: "19 Jun 2024", client: "Delacour Family",      address: "6 Cedar Ave, Turramurra",    type: "Bathroom Reno",   status: "Done",        hours: 6,   notes: "Full bathroom replumb. Tile-ready." },
  { id: 6, date: "18 Jun 2024", client: "Ridgeline Strata",     address: "22 Surf Rd, Dee Why",        type: "Maintenance",     status: "Invoiced",    hours: 2.5, notes: "Annual gutter + downpipe inspection." },
];

const STATUS_CONFIG: Record<Status, { color: string; bg: string }> = {
  "Scheduled":   { color: "var(--b-badge-blue-text)", bg: "rgba(80,130,255,0.08)"  },
  "In Progress": { color: YELLOW,                     bg: "rgba(255,214,0,0.1)"    },
  "Done":        { color: GREEN,                      bg: "rgba(26,138,74,0.08)"   },
  "Invoiced":    { color: "var(--b-text-muted)",      bg: "var(--b-bg-active)"     },
};

const TRADE_TYPES = ["Plumbing", "Hot Water", "Rough-in", "Bathroom Reno", "Maintenance", "Gas", "Drainage", "Other"];
const STATUSES: Status[] = ["Scheduled", "In Progress", "Done", "Invoiced"];

const INIT = { client: "", address: "", type: "Plumbing", status: "Scheduled" as Status, hours: "", notes: "", date: new Date().toISOString().slice(0,10) };

export function TradieJobs() {
  const [jobs, setJobs]       = useState<Job[]>(SEED);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<Status | "">("");
  const [f, setF]             = useState(INIT);
  const set = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));

  const totalHours = jobs.filter(j => j.status === "Done" || j.status === "Invoiced").reduce((s, j) => s + j.hours, 0);
  const filtered   = filterStatus ? jobs.filter(j => j.status === filterStatus) : jobs;

  function addJob() {
    if (!f.client || !f.address) return;
    const newJob: Job = {
      id:      Date.now(),
      date:    new Date(f.date).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" }),
      client:  f.client,
      address: f.address,
      type:    f.type,
      status:  f.status,
      hours:   parseFloat(f.hours) || 0,
      notes:   f.notes,
    };
    setJobs(prev => [newJob, ...prev]);
    setF(INIT);
    setDrawerOpen(false);
  }

  return (
    <div className="p-5 max-w-[900px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-[800] tracking-tight" style={{ color: "var(--b-text)" }}>Job Log</h1>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>Track your jobs, hours and clients.</p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-1.5 px-4 h-9 text-[12.5px] font-[700]"
          style={{ background: YELLOW, color: "#0a0a0a" }}
        >
          <Plus className="w-3.5 h-3.5" /> Log Job
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Jobs",       value: String(jobs.length) },
          { label: "Hours Completed",  value: `${totalHours}h`    },
          { label: "This Month",       value: String(jobs.filter(j => j.date.includes("Jun")).length) },
          { label: "To Invoice",       value: String(jobs.filter(j => j.status === "Done").length)    },
        ].map(s => (
          <div key={s.label} className="border px-3 py-2.5 text-center" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
            <div className="text-[20px] font-[800] leading-none" style={{ color: "var(--b-text)" }}>{s.value}</div>
            <div className="text-[10.5px] mt-1" style={{ color: "var(--b-text-muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4">
        {(["", ...STATUSES] as (Status | "")[]).map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className="px-3 h-7 text-[11.5px] font-[600] border transition-colors"
            style={{
              borderColor: filterStatus === s ? YELLOW : "var(--b-border)",
              color:       filterStatus === s ? YELLOW : "var(--b-text-muted)",
              background:  filterStatus === s ? "rgba(255,214,0,0.08)" : "transparent",
            }}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {/* Job list */}
      <div className="space-y-2">
        {filtered.map(job => {
          const st = STATUS_CONFIG[job.status];
          return (
            <div key={job.id} className="flex items-start gap-3 border px-4 py-3" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
              {/* Left */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[12.5px] font-[700]" style={{ color: "var(--b-text)" }}>{job.client}</span>
                  <span className="text-[10.5px] font-[600] px-1.5 py-px" style={{ background: st.bg, color: st.color }}>{job.status}</span>
                  <span className="text-[10.5px] px-1.5 py-px font-[500]" style={{ background: "var(--b-bg-active)", color: "var(--b-text-muted)" }}>{job.type}</span>
                </div>
                <p className="flex items-center gap-1 text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
                  <MapPin className="w-3 h-3 flex-shrink-0" />{job.address}
                </p>
                {job.notes && <p className="text-[11.5px] mt-1 italic" style={{ color: "var(--b-text-muted)" }}>{job.notes}</p>}
              </div>
              {/* Right */}
              <div className="flex-shrink-0 text-right">
                <p className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>{job.date}</p>
                <p className="flex items-center gap-1 justify-end text-[11.5px] font-[600] mt-0.5" style={{ color: "var(--b-text-secondary)" }}>
                  <Clock className="w-3 h-3" />{job.hours}h
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="flex flex-col border-l h-full" style={{ width: 400, background: "var(--b-bg)", borderColor: "var(--b-border-strong)" }}>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b flex-shrink-0" style={{ borderColor: "var(--b-border)" }}>
              <span className="text-[13px] font-[700]" style={{ color: "var(--b-text)" }}>Log a Job</span>
              <button onClick={() => setDrawerOpen(false)} className="ml-auto" style={{ color: "var(--b-text-muted)" }}><X className="w-4 h-4" /></button>
            </div>
            {/* Form */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {[
                { label: "Client Name *",  key: "client",  placeholder: "e.g. Morrison Residence" },
                { label: "Address *",      key: "address", placeholder: "e.g. 14 Elm St, Mosman"  },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-[11px] font-[700] uppercase tracking-wide mb-1.5" style={{ color: "var(--b-text-muted)" }}>{label}</label>
                  <input
                    className="w-full px-3 h-[36px] border text-[12.5px] outline-none"
                    style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }}
                    placeholder={placeholder}
                    value={f[key as keyof typeof INIT]}
                    onChange={e => set(key as keyof typeof INIT, e.target.value)}
                    onFocus={e => (e.currentTarget.style.borderColor = YELLOW)}
                    onBlur={e => (e.currentTarget.style.borderColor = "var(--b-border-strong)")}
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-[700] uppercase tracking-wide mb-1.5" style={{ color: "var(--b-text-muted)" }}>Trade Type</label>
                  <div className="relative">
                    <select
                      className="w-full px-3 h-[36px] border text-[12.5px] outline-none appearance-none"
                      style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }}
                      value={f.type} onChange={e => set("type", e.target.value)}
                    >
                      {TRADE_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--b-text-muted)" }} />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-[700] uppercase tracking-wide mb-1.5" style={{ color: "var(--b-text-muted)" }}>Status</label>
                  <div className="relative">
                    <select
                      className="w-full px-3 h-[36px] border text-[12.5px] outline-none appearance-none"
                      style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }}
                      value={f.status} onChange={e => set("status", e.target.value as Status)}
                    >
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--b-text-muted)" }} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-[700] uppercase tracking-wide mb-1.5" style={{ color: "var(--b-text-muted)" }}>Date</label>
                  <input type="date" className="w-full px-3 h-[36px] border text-[12.5px] outline-none" style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }} value={f.date} onChange={e => set("date", e.target.value)} />
                </div>
                <div>
                  <label className="block text-[11px] font-[700] uppercase tracking-wide mb-1.5" style={{ color: "var(--b-text-muted)" }}>Hours</label>
                  <input type="number" step="0.5" min="0" max="24" className="w-full px-3 h-[36px] border text-[12.5px] outline-none" style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }} placeholder="e.g. 3.5" value={f.hours} onChange={e => set("hours", e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-[700] uppercase tracking-wide mb-1.5" style={{ color: "var(--b-text-muted)" }}>Notes</label>
                <textarea
                  className="w-full px-3 py-2 border text-[12.5px] outline-none resize-none"
                  rows={3}
                  style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", color: "var(--b-text)", fontFamily: "inherit", lineHeight: 1.6 }}
                  placeholder="What was the job? Any issues?"
                  value={f.notes}
                  onChange={e => set("notes", e.target.value)}
                />
              </div>
            </div>
            {/* Footer */}
            <div className="flex gap-2 px-5 py-4 border-t flex-shrink-0" style={{ borderColor: "var(--b-border)" }}>
              <button onClick={() => setDrawerOpen(false)} className="flex-1 h-9 text-[12.5px] font-[600] border" style={{ borderColor: "var(--b-border-strong)", color: "var(--b-text-muted)", background: "transparent" }}>Cancel</button>
              <button onClick={addJob} className="flex-1 h-9 text-[12.5px] font-[700]" style={{ background: YELLOW, color: "#0a0a0a" }}>Save Job</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
