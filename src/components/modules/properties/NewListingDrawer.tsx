"use client";

import { useState } from "react";
import { X, ChevronDown, ChevronRight, Check, AlertCircle, Home, FileText, Shield } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

interface ChecklistItem {
  id: string;
  label: string;
  required: boolean;
  note?: string;
}

interface ChecklistSection {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  items: ChecklistItem[];
}

// ── Checklist data ─────────────────────────────────────────────────────────

const SECTIONS: ChecklistSection[] = [
  {
    id: "vendor-id",
    title: "Vendor Identity Verification",
    icon: Shield,
    color: "#f06060",
    items: [
      { id: "vid-1", label: "Primary ID sighted & certified copy taken (driver's licence or passport)", required: true, note: "AML/CTF Act 2006 — s.28" },
      { id: "vid-2", label: "Secondary ID verified (utility bill, rates notice or bank statement)", required: true },
      { id: "vid-3", label: "All beneficial owners identified and verified", required: true, note: "Required if property held in trust or company name" },
      { id: "vid-4", label: "Politically Exposed Person (PEP) check completed", required: true },
      { id: "vid-5", label: "Sanctions screening completed (OFAC, DFAT lists)", required: true },
    ],
  },
  {
    id: "aml-ctf",
    title: "AML/CTF Compliance",
    icon: Shield,
    color: "#b58a1b",
    items: [
      { id: "aml-1", label: "AML/CTF risk assessment completed for this transaction", required: true, note: "AUSTRAC obligation — effective 31 Mar 2026" },
      { id: "aml-2", label: "Source of funds verified and documented", required: true },
      { id: "aml-3", label: "Transaction monitoring flags reviewed — no suspicious activity", required: true },
      { id: "aml-4", label: "AML/CTF records filed (minimum 7-year retention)", required: true },
    ],
  },
  {
    id: "agency-agreement",
    title: "Agency Agreement & Authority",
    icon: FileText,
    color: "#1a6ddb",
    items: [
      { id: "ag-1", label: "Agency agreement signed by all vendors", required: true },
      { id: "ag-2", label: "Commission and fees disclosed in writing before signing", required: true, note: "Property and Stock Agents Act 2002" },
      { id: "ag-3", label: "Cooling-off period noted and communicated (if applicable)", required: false },
      { id: "ag-4", label: "Authority type confirmed: sole / exclusive / open", required: true },
      { id: "ag-5", label: "Rebate & benefit disclosure signed by vendor", required: true },
    ],
  },
  {
    id: "due-diligence",
    title: "Property Due Diligence",
    icon: Home,
    color: "#1a8a4a",
    items: [
      { id: "dd-1", label: "Certificate of Title obtained and reviewed for encumbrances", required: true },
      { id: "dd-2", label: "Zoning, planning overlays and easements checked", required: true },
      { id: "dd-3", label: "Council rates and outgoings confirmed with vendor", required: true },
      { id: "dd-4", label: "Body corporate records and levies obtained (strata properties)", required: false, note: "Required for strata and community title only" },
      { id: "dd-5", label: "Building & pest inspection reports obtained or vendor acknowledged waiver", required: false },
      { id: "dd-6", label: "Section 32 / Vendor Statement prepared by solicitor", required: true },
    ],
  },
  {
    id: "marketing",
    title: "Marketing & Listing Setup",
    icon: Home,
    color: "#7c3aed",
    items: [
      { id: "mk-1", label: "Comparable Market Analysis (CMA) prepared and presented to vendor", required: true },
      { id: "mk-2", label: "Vendor price guide agreed and documented", required: true },
      { id: "mk-3", label: "Professional photography booked and completed", required: false },
      { id: "mk-4", label: "Floor plan prepared", required: false },
      { id: "mk-5", label: "Advertising copy approved by vendor in writing", required: true },
      { id: "mk-6", label: "Listed on realestate.com.au and Domain", required: false },
      { id: "mk-7", label: "Signboard installed on property", required: false },
    ],
  },
  {
    id: "access",
    title: "Property Access & Handover",
    icon: Home,
    color: "#0891b2",
    items: [
      { id: "ac-1", label: "Keys collected from vendor and logged in key register", required: true },
      { id: "ac-2", label: "Lockbox installed and combination recorded", required: false },
      { id: "ac-3", label: "Inspection schedule set and confirmed with vendor", required: true },
      { id: "ac-4", label: "Emergency contact details recorded", required: true },
    ],
  },
];

// ── Props ──────────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
  onSave?: (data: { address: string; type: string; price: string; agent: string; checked: Set<string> }) => void;
}

// ── Component ──────────────────────────────────────────────────────────────

export function NewListingDrawer({ open, onClose, onSave }: Props) {
  const [address, setAddress] = useState("");
  const [type, setType] = useState("House");
  const [price, setPrice] = useState("");
  const [agent, setAgent] = useState("Taylor Reid");
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["vendor-id"]));
  const [activeTab, setActiveTab] = useState<"details" | "checklist">("details");

  const allRequired = SECTIONS.flatMap(s => s.items.filter(i => i.required).map(i => i.id));
  const requiredDone = allRequired.filter(id => checked.has(id)).length;
  const totalRequired = allRequired.length;
  const pct = Math.round((requiredDone / totalRequired) * 100);

  function toggle(id: string) {
    setChecked(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  function toggleSection(id: string) {
    setOpenSections(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  function handleSave() {
    if (!address.trim()) return;
    onSave?.({ address, type, price, agent, checked });
    onClose();
    setAddress(""); setPrice(""); setChecked(new Set()); setOpenSections(new Set(["vendor-id"])); setActiveTab("details");
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col b-drawer-panel"
        style={{
          width: "min(680px, 100vw)",
          background: "var(--b-bg)",
          borderLeft: "1px solid var(--b-border)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: "var(--b-border)" }}
        >
          <div>
            <h2 className="text-[16px] font-semibold" style={{ color: "var(--b-text)" }}>New Listing</h2>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>
              Complete all required compliance steps before going to market
            </p>
          </div>
          <button onClick={onClose} style={{ color: "var(--b-text-muted)" }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Compliance progress bar */}
        <div className="px-6 py-3 border-b flex-shrink-0" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--b-text-muted)" }}>
              Compliance checklist
            </span>
            <span className="text-[11px] font-semibold" style={{ color: pct === 100 ? "var(--b-badge-green-text)" : "var(--b-text-muted)" }}>
              {requiredDone}/{totalRequired} required · {pct}%
            </span>
          </div>
          <div className="h-1.5 w-full" style={{ background: "var(--b-border)" }}>
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${pct}%`,
                background: pct === 100 ? "var(--b-badge-green-text)" : pct > 60 ? "#f0cb00" : "#f06060",
              }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b flex-shrink-0" style={{ borderColor: "var(--b-border)" }}>
          {(["details", "checklist"] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className="b-tab"
              data-active={activeTab === t}
            >
              {t === "details" ? "Property Details" : `Compliance Checklist (${requiredDone}/${totalRequired})`}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "details" && (
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--b-text-muted)" }}>
                  Property Address <span style={{ color: "#f06060" }}>*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="e.g. 32 Harbour Street, Manly NSW 2095"
                  className="w-full px-3 h-[40px] text-[13px] border outline-none"
                  style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--b-text-muted)" }}>
                    Property Type
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="w-full px-3 h-[40px] text-[13px] border outline-none"
                    style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }}
                  >
                    {["House", "Apartment", "Townhouse", "Land", "Commercial", "Rural"].map(t => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--b-text-muted)" }}>
                    Listing Agent
                  </label>
                  <select
                    value={agent}
                    onChange={e => setAgent(e.target.value)}
                    className="w-full px-3 h-[40px] text-[13px] border outline-none"
                    style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }}
                  >
                    {["Taylor Reid", "Sarah Kim", "Mark Ng", "Jamie Walsh"].map(a => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--b-text-muted)" }}>
                  Vendor Price Guide
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px]" style={{ color: "var(--b-text-muted)" }}>$</span>
                  <input
                    type="text"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="e.g. 1,850,000"
                    className="w-full pl-7 pr-3 h-[40px] text-[13px] border outline-none"
                    style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }}
                  />
                </div>
              </div>

              {/* Compliance callout */}
              <div
                className="p-4 border-l-2 mt-2"
                style={{ background: "rgba(240,96,96,0.05)", borderLeftColor: "#f06060" }}
              >
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#f06060" }} />
                  <div>
                    <div className="text-[12.5px] font-semibold mb-1" style={{ color: "var(--b-text)" }}>
                      AML/CTF compliance required before listing
                    </div>
                    <div className="text-[12px] leading-relaxed" style={{ color: "var(--b-text-muted)" }}>
                      Under the <strong>AML/CTF Act 2006</strong> (effective 31 March 2026), real estate agents must complete vendor identity verification and AML risk assessment before marketing or exchanging contracts. Complete the Compliance Checklist tab before submitting.
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab("checklist")}
                className="b-btn-accent flex items-center gap-2 px-4 h-[38px] text-[13px] font-medium w-full justify-center"
              >
                Proceed to Compliance Checklist
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {activeTab === "checklist" && (
            <div className="p-6 space-y-3">
              {SECTIONS.map(section => {
                const sectionItems = section.items;
                const sectionDone = sectionItems.filter(i => checked.has(i.id)).length;
                const isOpen = openSections.has(section.id);
                const allDone = sectionDone === sectionItems.length;
                const Icon = section.icon;

                return (
                  <div key={section.id} className="border" style={{ borderColor: "var(--b-border)" }}>
                    {/* Section header */}
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 text-left"
                      style={{ background: "var(--b-bg-secondary)" }}
                      onClick={() => toggleSection(section.id)}
                    >
                      <div
                        className="w-6 h-6 flex items-center justify-center flex-shrink-0"
                        style={{ background: allDone ? "var(--b-badge-green-bg)" : `${section.color}15`, color: allDone ? "var(--b-badge-green-text)" : section.color }}
                      >
                        {allDone ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="text-[12.5px] font-semibold" style={{ color: "var(--b-text)" }}>{section.title}</div>
                      </div>
                      <span className="text-[11px] font-medium mr-2 flex-shrink-0" style={{ color: allDone ? "var(--b-badge-green-text)" : "var(--b-text-muted)" }}>
                        {sectionDone}/{sectionItems.length}
                      </span>
                      {isOpen
                        ? <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />
                        : <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />
                      }
                    </button>

                    {/* Section items */}
                    {isOpen && (
                      <div className="divide-y" style={{ borderColor: "var(--b-border)" }}>
                        {sectionItems.map(item => {
                          const isDone = checked.has(item.id);
                          return (
                            <div
                              key={item.id}
                              className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors"
                              style={{ background: isDone ? "var(--b-accent-bg)" : "var(--b-bg)" }}
                              onClick={() => toggle(item.id)}
                            >
                              <div
                                className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 border transition-colors"
                                style={{
                                  background: isDone ? "var(--b-badge-green-text)" : "transparent",
                                  borderColor: isDone ? "var(--b-badge-green-text)" : "var(--b-border-strong)",
                                }}
                              >
                                {isDone && <Check className="w-2.5 h-2.5 text-white" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div
                                  className="text-[12.5px] leading-snug"
                                  style={{ color: isDone ? "var(--b-text-muted)" : "var(--b-text)", textDecoration: isDone ? "line-through" : "none" }}
                                >
                                  {item.label}
                                  {item.required && !isDone && (
                                    <span className="ml-1.5 text-[10px] font-semibold" style={{ color: "#f06060" }}>REQUIRED</span>
                                  )}
                                </div>
                                {item.note && (
                                  <div className="text-[11px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>{item.note}</div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-4 border-t flex-shrink-0"
          style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}
        >
          <div>
            {pct < 100 && (
              <div className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>
                {totalRequired - requiredDone} required step{totalRequired - requiredDone !== 1 ? "s" : ""} remaining
              </div>
            )}
            {pct === 100 && (
              <div className="text-[12px] font-medium" style={{ color: "var(--b-badge-green-text)" }}>
                ✓ All required steps complete
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="b-btn-ghost px-4 h-[38px] text-[13px]">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!address.trim()}
              className="b-btn-accent px-5 h-[38px] text-[13px] font-semibold disabled:opacity-40"
            >
              Save Listing
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
