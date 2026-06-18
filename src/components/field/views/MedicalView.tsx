"use client";

import { useState } from "react";
import { Phone, HeartPulse, Megaphone, X, Check, AlertTriangle, Droplet, Pill } from "lucide-react";
import type { useField } from "../store";
import { Screen, Card, Btn } from "../ui";

type F = ReturnType<typeof useField>;

export function MedicalView({ f, back }: { f: F; back: () => void }) {
  const p = f.state.profile;
  const [broadcast, setBroadcast] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <Screen title="Medical & Emergency" onBack={back}>
      {/* Emergency contact — one tap call */}
      <Card className="p-4 mb-3">
        <div className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--b-text-muted)" }}>Emergency contact</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[15px] font-bold" style={{ color: "var(--b-text)" }}>{p.emergencyContact.name}</div>
            <div className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>{p.emergencyContact.relationship} · {p.emergencyContact.phone}</div>
          </div>
          <a href={`tel:${p.emergencyContact.phone.replace(/\s/g, "")}`} className="w-12 h-12 flex items-center justify-center" style={{ background: "var(--b-badge-green-bg)" }}>
            <Phone className="w-5 h-5" style={{ color: "var(--b-badge-green-text)" }} />
          </a>
        </div>
      </Card>

      {/* 000 */}
      <a href="tel:000" className="flex items-center justify-center gap-2 h-12 mb-4 text-[15px] font-bold" style={{ background: "rgba(240,96,96,0.12)", border: "1px solid #f06060", color: "#f06060" }}>
        <Phone className="w-5 h-5" /> Call 000 — Emergency
      </a>

      {/* Medical info for first responders */}
      <div className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--b-text-muted)" }}>Medical info for first responders</div>
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-2 mb-3"><HeartPulse className="w-4 h-4" style={{ color: "#f06060" }} /><span className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>{p.name}</span></div>
        <Row icon={Droplet} label="Blood type" value={p.medical.bloodType} />
        <Row icon={AlertTriangle} label="Allergies" value={p.medical.allergies} />
        <Row icon={HeartPulse} label="Conditions" value={p.medical.conditions} />
        <Row icon={Pill} label="Medications" value={p.medical.medications} />
      </Card>

      {/* Emergency broadcast (supervisor) */}
      <div className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--b-text-muted)" }}>Supervisor</div>
      <Btn kind="danger" className="w-full" onClick={() => setBroadcast(true)}><Megaphone className="w-4 h-4" /> Send emergency broadcast</Btn>
      <p className="text-[11px] mt-2 text-center" style={{ color: "var(--b-text-muted)" }}>One tap sends a site-wide push alert to every worker on site.</p>

      {broadcast && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6" style={{ background: "rgba(0,0,0,0.9)" }}>
          <div className="w-full max-w-[340px] border p-5" style={{ background: "var(--b-bg)", borderColor: "#f06060" }}>
            {!sent ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[15px] font-bold flex items-center gap-2" style={{ color: "#f06060" }}><Megaphone className="w-5 h-5" /> Emergency broadcast</span>
                  <button onClick={() => setBroadcast(false)} style={{ color: "var(--b-text-muted)" }}><X className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {["Evacuate now", "Stop work", "Medical emergency", "Severe weather"].map((m) => (
                    <button key={m} onClick={() => setSent(true)} className="h-12 text-[12.5px] font-semibold border" style={{ borderColor: "#f06060", color: "#f06060", background: "rgba(240,96,96,0.06)" }}>{m}</button>
                  ))}
                </div>
                <p className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>Tap a message to push it to all devices on site.</p>
              </>
            ) : (
              <div className="text-center py-2">
                <div className="w-14 h-14 mx-auto flex items-center justify-center mb-3" style={{ background: "rgba(240,96,96,0.15)" }}><Check className="w-7 h-7" style={{ color: "#f06060" }} /></div>
                <div className="text-[16px] font-bold" style={{ color: "var(--b-text)" }}>Alert sent site-wide</div>
                <p className="text-[12px] mt-1" style={{ color: "var(--b-text-muted)" }}>Pushed to all workers signed on at this site.</p>
                <Btn className="mt-4" onClick={() => { setBroadcast(false); setSent(false); }}>Done</Btn>
              </div>
            )}
          </div>
        </div>
      )}
    </Screen>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof Droplet; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />
      <span className="text-[12px] w-24 flex-shrink-0" style={{ color: "var(--b-text-muted)" }}>{label}</span>
      <span className="text-[13px]" style={{ color: "var(--b-text)" }}>{value}</span>
    </div>
  );
}
