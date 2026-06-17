import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { STANDARDS, modelFor, MODEL_COST_PER_MTOK } from "@/config/blueprints";
import type { GenerateRequest, GenerateResult } from "@/lib/blueprints/types";
import { buildSystemBlocks, buildUserPrompt } from "@/lib/blueprints/prompts";
import { fallbackDocument } from "@/lib/blueprints/fallback";

export const maxDuration = 60;

const HAS_KEY = !!process.env.ANTHROPIC_API_KEY;

export async function POST(req: NextRequest) {
  const body = (await req.json()) as GenerateRequest;
  const standard = STANDARDS[body.standard];
  if (!standard) return NextResponse.json({ error: "Unknown standard" }, { status: 400 });
  const doc = standard.docs.find((d) => d.id === body.docId);
  if (!doc) return NextResponse.json({ error: "Unknown document" }, { status: 400 });

  const model = modelFor(doc);

  // Graceful fallback so the generation flow always works in the demo.
  if (!HAS_KEY) {
    await new Promise((r) => setTimeout(r, 350 + Math.random() * 500));
    const content = fallbackDocument(standard, doc, body.org);
    const result: GenerateResult = {
      content,
      aiModel: model,
      tokensUsed: Math.round(content.length / 3.5),
      costUsd: 0,
      cached: true,
      fallback: true,
    };
    return NextResponse.json(result);
  }

  try {
    const client = new Anthropic();
    const msg = await client.messages.create({
      model,
      max_tokens: doc.complex ? 4000 : 1800,
      system: buildSystemBlocks(standard, body.org),
      messages: [{ role: "user", content: buildUserPrompt(standard, doc) }],
    });

    const content = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    const u = msg.usage;
    const inTok = (u.input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0);
    const tokensUsed = inTok + (u.output_tokens ?? 0);
    const costUsd = (tokensUsed / 1_000_000) * (MODEL_COST_PER_MTOK[model] ?? 2);

    const result: GenerateResult = {
      content,
      aiModel: model,
      tokensUsed,
      costUsd: Number(costUsd.toFixed(4)),
      cached: (u.cache_read_input_tokens ?? 0) > 0,
    };
    return NextResponse.json(result);
  } catch {
    // Fall back rather than fail the whole run.
    const content = fallbackDocument(standard, doc, body.org);
    const result: GenerateResult = {
      content,
      aiModel: model,
      tokensUsed: Math.round(content.length / 3.5),
      costUsd: 0,
      cached: false,
      fallback: true,
    };
    return NextResponse.json(result);
  }
}
