"use client";

import { useState } from "react";
import { IdCard, ShieldCheck, BadgeCheck, QrCode, X, Check, Clock, AlertTriangle, Camera, Building2, MapPin } from "lucide-react";
import type { useField } from "../store";
import { statusFor, daysToExpiry } from "../store";
import { Screen, STATUS_STYLE, Card, Btn } from "../ui";
import { PhotoButton, QRCode } from "../device";

type F = ReturnType<typeof useField>;

export function WalletView({ f, back }: { f: F; back: () => void }) {
  const { state, patchProfile, setState } = f;
  const [qr, setQr] = useState(false);
  const p = state.profile;

  function uploadLicence(id: string, dataUrl: string) {
    setState((s) => ({
      ...s,
      licences: s.licences.map((l) => (l.id === id ? { ...l, photo: dataUrl, verifiedAt: new Date().toISOString() } : l)),
    }));
  }

  const expiringSoon = state.licences.filter((l) => statusFor(l.expiry) === "expiring");
  const expired = state.licences.filter((l) => statusFor(l.expiry) === "expired");

  return (
    <Screen title="My Wallet" onBack={back} action={
      <button onClick={() => setQr(true)} className="w-9 h-9 flex items-center justify-center" style={{ color: "var(--b-accent-text)" }}><QrCode className="w-5 h-5" /></button>
    }>
      {/* Profile */}
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ background: "var(--b-bg-active)" }}>
            {p.photo ? <img src={p.photo} alt="" className="w-full h-full object-cover" /> : <IdCard className="w-7 h-7" style={{ color: "var(--b-text-muted)" }} />}
          </div>
          <div className="min-w-0">
            <div className="text-[16px] font-bold" style={{ color: "var(--b-text)" }}>{p.name}</div>
            <div className="text-[12.5px]" style={{ color: "var(--b-text-secondary)" }}>{p.role}</div>
            <div className="text-[11.5px] flex items-center gap-1 mt-0.5" style={{ color: "var(--b-text-muted)" }}><Building2 className="w-3 h-3" /> {p.employer}</div>
            <div className="text-[11.5px] flex items-center gap-1" style={{ color: "var(--b-text-muted)" }}><MapPin className="w-3 h-3" /> {p.site}</div>
          </div>
        </div>
        <div className="mt-3">
          <PhotoButton label={p.photo ? "Update profile photo" : "Add profile photo"} onCapture={(d) => patchProfile({ photo: d })} />
        </div>
      </Card>

      {/* Currency */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <CurrencyTile ok={p.inductionCurrent} icon={ShieldCheck} label="Induction" sub={p.inductionCurrent ? "Current" : "Lapsed"} />
        <CurrencyTile ok={p.insuranceCurrent} icon={BadgeCheck} label="Insurance" sub={p.insuranceCurrent ? "Active" : "Expired"} />
      </div>

      {/* Reminders */}
      {(expiringSoon.length > 0 || expired.length > 0) && (
        <div className="border p-3 mb-4" style={{ borderColor: "#f0606055", background: "rgba(240,96,96,0.06)" }}>
          <div className="flex items-center gap-1.5 text-[12px] font-semibold mb-1" style={{ color: "#f06060" }}>
            <AlertTriangle className="w-3.5 h-3.5" /> Licence reminders
          </div>
          <div className="text-[12px]" style={{ color: "var(--b-text-secondary)" }}>
            {expired.length > 0 && <div>{expired.length} expired — cannot be used on site. Renew immediately.</div>}
            {expiringSoon.map((l) => <div key={l.id}>{l.name.split(" (")[0]} expires in {daysToExpiry(l.expiry)} days.</div>)}
          </div>
          <div className="text-[10.5px] mt-1.5" style={{ color: "var(--b-text-muted)" }}>Reminders sent at 30 &amp; 7 days — you and your safety manager.</div>
        </div>
      )}

      {/* Licence wallet */}
      <div className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--b-text-muted)" }}>Licence &amp; ticket wallet</div>
      <div className="space-y-2">
        {state.licences.map((l) => {
          const st = statusFor(l.expiry); const days = daysToExpiry(l.expiry); const s = STATUS_STYLE[st];
          return (
            <Card key={l.id} className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[13.5px] font-semibold" style={{ color: "var(--b-text)" }}>{l.name}</div>
                  <div className="font-mono text-[11px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>{l.number} · {l.issuer}</div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 flex-shrink-0" style={{ background: s.bg, color: s.color }}>{s.label}</span>
              </div>
              <div className="flex items-center justify-between mt-2 text-[11.5px]">
                <span style={{ color: st === "expired" ? "#f06060" : st === "expiring" ? "var(--b-badge-yellow-text)" : "var(--b-text-muted)" }}>
                  {st === "expired" ? `Expired ${l.expiry}` : `Expires ${l.expiry} · ${days}d`}
                </span>
                {l.verifiedAt && l.photo
                  ? <span className="flex items-center gap-1" style={{ color: "var(--b-badge-green-text)" }}><Check className="w-3 h-3" /> Verified {new Date(l.verifiedAt).toLocaleDateString("en-AU")}</span>
                  : <PhotoButton label="Upload card" onCapture={(d) => uploadLicence(l.id, d)} className="flex items-center gap-1 text-[11px] px-2 h-7 border" />}
              </div>
              {l.photo && (
                <div className="mt-2 flex items-center gap-1.5 text-[10.5px]" style={{ color: "var(--b-text-muted)" }}>
                  <Camera className="w-3 h-3" /> Card image on file · auto-verified &amp; timestamped
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* QR modal */}
      {qr && <GatePass profile={p} onClose={() => setQr(false)} licences={state.licences} />}
    </Screen>
  );
}

function CurrencyTile({ ok, icon: Icon, label, sub }: { ok: boolean; icon: typeof ShieldCheck; label: string; sub: string }) {
  return (
    <div className="border p-3" style={{ borderColor: ok ? "var(--b-badge-green-text)" : "#f06060", background: ok ? "var(--b-badge-green-bg)" : "rgba(240,96,96,0.08)" }}>
      <Icon className="w-4 h-4 mb-1" style={{ color: ok ? "var(--b-badge-green-text)" : "#f06060" }} />
      <div className="text-[12px] font-semibold" style={{ color: "var(--b-text)" }}>{label}</div>
      <div className="text-[11px]" style={{ color: ok ? "var(--b-badge-green-text)" : "#f06060" }}>{sub}</div>
    </div>
  );
}

function GatePass({ profile, onClose, licences }: { profile: ReturnType<typeof useField>["state"]["profile"]; onClose: () => void; licences: ReturnType<typeof useField>["state"]["licences"] }) {
  const [scanned, setScanned] = useState(false);
  const allCurrent = licences.every((l) => statusFor(l.expiry) !== "expired") && profile.inductionCurrent;
  return (
    <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center p-6" style={{ background: "rgba(0,0,0,0.92)" }}>
      <button onClick={onClose} className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center" style={{ color: "#888" }}><X className="w-6 h-6" /></button>
      {!scanned ? (
        <>
          <div className="text-center mb-5">
            <div className="text-[15px] font-bold text-white">{profile.name}</div>
            <div className="text-[12px]" style={{ color: "#888" }}>Site Pass · {profile.site}</div>
          </div>
          <div className="p-4" style={{ background: "#fff" }}>
            <QRCode value={`BRIESA|${profile.name}|${profile.role}|${profile.site}|${Date.now()}`} size={230} />
          </div>
          <p className="text-[12px] text-center mt-5 max-w-[260px]" style={{ color: "#999" }}>
            Supervisor scans this at the gate to confirm induction, licences and site access are all current.
          </p>
          <button onClick={() => setScanned(true)} className="mt-5 h-11 px-6 text-[13px] font-semibold" style={{ background: "#ffd600", color: "#0a0a0a" }}>Simulate gate scan</button>
        </>
      ) : (
        <div className="text-center">
          <div className="w-16 h-16 mx-auto flex items-center justify-center mb-4" style={{ background: allCurrent ? "rgba(60,180,100,0.15)" : "rgba(240,96,96,0.15)" }}>
            {allCurrent ? <Check className="w-8 h-8" style={{ color: "var(--b-badge-green-text)" }} /> : <AlertTriangle className="w-8 h-8" style={{ color: "#f06060" }} />}
          </div>
          <div className="text-[18px] font-bold text-white">{allCurrent ? "Access granted" : "Access blocked"}</div>
          <div className="text-[13px] mt-1 mb-1" style={{ color: "#999" }}>{profile.name} · {profile.role}</div>
          <div className="text-[12px] flex items-center justify-center gap-3 mt-3" style={{ color: "#bbb" }}>
            <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" style={{ color: "var(--b-badge-green-text)" }} /> Induction</span>
            <span className="flex items-center gap-1">{allCurrent ? <Check className="w-3.5 h-3.5" style={{ color: "var(--b-badge-green-text)" }} /> : <Clock className="w-3.5 h-3.5" style={{ color: "#f06060" }} />} Licences</span>
          </div>
          <button onClick={onClose} className="mt-6 h-11 px-6 text-[13px] font-semibold" style={{ background: "#ffd600", color: "#0a0a0a" }}>Done</button>
        </div>
      )}
    </div>
  );
}
