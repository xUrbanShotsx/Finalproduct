export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getIndustry } from "@/lib/getIndustry";
import { getSubModules } from "@/config/modules";
import type { ModuleKey } from "@/config/modules";
import { SubModulePage } from "@/components/modules/SubModulePage";
import { HazardRegisterPage } from "@/components/modules/risk/HazardRegisterPage";
import { RiskAssessmentsPage } from "@/components/modules/risk/RiskAssessmentsPage";
import { EmergencyResponsePlansPage } from "@/components/modules/risk/EmergencyResponsePlansPage";
import { CriticalRiskControlsPage } from "@/components/modules/risk/CriticalRiskControlsPage";
import { HrcwPage } from "@/components/modules/risk/HrcwPage";
import { PsychosocialRiskPage } from "@/components/modules/risk/PsychosocialRiskPage";
import { JsaJseaPage } from "@/components/modules/risk/JsaJseaPage";
import { ChemicalProcessRiskPage } from "@/components/modules/risk/ChemicalProcessRiskPage";
import { SlipTripFallPage } from "@/components/modules/risk/SlipTripFallPage";

const MODULE_KEY = "risk" as ModuleKey;

const SPECIFIC: Record<string, React.FC> = {
  "hazard-register":         HazardRegisterPage,
  "risk-assessments":        RiskAssessmentsPage,
  "emergency-response-plans":EmergencyResponsePlansPage,
  "critical-risk-controls":  CriticalRiskControlsPage,
  "hrcw":                    HrcwPage,
  "psychosocial-risk":       PsychosocialRiskPage,
  "jsa-jsea":                JsaJseaPage,
  "chemical-process-risk":   ChemicalProcessRiskPage,
  "slip-trip-fall":          SlipTripFallPage,
};

export default async function SubModuleRoute({
  params,
}: {
  params: Promise<{ submodule: string }>;
}) {
  const { submodule } = await params;

  const industry = await getIndustry();
  const subModules = getSubModules(MODULE_KEY, industry);
  const found = subModules.find((sm) => sm.id === submodule);

  if (!found) notFound();

  const Page = SPECIFIC[submodule];
  if (Page) return <Page />;

  return <SubModulePage moduleKey={MODULE_KEY} subModule={found} />;
}
