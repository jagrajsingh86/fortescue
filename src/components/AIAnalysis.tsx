"use client";

import { useEffect, useState } from "react";
import type { AIAnalysisData, AssessmentAnswers } from "@/types/assessment";
import { PILLARS } from "@/lib/pillars";

interface Props {
  answers: AssessmentAnswers;
  clientName?: string;
  industry?: string;
  onLoaded?: (data: AIAnalysisData) => void;
}

export function AIAnalysis({ answers, clientName, industry, onLoaded }: Props) {
  const [analysis, setAnalysis] = useState<AIAnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const res = await fetch("/api/analyse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, clientName, industry }),
        });
        if (!res.ok) {
          const body = await res.text();
          throw new Error(`API ${res.status}: ${body.slice(0, 200)}`);
        }
        const data = await res.json();
        if (!cancelled) {
          setAnalysis(data.analysis);
          onLoaded?.(data.analysis);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
      }
    }
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div
        className="p-6"
        style={{
          background: "rgba(232,72,85,0.08)",
          border: "1px solid rgba(232,72,85,0.35)",
        }}
      >
        <div className="text-[11px] uppercase tracking-[0.22em] text-[#E84855] mb-2">
          Analysis unavailable
        </div>
        <p className="text-white/75 text-[14px] leading-relaxed">
          We couldn&rsquo;t generate the AI analysis right now. Your scores are still valid.
        </p>
        <p className="text-white/40 text-[12px] mt-3 font-mono">{error}</p>
      </div>
    );
  }

  if (!analysis) return <AnalysisSkeleton />;

  return (
    <div className="flex flex-col gap-10 cog-fade-up">
      <Section label="Executive Summary">
        <p className="text-white/85 text-[16px] leading-relaxed font-light max-w-3xl">
          {analysis.executiveSummary}
        </p>
      </Section>

      <Section label="Pillar Deep Dive">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {analysis.pillarAnalyses.map((pa) => {
            const pillar = PILLARS.find((p) => p.id === pa.pillarId);
            if (!pillar) return null;
            return (
              <div
                key={pa.pillarId}
                className="p-5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderLeft: `3px solid ${pillar.accent}`,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-[10px] font-bold tracking-[0.2em]"
                    style={{ color: pillar.accent }}
                  >
                    {pillar.num}
                  </span>
                  <h3 className="text-white text-[15px] tracking-wide">{pillar.name}</h3>
                </div>
                <p className="text-white/75 text-[13px] leading-relaxed font-light mb-4">
                  {pa.currentState}
                </p>

                <SubList title="Gaps" items={pa.gaps} />
                <SubList title="Recommendations" items={pa.recommendations} />
                <SubList title="Quick Wins (30 days)" items={pa.quickWins} accent={pillar.accent} />
              </div>
            );
          })}
        </div>
      </Section>

      <Section label="Transformation Roadmap">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {analysis.roadmap.map((h, i) => (
            <div
              key={i}
              className="p-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="text-[10px] font-bold tracking-[0.22em] text-[#06C7CC] mb-3">
                HORIZON {i + 1}
              </div>
              <div className="text-white text-[15px] tracking-wide mb-4">{h.horizon}</div>
              <ul className="flex flex-col gap-2.5">
                {h.initiatives.map((it, j) => (
                  <li key={j} className="flex gap-3 text-white/80 text-[13px] leading-relaxed font-light">
                    <span className="text-white/30 font-mono text-[11px] mt-[3px]">{String(j + 1).padStart(2, "0")}</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className="p-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderLeft: "3px solid #E84855",
          }}
        >
          <div className="text-[10px] font-bold tracking-[0.22em] text-[#E84855] mb-3">
            RISK FACTORS
          </div>
          <ul className="flex flex-col gap-2.5">
            {analysis.riskFactors.map((r, i) => (
              <li key={i} className="text-white/80 text-[13px] leading-relaxed font-light">
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div
          className="p-5"
          style={{
            background: "rgba(6,199,204,0.06)",
            border: "1px solid rgba(6,199,204,0.30)",
            borderLeft: "3px solid #06C7CC",
          }}
        >
          <div className="text-[10px] font-bold tracking-[0.22em] text-[#06C7CC] mb-3">
            HOW COGNIZANT HELPS
          </div>
          <p className="text-white/85 text-[14px] leading-relaxed font-light">
            {analysis.cognizantValue}
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-bold tracking-[0.24em] text-white/45 mb-4">{label}</div>
      {children}
    </div>
  );
}

function SubList({ title, items, accent }: { title: string; items: string[]; accent?: string }) {
  return (
    <div className="mb-3 last:mb-0">
      <div
        className="text-[10px] font-bold tracking-[0.2em] mb-1.5"
        style={{ color: accent || "rgba(255,255,255,0.5)" }}
      >
        {title.toUpperCase()}
      </div>
      <ul className="flex flex-col gap-1">
        {items.map((it, i) => (
          <li key={i} className="text-white/80 text-[13px] leading-relaxed font-light flex gap-2">
            <span className="text-white/30 mt-[2px]">—</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-[#06C7CC] cog-pulse" />
        <span className="text-[11px] uppercase tracking-[0.22em] text-white/65">
          Generating personalised analysis…
        </span>
      </div>
      <div className="flex flex-col gap-3">
        <div className="h-3 cog-shimmer w-[80%]" />
        <div className="h-3 cog-shimmer w-[95%]" />
        <div className="h-3 cog-shimmer w-[60%]" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 flex flex-col gap-3"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="h-2 w-16 cog-shimmer" />
            <div className="h-3 cog-shimmer w-[85%]" />
            <div className="h-3 cog-shimmer w-[70%]" />
            <div className="h-3 cog-shimmer w-[90%]" />
          </div>
        ))}
      </div>
    </div>
  );
}
