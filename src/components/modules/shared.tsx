"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Search, Download, MapPin, Check, SlidersHorizontal } from "lucide-react";

/* ── Job / project site filtering ──
   Pulls the "site" dimension from whichever column a record uses, so the same
   site dropdown works across every register. */
const SITE_FIELDS = ["site", "building", "area"];
const SITE_LOOSE_FIELDS = ["location", "sites", "building"];

export function rowSite(row: Record<string, unknown>): string {
  for (const k of SITE_FIELDS) {
    const v = row[k];
    if (typeof v === "string" && v && !/^all/i.test(v)) return v;
  }
  return "";
}

export function siteOptionsOf(rows: unknown[]): string[] {
  const set = new Set<string>();
  rows.forEach((r) => { const s = rowSite(r as Record<string, unknown>); if (s) set.add(s); });
  return [...set].sort();
}

export function matchesSite(site: string, row: Record<string, unknown>): boolean {
  if (!site) return true;
  for (const k of SITE_FIELDS) {
    if (String(row[k] ?? "") === site) return true;
  }
  for (const k of SITE_LOOSE_FIELDS) {
    const v = String(row[k] ?? "");
    if (v === site || v.includes(site) || /^all/i.test(v)) return true;
  }
  return false;
}

/* ── Generic tab/filter predicate ──
   Returns true when a row belongs under the given tab label.
   Non-filtering tabs (All, date ranges, etc.) pass everything through. */
export function matchesTab(tab: string, row: Record<string, unknown>): boolean {
  if (!tab) return true;
  const t = tab.toLowerCase().trim();

  // Pass-through tabs — show everything
  const passthrough = ["all", "all sites", "my actions", "mine", "everyone", "all certificates", "all licences", "all records", "all workers", "history"];
  if (passthrough.includes(t)) return true;
  // Date-range style tabs can't be filtered on demo data — pass through
  if (/\b(today|week|month|quarter|year|recent)\b/.test(t)) return true;

  const status = String(row.status ?? "").toLowerCase();
  const result = String(row.result ?? "").toLowerCase();

  // Boolean-flag driven tabs
  if (t === "overdue") return row.overdue === true || status === "overdue";
  if (t.includes("expiring") || t.includes("due for review") || t.includes("due soon")) {
    return row.expiringSoon === true || row.dueSoon === true || row.serviceDue === true || status === "expiring";
  }
  if (t.includes("expired")) return status === "expired" || row.sdsExpired === true || row.testOverdue === true;
  if (t === "signed off") return row.signedOff === true;
  if (t.includes("pending sign")) return row.signedOff === false;
  if (t === "defects" || t === "with defects") return Number(row.defects ?? 0) > 0 || row.defect === true;
  if (t === "verified") return row.verified === true || result === "verified";
  if (t === "unverified") return row.verified === false;
  if (t === "active" || t === "current") return status === "active" || status === "current";
  if (t === "notifiable") return row.notifiable === true || row.notifiableIncident === "Yes";
  if (t === "danger class" || t === "danger") return String(row.signalWord ?? "").toLowerCase() === "danger";
  if (t.includes("above wes") || t === "exceedances" || t === "exceedance") return row.aboveWes === true || row.exceedance === true || row.aboveLimit === true;
  if (t === "critical" || t === "high" || t === "medium" || t === "low") {
    return String(row.riskLevel ?? row.severity ?? row.priority ?? "").toLowerCase() === t;
  }

  // Direct status / result match (covers Active, Draft, Open, Closed, Pending, Pass, Fail, Granted, Denied, etc.)
  if (status === t || result === t) return true;

  // Category-style matches against common typed columns
  for (const key of ["ghsClass", "type", "category", "agentType", "chemType", "esmType", "zoneType", "psType", "checkType"]) {
    if (String(row[key] ?? "").toLowerCase() === t) return true;
  }

  // Unknown filter → don't hide everything
  return false;
}

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
      className="flex-1 min-w-[140px] border p-4"
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

/* ── Filters dropdown (toolbar) ── */
function FiltersDropdown({ siteOptions, siteValue, onSiteChange }: {
  siteOptions: string[];
  siteValue: string;
  onSiteChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open) { setQuery(""); setTimeout(() => inputRef.current?.focus(), 0); }
  }, [open]);

  const filtered = ["All sites", ...siteOptions].filter((s) =>
    !query || s.toLowerCase().includes(query.toLowerCase())
  );

  const hasActive = !!siteValue;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="b-btn-ghost flex items-center gap-1.5 px-3 h-[28px] text-[12px] transition-colors"
        style={{
          background: open || hasActive ? "var(--b-bg-active)" : undefined,
          color: hasActive ? "var(--b-text)" : undefined,
        }}
      >
        <SlidersHorizontal className="w-3 h-3" />
        Filters
        {hasActive && (
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: "var(--b-accent-text)" }}
          />
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+4px)] z-50 w-56 border shadow-sm"
          style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border-strong)" }}
        >
          {/* Section header */}
          <div className="px-3 pt-2.5 pb-1.5 border-b" style={{ borderColor: "var(--b-border)" }}>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--b-text-muted)" }}>
              <MapPin className="w-3 h-3" />
              Site
            </div>
          </div>
          {/* Search */}
          <div className="flex items-center gap-2 px-2.5 border-b" style={{ borderColor: "var(--b-border)" }}>
            <Search className="w-3 h-3 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sites…"
              className="flex-1 h-[30px] bg-transparent text-[12px] outline-none"
              style={{ color: "var(--b-text-secondary)" }}
            />
          </div>
          {/* Options */}
          <div className="max-h-44 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-1.5 text-[12px]" style={{ color: "var(--b-text-muted)" }}>No sites found</div>
            ) : filtered.map((s) => {
              const selected = s === "All sites" ? !siteValue : s === siteValue;
              return (
                <button
                  key={s}
                  onClick={() => { onSiteChange(s === "All sites" ? "" : s); setOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-1.5 text-left text-[12px]"
                  style={{
                    background: selected ? "var(--b-bg-active)" : "transparent",
                    color: selected ? "var(--b-text)" : "var(--b-text-secondary)",
                  }}
                  onMouseEnter={(e) => { if (!selected) (e.currentTarget as HTMLElement).style.background = "var(--b-bg-active)"; }}
                  onMouseLeave={(e) => { if (!selected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <Check className="w-3 h-3 flex-shrink-0" style={{ opacity: selected ? 1 : 0, color: "var(--b-accent-text)" }} />
                  {s}
                </button>
              );
            })}
          </div>
          {/* Clear */}
          {hasActive && (
            <div className="border-t px-3 py-2" style={{ borderColor: "var(--b-border)" }}>
              <button
                onClick={() => { onSiteChange(""); setOpen(false); }}
                className="text-[11.5px] transition-colors"
                style={{ color: "var(--b-text-muted)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--b-text-secondary)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--b-text-muted)")}
              >
                Clear filters
              </button>
            </div>
          )}
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
  onTabChange?: (tab: string) => void;
  siteOptions?: string[];
  onSiteChange?: (site: string) => void;
  children: React.ReactNode;
}

export function PageShell({ back, title, description, cta, ctaSlot, stats, tabs, onTabChange, siteOptions, onSiteChange, children }: ShellProps) {
  const [active, setActive] = useState(0);
  const [activeSite, setActiveSite] = useState("");
  const showSite = !!siteOptions && siteOptions.length > 0;
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 sm:px-8 pt-5 sm:pt-7 pb-5 border-b flex-shrink-0" style={{ borderColor: "var(--b-border)" }}>
        <Link
          href={back.href}
          className="b-icon-btn inline-flex items-center gap-1.5 text-[12px] mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {back.label}
        </Link>

        <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
          <div>
            <h1 className="text-[20px] font-semibold" style={{ color: "var(--b-text)" }}>
              {title}
            </h1>
            <p className="text-[12.5px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>
              {description}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {ctaSlot ?? (
              <button className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
                <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
                {cta}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">{stats}</div>
      </div>

      {/* Toolbar */}
      <div
        className="px-4 sm:px-8 border-b flex items-center gap-0 flex-shrink-0 overflow-x-auto"
        style={{ borderColor: "var(--b-border)" }}
      >
        {tabs.map((t, i) => (
          <span
            key={t}
            className="b-tab"
            data-active={i === active ? "true" : "false"}
            style={{ cursor: "pointer" }}
            onClick={() => { setActive(i); onTabChange?.(t); }}
          >
            {t}
          </span>
        ))}

        <div className="ml-auto hidden md:flex items-center gap-2 py-2">
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
          {showSite && (
            <FiltersDropdown
              siteOptions={siteOptions!}
              siteValue={activeSite}
              onSiteChange={(v) => { setActiveSite(v); onSiteChange?.(v); }}
            />
          )}
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
