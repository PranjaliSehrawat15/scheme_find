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
    if (s >= 75) return "bg-[#87A96B]/15 text-[#3D522D] border-[#87A96B]/35 font-bold";
    if (s >= 50) return "bg-[#D5851F]/15 text-[#92520B] border-[#D5851F]/35 font-bold";
    return "bg-[#5A3E2B]/10 text-[#5A3E2B]/70 border-[#5A3E2B]/20";
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
