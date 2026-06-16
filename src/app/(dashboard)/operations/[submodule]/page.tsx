export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrgContext } from "@/lib/getOrgContext";
import { getSubModules } from "@/config/modules";
import type { ModuleKey, Industry } from "@/config/modules";
import { SubModulePage } from "@/components/modules/SubModulePage";
import { SafeWorkProceduresPage } from "@/components/modules/operations/SafeWorkProceduresPage";
import { SiteAccessControlPage } from "@/components/modules/operations/SiteAccessControlPage";
import { WorkPlanningPage } from "@/components/modules/operations/WorkPlanningPage";
import { DefectReportingPage } from "@/components/modules/operations/DefectReportingPage";
import { EmergencyProceduresPage } from "@/components/modules/operations/EmergencyProceduresPage";
import { PlantEquipmentPage } from "@/components/modules/operations/PlantEquipmentPage";
import { OperationalReadinessPage } from "@/components/modules/operations/OperationalReadinessPage";
import { IsolationShutdownPage } from "@/components/modules/operations/IsolationShutdownPage";

const MODULE_KEY = "operations" as ModuleKey;

const SPECIFIC: Record<string, React.FC> = {
  "safe-work-procedures":   SafeWorkProceduresPage,
  "site-access-control":    SiteAccessControlPage,
  "work-planning":          WorkPlanningPage,
  "defect-reporting":       DefectReportingPage,
  "emergency-procedures":   EmergencyProceduresPage,
  "plant-equipment":        PlantEquipmentPage,
  "operational-readiness":  OperationalReadinessPage,
  "isolation-shutdown":     IsolationShutdownPage,
};

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http");

export default async function SubModuleRoute({
  params,
}: {
  params: Promise<{ submodule: string }>;
}) {
  const { submodule } = await params;

  const industry: Industry = SUPABASE_CONFIGURED
    ? await (async () => {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return "construction" as const;
        const ctx = await getOrgContext(supabase, user.id, user.user_metadata as Record<string, string>);
        return ctx.industry;
      })()
    : "construction";

  const subModules = getSubModules(MODULE_KEY, industry);
  const found = subModules.find((sm) => sm.id === submodule);

  if (!found) notFound();

  const Page = SPECIFIC[submodule];
  if (Page) return <Page />;

  return <SubModulePage moduleKey={MODULE_KEY} subModule={found} />;
}
