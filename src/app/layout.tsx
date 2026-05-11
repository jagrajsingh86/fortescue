import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cognizant AI Maturity Assessment",
  description:
    "Evaluate your organisation's AI readiness across five strategic pillars — People, Process, AI, Data, Technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">{children}</body>
    </html>
  );
}
