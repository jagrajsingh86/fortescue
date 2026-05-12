import { PILLARS } from "@/lib/pillars";

interface Props {
  activePillar: number;
}

export function PillarNav({ activePillar }: Props) {
  return (
    <div className="flex items-center gap-3">
      {PILLARS.map((p, i) => {
        const isActive = i === activePillar;
        const isDone = i < activePillar;
        const bg = isActive
          ? p.accent
          : isDone
          ? "color-mix(in srgb, var(--accent) 18%, transparent)"
          : "transparent";
        const border = isActive
          ? p.accent
          : isDone
          ? "color-mix(in srgb, var(--accent) 55%, transparent)"
          : "var(--line-strong)";
        const fg = isActive
          ? "var(--ink-on-accent)"
          : isDone
          ? "var(--accent)"
          : "var(--ink-mute)";
        return (
          <div key={p.id} className="flex items-center gap-2">
            <div
              className="flex items-center justify-center"
              style={{
                width: 22,
                height: 22,
                background: bg,
                border: `1px solid ${border}`,
                color: fg,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              {p.num}
            </div>
            <span
              className="hidden md:inline text-[11px] uppercase tracking-[0.16em]"
              style={{ color: isActive ? "var(--ink)" : "var(--ink-faint)" }}
            >
              {p.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
