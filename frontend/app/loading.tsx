import { LogoIcon } from "@/components/ui/logo";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#FAF8F5]/90 dark:bg-[#0E0C0A]/95 backdrop-blur-md transition-colors duration-300"
    >
      <span className="sr-only">Loading SchemeFind application...</span>

      {/* Soft ambient background glow */}
      <div className="absolute h-72 w-72 rounded-full bg-gradient-to-tr from-[#D5851F]/15 via-[#E4A247]/10 to-[#87A96B]/15 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center gap-5 text-center">
        {/* Animated Brand Badge */}
        <div className="relative">
          {/* Subtle spinning dashed ring with reduced-motion support */}
          <div className="absolute -inset-2.5 rounded-2xl border border-dashed border-[#D5851F]/40 dark:border-[#D5851F]/30 animate-[spin_10s_linear_infinite] motion-reduce:animate-none" />
          <LogoIcon className="h-14 w-14 shadow-xl shadow-[#D5851F]/25 animate-pulse motion-reduce:animate-none" />
        </div>

        {/* Brand Wordmark */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-display text-2xl font-extrabold tracking-tight text-[#5A3E2B] dark:text-[#FDFCFB]">
            Scheme<span className="text-[#D5851F]">Find</span>
          </span>
          <span className="text-xs text-[#5A3E2B]/60 dark:text-stone-400 font-medium">
            AI-Powered Welfare Discovery Engine
          </span>
        </div>

        {/* Indeterminate progress bar */}
        <div
          role="progressbar"
          aria-label="Loading page"
          aria-valuetext="Loading"
          className="h-1 w-40 overflow-hidden rounded-full bg-black/5 dark:bg-white/10 mt-1"
        >
          <div className="h-full w-full rounded-full bg-gradient-to-r from-[#D5851F] via-[#E4A247] to-[#87A96B] animate-pulse motion-reduce:animate-none" />
        </div>
      </div>
    </div>
  );
}
