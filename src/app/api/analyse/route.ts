import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";
import { PILLARS } from "@/lib/pillars";
import { getAllPillarScores, getBand, getOverallScore } from "@/lib/scoring";
import { buildPrompt } from "@/lib/prompt";
import type { AssessmentAnswers } from "@/types/assessment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-pro";

function getClient() {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GOOGLE_API_KEY (or GEMINI_API_KEY)");
  return new GoogleGenAI({ apiKey });
}

interface Body {
  answers: AssessmentAnswers;
  clientName?: string;
  industry?: string;
  context?: string;
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { answers, clientName, industry, context } = body;
  if (!answers || typeof answers !== "object" || Object.keys(answers).length === 0) {
    return new Response(JSON.stringify({ error: "Missing answers" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const overall = getOverallScore(answers);
  const overallBand = getBand(overall);
  const pillarScores = getAllPillarScores(answers);

  const selectedAnswers = Object.entries(answers).map(([key, score]) => {
    const [pi, qi] = key.split("-").map(Number);
    const pillar = PILLARS[pi];
    const question = pillar?.questions[qi];
    const selected = question?.options.find((o) => o.score === score);
    return {
      pillar: pillar?.name ?? "Unknown",
      question: question?.q ?? "Unknown",
      answer: selected?.text ?? "Unknown",
      score: score as number,
    };
  });

  const prompt = buildPrompt({
    clientName,
    industry,
    context,
    overall,
    overallBand,
    pillarScores,
    selectedAnswers,
  });

  let ai: GoogleGenAI;
  try {
    ai = getClient();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Configuration error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const genStream = await ai.models.generateContentStream({
          model: MODEL,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.6,
            maxOutputTokens: 16384,
            thinkingConfig: { thinkingBudget: 2048 },
          },
        });

        for await (const chunk of genStream) {
          const text = chunk.text;
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Stream failed";
        controller.enqueue(
          encoder.encode(`\n\n[STREAM_ERROR]${msg}[/STREAM_ERROR]`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
