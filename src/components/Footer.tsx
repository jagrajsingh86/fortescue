import { CognizantLogo } from "./CognizantLogo";

interface Props {
  status?: string;
}

export function Footer({ status }: Props) {
  return (
    <footer
      className="w-full mt-12 px-6 sm:px-10 py-5 flex items-center justify-between"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <CognizantLogo size={22} />
      <div className="flex items-center gap-6 text-[11px] uppercase tracking-[0.18em] text-white/50">
        {status && <span>{status}</span>}
        <span>Confidential</span>
      </div>
    </footer>
  );
}
