"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light";
  showText?: boolean;
  href?: string;
}

export function LogoIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#D5851F] via-[#E4A247] to-[#87A96B] shadow-md shadow-[#D5851F]/25 p-1.5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105",
        className
      )}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-white"
        aria-hidden="true"
      >
        {/* Outer subtle ring */}
        <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="3 3" />
        {/* Search magnifying loop */}
        <circle cx="14" cy="14" r="7.5" stroke="currentColor" strokeWidth="2.5" />
        {/* Loupe handle */}
        <path d="M19.5 19.5L25 25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* Verified checkmark inside discovery loupe */}
        <path
          d="M10.5 14L13 16.5L17.5 11.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Civic sparkle node */}
        <circle cx="23" cy="9" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}

export function Logo({
  className,
  size = "md",
  variant = "dark",
  showText = true,
  href = "/",
}: LogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  const isLight = variant === "light";

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 group cursor-pointer select-none", className)}>
      <LogoIcon className={iconSizes[size]} />
      {showText && (
        <span
          className={cn(
            "font-display font-extrabold tracking-tight transition-colors duration-200",
            textSizes[size],
            isLight ? "text-white" : "text-[#5A3E2B]"
          )}
        >
          Scheme<span className="text-[#D5851F]">Find</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="SchemeFind Home">
        {content}
      </Link>
    );
  }

  return content;
}

