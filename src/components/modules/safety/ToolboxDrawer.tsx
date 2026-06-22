"use client";

import { useEffect, useRef, useState } from "react";
import { Drawer } from "../Drawer";
import { Label, Section, Select, Input, Row, Col } from "../FormFields";
import { AiButton } from "../AiButton";
import { Search, X, PenLine, CheckCircle2, AlertCircle } from "lucide-react";

/* ─── Data ────────────────────────────────────────────────────────── */

const TOPICS = [
  "Working at Heights","Confined Space Safety","Hot Work Controls",
  "Manual Handling","Electrical Safety","Traffic Management",
  "Housekeeping","Incident Review","Near Miss Reporting",
  "Heat & Fatigue","Chemical Handling","Emergency Procedures",
  "Silica Dust","Struck-By Hazards","Scaffold Safety",
];
const SITES = ["Site 01","Site 02","Site 03","All Sites"];
const FACILITATORS = ["J. Smith","M. Jones","K. Davis","T. Walsh","D. Wong","S. Lee","P. Nguyen"];

const WORKER_POOL = [
  { id: "w1",  name: "Tom Morrison",   role: "Rigger",           site: "Site 01" },
  { id: "w2",  name: "Kelly Barnes",   role: "Dogman",           site: "Site 01" },
  { id: "w3",  name: "Daniel Walsh",   role: "Electrician",      site: "Site 02" },
  { id: "w4",  name: "Sarah Kim",      role: "Safety Officer",   site: "Site 01" },
  { id: "w5",  name: "James Chen",     role: "Labourer",         site: "Site 03" },
  { id: "w6",  name: "Mark Nguyen",    role: "Carpenter",        site: "Site 02" },
  { id: "w7",  name: "Priya Patel",    role: "Site Manager",     site: "Site 01" },
  { id: "w8",  name: "Luke Anderson",  role: "Plumber",          site: "Site 03" },
  { id: "w9",  name: "Emma Taylor",    role: "Labourer",         site: "Site 02" },
  { id: "w10", name: "Ryan O'Brien",   role: "Crane Operator",   site: "Site 01" },
  { id: "w11", name: "Mia Wong",       role: "Concreter",        site: "Site 03" },
  { id: "w12", name: "Jake Foster",    role: "Scaffolder",       site: "Site 02" },
  { id: "w13", name: "Chloe Martin",   role: "Traffic Controller","site": "Site 01" },
  { id: "w14", name: "Ben Harris",     role: "Boilermaker",      site: "Site 03" },
  { id: "w15", name: "Amy Liu",        role: "HSE Advisor",      site: "Site 02" },
];

/* ─── Signature pad ───────────────────────────────────────────────── */

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
  name: string;
}

function SignaturePad({ onSave, onCancel, name }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [hasMark, setHasMark] = useState(false);

  function getCtx() {
    const c = canvasRef.current;
    if (!c) return null;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    ctx.strokeStyle = "var(--b-text)";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    return ctx;
  }

  function pos(e: React.MouseEvent | React.TouchEvent) {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const src = "touches" in e ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  }

  function down(e: React.MouseEvent | React.TouchEvent) {
    drawing.current = true;
    const ctx = getCtx(); if (!ctx) return;
    const { x, y } = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setHasMark(true);
  }

  function move(e: React.MouseEvent | React.TouchEvent) {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = getCtx(); if (!ctx) return;
    const { x, y } = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function up() { drawing.current = false; }

  function clear() {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    setHasMark(false);
  }

  function save() {
    const c = canvasRef.current; if (!c) return;
    onSave(c.toDataURL());
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60">
      <div className="w-[480px] max-w-[calc(100vw-32px)] border" style={{ background: "var(--b-bg)", borderColor: "var(--b-border)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--b-border)" }}>
          <div>
            <p className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>Signature — {name}</p>
            <p className="text-[11.5px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>Sign below to confirm attendance at this toolbox talk</p>
          </div>
          <button onClick={onCancel} style={{ color: "var(--b-text-muted)" }}><X className="w-4 h-4" /></button>
        </div>

        {/* Canvas */}
        <div className="p-5">
          <div className="border relative" style={{ borderColor: "var(--b-border-strong)", background: "var(--b-bg-secondary)" }}>
            <canvas
              ref={canvasRef}
              width={432}
              height={160}
              className="w-full touch-none cursor-crosshair block"
              style={{ height: "160px" }}
              onMouseDown={down} onMouseMove={move} onMouseUp={up} onMouseLeave={up}
              onTouchStart={down} onTouchMove={move} onTouchEnd={up}
            />
            {!hasMark && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-2">
                <PenLine className="w-5 h-5" style={{ color: "var(--b-border-strong)" }} />
                <span className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>Sign here</span>
              </div>
            )}
            {/* Baseline */}
            <div className="absolute left-8 right-8 bottom-8 border-b border-dashed" style={{ borderColor: "var(--b-border-strong)" }} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 pb-5 gap-3">
          <button
            onClick={clear}
            className="text-[12.5px] underline"
            style={{ color: "var(--b-text-muted)" }}
          >
            Clear
          </button>
          <div className="flex gap-2">
            <button onClick={onCancel} className="b-btn-ghost px-4 h-[36px] text-[13px]">Cancel</button>
            <button
              onClick={save}
              disabled={!hasMark}
              className="b-btn-accent px-4 h-[36px] text-[13px] font-medium disabled:opacity-40"
            >
              Confirm Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main drawer ─────────────────────────────────────────────────── */

const INIT = { topic: "", site: "", facilitator: "", date: "", time: "", duration: "", keyPoints: "" };

interface Attendee {
  id: string;
  name: string;
  role: string;
  site: string;
  sig: string | null;
}

export function ToolboxDrawer({
  open, onClose, onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd?: (f: typeof INIT & { attendees: string; count: number }) => void;
}) {
  const [step, setStep] = useState(1);
  const [f, setF] = useState(INIT);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [search, setSearch] = useState("");
  const [signing, setSigning] = useState<Attendee | null>(null);

  const set = <K extends keyof typeof INIT>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));

  const filteredPool = WORKER_POOL.filter(w =>
    !attendees.find(a => a.id === w.id) &&
    (w.name.toLowerCase().includes(search.toLowerCase()) ||
     w.role.toLowerCase().includes(search.toLowerCase()) ||
     w.site.toLowerCase().includes(search.toLowerCase()))
  );

  function addWorker(w: (typeof WORKER_POOL)[number]) {
    setAttendees(prev => [...prev, { ...w, sig: null }]);
    setSearch("");
  }

  function removeWorker(id: string) {
    setAttendees(prev => prev.filter(a => a.id !== id));
  }

  function saveSig(dataUrl: string) {
    if (!signing) return;
    setAttendees(prev => prev.map(a => a.id === signing.id ? { ...a, sig: dataUrl } : a));
    setSigning(null);
  }

  function reset() {
    setStep(1);
    setF(INIT);
    setAttendees([]);
    setSearch("");
    setSigning(null);
    onClose();
  }

  function submit() {
    onAdd?.({
      ...f,
      attendees: attendees.map(a => a.name).join(", "),
      count: attendees.length,
    });
    reset();
  }

  const signedCount  = attendees.filter(a => a.sig).length;
  const allSigned    = attendees.length > 0 && signedCount === attendees.length;

  return (
    <>
      <Drawer
        open={open}
        onClose={reset}
        title="New Toolbox Talk"
        step={step}
        totalSteps={3}
        stepLabels={["Talk Details", "Talk Content", "Attendees & Signatures"]}
        onStepChange={setStep}
        onBack={() => step === 1 ? reset() : setStep(s => s - 1)}
        onNext={() => setStep(s => s + 1)}
        onSubmit={submit}
        submitLabel="Record Talk"
      >
        {/* ── Step 1: Talk Details ── */}
        {step === 1 && (
          <>
            <Section>
              <Label>Topic *</Label>
              <Select value={f.topic} onChange={v => set("topic", v)} placeholder="Select topic…" options={TOPICS} />
            </Section>
            <Section>
              <Row>
                <Col><Label>Site *</Label><Select value={f.site} onChange={v => set("site", v)} placeholder="Select site…" options={SITES} /></Col>
                <Col><Label>Facilitator *</Label><Select value={f.facilitator} onChange={v => set("facilitator", v)} placeholder="Select…" options={FACILITATORS} /></Col>
              </Row>
            </Section>
            <Section>
              <Row>
                <Col><Label>Date *</Label><Input type="date" value={f.date} onChange={v => set("date", v)} /></Col>
                <Col><Label>Time</Label><Input type="time" value={f.time} onChange={v => set("time", v)} /></Col>
              </Row>
            </Section>
            <div>
              <Label>Duration</Label>
              <Input value={f.duration} onChange={v => set("duration", v)} placeholder="e.g. 15 minutes" />
            </div>
          </>
        )}

        {/* ── Step 2: Talk Content ── */}
        {step === 2 && (
          <>
            {/* Talk header card */}
            <div className="p-4 mb-5 border" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}>
              <p className="text-[12px] font-semibold mb-1" style={{ color: "var(--b-text)" }}>
                {f.topic || "No topic selected"}
              </p>
              <p className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
                {f.site} · {f.facilitator} · {f.date || "Date TBC"} {f.time && `· ${f.time}`} {f.duration && `· ${f.duration}`}
              </p>
            </div>

            {/* Speaker notes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Speaker Talking Points</Label>
                <AiButton
                  disabled={!f.topic}
                  label="Generate with AI"
                  prompt={`Write 6 concise speaker talking points for a toolbox talk on "${f.topic}" for Australian construction workers. Each point should be a single sentence the facilitator can say out loud. Cover the main hazards, legal obligations, and practical controls. Number each point 1 to 6.`}
                  onStream={chunk => set("keyPoints", chunk ? f.keyPoints + chunk : "")}
                />
              </div>
              <textarea
                className="w-full rounded-none border text-[12.5px] p-3 resize-none outline-none"
                style={{
                  background: "var(--b-bg)",
                  borderColor: "var(--b-border-strong)",
                  color: "var(--b-text)",
                  minHeight: "180px",
                  fontFamily: "inherit",
                  lineHeight: 1.7,
                }}
                value={f.keyPoints}
                onChange={e => set("keyPoints", e.target.value)}
                placeholder={
                  f.topic
                    ? `Click "Generate with AI" to draft talking points for ${f.topic}, or type your own below…`
                    : "Go back and select a topic first…"
                }
              />
            </div>

            {/* Guidance note */}
            <div className="mt-4 flex items-start gap-2.5 p-3 border-l-2" style={{ borderLeftColor: "var(--b-accent)", background: "var(--b-accent-bg)" }}>
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "var(--b-accent-text)" }} />
              <p className="text-[11.5px] leading-relaxed" style={{ color: "var(--b-text-muted)" }}>
                Read through each talking point with your team before moving to the sign-off step. Workers must sign individually on the next screen.
              </p>
            </div>
          </>
        )}

        {/* ── Step 3: Attendees & Signatures ── */}
        {step === 3 && (
          <>
            {/* Progress */}
            <div className="mb-5 p-3 border" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11.5px] font-semibold" style={{ color: "var(--b-text)" }}>
                  {attendees.length} attendee{attendees.length !== 1 ? "s" : ""} added
                </span>
                <span className="text-[11px]" style={{ color: allSigned ? "var(--b-badge-green-text)" : "var(--b-text-muted)" }}>
                  {signedCount}/{attendees.length} signed
                </span>
              </div>
              <div className="h-1 w-full" style={{ background: "var(--b-border)" }}>
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: attendees.length ? `${(signedCount / attendees.length) * 100}%` : "0%",
                    background: allSigned ? "var(--b-badge-green-text)" : "var(--b-accent)",
                  }}
                />
              </div>
            </div>

            {/* Search */}
            <div className="mb-3">
              <Label>Add Attendees</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--b-text-muted)" }} />
                <input
                  className="w-full border pl-9 pr-3 h-[36px] text-[12.5px] outline-none"
                  style={{
                    background: "var(--b-bg)",
                    borderColor: "var(--b-border-strong)",
                    color: "var(--b-text)",
                  }}
                  placeholder="Search by name, role or site…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {/* Search results */}
              {(search.length > 0 || attendees.length === 0) && filteredPool.length > 0 && (
                <div className="border border-t-0 max-h-[140px] overflow-y-auto" style={{ borderColor: "var(--b-border-strong)" }}>
                  {filteredPool.slice(0, 6).map(w => (
                    <button
                      key={w.id}
                      onClick={() => addWorker(w)}
                      className="w-full flex items-center justify-between px-3 py-2 text-left transition-colors"
                      style={{ borderBottom: "1px solid var(--b-border)" }}
                      onMouseOver={e => ((e.currentTarget as HTMLElement).style.background = "var(--b-bg-active)")}
                      onMouseOut={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                    >
                      <div>
                        <p className="text-[12px] font-medium" style={{ color: "var(--b-text)" }}>{w.name}</p>
                        <p className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>{w.role} · {w.site}</p>
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5" style={{ color: "var(--b-accent-text)", background: "var(--b-accent-bg)" }}>+ Add</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Attendee list */}
            {attendees.length > 0 && (
              <div className="flex flex-col gap-2">
                <Label>Attendance Register — tap name to sign</Label>
                {attendees.map(a => (
                  <div
                    key={a.id}
                    className="border overflow-hidden"
                    style={{
                      borderColor: a.sig ? "var(--b-accent-border)" : "var(--b-border)",
                      background: a.sig ? "var(--b-accent-bg)" : "var(--b-bg-secondary)",
                    }}
                  >
                    <div className="flex items-center gap-3 px-3 py-2.5">
                      {/* Status icon */}
                      {a.sig
                        ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "var(--b-badge-green-text)" }} />
                        : <PenLine className="w-4 h-4 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />
                      }

                      {/* Name / role */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[12.5px] font-semibold" style={{ color: "var(--b-text)" }}>{a.name}</p>
                        <p className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>{a.role}</p>
                      </div>

                      {/* Signature preview or sign button */}
                      {a.sig ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={a.sig}
                            alt="signature"
                            className="h-8 w-24 object-contain border"
                            style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}
                          />
                          <button
                            onClick={() => setSigning(a)}
                            className="text-[11px] underline"
                            style={{ color: "var(--b-text-muted)" }}
                          >
                            Redo
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSigning(a)}
                          className="flex items-center gap-1.5 px-3 h-[30px] border text-[11.5px] font-medium"
                          style={{ borderColor: "var(--b-border-strong)", color: "var(--b-text-secondary)", background: "var(--b-bg)" }}
                        >
                          <PenLine className="w-3 h-3" />
                          Sign
                        </button>
                      )}

                      {/* Remove */}
                      <button onClick={() => removeWorker(a.id)} style={{ color: "var(--b-text-muted)" }}>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {attendees.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 gap-2" style={{ color: "var(--b-text-muted)" }}>
                <Search className="w-6 h-6 opacity-30" />
                <p className="text-[12.5px]">Search for workers above to add them to this talk</p>
              </div>
            )}
          </>
        )}
      </Drawer>

      {/* Signature overlay */}
      {signing && (
        <SignaturePad
          name={signing.name}
          onSave={saveSig}
          onCancel={() => setSigning(null)}
        />
      )}
    </>
  );
}
