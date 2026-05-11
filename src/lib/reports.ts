import type { AIAnalysisData, AssessmentAnswers } from "@/types/assessment";

export interface StoredReport {
  id: string;
  createdAt: number;
  clientName?: string;
  industry?: string;
  context?: string;
  answers: AssessmentAnswers;
  analysis: AIAnalysisData;
}

const KEY_PREFIX = "report:";
const TTL_SECONDS = 60 * 60 * 24 * 365; // 1 year

export function kvConfigured(): boolean {
  return Boolean(
    process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  );
}

export function newReportId(): string {
  const raw = (globalThis.crypto?.randomUUID?.() ?? "").replace(/-/g, "");
  if (raw) return raw.slice(0, 10);
  // Fallback for runtimes without crypto.randomUUID
  let id = "";
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 10; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

export async function saveReport(report: StoredReport): Promise<void> {
  if (!kvConfigured()) throw new Error("KV not configured");
  const { kv } = await import("@vercel/kv");
  await kv.set(`${KEY_PREFIX}${report.id}`, report, { ex: TTL_SECONDS });
}

export async function loadReport(id: string): Promise<StoredReport | null> {
  if (!kvConfigured()) return null;
  if (!/^[a-z0-9]{4,32}$/i.test(id)) return null;
  const { kv } = await import("@vercel/kv");
  const raw = await kv.get<StoredReport>(`${KEY_PREFIX}${id}`);
  return raw ?? null;
}
