"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/Footer";
import { ProgressBar } from "@/components/ProgressBar";
import { ReportView } from "@/components/ReportView";
import { getBand, getOverallScore, totalQuestions } from "@/lib/scoring";
import { clearSession, loadSession } from "@/lib/session";
import type { AIAnalysisData, AssessmentAnswers } from "@/types/assessment";

export default function ResultsPage() {
  const router = useRouter();

  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [clientName, setClientName] = useState<string | undefined>();
  const [industry, setIndustry] = useState<string | undefined>();
  const [context, setContext] = useState<string | undefined>();
  const [analysis, setAnalysis] = useState<AIAnalysisData | null>(null);

  useEffect(() => {
    const s = loadSession();
    if (!s.answers || Object.keys(s.answers).length < totalQuestions()) {
      router.replace("/");
      return;
    }
    setAnswers(s.answers);
    setClientName(s.clientName);
    setIndustry(s.industry);
    setContext(s.context);
    setHydrated(true);
  }, [router]);

  function retake() {
    clearSession();
    router.push("/");
  }

  if (!hydrated) return null;

  const overallBand = getBand(getOverallScore(answers));

  return (
    <>
      <ProgressBar value={1} max={1} />

      <ReportView
        answers={answers}
        clientName={clientName}
        industry={industry}
        context={context}
        preloadedAnalysis={analysis}
        onAnalysisLoaded={setAnalysis}
      />

      <div className="px-6 sm:px-10 -mt-6 mb-6 flex justify-end">
        <button
          type="button"
          onClick={retake}
          className="px-4 py-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-white/55 hover:text-white transition-colors"
          style={{ border: "1px solid rgba(255,255,255,0.12)" }}
        >
          Retake
        </button>
      </div>

      <Footer status={`Overall · ${overallBand}`} />
    </>
  );
}
