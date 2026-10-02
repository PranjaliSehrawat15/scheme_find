"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { StatsBar } from "@/components/landing/stats-bar";
import { DemoWidget } from "@/components/landing/demo-widget";
import { FAQ } from "@/components/landing/faq";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        suppressHydrationWarning
        className="fixed inset-0 z-[60] flex items-center justify-center bg-gradient-to-br from-[#38261A] via-[#4A3222] to-[#2B1B10]"
      >
        <div suppressHydrationWarning className="w-[300px] max-w-full px-4 sm:w-[400px]">
          <video
            suppressHydrationWarning
            src="/assets/loader-ring.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Hero />
        <section className="relative z-10 py-8 sm:py-12">
          <StatsBar />
        </section>

        {/* Interactive Quick Simulation Section */}
        <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D5851F]/30 bg-[#D5851F]/10 px-3.5 py-1 text-xs font-semibold text-[#D5851F] mb-3 shadow-2xs">
              Instant Entitlement Simulator
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink-navy sm:text-3xl">
              Experience SchemeFind in 10 Seconds
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto">
              Enter sample parameters to witness how our deterministic engine calculates percentage match scores and document gaps in real time.
            </p>
          </div>
          <DemoWidget />
        </section>

        <Features />
        <FAQ />
      </main>
    </div>
  );
}
