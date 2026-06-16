import Link from "next/link";
import { ArrowLeft, Plus, Search, Download } from "lucide-react";

/* ── Primitive badge ── */
interface BadgeProps {
  label: string;
  bg: string;
  color: string;
  dot?: boolean;
}
export function Badge({ label, bg, color, dot }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 uppercase tracking-wide"
      style={{ background: bg, color }}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
      )}
      {label}
    </span>
  );
}

/* ── Pre-wired severity / status badges ── */
export const SeverityBadge = ({ v }: { v: "Critical" | "High" | "Medium" | "Low" }) =>
  ({
    Critical: <Badge label="Critical" bg="rgba(220,38,38,0.15)" color="#f06060" dot />,
    High:     <Badge label="High"     bg="rgba(240,96,96,0.1)"  color="#f06060" dot />,
    Medium:   <Badge label="Medium"   bg="var(--b-badge-yellow-bg)" color="var(--b-badge-yellow-text)" dot />,
    Low:      <Badge label="Low"      bg="var(--b-badge-blue-bg)"   color="var(--b-badge-blue-text)"   dot />,
  }[v]);

export const StatusBadge = ({
  v,
}: {
  v: "Open" | "Under Investigation" | "Closed" | "Active" | "Expired" | "Draft" | "Overdue" | "Pass" | "Fail" | "Pending";
}) =>
  ({
    Open:                <Badge label="Open"                 bg="var(--b-badge-yellow-bg)" color="var(--b-badge-yellow-text)" />,
    "Under Investigation":<Badge label="Investigating"       bg="var(--b-badge-blue-bg)"   color="var(--b-badge-blue-text)" />,
    Closed:              <Badge label="Closed"               bg="var(--b-badge-green-bg)"  color="var(--b-badge-green-text)" />,
    Active:              <Badge label="Active"               bg="var(--b-badge-green-bg)"  color="var(--b-badge-green-text)" />,
    Expired:             <Badge label="Expired"              bg="rgba(240,96,96,0.1)"      color="#f06060" />,
    Draft:               <Badge label="Draft"                bg="var(--b-bg-active)"        color="var(--b-text-tertiary)" />,
    Overdue:             <Badge label="Overdue"              bg="rgba(240,96,96,0.15)"     color="#f06060" />,
    Pass:                <Badge label="Pass"                 bg="var(--b-badge-green-bg)"  color="var(--b-badge-green-text)" />,
    Fail:                <Badge label="Fail"                 bg="rgba(240,96,96,0.1)"      color="#f06060" />,
    Pending:             <Badge label="Pending"              bg="var(--b-badge-yellow-bg)" color="var(--b-badge-yellow-text)" />,
  }[v]);

/* ── Stat card ── */
export function Stat({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: "green" | "red" | "yellow";
}) {
  const valueColor =
    highlight === "green"
      ? "var(--b-badge-green-text)"
      : highlight === "red"
      ? "#f06060"
      : highlight === "yellow"
      ? "var(--b-badge-yellow-text)"
      : "var(--b-text)";

  return (
    <div
      className="flex-1 min-w-0 border p-4"
      style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}
    >
      <div
        className="text-[10px] font-semibold uppercase tracking-widest mb-2"
        style={{ color: "var(--b-text-muted)" }}
      >
        {label}
      </div>
      <div className="text-[1.875rem] font-bold leading-none" style={{ color: valueColor }}>
        {value}
      </div>
      {sub && (
        <div className="text-[11.5px] mt-1.5" style={{ color: "var(--b-text-muted)" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

/* ── Page shell ── */
interface ShellProps {
  back: { href: string; label: string };
  title: string;
  description: string;
  cta: string;
  ctaSlot?: React.ReactNode;
  stats: React.ReactNode;
  tabs: string[];
  children: React.ReactNode;
}

export function PageShell({ back, title, description, cta, ctaSlot, stats, tabs, children }: ShellProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 pt-7 pb-5 border-b flex-shrink-0" style={{ borderColor: "var(--b-border)" }}>
        <Link
          href={back.href}
          className="b-icon-btn inline-flex items-center gap-1.5 text-[12px] mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {back.label}
        </Link>

        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h1 className="text-[20px] font-semibold" style={{ color: "var(--b-text)" }}>
              {title}
            </h1>
            <p className="text-[12.5px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>
              {description}
            </p>
          </div>
          {ctaSlot ?? (
            <button className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
              <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
              {cta}
            </button>
          )}
        </div>

        <div className="flex gap-3">{stats}</div>
      </div>

      {/* Toolbar */}
      <div
        className="px-8 border-b flex items-center gap-0 flex-shrink-0"
        style={{ borderColor: "var(--b-border)" }}
      >
        {tabs.map((t, i) => (
          <span key={t} className="b-tab" data-active={i === 0 ? "true" : "false"}>
            {t}
          </span>
        ))}

        <div className="ml-auto flex items-center gap-2 py-2">
          <div
            className="flex items-center gap-2 px-3 h-[28px] border text-[12px]"
            style={{
              background: "var(--b-bg-secondary)",
              borderColor: "var(--b-border-strong)",
              color: "var(--b-text-placeholder)",
            }}
          >
            <Search className="w-3 h-3 flex-shrink-0" />
            <span>Search…</span>
          </div>
          <button
            className="b-btn-ghost flex items-center gap-1.5 px-3 h-[28px] text-[12px]"
          >
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

/* ── Table primitives ── */
export function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th
      className={`px-4 py-3 text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap ${right ? "text-right" : "text-left"}`}
      style={{ color: "var(--b-text-muted)" }}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  muted,
  right,
  mono,
}: {
  children: React.ReactNode;
  muted?: boolean;
  right?: boolean;
  mono?: boolean;
}) {
  return (
    <td
      className={`px-4 py-3.5 text-[12.5px] ${right ? "text-right" : ""} ${mono ? "font-mono" : ""}`}
      style={{ color: muted ? "var(--b-text-muted)" : "var(--b-text-secondary)" }}
    >
      {children}
    </td>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead>
      <tr className="border-b" style={{ borderColor: "var(--b-border)" }}>
        {children}
      </tr>
    </thead>
  );
}

export function Tr({ children }: { children: React.ReactNode }) {
  return (
    <tr className="b-tr border-b" style={{ borderColor: "var(--b-border)" }}>
      {children}
    </tr>
  );
}
