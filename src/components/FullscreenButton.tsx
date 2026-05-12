"use client";

import { useEffect, useState } from "react";

export function FullscreenButton() {
  const [presenting, setPresenting] = useState(false);

  useEffect(() => {
    function sync() {
      const fs = Boolean(document.fullscreenElement);
      setPresenting(fs);
      document.documentElement.setAttribute("data-presenting", String(fs));
    }
    document.addEventListener("fullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.documentElement.removeAttribute("data-presenting");
    };
  }, []);

  async function toggle() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen toggle failed", err);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={presenting ? "Exit fullscreen" : "Present fullscreen"}
      title={presenting ? "Exit fullscreen (Esc)" : "Present fullscreen"}
      className="w-9 h-9 flex items-center justify-center transition-colors"
      style={{
        background: presenting ? "var(--accent)" : "var(--surface-card)",
        border: `1px solid ${presenting ? "var(--accent)" : "var(--line)"}`,
        color: presenting ? "var(--ink-on-accent)" : "var(--ink-soft)",
      }}
    >
      {presenting ? <Exit /> : <Enter />}
    </button>
  );
}

function Enter() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 9V4h5" />
      <path d="M20 9V4h-5" />
      <path d="M4 15v5h5" />
      <path d="M20 15v5h-5" />
    </svg>
  );
}

function Exit() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 4v5H4" />
      <path d="M15 4v5h5" />
      <path d="M9 20v-5H4" />
      <path d="M15 20v-5h5" />
    </svg>
  );
}
