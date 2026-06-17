/* Client-side exporters for generated blueprint documents.
   PDF uses the browser print pipeline; Word uses an HTML-based .doc. */

function mdToHtml(md: string): string {
  const lines = md.replace(/\r/g, "").split("\n");
  const out: string[] = [];
  let i = 0;
  const inlineFmt = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
     .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
     .replace(/`([^`]+)`/g, "<code>$1</code>");
  while (i < lines.length) {
    const line = lines[i];
    if (line.includes("|") && lines[i + 1]?.match(/^\s*\|?[\s:|-]+\|?\s*$/)) {
      const row = (l: string) => l.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
      const header = row(line); i += 2;
      const body: string[][] = [];
      while (i < lines.length && lines[i].includes("|")) { body.push(row(lines[i])); i++; }
      out.push(`<table><thead><tr>${header.map((h) => `<th>${inlineFmt(h)}</th>`).join("")}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inlineFmt(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`);
      continue;
    }
    if (/^#\s/.test(line)) out.push(`<h1>${inlineFmt(line.slice(2))}</h1>`);
    else if (/^##\s/.test(line)) out.push(`<h2>${inlineFmt(line.slice(3))}</h2>`);
    else if (/^###\s/.test(line)) out.push(`<h3>${inlineFmt(line.slice(4))}</h3>`);
    else if (/^>\s?/.test(line)) out.push(`<blockquote>${inlineFmt(line.replace(/^>\s?/, ""))}</blockquote>`);
    else if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) { items.push(`<li>${inlineFmt(lines[i].replace(/^\d+\.\s/, ""))}</li>`); i++; }
      out.push(`<ol>${items.join("")}</ol>`); continue;
    } else if (/^[-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) { items.push(`<li>${inlineFmt(lines[i].replace(/^[-*]\s/, ""))}</li>`); i++; }
      out.push(`<ul>${items.join("")}</ul>`); continue;
    } else if (line.trim() !== "") out.push(`<p>${inlineFmt(line)}</p>`);
    i++;
  }
  return out.join("\n");
}

const DOC_CSS = `
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; max-width: 800px; margin: 40px auto; padding: 0 24px; line-height: 1.6; font-size: 13px; }
  h1 { font-size: 24px; border-bottom: 2px solid #1a8a4a; padding-bottom: 8px; }
  h2 { font-size: 17px; margin-top: 24px; }
  h3 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.04em; color: #444; }
  table { border-collapse: collapse; width: 100%; margin: 12px 0; }
  th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; font-size: 12px; }
  th { background: #f3f3f3; }
  blockquote { border-left: 3px solid #1a8a4a; padding-left: 12px; color: #555; }
  code { background: #f0f0f0; padding: 1px 4px; font-family: monospace; }
`;

export function exportPDF(title: string, markdown: string) {
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>${DOC_CSS}</style></head><body>${mdToHtml(markdown)}<script>window.onload=()=>{window.print();}</script></body></html>`);
  w.document.close();
}

export function exportWord(title: string, markdown: string) {
  const html = `<!doctype html><html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'><head><meta charset="utf-8"><style>${DOC_CSS}</style></head><body>${mdToHtml(markdown)}</body></html>`;
  download(`${slug(title)}.doc`, html, "application/msword");
}

export function exportMarkdown(title: string, markdown: string) {
  download(`${slug(title)}.md`, markdown, "text/markdown");
}

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
