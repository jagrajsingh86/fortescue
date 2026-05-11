import { bandColor } from "@/lib/theme";
import { getBand } from "@/lib/scoring";

interface Props {
  score: number;
  size?: number;
}

export function RadialGauge({ score, size = 220 }: Props) {
  const band = getBand(score);
  const color = bandColor(band);
  const radius = size / 2 - 14;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, score / 10));
  const offset = circumference * (1 - pct);
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="inline-flex flex-col items-center">
      <svg width={size} height={size} aria-label={`Overall score ${score.toFixed(1)} of 10`}>
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={6}
        />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="butt"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: "stroke-dashoffset 700ms ease, stroke 300ms ease" }}
        />
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fill="#fff"
          style={{ fontSize: size * 0.28, fontWeight: 300 }}
        >
          {score.toFixed(1)}
        </text>
        <text
          x={cx}
          y={cy + size * 0.14}
          textAnchor="middle"
          fill="rgba(255,255,255,0.55)"
          style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" }}
        >
          of 10
        </text>
      </svg>
      <div
        className="mt-3 px-3 py-1 text-[11px] uppercase tracking-[0.22em]"
        style={{
          border: `1px solid ${color}`,
          color,
        }}
      >
        {band}
      </div>
    </div>
  );
}
