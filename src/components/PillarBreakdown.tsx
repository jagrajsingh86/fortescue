import type { PillarScore } from "@/types/assessment";
import { PILLARS } from "@/lib/pillars";

interface Props {
  scores: PillarScore[];
}

export function PillarBreakdown({ scores }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {scores.map((s, i) => {
        const pillar = PILLARS[i];
        const pct = (s.score / 10) * 100;
        return (
          <div key={s.pillarId} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="text-[10px] font-bold tracking-[0.18em]"
                  style={{ color: pillar.accent }}
                >
                  {pillar.num}
                </span>
                <span
                  className="text-[14px] tracking-wide"
                  style={{ color: "var(--ink)" }}
                >
                  {s.pillarName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: "var(--ink-mute)" }}
                >
                  {s.band}
                </span>
                <span
                  className="font-medium text-[15px] tabular-nums"
                  style={{ color: "var(--ink)" }}
                >
                  {s.score.toFixed(1)}
                </span>
              </div>
            </div>
            <div
              className="h-[6px] w-full"
              style={{ background: "var(--surface-card-strong)" }}
            >
              <div
                className="h-full"
                style={{
                  width: `${pct}%`,
                  background: pillar.accent,
                  transition: "width 700ms ease",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
