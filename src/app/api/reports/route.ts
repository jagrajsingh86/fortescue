import { NextRequest, NextResponse } from "next/server";
import { kvConfigured, newReportId, saveReport, type StoredReport } from "@/lib/reports";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Body {
  clientName?: string;
  industry?: string;
  context?: string;
  answers: StoredReport["answers"];
  analysis: StoredReport["analysis"];
}

export async function POST(req: NextRequest) {
  if (!kvConfigured()) {
    return NextResponse.json(
      {
        error:
          "Persistence not configured. Connect a KV/Upstash store on Vercel (Storage → Create → KV) and the share feature will switch on automatically.",
      },
      { status: 503 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.answers || !body.analysis) {
    return NextResponse.json({ error: "Missing answers or analysis" }, { status: 400 });
  }

  const report: StoredReport = {
    id: newReportId(),
    createdAt: Date.now(),
    clientName: body.clientName,
    industry: body.industry,
    context: body.context,
    answers: body.answers,
    analysis: body.analysis,
  };

  try {
    await saveReport(report);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Save failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  return NextResponse.json({ id: report.id });
}
