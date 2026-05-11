"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CognizantLogo } from "@/components/CognizantLogo";
import { Footer } from "@/components/Footer";
import { ProgressBar } from "@/components/ProgressBar";
import { PILLARS } from "@/lib/pillars";
import { clearSession, saveSession } from "@/lib/session";

export default function LandingPage() {
  const router = useRouter();
  const [clientName, setClientName] = useState("");
  const [industry, setIndustry] = useState("");

  function begin() {
    clearSession();
    saveSession({
      answers: {},
      clientName: clientName.trim() || undefined,
      industry: industry.trim() || undefined,
      current: 0,
    });
    router.push("/assessment");
  }

  return (
    <>
      <ProgressBar value={0} max={1} />

      <header className="px-6 sm:px-10 pt-6 flex items-center justify-between relative z-10">
        <span className="cog-reveal" style={{ animationDelay: "0ms" }}>
          <CognizantLogo size={28} />
        </span>
        <span
          className="text-[11px] uppercase tracking-[0.22em] text-white/45 cog-reveal"
          style={{ animationDelay: "120ms" }}
        >
          AI Maturity Assessment
        </span>
      </header>

      <main className="flex-1 px-6 sm:px-10 py-12 sm:py-20 max-w-5xl w-full mx-auto relative">
        {/* Ambient aurora behind the headline */}
        <div className="cog-aurora" aria-hidden="true" />

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-start relative">
          <div>
            <div
              className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.24em] text-[#06C7CC] mb-5 cog-reveal"
              style={{ animationDelay: "180ms" }}
            >
              <span
                className="inline-block w-1.5 h-1.5 bg-[#06C7CC] cog-dot"
                aria-hidden="true"
              />
              <span>5 pillars · 15 questions · ~5 minutes</span>
            </div>

            <h1 className="text-white font-light text-[42px] sm:text-[54px] leading-[1.05] tracking-tight mb-6">
              <span
                className="block cog-reveal"
                style={{ animationDelay: "260ms" }}
              >
                AI Maturity
              </span>
              <span
                className="block cog-reveal"
                style={{ animationDelay: "380ms" }}
              >
                <span className="relative inline-block">
                  Assessment
                  <span
                    className="absolute left-0 -bottom-1 h-[2px] w-full cog-line-draw"
                    style={{
                      background: "linear-gradient(90deg, #06C7CC, #7373D8)",
                      animationDelay: "780ms",
                    }}
                  />
                </span>
              </span>
            </h1>

            <p
              className="text-white/70 text-[17px] leading-relaxed font-light max-w-xl mb-10 cog-reveal"
              style={{ animationDelay: "520ms" }}
            >
              Evaluate your organisation&rsquo;s AI readiness across five
              strategic pillars. Receive a personalised analysis and a
              transformation roadmap grounded in Cognizant&rsquo;s BASIS
              methodology — generated in real time by Gemini.
            </p>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mb-10 cog-reveal"
              style={{ animationDelay: "640ms" }}
            >
              <Field
                label="Client / Organisation"
                placeholder="e.g. Fortescue"
                value={clientName}
                onChange={setClientName}
              />
              <Field
                label="Industry"
                placeholder="e.g. Mining & Resources"
                value={industry}
                onChange={setIndustry}
              />
            </div>

            <button
              type="button"
              onClick={begin}
              className="cog-cta cog-reveal px-7 py-3.5 text-[13px] uppercase tracking-[0.2em] font-semibold"
              style={{
                background: "#06C7CC",
                color: "#000028",
                animationDelay: "760ms",
              }}
            >
              Begin Assessment →
            </button>
          </div>

          <div>
            <div
              className="text-[10px] uppercase tracking-[0.24em] text-white/45 mb-4 cog-reveal"
              style={{ animationDelay: "300ms" }}
            >
              The Five Pillars
            </div>
            <ul className="flex flex-col">
              {PILLARS.map((p, i) => (
                <li
                  key={p.id}
                  className="cog-row-in flex items-baseline gap-5 py-4 px-5"
                  style={
                    {
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      borderLeft: `3px solid ${p.accent}`,
                      background: "rgba(255,255,255,0.02)",
                      animationDelay: `${420 + i * 110}ms`,
                      ["--row-accent" as never]: p.accent,
                    } as React.CSSProperties
                  }
                >
                  <span
                    className="text-[11px] font-bold tracking-[0.18em]"
                    style={{ color: p.accent }}
                  >
                    {p.num}
                  </span>
                  <span className="text-white text-[15px] tracking-wide">
                    {p.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] uppercase tracking-[0.22em] text-white/50">
        {label}
      </span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/[0.04] border border-white/10 px-4 py-3 text-white text-[15px] font-light outline-none focus:border-[#06C7CC] transition-colors"
      />
    </label>
  );
}
