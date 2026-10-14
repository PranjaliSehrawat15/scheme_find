"use client";

import React from "react";
import Link from "next/link";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  target,
  rel,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D5851F]/50 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[#D5851F] hover:bg-[#B86C14] text-white shadow-md shadow-[#D5851F]/25 active:scale-[0.98]",
    secondary:
      "bg-[#5A3E2B] hover:bg-[#483122] text-white shadow-md shadow-[#5A3E2B]/20 active:scale-[0.98]",
    outline:
      "border border-[#5A3E2B]/25 hover:border-[#5A3E2B]/40 text-[#5A3E2B] hover:bg-[#5A3E2B]/5 active:scale-[0.98]",
    ghost: "text-[#5A3E2B]/80 hover:text-[#5A3E2B] hover:bg-[#5A3E2B]/8",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} target={target} rel={rel}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
