export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getIndustry } from "@/lib/getIndustry";
import { getSubModules } from "@/config/modules";
import type { ModuleKey } from "@/config/modules";
import { SubModulePage } from "@/components/modules/SubModulePage";
import { PoliciesPage } from "@/components/modules/policies/PoliciesPage";

const MODULE_KEY = "policies" as ModuleKey;

const SPECIFIC: Record<string, React.FC> = {
  procedures: PoliciesPage,
};

export default async function PoliciesSubModuleRoute({
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
