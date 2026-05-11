import type { AssessmentAnswers } from "@/types/assessment";

const KEY = "cog-ai-maturity";

interface SessionData {
  answers: AssessmentAnswers;
  clientName?: string;
  industry?: string;
  current?: number;
}

export function loadSession(): SessionData {
  if (typeof window === "undefined") return { answers: {} };
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return { answers: {} };
    return JSON.parse(raw) as SessionData;
  } catch {
    return { answers: {} };
  }
}

export function saveSession(data: SessionData) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(data));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
