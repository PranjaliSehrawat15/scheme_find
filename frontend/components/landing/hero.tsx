"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { HeroPanel } from "@/components/landing/hero-panel";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches) return;

      const heroEls = sectionRef.current?.querySelectorAll(
        ".hero-badge, .hero-headline, .hero-subtitle, .hero-search, .hero-cta, .hero-trust"
      );
      if (heroEls?.length) gsap.killTweensOf(heroEls);
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".hero-badge",
          { opacity: 0, y: -6 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", clearProps: "all" }
        );
        gsap.fromTo(
          ".hero-headline",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.15, ease: "power2.out", clearProps: "all" }
        );
        gsap.fromTo(
          ".hero-subtitle",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, delay: 0.35, ease: "power2.out", clearProps: "all" }
        );
        gsap.fromTo(
          ".hero-search",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, delay: 0.45, ease: "power2.out", clearProps: "all" }
        );
        gsap.fromTo(
          ".hero-cta",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, delay: 0.55, ease: "power2.out", clearProps: "all", stagger: 0.1 }
        );
        gsap.fromTo(
          ".hero-trust",
          { opacity: 0 },
          { opacity: 1, duration: 0.5, delay: 0.7, ease: "power2.out", clearProps: "all" }
        );
      }, sectionRef);
      return () => ctx.revert();
    } catch {
      return;
    }
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/schemes?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/schemes");
    }
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-to-b from-white via-warm-paper/40 to-warm-paper dark:from-[#14110F] dark:via-[#100D0B] dark:to-[#0E0C0A]">
      {/* Background ornament — subtle geometric accents */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] opacity-[0.04]">
        <svg viewBox="0 0 500 500" fill="none" aria-hidden="true">
          <circle cx="250" cy="250" r="200" stroke="#5A3E2B" strokeWidth="2" />
          <circle cx="250" cy="250" r="160" stroke="#5A3E2B" strokeWidth="1.5" strokeDasharray="8 8" />
          <circle cx="250" cy="250" r="240" stroke="#5A3E2B" strokeWidth="1" strokeDasharray="4 12" />
          <path d="M250 50 Q 300 150 250 250 Q 200 150 250 50Z" fill="#D5851F" opacity="0.3" />
          <path d="M250 450 Q 300 350 250 250 Q 200 350 250 450Z" fill="#87A96B" opacity="0.3" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 lg:px-8 lg:pb-16 lg:pt-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 items-center">
          {/* Left — Copy & Actions */}
          <div className="flex flex-col justify-center">
            <div className="hero-badge mb-4 inline-flex items-center gap-2 rounded-full border border-[#D5851F]/30 bg-[#D5851F]/10 px-3.5 py-1 text-xs font-semibold text-[#D5851F] shadow-xs w-fit">
              <span className="flex h-2 w-2 rounded-full bg-[#D5851F] animate-pulse" />
              <span>SchemeFind • 100% Deterministic Rule Engine</span>
            </div>

            <h1 className="hero-headline font-display text-4xl font-extrabold leading-[1.15] tracking-tight text-[#5A3E2B] sm:text-5xl lg:text-6xl">
              Thousands of schemes.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D5851F] via-[#E4A247] to-[#87A96B]">
                Found in seconds.
              </span>
            </h1>

            <p className="hero-subtitle mt-4 max-w-xl text-base leading-relaxed text-[#6E5748] sm:text-lg">
              India administers over a thousand welfare programs across central and state departments.
              Eligibility is not the hurdle — discovery is. <strong>SchemeFind</strong> matches your profile
              against auditable government rules so no benefit is left behind.
            </p>

            {/* Instant Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hero-search mt-6 max-w-lg">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search schemes by name, category, or benefit..."
                  className="w-full rounded-full border-2 border-[#5A3E2B]/15 bg-white py-3 pl-11 pr-28 text-sm text-[#5A3E2B] shadow-sm transition-all focus:border-[#D5851F] focus:outline-none focus:ring-4 focus:ring-[#D5851F]/10 placeholder:text-[#5A3E2B]/40"
                  aria-label="Search government schemes"
                />
                <svg
                  className="absolute left-4 h-4 w-4 text-[#5A3E2B]/40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <button
                  type="submit"
                  className="absolute right-1.5 rounded-full bg-[#D5851F] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#B86C14] active:scale-95 transition-all cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="hero-cta mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href="/register" size="lg" className="shadow-lg shadow-[#D5851F]/20">
                Check My Eligibility
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Button>
              <Button href="/schemes" variant="outline" size="lg">
                Browse All Schemes
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="hero-trust mt-8 flex flex-wrap items-center gap-5 text-xs text-[#5A3E2B]/75">
              <span className="flex items-center gap-1.5 font-medium">
                <svg className="h-4 w-4 text-[#87A96B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pure Rule Engine (No Hallucination)
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <svg className="h-4 w-4 text-[#87A96B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Zero-PII Storage
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <svg className="h-4 w-4 text-[#87A96B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                100% Free & Citizen-First
              </span>
            </div>
          </div>

          {/* Right — Interactive Dynamic Hero Showcase */}
          <div className="flex justify-center lg:justify-end">
            <HeroPanel />
          </div>
        </div>
      </div>
    </section>
  );
}
