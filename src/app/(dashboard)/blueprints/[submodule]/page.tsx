import { notFound } from "next/navigation";
import { BlueprintRouter } from "@/components/modules/blueprints/BlueprintRouter";

const VALID = ["store", "builder", "library", "gap-analysis", "renewals"];

export default async function BlueprintSubmodulePage({
  params,
}: {
  params: Promise<{ submodule: string }>;
}) {
  const { submodule } = await params;
  if (!VALID.includes(submodule)) notFound();
  return <BlueprintRouter submodule={submodule} />;
}
