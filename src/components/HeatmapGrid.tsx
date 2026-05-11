import type { PillarScore } from "@/types/assessment";
import { PILLARS } from "@/lib/pillars";
import { bandColor } from "@/lib/theme";

interface Props {
  scores: PillarScore[];
}

export function HeatmapGrid({ scores }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
      {scores.map((s, i) => {
        const pillar = PILLARS[i];
        const color = bandColor(s.band);
        return (
          <div
            key={s.pillarId}
            className="aspect-[1.1/1] p-4 flex flex-col justify-between"
            style={{
              background: `color-mix(in srgb, ${color} 18%, transparent)`,
              border: `1px solid color-mix(in srgb, ${color} 45%, transparent)`,
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] font-bold tracking-[0.18em]"
                style={{ color: pillar.accent }}
              >
                {pillar.num}
              </span>
              <span
                className="text-[9px] uppercase tracking-[0.18em]"
                style={{ color }}
              >
                {s.band}
              </span>
            </div>
            <div>
              <div className="text-white font-light text-[28px] tabular-nums leading-none">
                {s.score.toFixed(1)}
              </div>
              <div className="mt-1 text-white/65 text-[11px] tracking-wide">
                {s.pillarName}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
