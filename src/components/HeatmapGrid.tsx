import type { PillarScore } from "@/types/assessment";
import { PILLARS } from "@/lib/pillars";
import { bandColor } from "@/lib/theme";

interface Props {
  scores: PillarScore[];
}

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
              background: hexToRgba(color, 0.18),
              border: `1px solid ${hexToRgba(color, 0.45)}`,
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
