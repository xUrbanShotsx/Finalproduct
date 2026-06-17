export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getIndustry } from "@/lib/getIndustry";
import { getSubModules } from "@/config/modules";
import type { ModuleKey } from "@/config/modules";
import { SubModulePage } from "@/components/modules/SubModulePage";
import { IncidentsPage } from "@/components/modules/safety/IncidentsPage";
import { SwmsPage } from "@/components/modules/safety/SwmsPage";
import { PermitsPage } from "@/components/modules/safety/PermitsPage";
import { PrestartPage } from "@/components/modules/safety/PrestartPage";
import { ToolboxPage } from "@/components/modules/safety/ToolboxPage";
import { ActionsPage } from "@/components/modules/safety/ActionsPage";
import { HazardousMaterialsPage } from "@/components/modules/safety/HazardousMaterialsPage";

const MODULE_KEY = "safety" as ModuleKey;

const SPECIFIC: Record<string, React.FC> = {
  incidents: IncidentsPage,
  swms:      SwmsPage,
  permits:   PermitsPage,
  prestart:  PrestartPage,
  toolbox:   ToolboxPage,
  actions:   ActionsPage,
  "hazardous-materials": HazardousMaterialsPage,
};

export default async function SubModuleRoute({
  params,
}: {
  params: Promise<{ submodule: string }>;
}) {
  const { submodule } = await params;

  const SpecificPage = SPECIFIC[submodule];
  if (SpecificPage) return <SpecificPage />;

  const industry = await getIndustry();
  const subModules = getSubModules(MODULE_KEY, industry);
  const found = subModules.find((sm) => sm.id === submodule);
  if (!found) notFound();

  return <SubModulePage moduleKey={MODULE_KEY} subModule={found} />;
}
