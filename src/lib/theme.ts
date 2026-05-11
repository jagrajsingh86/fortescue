export const cognizant = {
  navy: "#000048",
  bg: "#00003a",
  bgDeep: "#000028",
  teal: "#06C7CC",
  blue: "#2F78C4",
  purple: "#2E308E",
  lilac: "#7373D8",
  lightBlue: "#92BBE6",
  cyan: "#35CACF",
  white: "#FFFFFF",
  white70: "rgba(255,255,255,0.70)",
  white50: "rgba(255,255,255,0.50)",
  white30: "rgba(255,255,255,0.30)",
  white12: "rgba(255,255,255,0.12)",
  white06: "rgba(255,255,255,0.06)",
  white04: "rgba(255,255,255,0.04)",
  red: "#E84855",
  amber: "#F5A623",
  green: "#06C7CC",
} as const;

export const pillarAccents = [
  "#06C7CC",
  "#7373D8",
  "#2F78C4",
  "#92BBE6",
  "#35CACF",
] as const;

export function bandColor(band: string): string {
  if (band === "Foundational") return cognizant.red;
  if (band === "Scaling") return cognizant.amber;
  return cognizant.teal;
}
