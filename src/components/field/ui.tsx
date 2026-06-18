"use client";

import { ArrowLeft } from "lucide-react";
import type { LicenceStatus } from "./store";

export function Screen({ title, onBack, action, children }: { title: string; onBack: () => void; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="min-h-full" style={{ background: "var(--b-bg-canvas)" }}>
      <div className="sticky top-0 z-10 flex items-center gap-2 px-3 h-12 border-b" style={{ background: "var(--b-bg)", borderColor: "var(--b-border)" }}>
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center -ml-1" style={{ color: "var(--b-text-secondary)" }}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-[15px] font-semibold flex-1 truncate" style={{ color: "var(--b-text)" }}>{title}</span>
        {action}
      </div>
      <div className="p-4 pb-24">{children}</div>
    </div>
  );
}

export const STATUS_STYLE: Record<LicenceStatus, { label: string; color: string; bg: string }> = {
  current:  { label: "Current",  color: "var(--b-badge-green-text)",  bg: "var(--b-badge-green-bg)" },
  expiring: { label: "Expiring", color: "var(--b-badge-yellow-text)", bg: "var(--b-badge-yellow-bg)" },
  expired:  { label: "Expired",  color: "#f06060",                    bg: "rgba(240,96,96,0.12)" },
};

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`border ${className}`} style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>{children}</div>;
}

export function Btn({ children, onClick, kind = "accent", className = "", type = "button", disabled }: { children: React.ReactNode; onClick?: () => void; kind?: "accent" | "ghost" | "danger"; className?: string; type?: "button" | "submit"; disabled?: boolean }) {
  const styles: Record<string, React.CSSProperties> = {
    accent: { background: "var(--b-accent-bg)", borderColor: "var(--b-accent-border)", color: "var(--b-text)" },
    ghost:  { background: "transparent", borderColor: "var(--b-border-strong)", color: "var(--b-text-secondary)" },
    danger: { background: "rgba(240,96,96,0.1)", borderColor: "#f06060", color: "#f06060" },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`h-11 px-4 border text-[14px] font-semibold flex items-center justify-center gap-2 disabled:opacity-40 ${className}`} style={styles[kind]}>
      {children}
    </button>
  );
}

export const fieldInput: React.CSSProperties = {
  width: "100%", height: "44px", padding: "0 12px", fontSize: "14px",
  background: "var(--b-bg-secondary)", border: "1px solid var(--b-border-strong)", color: "var(--b-text)", outline: "none",
};
