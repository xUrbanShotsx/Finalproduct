"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * On mobile the dashboard tables render as stacked cards. To keep each value
 * readable we label every cell with its column header. This wires the labels at
 * runtime (no per-page changes) and re-applies them whenever rows re-render
 * (filtering, adding records, etc.). CSS does the actual card layout.
 */
export function ResponsiveTableLabels() {
  const pathname = usePathname();

  useEffect(() => {
    function apply() {
      document.querySelectorAll("main table").forEach((table) => {
        const headers = Array.from(table.querySelectorAll("thead th")).map((th) => (th.textContent || "").trim());
        if (headers.length === 0) return;
        table.querySelectorAll("tbody tr").forEach((tr) => {
          let i = 0;
          Array.from(tr.children).forEach((cell) => {
            if (cell.tagName !== "TD") return;
            const label = headers[i] ?? "";
            (cell as HTMLElement).dataset.label = label;
            i += 1;
          });
        });
      });
    }

    apply();
    const main = document.querySelector("main");
    if (!main) return;
    let raf = 0;
    const obs = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    });
    obs.observe(main, { childList: true, subtree: true });
    return () => { obs.disconnect(); cancelAnimationFrame(raf); };
  }, [pathname]);

  return null;
}
