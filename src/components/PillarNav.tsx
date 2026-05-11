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
        return (
          <div key={p.id} className="flex items-center gap-2">
            <div
              className="flex items-center justify-center"
              style={{
                width: 22,
                height: 22,
                background: isActive ? p.accent : isDone ? "rgba(6,199,204,0.18)" : "transparent",
                border: `1px solid ${isActive ? p.accent : isDone ? "rgba(6,199,204,0.55)" : "rgba(255,255,255,0.18)"}`,
                color: isActive ? "#000028" : isDone ? "#06C7CC" : "rgba(255,255,255,0.55)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              {p.num}
            </div>
            <span
              className="hidden md:inline text-[11px] uppercase tracking-[0.16em]"
              style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.45)" }}
            >
              {p.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
