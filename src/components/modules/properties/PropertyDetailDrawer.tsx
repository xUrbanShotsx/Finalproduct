"use client";

import { useRef, useState } from "react";
import {
  X, Home, Upload, CheckCircle2, Clock, FileText, Trash2, Eye,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

export interface ListingRecord {
  ref: string;
  address: string;
  suburb: string;
  type: string;
  price: string;
  status: string;
  daysOnMarket: number;
  agent: string;
  aml: string;
}

interface DocSlot {
  id: string;
  label: string;
  description: string;
  required: boolean;
  accept: string;
}

interface UploadedFile {
  name: string;
  size: number;
  uploadedAt: string;
}

// ── Document checklist definition ─────────────────────────────────────────

const DOC_SLOTS: DocSlot[] = [
  {
    id: "vendor-id-primary",
    label: "Vendor ID — Primary",
    description: "Certified copy of driver's licence or passport for all vendors",
    required: true,
    accept: "image/*,.pdf",
  },
  {
    id: "vendor-id-secondary",
    label: "Vendor ID — Secondary",
    description: "Utility bill, rates notice or bank statement (within 3 months)",
    required: true,
    accept: "image/*,.pdf",
  },
  {
    id: "contract-of-sale",
    label: "Contract of Sale",
    description: "Signed contract of sale / Section 32 Vendor Statement prepared by solicitor",
    required: true,
    accept: ".pdf,.doc,.docx",
  },
  {
    id: "sales-agreement",
    label: "Sales Agreement",
    description: "Agency agreement / authority to act signed by all vendors with commission disclosure",
    required: true,
    accept: ".pdf,.doc,.docx",
  },
  {
    id: "cma-report",
    label: "CMA Report",
    description: "Comparable Market Analysis prepared and presented to vendor prior to listing",
    required: true,
    accept: ".pdf,.doc,.docx,.xls,.xlsx",
  },
  {
    id: "council-rates",
    label: "Council Rates Notice",
    description: "Current council rates notice showing property address and annual charges",
    required: false,
    accept: "image/*,.pdf",
  },
  {
    id: "water-rates",
    label: "Water Rates Notice",
    description: "Current water rates / utility notice for the property",
    required: false,
    accept: "image/*,.pdf",
  },
];

// ── Seed uploaded docs for demo listings that are already complete/in-progress ─

function seedDocs(ref: string): Record<string, UploadedFile> {
  if (ref === "LST-002" || ref === "LST-003" || ref === "LST-005") {
    return Object.fromEntries(DOC_SLOTS.map(s => [s.id, { name: `${s.id}.pdf`, size: 245760, uploadedAt: "2 May 2026" }]));
  }
  if (ref === "LST-006" || ref === "LST-007") {
    return {
      "vendor-id-primary": { name: "vendor-id-primary.jpg", size: 102400, uploadedAt: "8 Jun 2026" },
      "vendor-id-secondary": { name: "vendor-id-secondary.pdf", size: 88000, uploadedAt: "8 Jun 2026" },
      "sales-agreement": { name: "agency-agreement-signed.pdf", size: 312000, uploadedAt: "8 Jun 2026" },
    };
  }
  return {};
}

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Component ──────────────────────────────────────────────────────────────

interface Props {
  listing: ListingRecord | null;
  open: boolean;
  onClose: () => void;
}

export function PropertyDetailDrawer({ listing, open, onClose }: Props) {
  const [uploads, setUploads] = useState<Record<string, UploadedFile>>(() =>
    listing ? seedDocs(listing.ref) : {}
  );
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Reset uploads when listing changes
  const [currentRef, setCurrentRef] = useState<string | null>(null);
  if (listing && listing.ref !== currentRef) {
    setCurrentRef(listing.ref);
    setUploads(seedDocs(listing.ref));
  }

  function handleFileChange(slotId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const today = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
    setUploads(prev => ({
      ...prev,
      [slotId]: { name: file.name, size: file.size, uploadedAt: today },
    }));
    e.target.value = "";
  }

  function removeFile(slotId: string) {
    setUploads(prev => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
  }

  if (!open || !listing) return null;

  const uploaded = DOC_SLOTS.filter(s => uploads[s.id]).length;
  const requiredUploaded = DOC_SLOTS.filter(s => s.required && uploads[s.id]).length;
  const totalRequired = DOC_SLOTS.filter(s => s.required).length;
  const pct = Math.round((requiredUploaded / totalRequired) * 100);

  const AML_STYLE: Record<string, React.CSSProperties> = {
    "Complete":    { background: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
    "In Progress": { background: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
    "Overdue":     { background: "rgba(240,96,96,0.1)",      color: "#f06060" },
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col b-drawer-panel"
        style={{ width: "min(660px, 100vw)", background: "var(--b-bg)", borderLeft: "1px solid var(--b-border)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: "var(--b-border)" }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ background: "var(--b-bg-active)", color: "var(--b-text-muted)" }}>
              <Home className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-[15px] font-semibold truncate" style={{ color: "var(--b-text)" }}>{listing.address}</h2>
              <p className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>{listing.suburb} · {listing.type} · {listing.price}</p>
            </div>
          </div>
          <button onClick={onClose} className="flex-shrink-0 ml-4" style={{ color: "var(--b-text-muted)" }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-4 px-6 py-3 border-b flex-shrink-0" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}>
          <div className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>
            <span className="font-semibold" style={{ color: "var(--b-text-secondary)" }}>Agent:</span> {listing.agent}
          </div>
          <div className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>
            <span className="font-semibold" style={{ color: "var(--b-text-secondary)" }}>DOM:</span> {listing.daysOnMarket === 0 ? "—" : `${listing.daysOnMarket}d`}
          </div>
          <div>
            <span className="px-2 py-0.5 text-[11px] font-semibold" style={(AML_STYLE[listing.aml] ?? {})}>
              AML: {listing.aml}
            </span>
          </div>
        </div>

        {/* Document progress bar */}
        <div className="px-6 py-3 border-b flex-shrink-0" style={{ borderColor: "var(--b-border)" }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--b-text-muted)" }}>
              Listing documents
            </span>
            <span className="text-[11px] font-semibold" style={{ color: pct === 100 ? "var(--b-badge-green-text)" : "var(--b-text-muted)" }}>
              {uploaded}/{DOC_SLOTS.length} uploaded · {requiredUploaded}/{totalRequired} required ({pct}%)
            </span>
          </div>
          <div className="h-1.5 w-full" style={{ background: "var(--b-border)" }}>
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${pct}%`,
                background: pct === 100 ? "var(--b-badge-green-text)" : pct >= 60 ? "#f0cb00" : "#f06060",
              }}
            />
          </div>
        </div>

        {/* Document list */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-3">
            {DOC_SLOTS.map(slot => {
              const file = uploads[slot.id];
              return (
                <div
                  key={slot.id}
                  className="border"
                  style={{
                    borderColor: file ? "var(--b-accent-border)" : "var(--b-border)",
                    background: file ? "var(--b-accent-bg)" : "var(--b-bg-secondary)",
                  }}
                >
                  <div className="flex items-start gap-3 p-4">
                    {/* Status icon */}
                    <div
                      className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: file ? "var(--b-badge-green-text)" : "var(--b-border-strong)",
                        color: "white",
                      }}
                    >
                      {file ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>

                    {/* Label & description */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>{slot.label}</span>
                        {slot.required && !file && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5" style={{ background: "rgba(240,96,96,0.1)", color: "#f06060" }}>
                            REQUIRED
                          </span>
                        )}
                        {file && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5" style={{ background: "var(--b-badge-green-bg)", color: "var(--b-badge-green-text)" }}>
                            UPLOADED
                          </span>
                        )}
                      </div>
                      <p className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>{slot.description}</p>

                      {/* Uploaded file info */}
                      {file && (
                        <div className="flex items-center gap-3 mt-2.5 px-3 py-2 border" style={{ background: "var(--b-bg)", borderColor: "var(--b-accent-border)" }}>
                          <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-accent-text)" }} />
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] font-medium truncate" style={{ color: "var(--b-text)" }}>{file.name}</div>
                            <div className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>{fmtSize(file.size)} · Uploaded {file.uploadedAt}</div>
                          </div>
                          <button
                            onClick={() => removeFile(slot.id)}
                            className="flex-shrink-0 p-1 transition-colors"
                            style={{ color: "var(--b-text-muted)" }}
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button className="flex-shrink-0 p-1 transition-colors" style={{ color: "var(--b-text-muted)" }} title="Preview">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Upload button */}
                    <div className="flex-shrink-0">
                      <input
                        ref={el => { fileRefs.current[slot.id] = el; }}
                        type="file"
                        accept={slot.accept}
                        className="hidden"
                        onChange={e => handleFileChange(slot.id, e)}
                      />
                      <button
                        onClick={() => fileRefs.current[slot.id]?.click()}
                        className="flex items-center gap-1.5 px-3 h-[34px] border text-[12px] font-medium transition-colors"
                        style={{
                          background: file ? "var(--b-bg)" : "var(--b-bg)",
                          borderColor: "var(--b-border-strong)",
                          color: "var(--b-text-secondary)",
                        }}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        {file ? "Replace" : "Upload"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t flex-shrink-0" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
          <div className="text-[12px]" style={{ color: pct === 100 ? "var(--b-badge-green-text)" : "var(--b-text-muted)" }}>
            {pct === 100 ? "✓ All required documents uploaded" : `${totalRequired - requiredUploaded} required document${totalRequired - requiredUploaded !== 1 ? "s" : ""} pending`}
          </div>
          <button onClick={onClose} className="b-btn-ghost px-4 h-[38px] text-[13px]">Close</button>
        </div>
      </div>
    </>
  );
}
