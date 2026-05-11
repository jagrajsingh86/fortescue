import { NextResponse } from "next/server";
import { kvConfigured, loadReport } from "@/lib/reports";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!kvConfigured()) {
    return NextResponse.json({ error: "Persistence not configured" }, { status: 503 });
  }

  try {
    const report = await loadReport(id);
    if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(report);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Lookup failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
