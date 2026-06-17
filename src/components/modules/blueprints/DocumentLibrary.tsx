"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, FileText, Download, FileType, FileDown, Pencil, Check, X, History, Search } from "lucide-react";
import { STANDARDS, CATEGORY_LABEL, type DocCategory } from "@/config/blueprints";
import { useBlueprints, type Blueprint, type DocState } from "./store";
import { StandardChip, CATEGORY_COLOR, Markdown } from "./shared";
import { exportPDF, exportWord, exportMarkdown } from "@/lib/blueprints/exporters";

export function DocumentLibrary() {
  const params = useSearchParams();
  const idParam = params.get("id");
  const { blueprints, hydrated } = useBlueprints();

  const completed = useMemo(
    () => blueprints.filter((b) => b.docs.some((d) => d.content)),
    [blueprints]
  );
  const [activeId, setActiveId] = useState<string | null>(idParam);
  const active = completed.find((b) => b.id === (activeId ?? idParam)) ?? completed[0];

  if (!hydrated) return <div className="p-8 text-[13px]" style={{ color: "var(--b-text-muted)" }}>Loading…</div>;

  if (completed.length === 0) {
    return (
      <div className="p-8 max-w-[1100px]">
        <Back />
        <div className="border border-dashed p-12 text-center" style={{ borderColor: "var(--b-border)" }}>
          <FileText className="w-6 h-6 mx-auto mb-3" style={{ color: "var(--b-text-muted)" }} />
          <p className="text-[13.5px] font-medium" style={{ color: "var(--b-text-tertiary)" }}>No generated documents yet</p>
          <p className="text-[12px] mt-1 mb-4" style={{ color: "var(--b-text-muted)" }}>Generate a blueprint to populate your library.</p>
          <Link href="/blueprints/store" className="b-btn-accent inline-flex items-center gap-2 px-4 h-[36px] text-[13px] font-semibold">Browse Blueprint Store</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1200px]">
      <Back />
      {/* Blueprint switcher */}
      {completed.length > 1 && (
        <div className="flex items-center gap-2 mb-4">
          {completed.map((b) => (
            <button key={b.id} onClick={() => setActiveId(b.id)} className="px-3 py-1.5 border text-[12px] transition-colors" style={{ borderColor: active?.id === b.id ? "var(--b-accent-border)" : "var(--b-border)", background: active?.id === b.id ? "var(--b-accent-bg)" : "transparent" }}>
              {STANDARDS[b.standard].code}
            </button>
          ))}
        </div>
      )}
      {active && <LibraryView key={active.id} bp={active} />}
    </div>
  );
}

function LibraryView({ bp }: { bp: Blueprint }) {
  const { updateDoc } = useBlueprints();
  const std = STANDARDS[bp.standard];
  const generated = bp.docs.filter((d) => d.content);
  const [selectedId, setSelectedId] = useState(generated[0]?.id);
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState<DocCategory | "ALL">("ALL");

  const selected = bp.docs.find((d) => d.id === selectedId) ?? generated[0];

  const list = generated.filter((d) =>
    (catFilter === "ALL" || d.category === catFilter) &&
    d.name.toLowerCase().includes(query.toLowerCase())
  );

  const totalCost = bp.docs.reduce((s, d) => s + d.costUsd, 0);

  return (
    <>
      <div className="flex items-center gap-2 mb-1"><StandardChip k={bp.standard} size={13} /></div>
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight" style={{ color: "var(--b-text)" }}>{std.name} Library</h1>
          <p className="text-[12.5px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>{bp.org?.orgName} · {generated.length} documents · ${totalCost.toFixed(2)} AI cost</p>
        </div>
        <Link href={`/blueprints/gap-analysis?id=${bp.id}`} className="b-btn-ghost flex items-center gap-2 px-3 h-[34px] text-[12.5px]">Run Gap Analysis</Link>
      </div>

      <div className="grid gap-5 r-grid-2" style={{ gridTemplateColumns: "300px 1fr" }}>
        {/* Sidebar list */}
        <div className="border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
          <div className="p-2.5 border-b" style={{ borderColor: "var(--b-border)" }}>
            <div className="flex items-center gap-2 px-2 h-8 border" style={{ borderColor: "var(--b-border-strong)", background: "var(--b-bg-secondary)" }}>
              <Search className="w-3 h-3" style={{ color: "var(--b-text-muted)" }} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search documents…" className="flex-1 bg-transparent text-[12px] outline-none" style={{ color: "var(--b-text)" }} />
            </div>
            <div className="flex gap-1 mt-2">
              {(["ALL", "MANDATORY_DOCUMENT", "MANDATORY_RECORD", "RECOMMENDED_PROCEDURE"] as const).map((c) => (
                <button key={c} onClick={() => setCatFilter(c)} className="flex-1 text-[9.5px] font-semibold uppercase py-1 border transition-colors" style={{ borderColor: catFilter === c ? "var(--b-accent-border)" : "var(--b-border)", background: catFilter === c ? "var(--b-accent-bg)" : "transparent", color: catFilter === c ? "var(--b-accent-text)" : "var(--b-text-muted)" }}>
                  {c === "ALL" ? "All" : CATEGORY_COLOR[c].label}
                </button>
              ))}
            </div>
          </div>
          <div className="max-h-[560px] overflow-y-auto">
            {list.map((d) => {
              const sel = d.id === selected?.id;
              return (
                <button key={d.id} onClick={() => setSelectedId(d.id)} className="w-full text-left px-3 py-2.5 border-b flex items-start gap-2 transition-colors" style={{ borderColor: "var(--b-border)", background: sel ? "var(--b-bg-active)" : "transparent" }}>
                  <span className="font-mono text-[9px] px-1 py-0.5 mt-0.5 flex-shrink-0" style={{ background: CATEGORY_COLOR[d.category].bg, color: CATEGORY_COLOR[d.category].color }}>{d.clauseRef}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[12px] truncate" style={{ color: sel ? "var(--b-text)" : "var(--b-text-secondary)", fontWeight: sel ? 600 : 400 }}>{d.name}</span>
                    <span className="text-[10px]" style={{ color: "var(--b-text-muted)" }}>{d.edited ? "Edited" : "AI-generated"}{d.aiModel.includes("sonnet") ? " · Sonnet" : ""}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Document view/edit */}
        {selected && <DocViewer key={selected.id} bp={bp} doc={selected} onSave={(content) => {
          updateDoc(bp.id, selected.id, {
            content,
            edited: true,
            status: "EDITED",
            versions: [{ content: selected.content, at: new Date().toISOString(), label: selected.edited ? "Edit" : "Original AI version" }, ...selected.versions],
          });
        }} />}
      </div>
    </>
  );
}

function DocViewer({ bp, doc, onSave }: { bp: Blueprint; doc: DocState; onSave: (content: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(doc.content);
  const [showVersions, setShowVersions] = useState(false);

  return (
    <div className="border flex flex-col" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)", maxHeight: "640px" }}>
      {/* toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-semibold px-1.5 py-0.5" style={{ background: CATEGORY_COLOR[doc.category].bg, color: CATEGORY_COLOR[doc.category].color }}>{CATEGORY_LABEL[doc.category]}</span>
          <span className="text-[10px]" style={{ color: "var(--b-text-muted)" }}>· clause {doc.clauseRef}</span>
          {doc.edited && <span className="text-[10px] px-1.5 py-0.5" style={{ background: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" }}>Edited</span>}
        </div>
        <div className="flex items-center gap-1.5">
          {!editing ? (
            <>
              {doc.versions.length > 0 && (
                <button onClick={() => setShowVersions((v) => !v)} className="b-icon-btn flex items-center gap-1 px-2 h-7 text-[11px]" title="Version history">
                  <History className="w-3.5 h-3.5" /> {doc.versions.length}
                </button>
              )}
              <button onClick={() => { setDraft(doc.content); setEditing(true); }} className="b-btn-ghost flex items-center gap-1.5 px-2.5 h-7 text-[11.5px]"><Pencil className="w-3 h-3" /> Edit</button>
              <ExportMenu title={doc.name} content={doc.content} />
            </>
          ) : (
            <>
              <button onClick={() => setEditing(false)} className="b-btn-ghost flex items-center gap-1.5 px-2.5 h-7 text-[11.5px]"><X className="w-3 h-3" /> Cancel</button>
              <button onClick={() => { onSave(draft); setEditing(false); }} className="b-btn-accent flex items-center gap-1.5 px-3 h-7 text-[11.5px] font-semibold"><Check className="w-3 h-3" style={{ color: "var(--b-accent-text)" }} /> Save version</button>
            </>
          )}
        </div>
      </div>

      {showVersions && doc.versions.length > 0 && (
        <div className="px-4 py-2 border-b text-[11px]" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)", color: "var(--b-text-muted)" }}>
          <div className="font-semibold mb-1" style={{ color: "var(--b-text-secondary)" }}>Audit trail — original AI version preserved</div>
          {doc.versions.map((v, i) => (
            <div key={i} className="flex items-center justify-between py-0.5">
              <span>{v.label}</span><span>{new Date(v.at).toLocaleString("en-AU")}</span>
            </div>
          ))}
        </div>
      )}

      {/* body */}
      <div className="flex-1 overflow-y-auto p-6">
        {editing ? (
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} className="w-full h-full min-h-[480px] text-[12.5px] font-mono border outline-none p-4 resize-none" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border-strong)", color: "var(--b-text)", lineHeight: 1.6 }} />
        ) : (
          <Markdown text={doc.content} />
        )}
      </div>
      {/* footer */}
      <div className="px-4 py-2 border-t flex items-center justify-between text-[10.5px] flex-shrink-0" style={{ borderColor: "var(--b-border)", color: "var(--b-text-muted)" }}>
        <span>{bp.org?.orgName} · {STANDARDS[bp.standard].code}</span>
        <span>{doc.aiModel.includes("sonnet") ? "Claude Sonnet 4.6" : "Claude Haiku 4.5"} · {(doc.tokensUsed / 1000).toFixed(1)}k tokens</span>
      </div>
    </div>
  );
}

function ExportMenu({ title, content }: { title: string; content: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="b-btn-accent flex items-center gap-1.5 px-3 h-7 text-[11.5px] font-semibold"><Download className="w-3 h-3" style={{ color: "var(--b-accent-text)" }} /> Export</button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 z-20 border w-40" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
            {[
              { icon: FileType, label: "Export as PDF", fn: () => exportPDF(title, content) },
              { icon: FileDown, label: "Export as Word", fn: () => exportWord(title, content) },
              { icon: FileText, label: "Export Markdown", fn: () => exportMarkdown(title, content) },
            ].map(({ icon: Icon, label, fn }) => (
              <button key={label} onClick={() => { fn(); setOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-left transition-colors hover:bg-[var(--b-bg-hover)]" style={{ color: "var(--b-text-secondary)" }}>
                <Icon className="w-3.5 h-3.5" style={{ color: "var(--b-text-muted)" }} /> {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Back() {
  return <Link href="/blueprints" className="b-icon-btn inline-flex items-center gap-1.5 text-[12px] mb-6"><ArrowLeft className="w-3.5 h-3.5" /> Blueprints</Link>;
}
