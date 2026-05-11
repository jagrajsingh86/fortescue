interface Props {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

export function CognizantLogo({ size = 28, showWordmark = true, className = "" }: Props) {
  const h = size;
  return (
    <div className={`inline-flex items-center gap-2 ${className}`} aria-label="Cognizant">
      <svg
        width={h}
        height={h}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="cog-face-left" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2F78C4" />
            <stop offset="100%" stopColor="#06C7CC" />
          </linearGradient>
          <linearGradient id="cog-face-right" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2E308E" />
            <stop offset="100%" stopColor="#7373D8" />
          </linearGradient>
          <linearGradient id="cog-face-top" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#92BBE6" />
            <stop offset="100%" stopColor="#2F78C4" />
          </linearGradient>
        </defs>
        {/* Top facet */}
        <polygon points="32,4 56,18 32,32 8,18" fill="url(#cog-face-top)" />
        {/* Left facet */}
        <polygon points="8,18 32,32 32,60 8,46" fill="url(#cog-face-left)" />
        {/* Right facet */}
        <polygon points="56,18 56,46 32,60 32,32" fill="url(#cog-face-right)" />
      </svg>
      {showWordmark && (
        <span
          className="font-semibold tracking-wide text-white"
          style={{ fontSize: Math.round(h * 0.6), letterSpacing: "0.02em" }}
        >
          Cognizant
        </span>
      )}
    </div>
  );
}
