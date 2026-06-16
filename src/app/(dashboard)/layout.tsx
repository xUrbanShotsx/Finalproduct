export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrgContext } from "@/lib/getOrgContext";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http");

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let industry: "construction" | "industrial" | "facilities" = "construction";
  let orgName = "Demo Organisation";
  let userName = "Demo User";

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
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "var(--b-bg-canvas)" }}>
      <TopBar industry={industry} orgName={orgName} userName={userName} />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <AppSidebar industry={industry} orgName={orgName} userName={userName} />
        <main className="flex-1 overflow-auto" style={{ background: "var(--b-bg-canvas)" }}>{children}</main>
      </div>
    </div>
  );
}
