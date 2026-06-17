import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { STANDARDS, SONNET } from "@/config/blueprints";
import type { OrgContext, GapReport } from "@/lib/blueprints/types";
import { buildGapPrompt } from "@/lib/blueprints/prompts";
import { fallbackGapReport } from "@/lib/blueprints/fallback";
import type { ISOStandard } from "@/config/blueprints";

export const maxDuration = 60;

const HAS_KEY = !!process.env.ANTHROPIC_API_KEY;

export async function POST(req: NextRequest) {
  const { standard, org, docTitles } = (await req.json()) as {
    standard: ISOStandard;
    org: OrgContext;
    docTitles: string[];
  };
  const std = STANDARDS[standard];
  if (!std) return NextResponse.json({ error: "Unknown standard" }, { status: 400 });

  if (!HAS_KEY) {
    await new Promise((r) => setTimeout(r, 900));
    return NextResponse.json(fallbackGapReport(org, docTitles));
  }

  try {
    const briesaSummary = summariseBriesa(org);
    const { system, user } = buildGapPrompt(std.code, docTitles, briesaSummary);
    const client = new Anthropic();
    const msg = await client.messages.create({
      model: SONNET,
      max_tokens: 2500,
      system,
      messages: [{ role: "user", content: user }],
    });
    const text = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim()
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/i, "")
      .trim();
    const report = JSON.parse(text) as GapReport;
    return NextResponse.json(report);
  } catch {
    return NextResponse.json(fallbackGapReport(org, docTitles));
  }
}

function summariseBriesa(org: OrgContext): string {
  const b = org.briesaData;
  if (!b) return "";
  const parts: string[] = [];
  if (b.hazards?.length) parts.push(`${b.hazards.length} hazard register entries`);
  if (b.riskAssessments?.length) parts.push(`${b.riskAssessments.length} risk assessments`);
  if (b.incidents?.length) parts.push(`${b.incidents.length} incidents in last 12 months`);
  if (b.contractors?.length) parts.push(`${b.contractors.length} managed contractors`);
  if (b.training?.length) parts.push(`${b.training.length} training programs tracked`);
  return parts.join(", ");
}
