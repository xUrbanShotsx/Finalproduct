export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getIndustry } from "@/lib/getIndustry";
import { getSubModules } from "@/config/modules";
import type { ModuleKey } from "@/config/modules";
import { SubModulePage } from "@/components/modules/SubModulePage";
import { ListingsPage } from "@/components/modules/properties/ListingsPage";

const MODULE_KEY = "properties" as ModuleKey;

const SPECIFIC: Record<string, React.FC> = {
  listings: ListingsPage,
};

export default async function PropertiesSubModuleRoute({
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
