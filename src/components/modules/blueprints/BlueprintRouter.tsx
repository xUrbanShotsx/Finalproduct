"use client";

import { Suspense } from "react";
import { BlueprintStore } from "./BlueprintStore";
import { BlueprintBuilder } from "./BlueprintBuilder";
import { DocumentLibrary } from "./DocumentLibrary";
import { GapAnalysis } from "./GapAnalysis";
import { Renewals } from "./Renewals";

export function BlueprintRouter({ submodule }: { submodule: string }) {
  return (
    <Suspense fallback={<div className="p-8 text-[13px]" style={{ color: "var(--b-text-muted)" }}>Loading…</div>}>
      {submodule === "store" && <BlueprintStore />}
      {submodule === "builder" && <BlueprintBuilder />}
      {submodule === "library" && <DocumentLibrary />}
      {submodule === "gap-analysis" && <GapAnalysis />}
      {submodule === "renewals" && <Renewals />}
    </Suspense>
  );
}
