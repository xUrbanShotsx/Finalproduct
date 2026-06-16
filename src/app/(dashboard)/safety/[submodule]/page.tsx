export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrgContext } from "@/lib/getOrgContext";
import { getSubModules } from "@/config/modules";
import type { ModuleKey, Industry } from "@/config/modules";
import { SubModulePage } from "@/components/modules/SubModulePage";
import { IncidentsPage } from "@/components/modules/safety/IncidentsPage";
import { SwmsPage } from "@/components/modules/safety/SwmsPage";
import { PermitsPage } from "@/components/modules/safety/PermitsPage";
import { PrestartPage } from "@/components/modules/safety/PrestartPage";
import { ToolboxPage } from "@/components/modules/safety/ToolboxPage";
import { ActionsPage } from "@/components/modules/safety/ActionsPage";

const MODULE_KEY = "safety" as ModuleKey;

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http");

const SPECIFIC: Record<string, React.FC> = {
  incidents: IncidentsPage,
  swms:      SwmsPage,
  permits:   PermitsPage,
  prestart:  PrestartPage,
  toolbox:   ToolboxPage,
  actions:   ActionsPage,
};

export default async function SubModuleRoute({
  params,
}: {
  params: Promise<{ submodule: string }>;
}) {
  const { submodule } = await params;

  const SpecificPage = SPECIFIC[submodule];
  if (SpecificPage) return <SpecificPage />;

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

  return <SubModulePage moduleKey={MODULE_KEY} subModule={found} />;
}
