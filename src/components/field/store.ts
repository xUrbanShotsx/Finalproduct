"use client";

import { useState, useEffect, useCallback } from "react";

/* ── Types ── */
export type LicenceStatus = "current" | "expiring" | "expired";

export interface Licence {
  id: string;
  name: string;
  number: string;
  issuer: string;
  expiry: string;       // ISO date
  photo?: string | null;
  verifiedAt?: string | null;
}

export interface FieldRecord {
  id: string;
  kind: "Incident" | "Defect" | "Hazard" | "Inspection";
  title: string;
  note: string;
  photos: string[];
  location: string;
  assignedTo: string;
  status: "Draft" | "Open" | "Closed";
  outOfService?: boolean;
  createdAt: string;
}

export interface SignOnSession {
  id: string;
  site: string;
  on: string;          // ISO
  off?: string | null;
  location: string;
}

export interface FieldState {
  profile: {
    name: string; role: string; employer: string; site: string; photo?: string | null;
    inductionCurrent: boolean; insuranceCurrent: boolean;
    emergencyContact: { name: string; relationship: string; phone: string };
    medical: { bloodType: string; allergies: string; conditions: string; medications: string };
  };
  licences: Licence[];
  records: FieldRecord[];
  sessions: SignOnSession[];
  rememberSite: string | null;
}

/* ── Seed ── */
const now = Date.now();
const day = 864e5;
const iso = (d: number) => new Date(d).toISOString().slice(0, 10);

export const SEED: FieldState = {
  profile: {
    name: "Jordan Smith",
    role: "Rigger / Dogger",
    employer: "Apex Construction Pty Ltd",
    site: "Site 01 — Parramatta",
    photo: null,
    inductionCurrent: true,
    insuranceCurrent: true,
    emergencyContact: { name: "Casey Smith", relationship: "Partner", phone: "0412 345 678" },
    medical: { bloodType: "O+", allergies: "Penicillin", conditions: "Asthma (carries inhaler)", medications: "Ventolin PRN" },
  },
  licences: [
    { id: "l1", name: "White Card (Construction Induction)", number: "WC-0429183", issuer: "SafeWork NSW", expiry: iso(now + 540 * day), verifiedAt: iso(now - 200 * day) },
    { id: "l2", name: "High Risk Work — Rigging (RB)", number: "HRWL-RB-008812", issuer: "SafeWork NSW", expiry: iso(now + 22 * day), verifiedAt: iso(now - 150 * day) },
    { id: "l3", name: "High Risk Work — Dogging (DG)", number: "HRWL-DG-004417", issuer: "SafeWork NSW", expiry: iso(now + 6 * day), verifiedAt: iso(now - 150 * day) },
    { id: "l4", name: "Forklift (LF)", number: "HRWL-LF-119284", issuer: "SafeWork NSW", expiry: iso(now - 14 * day), verifiedAt: iso(now - 400 * day) },
    { id: "l5", name: "EWP (Boom > 11m, WP)", number: "HRWL-WP-552190", issuer: "SafeWork NSW", expiry: iso(now + 300 * day), verifiedAt: iso(now - 90 * day) },
    { id: "l6", name: "Scaffolding — Basic (SB)", number: "HRWL-SB-667301", issuer: "SafeWork NSW", expiry: iso(now + 120 * day), verifiedAt: iso(now - 60 * day) },
  ],
  records: [],
  sessions: [],
  rememberSite: null,
};

export function statusFor(expiry: string): LicenceStatus {
  const days = Math.round((new Date(expiry).getTime() - Date.now()) / day);
  if (days < 0) return "expired";
  if (days <= 30) return "expiring";
  return "current";
}
export function daysToExpiry(expiry: string): number {
  return Math.round((new Date(expiry).getTime() - Date.now()) / day);
}

/* ── Persistence ── */
const KEY = "briesa-field-v1";

export function useField() {
  const [state, setState] = useState<FieldState>(SEED);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...SEED, ...JSON.parse(raw) });
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ } }
  }, [state, hydrated]);

  const update = useCallback((patch: Partial<FieldState>) => setState((s) => ({ ...s, ...patch })), []);
  const patchProfile = useCallback((p: Partial<FieldState["profile"]>) => setState((s) => ({ ...s, profile: { ...s.profile, ...p } })), []);

  return { state, hydrated, update, patchProfile, setState };
}
