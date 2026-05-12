"use client";

import { useEffect, useState } from "react";
import type { Question } from "@/types/assessment";

interface Props {
  question: Question;
  selectedScore?: number;
  accent: string;
  onSelect: (score: number) => void;
  onPrevious?: () => void;
}

const LETTERS = ["A", "B", "C", "D", "E"];

export function QuestionCard({
  question,
  selectedScore,
  accent,
  onSelect,
  onPrevious,
}: Props) {
  const [pending, setPending] = useState<number | null>(null);

  useEffect(() => {
    setPending(null);
  }, [question]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (pending !== null) return;

      if (e.key >= "1" && e.key <= "5") {
        const i = Number(e.key) - 1;
        const opt = question.options[i];
        if (opt) {
          e.preventDefault();
          handleClick(opt.score);
        }
        return;
      }

      if ((e.key === "Backspace" || e.key === "ArrowLeft") && onPrevious) {
        e.preventDefault();
        onPrevious();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, pending, onPrevious]);

  function handleClick(score: number) {
    if (pending !== null) return;
    setPending(score);
    window.setTimeout(() => onSelect(score), 350);
  }

  return (
    <div className="cog-fade-up">
      <h2
        className="font-normal text-[22px] leading-snug mb-8 max-w-3xl"
        style={{ color: "var(--ink)" }}
      >
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
                className="w-full text-left flex items-start gap-4 px-5 py-4 transition-all duration-200 disabled:cursor-default group"
                style={{
                  background: isSelected ? "var(--accent-soft)" : "var(--surface-card)",
                  border: `1px solid ${isSelected ? accent : "var(--line-faint)"}`,
                  borderLeftWidth: 3,
                  borderLeftColor: isSelected ? accent : "var(--line)",
                }}
              >
                <span
                  className="font-bold text-[11px] tracking-[0.16em] mt-[3px] flex items-center gap-1.5"
                  style={{ color: isSelected ? accent : "var(--ink-faint)" }}
                >
                  {LETTERS[i]}
                  <span
                    className="font-mono text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-hidden="true"
                  >
                    [{i + 1}]
                  </span>
                </span>
                <span
                  className="text-[15px] leading-relaxed font-light flex-1"
                  style={{ color: "var(--ink-soft)" }}
                >
                  {opt.text}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div
        className="mt-6 text-[10px] uppercase tracking-[0.22em] flex items-center gap-4"
        style={{ color: "var(--ink-faint)" }}
      >
        <span>
          Press{" "}
          <kbd
            className="px-1.5 py-0.5 font-mono"
            style={{
              background: "var(--surface-card-strong)",
              border: "1px solid var(--line)",
            }}
          >
            1
          </kbd>
          –
          <kbd
            className="px-1.5 py-0.5 font-mono"
            style={{
              background: "var(--surface-card-strong)",
              border: "1px solid var(--line)",
            }}
          >
            5
          </kbd>{" "}
          to select
        </span>
        {onPrevious && (
          <span>
            <kbd
              className="px-1.5 py-0.5 font-mono"
              style={{
                background: "var(--surface-card-strong)",
                border: "1px solid var(--line)",
              }}
            >
              ←
            </kbd>{" "}
            previous
          </span>
        )}
      </div>
    </div>
  );
}
