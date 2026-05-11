interface Props {
  value: number;
  max: number;
}

export function ProgressBar({ value, max }: Props) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="w-full h-[3px] cog-progress-track">
      <div className="h-full cog-progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
