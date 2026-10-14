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
  const getStyle = (s: number) => {
    if (s >= 75) return "bg-[#87A96B]/15 text-[#3D522D] border-[#87A96B]/35 font-bold";
    if (s >= 50) return "bg-[#D5851F]/15 text-[#92520B] border-[#D5851F]/35 font-bold";
    return "bg-[#5A3E2B]/10 text-[#5A3E2B]/70 border-[#5A3E2B]/20";
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStyle(
        score
      )}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {score}% Match
    </span>
  );
}

export default ConfidenceBadge;
