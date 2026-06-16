export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrgContext } from "@/lib/getOrgContext";
import { getSubModules } from "@/config/modules";
import type { ModuleKey, Industry } from "@/config/modules";
import { SubModulePage } from "@/components/modules/SubModulePage";
import { CourseBuilderPage }       from "@/components/modules/training/CourseBuilderPage";
import { TrainingRegisterPage }    from "@/components/modules/training/TrainingRegisterPage";
import { CompetencyLicencesPage }  from "@/components/modules/training/CompetencyLicencesPage";
import { InductionBuilderPage }    from "@/components/modules/training/InductionBuilderPage";
import { TrainingMatrixPage }      from "@/components/modules/training/TrainingMatrixPage";
import { CertificatesRecordsPage } from "@/components/modules/training/CertificatesRecordsPage";

const MODULE_KEY = "training" as ModuleKey;

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http");

const SPECIFIC: Record<string, React.FC> = {
  "course-builder":      CourseBuilderPage,
  "training-register":   TrainingRegisterPage,
  "competency-licences": CompetencyLicencesPage,
  "induction-builder":   InductionBuilderPage,
  "training-matrix":     TrainingMatrixPage,
  "certificates-records":CertificatesRecordsPage,
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
