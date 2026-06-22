export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function TradieLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const plan = cookieStore.get("b-demo-plan")?.value;
  if (plan !== "tradie") redirect("/login");
  return <>{children}</>;
}
