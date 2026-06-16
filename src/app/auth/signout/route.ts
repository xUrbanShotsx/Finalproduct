import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const origin = new URL(req.url).origin;
  const loginUrl = new URL("/login", origin);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || !supabaseUrl.startsWith("http")) {
    // Demo mode — no real session to clear, just redirect
    return NextResponse.redirect(loginUrl);
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  await supabase.auth.signOut();

  return NextResponse.redirect(loginUrl);
}
