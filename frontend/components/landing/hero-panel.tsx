"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { LogoIcon } from "@/components/ui/logo";

const schemeScores: Record<string, number> = {
  "PM-KISAN": 92,
  KALIA: 76,
  "Ayushman Bharat": 45,
};

function SchemeCard({
  name,
  desc,
  color,
  delay,
}: {
  name: string;
  desc: string;
  color: "orange" | "teal" | "amber";
  delay: number;
}) {
  const score = schemeScores[name] ?? 70;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.killTweensOf(el);
    const tween = gsap.fromTo(
      el,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.5, delay, ease: "power2.out", clearProps: "all" }
    );
    return () => { tween.kill(); };
  }, [delay]);

  const colors = {
    orange: { ring: "stroke-[#D5851F]", text: "text-[#D5851F]", bg: "bg-[#D5851F]/15" },
    teal: { ring: "stroke-[#87A96B]", text: "text-[#87A96B]", bg: "bg-[#87A96B]/15" },
    amber: { ring: "stroke-[#D5851F]", text: "text-[#D5851F]", bg: "bg-[#D5851F]/15" },
  };

  const c = colors[color];

  return (
    <div
      ref={ref}
      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-sm hover:border-white/20 transition-colors"
    >
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.bg}`}>
        <svg className={`h-5 w-5 ${c.text}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
          <path d="M9 12l2 2 4-4" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">{name}</p>
        <p className="text-xs text-white/50">{desc}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`text-sm font-bold font-mono ${c.text}`}>{score}%</span>
        <svg className={`h-8 w-8 -rotate-90 ${c.ring}`} viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth={2} opacity="0.2" />
          <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth={2} strokeDasharray="82" strokeDashoffset="20" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

export function HeroPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const emblemRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches) return;

      const hpEls = panelRef.current?.querySelectorAll(".hp-emblem, .hp-title, .hp-badge, .hp-pulse-ring, .hp-stat-num");
      if (hpEls?.length) gsap.killTweensOf(hpEls);

      const ctx = gsap.context(() => {
        gsap.fromTo(".hp-emblem", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)", clearProps: "all" });
        gsap.fromTo(".hp-title", { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.15, ease: "power2.out", clearProps: "all" });
        gsap.fromTo(".hp-badge", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4, delay: 0.3, ease: "back.out(1.7)", clearProps: "all" });

        gsap.to(".hp-pulse-ring", {
          scale: 1.6,
          opacity: 0,
          duration: 2,
          repeat: -1,
          ease: "power2.out",
          stagger: 0.4,
        });

        const statNums = statsRef.current?.querySelectorAll(".hp-stat-num");
        if (statNums) {
          gsap.fromTo(statNums, { textContent: 0 }, {
            textContent: 1,
            duration: 1.2,
            delay: 0.6,
            ease: "power2.out",
            snap: { textContent: 1 },
            stagger: 0.15,
          });
        }
      }, panelRef);

      return () => ctx.revert();
    } catch { return; }
  }, []);

  return (
    <div
      ref={panelRef}
      className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-gradient-to-br from-[#4A3222] via-[#5A3E2B] to-[#38261A] border border-[#87A96B]/20 shadow-2xl shadow-[#5A3E2B]/40"
    >
      {/* Subtle grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 0h1v40H0zM0 0h40v1H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
      />

      {/* Glow accents with Amber Glow and Sage Green */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#D5851F]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-[#87A96B]/20 blur-3xl" />

      {/* Content */}
      <div className="relative px-6 pb-6 pt-7 sm:px-8 sm:pb-8 sm:pt-8">
        {/* Top: Emblem + Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div ref={emblemRef} className="hp-emblem">
              <LogoIcon className="w-10 h-10" />
            </div>
            <div>
              <p className="hp-title text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                Scheme<span className="text-[#D5851F]">Find</span>
              </p>
              <p className="text-[10px] font-semibold tracking-[0.15em] text-[#D8C8BB] uppercase">
                Eligibility Engine
              </p>
            </div>
          </div>

          {/* Verified badge */}
          <div className="hp-badge relative flex items-center gap-1.5 rounded-full border border-[#87A96B]/40 bg-[#87A96B]/15 px-3 py-1">
            <div className="relative">
              <div className="h-2 w-2 rounded-full bg-[#87A96B]" />
              <div className="hp-pulse-ring absolute inset-0 h-2 w-2 rounded-full border border-[#87A96B]" />
            </div>
            <span className="text-[11px] font-semibold text-[#CFDFC3]">Deterministic Match</span>
          </div>
        </div>

        {/* Main card: Digital citizen profile */}
        <div className="mb-5 rounded-xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D5851F]/20 text-[#D5851F] ring-1 ring-[#D5851F]/30">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white/95">Digital Citizen Profile</p>
              <p className="text-xs text-white/50">Demographics · Income · Assets · State</p>
            </div>
            <div className="ml-auto">
              <div className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-center">
                <p className="text-[10px] font-semibold uppercase text-white/60">Matched</p>
                <p className="hp-stat-num font-display text-xl font-bold text-[#D5851F]">14</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Farmer", "Odisha", "Age 34", "BPL Card", "OBC", "2.5 Acres"].map((tag) => (
              <span key={tag} className="rounded-md bg-white/[0.07] px-2.5 py-1 text-[11px] font-medium text-white/70 ring-1 ring-white/10">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Scheme cards */}
        <div className="mb-5 space-y-2.5">
          <SchemeCard name="PM-KISAN" desc="Direct Income Support · ₹6,000/yr" color="teal" delay={0.4} />
          <SchemeCard name="KALIA (Krushak Assistance)" desc="State Agriculture Livelihood · Odisha" color="teal" delay={0.55} />
          <SchemeCard name="Ayushman Bharat (PM-JAY)" desc="Universal Health Cover · ₹5,00,000" color="amber" delay={0.7} />
        </div>

        {/* Bottom stats */}
        <div
          ref={statsRef}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: "Schemes Scored", value: "1,000+" },
            { label: "Ready to Apply", value: "8" },
            { label: "Top Match", value: "92%" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-center backdrop-blur-sm">
              <p className="font-display text-lg font-bold text-white">{stat.value}</p>
              <p className="text-[10px] font-medium text-white/50">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Bottom trust line */}
        <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-white/40">
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-[#87A96B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            No AI Hallucinations
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-[#87A96B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Bank-Grade Privacy
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-[#87A96B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            100% Free
          </span>
        </div>
      </div>
    </div>
  );
}
