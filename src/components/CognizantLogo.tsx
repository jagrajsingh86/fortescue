interface Props {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

const ASPECT = 124 / 23;

export function CognizantLogo({ size = 24, className = "" }: Props) {
  const height = size;
  const width = Math.round(height * ASPECT);
  return (
    <span
      className={`inline-flex items-center ${className}`}
      aria-label="Cognizant"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/cognizant-logo.svg"
        alt="Cognizant"
        width={width}
        height={height}
        style={{ height, width: "auto", display: "block" }}
      />
    </span>
  );
}
