"use client";

import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, hint, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-[#5A3E2B]/90 dark:text-[#E8DCCF] mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1A16] border border-[#5A3E2B]/15 dark:border-white/15 rounded-xl text-sm text-[#5A3E2B] dark:text-[#F0E6DA] placeholder-[#5A3E2B]/40 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#D5851F]/30 focus:border-[#D5851F] transition-all ${className}`}
          {...props}
        />
        {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
