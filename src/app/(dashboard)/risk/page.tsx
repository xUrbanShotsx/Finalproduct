export const dynamic = "force-dynamic";

import { getIndustry } from "@/lib/getIndustry";
import { MobileModule } from "@/components/field/MobileModule";
import { RiskHubPage } from "@/components/modules/risk/RiskHubPage";
import type { ModuleKey } from "@/config/modules";

const MODULE_KEY = "risk" as ModuleKey;

export default async function ModulePage() {
  const industry = await getIndustry();

  return (
    <>
      <div className="md:hidden">
        <MobileModule moduleKey={MODULE_KEY} industry={industry} />
      </div>
      <div className="hidden md:block">
        <RiskHubPage />
      </div>
    </>
  );
}
