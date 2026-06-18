"use client";

import { useRef, useState, useCallback } from "react";
import { Camera, Mic, MapPin } from "lucide-react";

/* ── Photo capture (opens the camera on mobile) ── */
export function PhotoButton({ onCapture, label = "Take photo", className = "" }: { onCapture: (dataUrl: string) => void; label?: string; className?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onCapture(String(reader.result));
    reader.readAsDataURL(file);
    e.target.value = "";
  }
  return (
    <>
      <button type="button" onClick={() => ref.current?.click()} className={className || "flex items-center justify-center gap-2 h-11 border text-[13px] font-medium w-full"} style={className ? undefined : { borderColor: "var(--b-border-strong)", color: "var(--b-text-secondary)", background: "var(--b-bg)" }}>
        <Camera className="w-4 h-4" /> {label}
      </button>
      <input ref={ref} type="file" accept="image/*" capture="environment" onChange={handle} className="hidden" />
    </>
  );
}

/* ── Geolocation ── */
export function useGeo() {
  const [loc, setLoc] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const get = useCallback((): Promise<string> => {
    setBusy(true);
    return new Promise((resolve) => {
      const fallback = "-33.8136, 151.0034 · Parramatta NSW";
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        setBusy(false); setLoc(fallback); resolve(fallback); return;
      }
      navigator.geolocation.getCurrentPosition(
        (p) => { const s = `${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)}`; setBusy(false); setLoc(s); resolve(s); },
        () => { setBusy(false); setLoc(fallback); resolve(fallback); },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    });
  }, []);
  return { loc, busy, get };
}

/* ── Voice-to-text (Web Speech API) ── */
export function VoiceButton({ onText }: { onText: (text: string) => void }) {
  const [listening, setListening] = useState(false);
  const recRef = useRef<unknown>(null);

  function toggle() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) as any;
    if (!SR) { alert("Voice input isn't supported on this browser."); return; }
    if (listening) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (recRef.current as any)?.stop(); setListening(false); return;
    }
    const rec = new SR();
    rec.lang = "en-AU"; rec.interimResults = false; rec.continuous = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => { const t = e.results[0][0].transcript; onText(t); };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  }

  return (
    <button type="button" onClick={toggle} className="flex items-center gap-1.5 px-2.5 h-8 border text-[12px]" style={{ borderColor: listening ? "#f06060" : "var(--b-border-strong)", color: listening ? "#f06060" : "var(--b-text-muted)", background: "var(--b-bg)" }}>
      <Mic className="w-3.5 h-3.5" /> {listening ? "Listening…" : "Voice"}
    </button>
  );
}

export function GeoChip({ loc }: { loc: string }) {
  if (!loc) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: "var(--b-text-muted)" }}>
      <MapPin className="w-3 h-3" /> {loc}
    </span>
  );
}

/* ── Deterministic QR-style code (visual; encodes nothing real) ── */
export function QRCode({ value, size = 200, fg = "#0a0a0a", bg = "#ffffff" }: { value: string; size?: number; fg?: string; bg?: string }) {
  const n = 25;
  // simple string hash → PRNG
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) { h ^= value.charCodeAt(i); h = Math.imul(h, 16777619); }
  const rand = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 1000) / 1000; };
  const cell = size / n;
  const rects: React.ReactNode[] = [];
  const isFinder = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (isFinder(r, c)) continue;
      if (rand() > 0.52) rects.push(<rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill={fg} />);
    }
  }
  const finder = (x: number, y: number) => (
    <g key={`f${x}-${y}`}>
      <rect x={x * cell} y={y * cell} width={cell * 7} height={cell * 7} fill={fg} />
      <rect x={(x + 1) * cell} y={(y + 1) * cell} width={cell * 5} height={cell * 5} fill={bg} />
      <rect x={(x + 2) * cell} y={(y + 2) * cell} width={cell * 3} height={cell * 3} fill={fg} />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: bg, display: "block" }}>
      {rects}
      {finder(0, 0)}
      {finder(n - 7, 0)}
      {finder(0, n - 7)}
    </svg>
  );
}
