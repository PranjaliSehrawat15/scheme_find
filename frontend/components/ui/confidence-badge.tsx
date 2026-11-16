"use client";

import React from "react";

export function ConfidenceBadge({
  score,
  size,
  showLabel,
  className = "",
}: {
  score: number;
  size?: string;
  showLabel?: boolean;
  className?: string;
}) {
  // Automatically normalize decimal scores (e.g. 0.92 -> 92) so it never displays "0.92%"
  const normalizedScore =
    score > 0 && score <= 1 ? Math.round(score * 100) : Math.round(score || 0);

  const getStyle = (s: number) => {
    if (s >= 75) return "bg-[#87A96B]/15 text-[#3D522D] dark:text-[#A7C88B] border-[#87A96B]/35 dark:border-[#87A96B]/50 font-bold";
    if (s >= 50) return "bg-[#D5851F]/15 text-[#92520B] dark:text-[#E8952B] border-[#D5851F]/35 dark:border-[#D5851F]/50 font-bold";
    return "bg-[#5A3E2B]/10 dark:bg-white/10 text-[#5A3E2B]/70 dark:text-[#D5C2B0] border-[#5A3E2B]/20 dark:border-white/15";
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStyle(
        normalizedScore
      )} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {normalizedScore}% Match
    </span>
  );
}

export default ConfidenceBadge;
