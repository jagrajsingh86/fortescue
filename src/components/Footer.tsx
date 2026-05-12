import { CognizantLogo } from "./CognizantLogo";

interface Props {
  status?: string;
}

export function Footer({ status }: Props) {
  return (
    <footer
      className="cog-chrome w-full mt-12 px-6 sm:px-10 py-5 flex items-center justify-between"
      style={{ borderTop: "1px solid var(--line-faint)" }}
    >
      <CognizantLogo size={22} />
      <div
        className="flex items-center gap-6 text-[11px] uppercase tracking-[0.18em]"
        style={{ color: "var(--ink-mute)" }}
      >
        {status && <span>{status}</span>}
        <span>Confidential</span>
      </div>
    </footer>
  );
}
