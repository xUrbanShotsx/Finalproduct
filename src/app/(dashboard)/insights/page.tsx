export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { getOrgContext } from "@/lib/getOrgContext";
import { getSubModules } from "@/config/modules";
import type { ModuleKey } from "@/config/modules";
import { SubModuleGrid } from "@/components/modules/SubModuleGrid";

const MODULE_KEY = "insights" as ModuleKey;

const META: Record<string, { title: string; description: string }> = {
  safety:     { title: "Safety",          description: "Ground-level safety activities — what workers report and action on site." },
  people:     { title: "People",          description: "Workforce credentials, access and wellbeing." },
  operations: { title: "Operations",      description: "How work is planned, controlled and executed safely." },
  risk:       { title: "Risk Management", description: "Hazards identified, assessed and controlled." },
  compliance: { title: "Compliance",      description: "Regulatory obligations evidenced and recorded." },
  governance: { title: "Governance",      description: "Organisational safety governance and reporting." },
  insights:   { title: "Insights",        description: "WHS performance data across all modules." },
  training:   { title: "Training",        description: "Licences, competencies and induction content." },
  blueprints: { title: "Blueprints",      description: "Document templates and site configuration." },
};

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http");

export default async function ModulePage() {
  const industry = SUPABASE_CONFIGURED
    ? await (async () => {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return "construction" as const;
        const ctx = await getOrgContext(supabase, user.id, user.user_metadata as Record<string, string>);
        return ctx.industry;
      })()
    : ("construction" as const);

  const subModules = getSubModules(MODULE_KEY, industry);
  const meta = META[MODULE_KEY] ?? { title: MODULE_KEY, description: "" };

  return (
    <div className="p-8">
      <div className="max-w-[1100px]">
        <div className="mb-8">
          <h1 className="text-[22px] font-semibold" style={{ color: "var(--b-text)" }}>{meta.title}</h1>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>{meta.description}</p>
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
    </div>
  );
}
