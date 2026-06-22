export const dynamic = "force-dynamic";

import { getIndustry } from "@/lib/getIndustry";
import { getSubModules } from "@/config/modules";
import type { ModuleKey } from "@/config/modules";
import { SubModuleGrid } from "@/components/modules/SubModuleGrid";

const MODULE_KEY = "aml-ctf" as ModuleKey;

export default async function AmlCtfModulePage() {
  const industry = await getIndustry();
  const subModules = getSubModules(MODULE_KEY, industry);

  return (
    <div className="p-8 max-w-[1100px]">
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold" style={{ color: "var(--b-text)" }}>AML / CTF</h1>
        <p className="text-[13px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>
          Anti-Money Laundering and Counter-Terrorism Financing compliance — customer due diligence, risk assessments, AUSTRAC reporting.
        </p>
      </div>
      {subModules.length > 0 ? (
        <SubModuleGrid subModules={subModules} moduleKey={MODULE_KEY} />
      ) : (
        <div
          className="flex flex-col items-center justify-center py-24 text-center border border-dashed"
          style={{ borderColor: "var(--b-border)" }}
        >
          <p className="text-[14px] font-medium" style={{ color: "var(--b-text-tertiary)" }}>Coming soon</p>
          <p className="text-[12.5px] mt-1" style={{ color: "var(--b-text-muted)" }}>This module is being built.</p>
        </div>
      )}
    </div>
  );
}
