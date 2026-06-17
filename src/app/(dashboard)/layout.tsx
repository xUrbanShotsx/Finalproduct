export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getOrgContext } from "@/lib/getOrgContext";
import { DashboardChrome } from "@/components/layout/DashboardChrome";

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http");

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const demoCookie  = cookieStore.get("b-demo-industry")?.value ?? "construction";
  const isProspectDemo = cookieStore.get("b-demo-prospect")?.value === "1";

  let industry: "construction" | "industrial" | "facilities" =
    demoCookie === "industrial" ? "industrial"
    : demoCookie === "facilities" ? "facilities"
    : "construction";
  let orgName  =
    industry === "industrial" ? "Pacific Industrial Pty Ltd"
    : industry === "facilities" ? "Meridian Facilities Group"
    : "Apex Construction Pty Ltd";
  let userName =
    industry === "industrial" ? "Demo Industrial"
    : industry === "facilities" ? "Demo Facilities"
    : "Demo User";

  if (SUPABASE_CONFIGURED) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");
    const ctx = await getOrgContext(supabase, user.id, user.user_metadata as Record<string, string>);
    industry = ctx.industry;
    orgName = ctx.orgName;
    userName = ctx.userName;
  }

  return (
    <DashboardChrome industry={industry} orgName={orgName} userName={userName} isDemo={isProspectDemo}>
      {children}
    </DashboardChrome>
  );
}
