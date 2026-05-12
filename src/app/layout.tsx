import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cognizant AI Maturity Assessment",
  description:
    "Evaluate your organisation's AI readiness across five strategic pillars — People, Process, AI, Data, Technology.",
};

// Inline script run before paint to apply the user's saved theme. Avoids a
// dark→light flash on first load when light mode is the saved preference.
const THEME_INIT = `
try {
  var t = localStorage.getItem('cog-theme');
  if (t !== 'light' && t !== 'dark') t = 'dark';
  document.documentElement.setAttribute('data-theme', t);
} catch (e) {
  document.documentElement.setAttribute('data-theme', 'dark');
}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="min-h-screen flex flex-col antialiased">{children}</body>
    </html>
  );
}
