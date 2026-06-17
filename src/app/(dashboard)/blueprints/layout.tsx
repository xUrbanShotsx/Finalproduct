import { BlueprintProvider } from "@/components/modules/blueprints/store";

export default function BlueprintsLayout({ children }: { children: React.ReactNode }) {
  return <BlueprintProvider>{children}</BlueprintProvider>;
}
