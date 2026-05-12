"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CognizantLogo } from "@/components/CognizantLogo";
import { Footer } from "@/components/Footer";
import { ProgressBar } from "@/components/ProgressBar";
import { PillarNav } from "@/components/PillarNav";
import { QuestionCard } from "@/components/QuestionCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FullscreenButton } from "@/components/FullscreenButton";
import { PILLARS } from "@/lib/pillars";
import { totalQuestions } from "@/lib/scoring";
import { loadSession, saveSession } from "@/lib/session";

interface Step {
  pi: number;
  qi: number;
}

export default function AssessmentPage() {
  const router = useRouter();
  const steps = useMemo<Step[]>(() => {
    const out: Step[] = [];
    PILLARS.forEach((p, pi) => p.questions.forEach((_, qi) => out.push({ pi, qi })));
    return out;
  }, []);
  const total = steps.length;

  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [current, setCurrent] = useState(0);
  const [clientName, setClientName] = useState<string | undefined>();
  const [industry, setIndustry] = useState<string | undefined>();
  const [context, setContext] = useState<string | undefined>();

  useEffect(() => {
    const s = loadSession();
    setAnswers(s.answers || {});
    setCurrent(Math.min(s.current ?? 0, total - 1));
    setClientName(s.clientName);
    setIndustry(s.industry);
    setContext(s.context);
    setHydrated(true);
  }, [total]);

  useEffect(() => {
    if (!hydrated) return;
    saveSession({ answers, clientName, industry, context, current });
  }, [answers, clientName, industry, context, current, hydrated]);

  if (!hydrated) return null;

  const step = steps[current];
  const pillar = PILLARS[step.pi];
  const question = pillar.questions[step.qi];
  const key = `${step.pi}-${step.qi}`;
  const selectedScore = answers[key];

  function onSelect(score: number) {
    const next = { ...answers, [key]: score };
    setAnswers(next);
    if (current >= total - 1) {
      saveSession({ answers: next, clientName, industry, context, current });
      router.push("/results");
    } else {
      setCurrent(current + 1);
    }
  }

  function goBack() {
    if (current > 0) setCurrent(current - 1);
  }

  const completed = Object.keys(answers).length;

  return (
    <>
      <ProgressBar value={current + 1} max={total} />

      <header className="cog-chrome px-6 sm:px-10 pt-6 flex items-center justify-between gap-4">
        <CognizantLogo size={26} />
        <div className="flex items-center gap-3">
          <PillarNav activePillar={step.pi} />
          <FullscreenButton />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 px-6 sm:px-10 py-12 sm:py-16 max-w-4xl w-full mx-auto">
        <div className="flex items-baseline justify-between mb-3">
          <div className="flex items-baseline gap-4">
            <span
              className="text-[11px] font-bold tracking-[0.22em]"
              style={{ color: pillar.accent }}
            >
              {pillar.num} · {pillar.name.toUpperCase()}
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.22em] text-white/45 font-mono tabular-nums">
            {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>

        <QuestionCard
          question={question}
          accent={pillar.accent}
          selectedScore={selectedScore}
          onSelect={onSelect}
          onPrevious={current > 0 ? goBack : undefined}
        />

        {current > 0 && (
          <button
            type="button"
            onClick={goBack}
            className="mt-10 text-[12px] uppercase tracking-[0.22em] text-white/55 hover:text-white transition-colors"
          >
            ← Previous question
          </button>
        )}
      </main>

      <Footer status={`${completed} of ${total} completed`} />
    </>
  );
}
