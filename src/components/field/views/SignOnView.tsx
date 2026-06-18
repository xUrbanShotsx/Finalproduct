"use client";

import { useState, useEffect } from "react";
import { LogIn, LogOut, MapPin, Clock, RefreshCw, QrCode, Check } from "lucide-react";
import type { useField } from "../store";
import { Screen, Card } from "../ui";
import { useGeo, QRCode } from "../device";

type F = ReturnType<typeof useField>;
const SITES = ["Site 01 — Parramatta", "Site 02 — Liverpool", "Site 03 — Penrith"];

export function SignOnView({ f, back }: { f: F; back: () => void }) {
  const { state, setState, update } = f;
  const geo = useGeo();
  const active = state.sessions.find((s) => !s.off);
  const [site, setSite] = useState(state.rememberSite ?? state.profile.site);
  const [remember, setRemember] = useState(!!state.rememberSite);
  const [refreshing, setRefreshing] = useState(true);
  const [token, setToken] = useState(0);

  // refreshing QR rotates its token every few seconds
  useEffect(() => {
    if (!refreshing) return;
    const t = setInterval(() => setToken((x) => x + 1), 4000);
    return () => clearInterval(t);
  }, [refreshing]);

  async function signOn() {
    const loc = await geo.get();
    const id = `so_${Date.now()}`;
    setState((s) => ({
      ...s,
      rememberSite: remember ? site : null,
      sessions: [{ id, site, on: new Date().toISOString(), off: null, location: loc }, ...s.sessions],
    }));
  }
  function signOff() {
    if (!active) return;
    setState((s) => ({ ...s, sessions: s.sessions.map((x) => (x.id === active.id ? { ...x, off: new Date().toISOString() } : x)) }));
  }

  const weekHours = state.sessions.reduce((sum, s) => {
    const end = s.off ? new Date(s.off).getTime() : Date.now();
    return sum + (end - new Date(s.on).getTime()) / 36e5;
  }, 0);

  return (
    <Screen title="Site Sign-On" onBack={back}>
      {/* Status card */}
      <Card className="p-4 mb-4 text-center">
        <div className="text-[11px] uppercase tracking-widest mb-2" style={{ color: "var(--b-text-muted)" }}>{active ? "Signed on" : "Not on site"}</div>
        {active ? (
          <>
            <Elapsed since={active.on} />
            <div className="text-[12px] mt-1" style={{ color: "var(--b-text-secondary)" }}>{active.site}</div>
            <div className="text-[11px] flex items-center justify-center gap-1 mt-0.5" style={{ color: "var(--b-text-muted)" }}><MapPin className="w-3 h-3" /> {active.location}</div>
            <button onClick={signOff} className="mt-4 w-full h-12 flex items-center justify-center gap-2 text-[15px] font-bold" style={{ background: "rgba(240,96,96,0.12)", border: "1px solid #f06060", color: "#f06060" }}>
              <LogOut className="w-5 h-5" /> Sign Off
            </button>
          </>
        ) : (
          <>
            <select value={site} onChange={(e) => setSite(e.target.value)} className="w-full h-11 px-3 text-[14px] border mb-3" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }}>
              {SITES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button onClick={signOn} disabled={geo.busy} className="w-full h-12 flex items-center justify-center gap-2 text-[15px] font-bold disabled:opacity-60" style={{ background: "var(--b-accent-bg)", border: "1px solid var(--b-accent-border)", color: "var(--b-text)" }}>
              <LogIn className="w-5 h-5" style={{ color: "var(--b-accent-text)" }} /> {geo.busy ? "Getting location…" : "Sign On"}
            </button>
            <label className="flex items-center justify-center gap-2 mt-3 text-[12.5px]" style={{ color: "var(--b-text-secondary)" }}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me on this site
            </label>
          </>
        )}
      </Card>

      {/* Gate QR */}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] font-semibold flex items-center gap-1.5" style={{ color: "var(--b-text)" }}><QrCode className="w-4 h-4" /> Gate QR</span>
          <button onClick={() => setRefreshing((r) => !r)} className="flex items-center gap-1 text-[11px] px-2 h-7 border" style={{ borderColor: "var(--b-border-strong)", color: "var(--b-text-muted)" }}>
            {refreshing ? <><RefreshCw className="w-3 h-3" /> Refreshing</> : "Static / printable"}
          </button>
        </div>
        <div className="flex justify-center">
          <div className="p-3" style={{ background: "#fff" }}>
            <QRCode value={`BRIESA-GATE|${site}|${refreshing ? token : "static"}`} size={180} />
          </div>
        </div>
        <p className="text-[11px] text-center mt-3" style={{ color: "var(--b-text-muted)" }}>
          {refreshing
            ? "Refreshing code rotates every few seconds — prevents pass-back. Scan at the gate to sign on/off."
            : "Static code can be printed and posted at the gate for low-tech sites."}
        </p>
      </Card>

      {/* Hours summary */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2"><Clock className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} /><span className="text-[12px] font-semibold" style={{ color: "var(--b-text)" }}>Hours this week</span></div>
        <div className="text-[28px] font-bold" style={{ color: "var(--b-text)" }}>{weekHours.toFixed(1)}<span className="text-[14px]" style={{ color: "var(--b-text-muted)" }}> hrs</span></div>
        <div className="flex items-center gap-1.5 mt-2 text-[11px]" style={{ color: "var(--b-text-muted)" }}>
          <Check className="w-3 h-3" style={{ color: "var(--b-badge-green-text)" }} /> Rolls into Fatigue Management &amp; Training/Insights attendance
        </div>
      </Card>

      {state.sessions.length > 0 && (
        <div className="mt-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--b-text-muted)" }}>Recent</div>
          <div className="space-y-1.5">
            {state.sessions.slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center justify-between text-[12px] border px-3 py-2" style={{ borderColor: "var(--b-border)" }}>
                <span style={{ color: "var(--b-text-secondary)" }}>{new Date(s.on).toLocaleString("en-AU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                <span style={{ color: "var(--b-text-muted)" }}>{s.off ? "Signed off" : "On site"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Screen>
  );
}

function Elapsed({ since }: { since: string }) {
  const [, force] = useState(0);
  useEffect(() => { const t = setInterval(() => force((x) => x + 1), 30000); return () => clearInterval(t); }, []);
  const mins = Math.floor((Date.now() - new Date(since).getTime()) / 60000);
  const h = Math.floor(mins / 60), m = mins % 60;
  return <div className="text-[32px] font-bold leading-none" style={{ color: "var(--b-badge-green-text)" }}>{h}h {m}m</div>;
}
