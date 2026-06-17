import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getOrgContext } from "@/lib/getOrgContext";
import type { Industry } from "@/config/modules";

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http");

/**
 * Resolves the active industry for the current request.
 * Uses the authenticated org context when Supabase is configured,
 * otherwise falls back to the `b-demo-industry` cookie set at demo login.
 */
export async function getIndustry(): Promise<Industry> {
  if (SUPABASE_CONFIGURED) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const ctx = await getOrgContext(supabase, user.id, user.user_metadata as Record<string, string>);
      return ctx.industry;
    }
  }

  const cookieStore = await cookies();
  const demo = cookieStore.get("b-demo-industry")?.value;
  return demo === "industrial" ? "industrial"
    : demo === "facilities" ? "facilities"
    : "construction";
}
