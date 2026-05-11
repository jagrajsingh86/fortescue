"use client";

import { useMemo, useRef, useState } from "react";
import { CognizantLogo } from "@/components/CognizantLogo";
import { RadialGauge } from "@/components/RadialGauge";
import { PillarBreakdown } from "@/components/PillarBreakdown";
import { HeatmapGrid } from "@/components/HeatmapGrid";
import { AIAnalysis } from "@/components/AIAnalysis";
import {
  getAllPillarScores,
  getBand,
  getOverallScore,
} from "@/lib/scoring";
import type { AIAnalysisData, AssessmentAnswers, PillarScore } from "@/types/assessment";

interface Props {
  answers: AssessmentAnswers;
  clientName?: string;
  industry?: string;
  context?: string;
  /** When provided, AI analysis is rendered from this saved value (no API call). */
  preloadedAnalysis?: AIAnalysisData | null;
  onAnalysisLoaded?: (a: AIAnalysisData) => void;
  reportLabel?: string;
}

export function ReportView({
  answers,
  clientName,
  industry,
  context,
  preloadedAnalysis,
  onAnalysisLoaded,
  reportLabel = "Assessment Report",
}: Props) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const overall = useMemo(() => getOverallScore(answers), [answers]);
  const overallBand = useMemo(() => getBand(overall), [overall]);
  const pillarScores: PillarScore[] = useMemo(
    () => getAllPillarScores(answers),
    [answers]
  );

  async function exportPDF() {
    const el = reportRef.current;
    if (!el) return;
    setExporting(true);

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(el, {
        backgroundColor: "#000028",
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: el.scrollWidth,
        onclone: (_doc, clonedEl) => {
          clonedEl.classList.add("pdf-export-mode");
          clonedEl.style.background = "#000028";
          clonedEl.style.padding = "32px";
        },
      });

      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pageWidthMm = pdf.internal.pageSize.getWidth();
      const pageHeightMm = pdf.internal.pageSize.getHeight();
      const marginMm = 10;
      const innerWidthMm = pageWidthMm - marginMm * 2;
      const innerHeightMm = pageHeightMm - marginMm * 2;
      const pxPerMm = canvas.width / innerWidthMm;
      const pageHeightPx = Math.floor(innerHeightMm * pxPerMm);

      let yOffset = 0;
      let pageIndex = 0;
      while (yOffset < canvas.height) {
        if (pageIndex > 0) pdf.addPage();

        const sliceHeight = Math.min(pageHeightPx, canvas.height - yOffset);
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;
        const ctx = pageCanvas.getContext("2d");
        if (!ctx) throw new Error("Could not allocate 2D canvas context");
        ctx.fillStyle = "#000028";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(canvas, 0, -yOffset);

        const imgData = pageCanvas.toDataURL("image/png");
        const sliceHeightMm = sliceHeight / pxPerMm;
        pdf.addImage(imgData, "PNG", marginMm, marginMm, innerWidthMm, sliceHeightMm);

        yOffset += pageHeightPx;
        pageIndex++;
      }

      const filename = `AI-Maturity-Assessment-${(clientName || "Report").replace(/\s+/g, "-")}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error("PDF export failed", err);
      const msg = err instanceof Error ? err.message : "Unknown error";
      window.alert(`PDF export failed: ${msg}`);
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <header className="px-6 sm:px-10 pt-6 flex items-center justify-between">
        <CognizantLogo size={28} />
        <div className="flex items-center gap-3">
          <ShareButton
            answers={answers}
            clientName={clientName}
            industry={industry}
            context={context}
            preloadedAnalysis={preloadedAnalysis}
          />
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
        </div>
      </header>

      <main className="flex-1 px-6 sm:px-10 py-12 sm:py-16 max-w-6xl w-full mx-auto">
        <div ref={reportRef} id="results-container" className="flex flex-col gap-14">
          <section className="cog-fade-up">
            <div className="text-[11px] uppercase tracking-[0.24em] text-[#06C7CC] mb-3">
              {reportLabel}
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

          <section className="cog-fade-up">
            <div className="text-[10px] uppercase tracking-[0.24em] text-white/45 mb-4">
              Maturity Heatmap
            </div>
            <HeatmapGrid scores={pillarScores} />
          </section>

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
              context={context}
              preloaded={preloadedAnalysis}
              onLoaded={onAnalysisLoaded}
            />
          </section>

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
    </>
  );
}

function ShareButton({
  answers,
  clientName,
  industry,
  context,
  preloadedAnalysis,
}: {
  answers: AssessmentAnswers;
  clientName?: string;
  industry?: string;
  context?: string;
  preloadedAnalysis?: AIAnalysisData | null;
}) {
  const [status, setStatus] = useState<"idle" | "saving" | "copied" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("Share");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  async function share() {
    if (status === "saving") return;
    if (!preloadedAnalysis) {
      setStatus("error");
      setMessage("Wait for analysis…");
      setTimeout(() => {
        setStatus("idle");
        setMessage("Share");
      }, 2200);
      return;
    }
    setStatus("saving");
    setMessage("Saving…");
    setErrorDetail(null);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          industry,
          context,
          answers,
          analysis: preloadedAnalysis,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Save failed" }));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const { id } = (await res.json()) as { id: string };
      const url = `${window.location.origin}/r/${id}`;
      try {
        await navigator.clipboard.writeText(url);
        setStatus("copied");
        setMessage("Link copied ✓");
      } catch {
        window.prompt("Copy this URL:", url);
        setStatus("copied");
        setMessage("Link ready");
      }
      setTimeout(() => {
        setStatus("idle");
        setMessage("Share");
      }, 2800);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setErrorDetail(msg);
      setStatus("error");
      setMessage("Share unavailable");
      setTimeout(() => {
        setStatus("idle");
        setMessage("Share");
        setErrorDetail(null);
      }, 4000);
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      disabled={status === "saving"}
      title={errorDetail ?? "Save and copy a shareable link"}
      className="px-4 py-2 text-[11px] uppercase tracking-[0.2em] font-semibold transition-all disabled:opacity-50"
      style={{
        background: status === "copied" ? "#06C7CC" : "transparent",
        border: "1px solid rgba(255,255,255,0.18)",
        color: status === "copied" ? "#000028" : "rgba(255,255,255,0.85)",
      }}
    >
      {message}
    </button>
  );
}
