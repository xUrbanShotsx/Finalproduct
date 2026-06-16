export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrgContext } from "@/lib/getOrgContext";
import { getSubModules } from "@/config/modules";
import type { ModuleKey, Industry } from "@/config/modules";
import { SubModulePage } from "@/components/modules/SubModulePage";
import { InspectionsAuditsPage } from "@/components/modules/compliance/InspectionsAuditsPage";
import { LegislativeRegisterPage } from "@/components/modules/compliance/LegislativeRegisterPage";
import { PpeRegisterPage } from "@/components/modules/compliance/PpeRegisterPage";
import { RegulatorNoticesPage } from "@/components/modules/compliance/RegulatorNoticesPage";
import { HrcwCompliancePage } from "@/components/modules/compliance/HrcwCompliancePage";
import { SwmsRegisterPage } from "@/components/modules/compliance/SwmsRegisterPage";
import { HazardousSubstancesPage } from "@/components/modules/compliance/HazardousSubstancesPage";
import { ExposureMonitoringPage } from "@/components/modules/compliance/ExposureMonitoringPage";
import { EssentialSafetyMeasuresPage } from "@/components/modules/compliance/EssentialSafetyMeasuresPage";
import { StatutoryObligationsPage } from "@/components/modules/compliance/StatutoryObligationsPage";

const MODULE_KEY = "compliance" as ModuleKey;

const SPECIFIC: Record<string, React.FC> = {
  "inspections-audits":    InspectionsAuditsPage,
  "legislative-register":  LegislativeRegisterPage,
  "ppe-register":          PpeRegisterPage,
  "regulator-notices":     RegulatorNoticesPage,
  "hrcw-compliance":       HrcwCompliancePage,
  "swms-register":         SwmsRegisterPage,
  "hazardous-substances":  HazardousSubstancesPage,
  "exposure-monitoring":   ExposureMonitoringPage,
  "essential-safety-measures": EssentialSafetyMeasuresPage,
  "statutory-obligations": StatutoryObligationsPage,
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
