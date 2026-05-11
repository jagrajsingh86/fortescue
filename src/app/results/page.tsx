"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CognizantLogo } from "@/components/CognizantLogo";
import { Footer } from "@/components/Footer";
import { ProgressBar } from "@/components/ProgressBar";
import { RadialGauge } from "@/components/RadialGauge";
import { PillarBreakdown } from "@/components/PillarBreakdown";
import { HeatmapGrid } from "@/components/HeatmapGrid";
import { AIAnalysis } from "@/components/AIAnalysis";
import { getAllPillarScores, getBand, getOverallScore, totalQuestions } from "@/lib/scoring";
import { clearSession, loadSession } from "@/lib/session";
import type { AIAnalysisData, AssessmentAnswers, PillarScore } from "@/types/assessment";

export default function ResultsPage() {
  const router = useRouter();
  const reportRef = useRef<HTMLDivElement>(null);

  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [clientName, setClientName] = useState<string | undefined>();
  const [industry, setIndustry] = useState<string | undefined>();
  const [exporting, setExporting] = useState(false);
  const [, setAnalysis] = useState<AIAnalysisData | null>(null);

  useEffect(() => {
    const s = loadSession();
    if (!s.answers || Object.keys(s.answers).length < totalQuestions()) {
      router.replace("/");
      return;
    }
    setAnswers(s.answers);
    setClientName(s.clientName);
    setIndustry(s.industry);
    setHydrated(true);
  }, [router]);

  const overall = useMemo(() => (hydrated ? getOverallScore(answers) : 0), [hydrated, answers]);
  const overallBand = useMemo(() => getBand(overall), [overall]);
  const pillarScores: PillarScore[] = useMemo(
    () => (hydrated ? getAllPillarScores(answers) : []),
    [hydrated, answers]
  );

  async function exportPDF() {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      const mod = await import("html2pdf.js");
      const html2pdf = mod.default;
      await html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: `AI-Maturity-Assessment-${(clientName || "Report").replace(/\s+/g, "-")}.pdf`,
          image: { type: "jpeg", quality: 0.95 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: "#000028" },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["css", "legacy"] },
        })
        .from(reportRef.current)
        .save();
    } finally {
      setExporting(false);
    }
  }

  function retake() {
    clearSession();
    router.push("/");
  }

  if (!hydrated) return null;

  return (
    <>
      <ProgressBar value={1} max={1} />

      <header className="px-6 sm:px-10 pt-6 flex items-center justify-between">
        <CognizantLogo size={28} />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={exportPDF}
            disabled={exporting}
            className="px-4 py-2 text-[11px] uppercase tracking-[0.2em] font-semibold transition-all disabled:opacity-50"
            style={{
              background: "transparent",
              border: "1px solid #06C7CC",
              color: "#06C7CC",
            }}
          >
            {exporting ? "Exporting…" : "Export PDF"}
          </button>
          <button
            type="button"
            onClick={retake}
            className="px-4 py-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-white/55 hover:text-white transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.12)" }}
          >
            Retake
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 sm:px-10 py-12 sm:py-16 max-w-6xl w-full mx-auto">
        <div ref={reportRef} id="results-container" className="flex flex-col gap-14">
          {/* Header block */}
          <section className="cog-fade-up">
            <div className="text-[11px] uppercase tracking-[0.24em] text-[#06C7CC] mb-3">
              Assessment Report
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h1 className="text-white font-light text-[36px] sm:text-[44px] leading-[1.05] tracking-tight">
                {clientName ? `${clientName} —` : ""} AI Maturity
              </h1>
              <div className="text-white/55 text-[13px] tracking-wide">
                {industry ? `${industry} · ` : ""}
                {new Date().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </section>

          {/* Score block */}
          <section className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-12 items-start cog-fade-up">
            <div className="flex flex-col items-center lg:items-start">
              <div className="text-[10px] uppercase tracking-[0.24em] text-white/45 mb-3">
                Overall Score
              </div>
              <RadialGauge score={overall} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-white/45 mb-4">
                Pillar Breakdown
              </div>
              <PillarBreakdown scores={pillarScores} />
            </div>
          </section>

          {/* Heatmap */}
          <section className="cog-fade-up">
            <div className="text-[10px] uppercase tracking-[0.24em] text-white/45 mb-4">
              Maturity Heatmap
            </div>
            <HeatmapGrid scores={pillarScores} />
          </section>

          {/* AI Analysis */}
          <section className="cog-fade-up">
            <div className="flex items-baseline justify-between mb-6">
              <div className="text-[10px] uppercase tracking-[0.24em] text-white/45">
                AI-Generated Analysis
              </div>
              <span className="text-[10px] uppercase tracking-[0.22em] text-white/35">
                Gemini 2.5 Pro
              </span>
            </div>
            <AIAnalysis
              answers={answers}
              clientName={clientName}
              industry={industry}
              onLoaded={setAnalysis}
            />
          </section>

          {/* Inline footer mark for PDF export */}
          <div
            className="hidden print:flex pt-6 items-center justify-between"
            style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
          >
            <CognizantLogo size={20} />
            <span className="text-[10px] uppercase tracking-[0.22em] text-white/45">
              Confidential — {overallBand}
            </span>
          </div>
        </div>
      </main>

      <Footer status={`Overall · ${overallBand}`} />
    </>
  );
}
