"use client";

import { useState } from "react";
import { Plus, Home, AlertCircle, CheckCircle2, Clock, Search } from "lucide-react";
import { NewListingDrawer } from "./NewListingDrawer";

// ── Types ──────────────────────────────────────────────────────────────────

type ListingStatus = "Active" | "Under Contract" | "Settled" | "For Sale";
type AmlStatus = "Complete" | "In Progress" | "Overdue";

interface Listing {
  ref: string;
  address: string;
  suburb: string;
  type: string;
  price: string;
  status: ListingStatus;
  daysOnMarket: number;
  agent: string;
  aml: AmlStatus;
}

// ── Demo data ──────────────────────────────────────────────────────────────

const DEMO_LISTINGS: Listing[] = [
  { ref: "LST-001", address: "32 Harbour Street",      suburb: "Manly NSW 2095",         type: "House",      price: "$2,850,000",  status: "Active",         daysOnMarket: 12, agent: "Taylor Reid",  aml: "Overdue" },
  { ref: "LST-002", address: "7 Marine Parade",        suburb: "Cronulla NSW 2230",      type: "Apartment",  price: "$1,250,000",  status: "Under Contract", daysOnMarket: 28, agent: "Taylor Reid",  aml: "Complete" },
  { ref: "LST-003", address: "15 Cliff Drive",         suburb: "Newport NSW 2106",       type: "House",      price: "$3,200,000",  status: "Active",         daysOnMarket: 5,  agent: "Sarah Kim",    aml: "Complete" },
  { ref: "LST-004", address: "82 Pacific Highway",     suburb: "Gordon NSW 2072",        type: "Townhouse",  price: "$1,650,000",  status: "Active",         daysOnMarket: 19, agent: "Mark Ng",      aml: "Overdue" },
  { ref: "LST-005", address: "4/12 Bay Street",        suburb: "Balmain NSW 2041",       type: "Apartment",  price: "$985,000",    status: "Settled",        daysOnMarket: 45, agent: "Taylor Reid",  aml: "Complete" },
  { ref: "LST-006", address: "201 Crown Street",       suburb: "Darlinghurst NSW 2010",  type: "Apartment",  price: "$1,100,000",  status: "Active",         daysOnMarket: 8,  agent: "Sarah Kim",    aml: "In Progress" },
  { ref: "LST-007", address: "38 Riverview Road",      suburb: "Riverview NSW 2066",     type: "House",      price: "$2,100,000",  status: "For Sale",       daysOnMarket: 0,  agent: "Mark Ng",      aml: "In Progress" },
  { ref: "LST-008", address: "14 Cove Road",           suburb: "Watsons Bay NSW 2030",   type: "House",      price: "$4,500,000",  status: "Active",         daysOnMarket: 3,  agent: "Jamie Walsh",  aml: "Overdue" },
];

// ── Style maps ─────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<ListingStatus, React.CSSProperties> = {
  "Active":         { background: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Under Contract": { background: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Settled":        { background: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "For Sale":       { background: "var(--b-bg-secondary)",    color: "var(--b-text-muted)" },
};

const AML_STYLE: Record<AmlStatus, React.CSSProperties> = {
  "Complete":    { background: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "In Progress": { background: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Overdue":     { background: "rgba(240,96,96,0.1)",      color: "#f06060" },
};

const AML_ICON = {
  "Complete":    CheckCircle2,
  "In Progress": Clock,
  "Overdue":     AlertCircle,
} as const;

// ── PageShell inline ───────────────────────────────────────────────────────

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 md:p-8 max-w-[1200px]">
      {children}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>(DEMO_LISTINGS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | ListingStatus>("All");

  const filtered = listings.filter(l => {
    const matchesSearch =
      l.address.toLowerCase().includes(search.toLowerCase()) ||
      l.suburb.toLowerCase().includes(search.toLowerCase()) ||
      l.agent.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || l.status === filter;
    return matchesSearch && matchesFilter;
  });

  const overdue = listings.filter(l => l.aml === "Overdue").length;
  const active = listings.filter(l => l.status === "Active").length;

  function handleSave(data: { address: string; type: string; price: string; agent: string }) {
    const newListing: Listing = {
      ref: `LST-${String(listings.length + 1).padStart(3, "0")}`,
      address: data.address,
      suburb: "",
      type: data.type,
      price: data.price ? `$${data.price}` : "—",
      status: "For Sale",
      daysOnMarket: 0,
      agent: data.agent,
      aml: "In Progress",
    };
    setListings(prev => [newListing, ...prev]);
  }

  const tabs: ("All" | ListingStatus)[] = ["All", "Active", "Under Contract", "For Sale", "Settled"];

  return (
    <PageShell>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-semibold" style={{ color: "var(--b-text)" }}>Listings</h1>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>
            {active} active · {listings.length} total · {overdue > 0 && <span style={{ color: "#f06060" }}>{overdue} AML checks overdue</span>}
          </p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="b-btn-accent flex items-center gap-2 px-4 h-[38px] text-[13px] font-medium flex-shrink-0"
        >
          <Plus className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} />
          New Listing
        </button>
      </div>

      {/* AML alert banner */}
      {overdue > 0 && (
        <div
          className="flex items-start gap-3 p-4 border-l-2 mb-6"
          style={{ background: "rgba(240,96,96,0.05)", borderLeftColor: "#f06060", borderRight: "1px solid rgba(240,96,96,0.15)", borderTop: "1px solid rgba(240,96,96,0.15)", borderBottom: "1px solid rgba(240,96,96,0.15)" }}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#f06060" }} />
          <div>
            <div className="text-[12.5px] font-semibold" style={{ color: "var(--b-text)" }}>
              {overdue} listing{overdue !== 1 ? "s" : ""} with overdue AML/CTF vendor checks
            </div>
            <div className="text-[12px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>
              Under the AML/CTF Act 2006, vendor identity verification must be completed before exchange of contracts. Open each listing to complete the compliance checklist.
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex gap-px border-b flex-1 min-w-0" style={{ borderColor: "var(--b-border)" }}>
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className="b-tab flex-shrink-0"
              data-active={filter === t}
            >
              {t}
            </button>
          ))}
        </div>
        <div
          className="hidden md:flex items-center gap-2 px-3 h-[34px] border flex-shrink-0"
          style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border-strong)" }}
        >
          <Search className="w-3.5 h-3.5" style={{ color: "var(--b-text-muted)" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search address, suburb, agent…"
            className="bg-transparent text-[12.5px] outline-none w-52"
            style={{ color: "var(--b-text)" }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="border overflow-hidden" style={{ borderColor: "var(--b-border)" }}>
        <table className="w-full text-[12.5px]" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--b-bg-secondary)", borderBottom: "1px solid var(--b-border)" }}>
              <th className="text-left px-4 py-3 font-semibold uppercase tracking-wider text-[10px]" style={{ color: "var(--b-text-muted)" }}>Property</th>
              <th className="text-left px-4 py-3 font-semibold uppercase tracking-wider text-[10px]" style={{ color: "var(--b-text-muted)" }}>Type</th>
              <th className="text-left px-4 py-3 font-semibold uppercase tracking-wider text-[10px]" style={{ color: "var(--b-text-muted)" }}>Price</th>
              <th className="text-left px-4 py-3 font-semibold uppercase tracking-wider text-[10px]" style={{ color: "var(--b-text-muted)" }}>Status</th>
              <th className="text-left px-4 py-3 font-semibold uppercase tracking-wider text-[10px]" style={{ color: "var(--b-text-muted)" }}>DOM</th>
              <th className="text-left px-4 py-3 font-semibold uppercase tracking-wider text-[10px]" style={{ color: "var(--b-text-muted)" }}>Agent</th>
              <th className="text-left px-4 py-3 font-semibold uppercase tracking-wider text-[10px]" style={{ color: "var(--b-text-muted)" }}>AML/CTF</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-16" style={{ color: "var(--b-text-muted)" }}>
                  No listings match your filter
                </td>
              </tr>
            )}
            {filtered.map((l, idx) => {
              const AmlIcon = AML_ICON[l.aml];
              return (
                <tr
                  key={l.ref}
                  className="b-tr cursor-pointer"
                  style={{ borderBottom: idx < filtered.length - 1 ? "1px solid var(--b-border)" : "none" }}
                >
                  <td className="px-4 py-3.5" data-label="Property">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 flex items-center justify-center flex-shrink-0"
                        style={{ background: "var(--b-bg-active)", color: "var(--b-text-muted)" }}
                      >
                        <Home className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-medium" style={{ color: "var(--b-text)" }}>{l.address}</div>
                        {l.suburb && <div className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>{l.suburb}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5" style={{ color: "var(--b-text-secondary)" }} data-label="Type">{l.type}</td>
                  <td className="px-4 py-3.5 font-medium" style={{ color: "var(--b-text)" }} data-label="Price">{l.price}</td>
                  <td className="px-4 py-3.5" data-label="Status">
                    <span className="px-2 py-0.5 text-[11px] font-semibold" style={STATUS_STYLE[l.status]}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5" style={{ color: "var(--b-text-secondary)" }} data-label="Days on Market">
                    {l.daysOnMarket === 0 ? "—" : `${l.daysOnMarket}d`}
                  </td>
                  <td className="px-4 py-3.5" style={{ color: "var(--b-text-secondary)" }} data-label="Agent">{l.agent}</td>
                  <td className="px-4 py-3.5" data-label="AML/CTF">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold" style={AML_STYLE[l.aml]}>
                      <AmlIcon className="w-3 h-3" />
                      {l.aml}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* New listing drawer */}
      <NewListingDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
      />
    </PageShell>
  );
}
