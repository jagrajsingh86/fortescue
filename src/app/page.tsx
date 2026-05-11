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

      <header className="px-6 sm:px-10 pt-6 flex items-center justify-between">
        <CognizantLogo size={28} />
        <span className="text-[11px] uppercase tracking-[0.22em] text-white/45">
          AI Maturity Assessment
        </span>
      </header>

      <main className="flex-1 px-6 sm:px-10 py-12 sm:py-20 max-w-5xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-start">
          <div className="cog-fade-up">
            <div className="text-[11px] uppercase tracking-[0.24em] text-[#06C7CC] mb-5">
              5 pillars · 15 questions · ~5 minutes
            </div>
            <h1 className="text-white font-light text-[42px] sm:text-[54px] leading-[1.05] tracking-tight mb-6">
              AI Maturity
              <br />
              Assessment
            </h1>
            <p className="text-white/70 text-[17px] leading-relaxed font-light max-w-xl mb-10">
              Evaluate your organisation&rsquo;s AI readiness across five
              strategic pillars. Receive a personalised analysis and a
              transformation roadmap grounded in Cognizant&rsquo;s BASIS
              methodology — generated in real time by Claude.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mb-10">
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
              className="px-7 py-3.5 text-[13px] uppercase tracking-[0.2em] font-semibold transition-all"
              style={{
                background: "#06C7CC",
                color: "#000028",
              }}
            >
              Begin Assessment →
            </button>
          </div>

          <div className="cog-fade-up" style={{ animationDelay: "120ms" }}>
            <div className="text-[10px] uppercase tracking-[0.24em] text-white/45 mb-4">
              The Five Pillars
            </div>
            <ul className="flex flex-col">
              {PILLARS.map((p) => (
                <li
                  key={p.id}
                  className="flex items-baseline gap-5 py-4 px-5"
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    borderLeft: `3px solid ${p.accent}`,
                    background: "rgba(255,255,255,0.02)",
                  }}
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
