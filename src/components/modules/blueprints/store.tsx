"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { ISOStandard, BlueprintStatus, DocCategory, DocStatus } from "@/config/blueprints";
import { STANDARDS } from "@/config/blueprints";
import type { OrgContext, GapReport } from "@/lib/blueprints/types";

export interface DocState {
  id: string;
  name: string;
  category: DocCategory;
  clauseRef: string;
  complex: boolean;
  status: DocStatus;
  content: string;
  originalContent: string;
  aiModel: string;
  tokensUsed: number;
  costUsd: number;
  edited: boolean;
  versions: { content: string; at: string; label: string }[];
}

export interface Blueprint {
  id: string;
  standard: ISOStandard;
  status: BlueprintStatus;
  org: OrgContext | null;
  createdAt: string;
  docs: DocState[];
  gap: GapReport | null;
}

interface Ctx {
  blueprints: Blueprint[];
  hydrated: boolean;
  addBlueprints: (standards: ISOStandard[]) => Blueprint[];
  get: (id: string) => Blueprint | undefined;
  update: (id: string, patch: Partial<Blueprint>) => void;
  updateDoc: (bpId: string, docId: string, patch: Partial<DocState>) => void;
  remove: (id: string) => void;
}

const BlueprintCtx = createContext<Ctx | null>(null);
const KEY = "briesa-blueprints-v1";

function freshDocs(standard: ISOStandard): DocState[] {
  return STANDARDS[standard].docs.map((d) => ({
    id: d.id,
    name: d.name,
    category: d.category,
    clauseRef: d.clauseRef,
    complex: !!d.complex,
    status: "PENDING" as DocStatus,
    content: "",
    originalContent: "",
    aiModel: "",
    tokensUsed: 0,
    costUsd: 0,
    edited: false,
    versions: [],
  }));
}

export function BlueprintProvider({ children }: { children: React.ReactNode }) {
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setBlueprints(JSON.parse(raw));
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try { localStorage.setItem(KEY, JSON.stringify(blueprints)); } catch { /* ignore */ }
    }
  }, [blueprints, hydrated]);

  const addBlueprints = useCallback((standards: ISOStandard[]) => {
    const created: Blueprint[] = standards.map((s) => ({
      id: `bp_${s}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      standard: s,
      status: "INTAKE" as BlueprintStatus,
      org: null,
      createdAt: new Date().toISOString(),
      docs: freshDocs(s),
      gap: null,
    }));
    setBlueprints((prev) => [...created, ...prev]);
    return created;
  }, []);

  const get = useCallback((id: string) => blueprints.find((b) => b.id === id), [blueprints]);

  const update = useCallback((id: string, patch: Partial<Blueprint>) => {
    setBlueprints((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }, []);

  const updateDoc = useCallback((bpId: string, docId: string, patch: Partial<DocState>) => {
    setBlueprints((prev) =>
      prev.map((b) =>
        b.id === bpId
          ? { ...b, docs: b.docs.map((d) => (d.id === docId ? { ...d, ...patch } : d)) }
          : b
      )
    );
  }, []);

  const remove = useCallback((id: string) => {
    setBlueprints((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return (
    <BlueprintCtx.Provider value={{ blueprints, hydrated, addBlueprints, get, update, updateDoc, remove }}>
      {children}
    </BlueprintCtx.Provider>
  );
}

export function useBlueprints() {
  const ctx = useContext(BlueprintCtx);
  if (!ctx) throw new Error("useBlueprints must be used within BlueprintProvider");
  return ctx;
}
