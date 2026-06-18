import { BlueprintOverview } from "@/components/modules/blueprints/BlueprintOverview";
import { MobileModule } from "@/components/field/MobileModule";

export default function BlueprintsPage() {
  return (
    <>
      <div className="md:hidden">
        <MobileModule moduleKey="blueprints" />
      </div>
      <div className="hidden md:block">
        <BlueprintOverview />
      </div>
    </>
  );
}
