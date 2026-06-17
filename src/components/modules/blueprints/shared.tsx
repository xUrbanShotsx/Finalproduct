"use client";

import React from "react";
import type { ISOStandard, DocCategory } from "@/config/blueprints";
import { STANDARDS } from "@/config/blueprints";

export function StandardChip({ k, size = 12 }: { k: ISOStandard; size?: number }) {
  const s = STANDARDS[k];
  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono font-bold uppercase tracking-wide"
      style={{ fontSize: size, color: s.color }}
    >
      <span style={{ width: 6, height: 6, background: s.color, display: "inline-block" }} />
      {s.code}
    </span>
  );
}

export const CATEGORY_COLOR: Record<DocCategory, { bg: string; color: string; label: string }> = {
  MANDATORY_DOCUMENT: { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)",   label: "Document" },
  MANDATORY_RECORD:   { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)", label: "Record" },
  RECOMMENDED_PROCEDURE: { bg: "var(--b-badge-green-bg)", color: "var(--b-badge-green-text)", label: "Procedure" },
};

/* ── Minimal, dependency-free Markdown renderer (headings, tables, lists, bold) ── */
export function Markdown({ text }: { text: string }) {
  const blocks = parseMarkdown(text);
  return (
    <div className="bp-md" style={{ color: "var(--b-text-secondary)", fontSize: "13.5px", lineHeight: 1.7 }}>
      {blocks}
    </div>
  );
}

function inline(s: string, key: string | number): React.ReactNode {
  // bold **x**, code `x`
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*|`([^`]+)`)/g;
  let last = 0; let m: RegExpExecArray | null; let i = 0;
  while ((m = regex.exec(s))) {
    if (m.index > last) parts.push(s.slice(last, m.index));
    if (m[2]) parts.push(<strong key={`${key}-b${i}`} style={{ color: "var(--b-text)", fontWeight: 700 }}>{m[2]}</strong>);
    else if (m[3]) parts.push(<code key={`${key}-c${i}`} style={{ fontFamily: "monospace", fontSize: "12px", background: "var(--b-bg-active)", padding: "1px 5px" }}>{m[3]}</code>);
    last = m.index + m[0].length; i++;
  }
  if (last < s.length) parts.push(s.slice(last));
  return parts;
}

function parseMarkdown(text: string): React.ReactNode[] {
  const lines = text.replace(/\r/g, "").split("\n");
  const out: React.ReactNode[] = [];
  let i = 0; let k = 0;
  while (i < lines.length) {
    const line = lines[i];

    // table
    if (line.includes("|") && lines[i + 1]?.match(/^\s*\|?[\s:|-]+\|?\s*$/)) {
      const header = splitRow(line);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && lines[i].includes("|")) { rows.push(splitRow(lines[i])); i++; }
      out.push(
        <div key={k++} style={{ overflowX: "auto", margin: "12px 0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
            <thead>
              <tr>{header.map((h, hi) => <th key={hi} style={{ textAlign: "left", padding: "7px 10px", borderBottom: "1px solid var(--b-border)", color: "var(--b-text-muted)", fontWeight: 600, background: "var(--b-bg-secondary)" }}>{inline(h, `h${hi}`)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => <tr key={ri}>{r.map((c, ci) => <td key={ci} style={{ padding: "7px 10px", borderBottom: "1px solid var(--b-border)", color: "var(--b-text-secondary)" }}>{inline(c, `c${ri}-${ci}`)}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (/^#\s/.test(line)) { out.push(<h1 key={k++} style={{ fontSize: "22px", fontWeight: 800, color: "var(--b-text)", letterSpacing: "-0.02em", margin: "4px 0 12px" }}>{inline(line.slice(2), `h1${k}`)}</h1>); i++; continue; }
    if (/^##\s/.test(line)) { out.push(<h2 key={k++} style={{ fontSize: "16px", fontWeight: 700, color: "var(--b-text)", margin: "20px 0 8px" }}>{inline(line.slice(3), `h2${k}`)}</h2>); i++; continue; }
    if (/^###\s/.test(line)) { out.push(<h3 key={k++} style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--b-text)", margin: "14px 0 6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{inline(line.slice(4), `h3${k}`)}</h3>); i++; continue; }
    if (/^>\s?/.test(line)) { out.push(<blockquote key={k++} style={{ borderLeft: "2px solid var(--b-accent-border)", paddingLeft: "12px", margin: "10px 0", color: "var(--b-text-muted)", fontSize: "12.5px" }}>{inline(line.replace(/^>\s?/, ""), `q${k}`)}</blockquote>); i++; continue; }

    // ordered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) { items.push(lines[i].replace(/^\d+\.\s/, "")); i++; }
      out.push(<ol key={k++} style={{ margin: "8px 0", paddingLeft: "20px", listStyle: "decimal" }}>{items.map((it, ii) => <li key={ii} style={{ margin: "3px 0" }}>{inline(it, `ol${k}-${ii}`)}</li>)}</ol>);
      continue;
    }
    // unordered list
    if (/^[-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) { items.push(lines[i].replace(/^[-*]\s/, "")); i++; }
      out.push(<ul key={k++} style={{ margin: "8px 0", paddingLeft: "18px", listStyle: "disc" }}>{items.map((it, ii) => <li key={ii} style={{ margin: "3px 0" }}>{inline(it, `ul${k}-${ii}`)}</li>)}</ul>);
      continue;
    }
    if (line.trim() === "") { i++; continue; }
    out.push(<p key={k++} style={{ margin: "8px 0" }}>{inline(line, `p${k}`)}</p>);
    i++;
  }
  return out;
}

function splitRow(line: string): string[] {
  return line.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
}
