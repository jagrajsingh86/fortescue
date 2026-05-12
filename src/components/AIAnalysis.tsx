"use client";

import { useEffect, useRef, useState } from "react";
import { parse, Allow } from "partial-json";
import type { AIAnalysisData, AssessmentAnswers } from "@/types/assessment";
import { PILLARS } from "@/lib/pillars";

interface Props {
  answers: AssessmentAnswers;
  clientName?: string;
  industry?: string;
  context?: string;
  /** When provided, skips the API call and renders this directly (used by saved-report view). */
  preloaded?: AIAnalysisData | null;
  onLoaded?: (data: AIAnalysisData) => void;
}

type PartialAnalysis = Partial<AIAnalysisData> & {
  pillarAnalyses?: Partial<AIAnalysisData["pillarAnalyses"][number]>[];
  roadmap?: Partial<AIAnalysisData["roadmap"][number]>[];
};

export function AIAnalysis({
  answers,
  clientName,
  industry,
  context,
  preloaded,
  onLoaded,
}: Props) {
  const [analysis, setAnalysis] = useState<PartialAnalysis | null>(
    preloaded ?? null
  );
  const [streaming, setStreaming] = useState(!preloaded);
  const [error, setError] = useState<string | null>(null);
  const onLoadedRef = useRef(onLoaded);
  onLoadedRef.current = onLoaded;

  useEffect(() => {
    if (preloaded) return;
    let cancelled = false;

    async function run() {
      try {
        const res = await fetch("/api/analyse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, clientName, industry, context }),
        });
        if (!res.ok) {
          const body = await res.text();
          throw new Error(`API ${res.status}: ${body.slice(0, 200)}`);
        }
        if (!res.body) throw new Error("No response body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";

        while (!cancelled) {
          const { value, done } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });

          // Surface upstream stream errors that we encoded into the body.
          const errMatch = acc.match(/\[STREAM_ERROR\]([\s\S]*?)\[\/STREAM_ERROR\]/);
          if (errMatch) throw new Error(errMatch[1]);

          // Strip code fences / preamble, then partial-parse.
          const cleaned = stripFences(acc);
          const objStart = cleaned.indexOf("{");
          if (objStart === -1) continue;
          const slice = cleaned.slice(objStart);
          try {
            const parsed = parse(
              slice,
              Allow.STR | Allow.OBJ | Allow.ARR | Allow.NUM
            ) as PartialAnalysis;
            setAnalysis(parsed);
          } catch {
            /* keep accumulating */
          }
        }

        if (cancelled) return;
        // One last strict parse for the completion callback.
        try {
          const final = JSON.parse(
            stripFences(acc).slice(stripFences(acc).indexOf("{"))
          ) as AIAnalysisData;
          setAnalysis(final);
          onLoadedRef.current?.(final);
        } catch {
          /* leave partial */
        }
        setStreaming(false);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Unknown error");
          setStreaming(false);
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [preloaded, answers, clientName, industry, context]);

  if (error) {
    return (
      <div
        className="p-6"
        style={{
          background: "color-mix(in srgb, var(--danger) 10%, transparent)",
          border: "1px solid color-mix(in srgb, var(--danger) 40%, transparent)",
        }}
      >
        <div
          className="text-[11px] uppercase tracking-[0.22em] mb-2"
          style={{ color: "var(--danger)" }}
        >
          Analysis unavailable
        </div>
        <p className="text-white/75 text-[14px] leading-relaxed">
          We couldn&rsquo;t generate the AI analysis right now. Your scores are still valid.
        </p>
        <p className="text-white/40 text-[12px] mt-3 font-mono">{error}</p>
      </div>
    );
  }

  // Nothing parsed yet — show the full skeleton.
  if (!analysis) return <AnalysisSkeleton />;

  return (
    <div className="flex flex-col gap-10">
      {analysis.executiveSummary && (
        <Section label="Executive Summary" streaming={streaming}>
          <p className="text-white/85 text-[16px] leading-relaxed font-light max-w-3xl">
            {analysis.executiveSummary}
          </p>
        </Section>
      )}

      {analysis.pillarAnalyses && analysis.pillarAnalyses.length > 0 && (
        <Section label="Pillar Deep Dive" streaming={streaming}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {analysis.pillarAnalyses.map((pa, i) => {
              if (!pa) return null;
              const pillar = PILLARS.find((p) => p.id === pa.pillarId);
              if (!pillar || !pa.currentState) {
                // While the pillar entry is mid-stream, show a skeleton card so
                // the layout stays stable.
                return <PillarSkeleton key={i} />;
              }
              return (
                <div
                  key={pa.pillarId}
                  className="p-5 cog-fade-up"
                  style={{
                    background: "var(--surface-card)",
                    border: "1px solid var(--line-faint)",
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
                    <h3 className="text-white text-[15px] tracking-wide">
                      {pillar.name}
                    </h3>
                  </div>
                  <p className="text-white/75 text-[13px] leading-relaxed font-light mb-4">
                    {pa.currentState}
                  </p>
                  {pa.gaps && pa.gaps.length > 0 && <SubList title="Gaps" items={pa.gaps} />}
                  {pa.recommendations && pa.recommendations.length > 0 && (
                    <SubList title="Recommendations" items={pa.recommendations} />
                  )}
                  {pa.quickWins && pa.quickWins.length > 0 && (
                    <SubList
                      title="Quick Wins (30 days)"
                      items={pa.quickWins}
                      accent={pillar.accent}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {analysis.roadmap && analysis.roadmap.length > 0 && (
        <Section label="Transformation Roadmap" streaming={streaming}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {analysis.roadmap.map((h, i) => {
              if (!h?.horizon) return <RoadmapSkeleton key={i} index={i} />;
              return (
                <div
                  key={i}
                  className="p-5 cog-fade-up"
                  style={{
                    background: "var(--surface-card)",
                    border: "1px solid var(--line-faint)",
                  }}
                >
                  <div
                    className="text-[10px] font-bold tracking-[0.22em] mb-3"
                    style={{ color: "var(--accent)" }}
                  >
                    HORIZON {i + 1}
                  </div>
                  <div className="text-white text-[15px] tracking-wide mb-4">
                    {h.horizon}
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {(h.initiatives ?? []).map((it, j) => (
                      <li
                        key={j}
                        className="flex gap-3 text-white/80 text-[13px] leading-relaxed font-light"
                      >
                        <span className="text-white/30 font-mono text-[11px] mt-[3px]">
                          {String(j + 1).padStart(2, "0")}
                        </span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {(analysis.riskFactors?.length || analysis.cognizantValue) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {analysis.riskFactors && analysis.riskFactors.length > 0 && (
            <div
              className="p-5 cog-fade-up"
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--line-faint)",
                borderLeft: "3px solid var(--danger)",
              }}
            >
              <div
                className="text-[10px] font-bold tracking-[0.22em] mb-3"
                style={{ color: "var(--danger)" }}
              >
                RISK FACTORS
              </div>
              <ul className="flex flex-col gap-2.5">
                {analysis.riskFactors.map((r, i) => (
                  <li
                    key={i}
                    className="text-white/80 text-[13px] leading-relaxed font-light"
                  >
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {analysis.cognizantValue && (
            <div
              className="p-5 cog-fade-up"
              style={{
                background: "var(--accent-soft)",
                border: "1px solid var(--accent-border)",
                borderLeft: "3px solid var(--accent)",
              }}
            >
              <div
                className="text-[10px] font-bold tracking-[0.22em] mb-3"
                style={{ color: "var(--accent)" }}
              >
                HOW COGNIZANT HELPS
              </div>
              <p className="text-white/85 text-[14px] leading-relaxed font-light">
                {analysis.cognizantValue}
              </p>
            </div>
          )}
        </div>
      )}

      {streaming && analysis.executiveSummary && (
        <div className="flex items-center gap-3 text-white/55 text-[11px] uppercase tracking-[0.22em]">
          <span
            className="w-2 h-2 cog-pulse"
            style={{ background: "var(--accent)" }}
          />
          Streaming additional sections…
        </div>
      )}
    </div>
  );
}

function stripFences(s: string) {
  return s.replace(/```json/g, "").replace(/```/g, "");
}

function Section({
  label,
  streaming,
  children,
}: {
  label: string;
  streaming?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="cog-fade-up">
      <div className="text-[10px] font-bold tracking-[0.24em] text-white/45 mb-4 flex items-center gap-2">
        <span>{label}</span>
        {streaming && (
          <span
            className="inline-block w-1.5 h-1.5 cog-pulse"
            style={{ background: "var(--accent)" }}
            aria-hidden="true"
          />
        )}
      </div>
      {children}
    </div>
  );
}

function SubList({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent?: string;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <div
        className="text-[10px] font-bold tracking-[0.2em] mb-1.5"
        style={{ color: accent || "var(--ink-mute)" }}
      >
        {title.toUpperCase()}
      </div>
      <ul className="flex flex-col gap-1">
        {items.map((it, i) => (
          <li
            key={i}
            className="text-white/80 text-[13px] leading-relaxed font-light flex gap-2"
          >
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
          <PillarSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function PillarSkeleton() {
  return (
    <div
      className="p-5 flex flex-col gap-3"
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--line-faint)",
      }}
    >
      <div className="h-2 w-16 cog-shimmer" />
      <div className="h-3 cog-shimmer w-[85%]" />
      <div className="h-3 cog-shimmer w-[70%]" />
      <div className="h-3 cog-shimmer w-[90%]" />
    </div>
  );
}

function RoadmapSkeleton({ index }: { index: number }) {
  return (
    <div
      className="p-5 flex flex-col gap-3"
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--line-faint)",
      }}
    >
      <div
        className="text-[10px] font-bold tracking-[0.22em]"
        style={{ color: "var(--accent)" }}
      >
        HORIZON {index + 1}
      </div>
      <div className="h-3 cog-shimmer w-[60%]" />
      <div className="h-3 cog-shimmer w-[80%]" />
      <div className="h-3 cog-shimmer w-[70%]" />
    </div>
  );
}
