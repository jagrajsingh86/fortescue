import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
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
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { answers, clientName, industry } = body;
  if (!answers || typeof answers !== "object" || Object.keys(answers).length === 0) {
    return NextResponse.json({ error: "Missing answers" }, { status: 400 });
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
    overall,
    overallBand,
    pillarScores,
    selectedAnswers,
  });

  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.6,
        maxOutputTokens: 16384,
        thinkingConfig: { thinkingBudget: 2048 },
      },
    });

    const finishReason = response.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== "STOP") {
      throw new Error(
        `Model stopped before completing the response (${finishReason}). ` +
          `Try a smaller model via GEMINI_MODEL or raise maxOutputTokens.`
      );
    }

    const text = response.text ?? "";
    const clean = text.replace(/```json|```/g, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start === -1 || end === -1) {
      throw new Error("Model response did not include valid JSON.");
    }
    const analysis = JSON.parse(clean.slice(start, end + 1));

    return NextResponse.json({
      overall,
      overallBand,
      pillarScores,
      analysis,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Analysis failed", details: message },
      { status: 500 }
    );
  }
}
