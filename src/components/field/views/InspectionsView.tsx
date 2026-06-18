"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, MapPin, Check, Ban, Pencil, X, Save, ClipboardList, Camera } from "lucide-react";
import type { useField, FieldRecord } from "../store";
import { Screen, Card, Btn, fieldInput } from "../ui";
import { PhotoButton, VoiceButton, useGeo, GeoChip } from "../device";

type F = ReturnType<typeof useField>;
const KINDS: FieldRecord["kind"][] = ["Incident", "Defect", "Hazard", "Inspection"];
const PEOPLE = ["M. Jones", "K. Davis", "T. Walsh", "S. Lee", "Unassigned"];
const CHECKLIST = ["Guarding in place", "No visible leaks", "Emergency stop works", "Tyres / tracks OK", "Controls functional"];

export function InspectionsView({ f, back }: { f: F; back: () => void }) {
  const { state, setState } = f;
  const [creating, setCreating] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);

  const drafts = state.records.filter((r) => r.status === "Draft");
  const open = state.records.filter((r) => r.status !== "Draft");

  if (creating || resumeId) {
    const existing = resumeId ? state.records.find((r) => r.id === resumeId) : null;
    return <RecordForm f={f} initial={existing} onDone={() => { setCreating(false); setResumeId(null); }} />;
  }

  return (
    <Screen title="Inspections & Defects" onBack={back} action={
      <button onClick={() => setCreating(true)} className="w-9 h-9 flex items-center justify-center" style={{ color: "var(--b-accent-text)" }}><Plus className="w-5 h-5" /></button>
    }>
      <Btn onClick={() => setCreating(true)} className="w-full mb-4"><Plus className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} /> New item from the field</Btn>

      {drafts.length > 0 && (
        <>
          <div className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--b-badge-yellow-text)" }}>Saved drafts</div>
          <div className="space-y-2 mb-4">
            {drafts.map((r) => <RecordRow key={r.id} r={r} onClick={() => setResumeId(r.id)} />)}
          </div>
        </>
      )}

      <div className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--b-text-muted)" }}>Raised items</div>
      {open.length === 0
        ? <div className="text-[13px] text-center py-8" style={{ color: "var(--b-text-muted)" }}>Nothing raised yet.</div>
        : <div className="space-y-2">{open.map((r) => <RecordRow key={r.id} r={r} onClick={() => {
            setState((s) => ({ ...s, records: s.records.map((x) => x.id === r.id ? { ...x, status: x.status === "Open" ? "Closed" : "Open" } : x) }));
          }} />)}</div>}
    </Screen>
  );
}

function RecordRow({ r, onClick }: { r: FieldRecord; onClick: () => void }) {
  return (
    <Card className="p-3" >
      <button onClick={onClick} className="w-full text-left">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold px-1.5 py-0.5" style={{ background: "var(--b-bg-active)", color: "var(--b-text-secondary)" }}>{r.kind}</span>
              {r.outOfService && <span className="text-[10px] font-bold px-1.5 py-0.5 flex items-center gap-1" style={{ background: "rgba(240,96,96,0.12)", color: "#f06060" }}><Ban className="w-3 h-3" /> OUT OF SERVICE</span>}
            </div>
            <div className="text-[13.5px] font-semibold mt-1" style={{ color: "var(--b-text)" }}>{r.title || "Untitled"}</div>
            <div className="text-[11.5px] flex items-center gap-2 mt-0.5" style={{ color: "var(--b-text-muted)" }}>
              <GeoChip loc={r.location} /> · {r.assignedTo}
            </div>
          </div>
          {r.photos[0] && <img src={r.photos[0]} alt="" className="w-12 h-12 object-cover flex-shrink-0" />}
        </div>
      </button>
    </Card>
  );
}

function RecordForm({ f, initial, onDone }: { f: F; initial?: FieldRecord | null; onDone: () => void }) {
  const { setState } = f;
  const geo = useGeo();
  const [kind, setKind] = useState<FieldRecord["kind"]>(initial?.kind ?? "Defect");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [note, setNote] = useState(initial?.note ?? "");
  const [photos, setPhotos] = useState<string[]>(initial?.photos ?? []);
  const [location, setLocation] = useState(initial?.location ?? "");
  const [assignedTo, setAssignedTo] = useState(initial?.assignedTo ?? "Unassigned");
  const [oos, setOos] = useState(initial?.outOfService ?? false);
  const [checks, setChecks] = useState<Record<string, "Pass" | "Fail" | "">>({});
  const [annotateIdx, setAnnotateIdx] = useState<number | null>(null);

  function commit(status: FieldRecord["status"]) {
    const rec: FieldRecord = {
      id: initial?.id ?? `fr_${Date.now()}`,
      kind, title, note, photos, location, assignedTo, outOfService: oos, status,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    };
    setState((s) => ({ ...s, records: [rec, ...s.records.filter((r) => r.id !== rec.id)] }));
    onDone();
  }

  return (
    <Screen title={initial ? "Resume draft" : "New field item"} onBack={onDone}>
      {/* kind */}
      <div className="grid grid-cols-4 gap-1.5 mb-3">
        {KINDS.map((k) => (
          <button key={k} onClick={() => setKind(k)} className="h-9 text-[12px] font-medium border" style={{ borderColor: kind === k ? "var(--b-accent-border)" : "var(--b-border)", background: kind === k ? "var(--b-accent-bg)" : "transparent", color: kind === k ? "var(--b-accent-text)" : "var(--b-text-muted)" }}>{k}</button>
        ))}
      </div>

      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={`${kind} title`} style={{ ...fieldInput, marginBottom: 12 }} />

      {/* note + voice */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: "var(--b-text-muted)" }}>Notes</span>
        <VoiceButton onText={(t) => setNote((n) => (n ? n + " " : "") + t)} />
      </div>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Describe what you found… (or tap Voice)" style={{ ...fieldInput, height: "auto", padding: "10px 12px", resize: "none", marginBottom: 12 }} />

      {/* photos */}
      {photos.length > 0 && (
        <div className="flex gap-2 mb-2 overflow-x-auto">
          {photos.map((p, i) => (
            <div key={i} className="relative flex-shrink-0">
              <img src={p} alt="" className="w-20 h-20 object-cover" />
              <button onClick={() => setAnnotateIdx(i)} className="absolute bottom-1 right-1 w-6 h-6 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}><Pencil className="w-3 h-3" /></button>
              <button onClick={() => setPhotos((ps) => ps.filter((_, x) => x !== i))} className="absolute top-0.5 right-0.5 w-5 h-5 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}><X className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
      )}
      <PhotoButton label="Add photo" onCapture={(d) => setPhotos((p) => [...p, d])} />

      {/* gps */}
      <div className="flex items-center justify-between mt-3 mb-3">
        <span className="text-[12px]" style={{ color: "var(--b-text-secondary)" }}>{location ? <GeoChip loc={location} /> : "No location tagged"}</span>
        <button onClick={() => geo.get().then(setLocation)} className="flex items-center gap-1 text-[12px] px-2.5 h-8 border" style={{ borderColor: "var(--b-border-strong)", color: "var(--b-text-muted)" }}>
          <MapPin className="w-3.5 h-3.5" /> {geo.busy ? "…" : "Tag GPS"}
        </button>
      </div>

      {/* checklist for inspections */}
      {kind === "Inspection" && (
        <Card className="p-3 mb-3">
          <div className="flex items-center gap-1.5 mb-2 text-[12px] font-semibold" style={{ color: "var(--b-text)" }}><ClipboardList className="w-3.5 h-3.5" /> Guided checklist</div>
          {CHECKLIST.map((c) => (
            <div key={c} className="flex items-center justify-between py-1.5">
              <span className="text-[12.5px]" style={{ color: "var(--b-text-secondary)" }}>{c}</span>
              <div className="flex gap-1">
                {(["Pass", "Fail"] as const).map((v) => (
                  <button key={v} onClick={() => setChecks((ch) => ({ ...ch, [c]: v }))} className="px-2.5 h-7 text-[11px] font-semibold border" style={{ borderColor: checks[c] === v ? (v === "Pass" ? "var(--b-badge-green-text)" : "#f06060") : "var(--b-border)", color: checks[c] === v ? (v === "Pass" ? "var(--b-badge-green-text)" : "#f06060") : "var(--b-text-muted)", background: checks[c] === v ? (v === "Pass" ? "var(--b-badge-green-bg)" : "rgba(240,96,96,0.1)") : "transparent" }}>{v}</button>
                ))}
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* assign + OOS */}
      <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} style={{ ...fieldInput, marginBottom: 10 }}>
        {PEOPLE.map((p) => <option key={p}>{p}</option>)}
      </select>
      <button onClick={() => setOos((v) => !v)} className="w-full flex items-center justify-between h-11 px-3 border mb-4" style={{ borderColor: oos ? "#f06060" : "var(--b-border-strong)", background: oos ? "rgba(240,96,96,0.08)" : "transparent" }}>
        <span className="flex items-center gap-2 text-[13px]" style={{ color: oos ? "#f06060" : "var(--b-text-secondary)" }}><Ban className="w-4 h-4" /> Tag plant Out-of-Service</span>
        <span className="text-[11px]" style={{ color: oos ? "#f06060" : "var(--b-text-muted)" }}>{oos ? "Blocks pre-op" : "Off"}</span>
      </button>

      <div className="grid grid-cols-2 gap-2">
        <Btn kind="ghost" onClick={() => commit("Draft")}><Save className="w-4 h-4" /> Save draft</Btn>
        <Btn onClick={() => commit("Open")}><Check className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} /> Submit</Btn>
      </div>

      {annotateIdx !== null && (
        <Annotate src={photos[annotateIdx]} onClose={() => setAnnotateIdx(null)} onSave={(d) => { setPhotos((ps) => ps.map((p, i) => (i === annotateIdx ? d : p))); setAnnotateIdx(null); }} />
      )}
    </Screen>
  );
}

/* Freehand red-pen annotation */
function Annotate({ src, onClose, onSave }: { src: string; onClose: () => void; onSave: (d: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const img = new Image();
    img.onload = () => {
      const max = 1000; const scale = Math.min(1, max / img.width);
      cv.width = img.width * scale; cv.height = img.height * scale;
      const ctx = cv.getContext("2d")!; ctx.drawImage(img, 0, 0, cv.width, cv.height);
      ctx.strokeStyle = "#ff2d2d"; ctx.lineWidth = Math.max(3, cv.width / 120); ctx.lineCap = "round"; ctx.lineJoin = "round";
    };
    img.src = src;
  }, [src]);

  function pos(e: React.PointerEvent) {
    const cv = canvasRef.current!; const rect = cv.getBoundingClientRect();
    return { x: (e.clientX - rect.left) * (cv.width / rect.width), y: (e.clientY - rect.top) * (cv.height / rect.height) };
  }
  function down(e: React.PointerEvent) { drawing.current = true; const ctx = canvasRef.current!.getContext("2d")!; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); }
  function move(e: React.PointerEvent) { if (!drawing.current) return; const ctx = canvasRef.current!.getContext("2d")!; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); }
  function up() { drawing.current = false; }

  return (
    <div className="fixed inset-0 z-[80] flex flex-col" style={{ background: "rgba(0,0,0,0.95)" }}>
      <div className="flex items-center justify-between px-4 h-12">
        <button onClick={onClose} style={{ color: "#888" }}><X className="w-5 h-5" /></button>
        <span className="text-[13px] text-white">Circle / mark the defect</span>
        <button onClick={() => onSave(canvasRef.current!.toDataURL("image/jpeg", 0.85))} className="flex items-center gap-1 text-[13px] font-semibold" style={{ color: "#ffd600" }}><Check className="w-4 h-4" /> Save</button>
      </div>
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <canvas ref={canvasRef} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} className="max-w-full max-h-full touch-none" style={{ background: "#111" }} />
      </div>
    </div>
  );
}
