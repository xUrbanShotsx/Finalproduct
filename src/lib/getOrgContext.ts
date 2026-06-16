import type { SupabaseClient } from "@supabase/supabase-js";
import type { Industry } from "@/config/modules";

interface OrgContext {
  industry: Industry;
  orgId: string | null;
  orgName: string;
  userName: string;
}

export async function getOrgContext(
  supabase: SupabaseClient,
  userId: string,
  userMeta?: Record<string, string>
): Promise<OrgContext> {
  const { data: profileRow } = await supabase
    .from("profiles")
    .select("full_name, org_id")
    .eq("id", userId)
    .maybeSingle();

  const profile = profileRow as { full_name: string; org_id: string | null } | null;

  const { data: orgRow } = profile?.org_id
    ? await supabase
        .from("organisations")
        .select("name, industry")
        .eq("id", profile.org_id)
        .maybeSingle()
    : { data: null };

  const org = orgRow as { name: string; industry: string } | null;

  return {
    industry: (org?.industry ?? userMeta?.industry ?? "construction") as Industry,
    orgId: profile?.org_id ?? null,
    orgName: org?.name ?? userMeta?.org_name ?? "My Organisation",
    userName: profile?.full_name ?? userMeta?.full_name ?? "User",
  };
}
