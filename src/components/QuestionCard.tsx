"use client";

import { useEffect, useState } from "react";
import type { Question } from "@/types/assessment";

interface Props {
  question: Question;
  selectedScore?: number;
  accent: string;
  onSelect: (score: number) => void;
}

const LETTERS = ["A", "B", "C", "D", "E"];

export function QuestionCard({ question, selectedScore, accent, onSelect }: Props) {
  const [pending, setPending] = useState<number | null>(null);

  useEffect(() => {
    setPending(null);
  }, [question]);

  function handleClick(score: number) {
    if (pending !== null) return;
    setPending(score);
    window.setTimeout(() => onSelect(score), 350);
  }

  return (
    <div className="cog-fade-up">
      <h2 className="font-normal text-white text-[22px] leading-snug mb-8 max-w-3xl">
        {question.q}
      </h2>

      <ul className="flex flex-col gap-2 max-w-3xl">
        {question.options.map((opt, i) => {
          const isSelected = selectedScore === opt.score || pending === opt.score;
          return (
            <li key={i}>
              <button
                type="button"
                disabled={pending !== null}
                onClick={() => handleClick(opt.score)}
                className="w-full text-left flex items-start gap-4 px-5 py-4 transition-all duration-200 disabled:cursor-default"
                style={{
                  background: isSelected ? "rgba(6,199,204,0.10)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isSelected ? accent : "rgba(255,255,255,0.08)"}`,
                  borderLeftWidth: 3,
                  borderLeftColor: isSelected ? accent : "rgba(255,255,255,0.10)",
                }}
              >
                <span
                  className="font-bold text-[11px] tracking-[0.16em] mt-[3px]"
                  style={{ color: isSelected ? accent : "rgba(255,255,255,0.45)" }}
                >
                  {LETTERS[i]}
                </span>
                <span className="text-white/85 text-[15px] leading-relaxed font-light flex-1">
                  {opt.text}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
