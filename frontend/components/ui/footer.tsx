"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="relative bg-[#22160E] text-[#ECE4DD] border-t border-[#5A3E2B]/40 mt-auto">
      {/* Top signature accent stripe: Sage Green, Amber Glow, Walnut Brown */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#87A96B] via-[#D5851F] to-[#5A3E2B]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 mb-12">
          {/* Brand & Mission (Col 1-5) */}
          <div className="md:col-span-5 space-y-4">
            <Logo variant="light" size="lg" href="/" />

            <p className="text-[#D8C8BB] text-sm leading-relaxed max-w-sm">
              An AI-powered welfare discovery engine simplifying access to government benefits across India. Reliable, transparent, and built to empower every citizen.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-[#87A96B]/30 px-3.5 py-1.5 text-xs font-semibold text-[#87A96B] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#87A96B] animate-pulse" />
                🇮🇳 Empowering Citizens Nationwide
              </span>
            </div>
          </div>

          {/* Platform Links (Col 6-7) */}
          <div className="md:col-span-2 md:col-start-7 space-y-4">
            <h4 className="font-bold text-xs tracking-wider uppercase text-white font-display">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/schemes" className="text-[#D8C8BB] hover:text-[#D5851F] hover:translate-x-0.5 inline-block transition-all duration-200">
                  Browse Schemes
                </Link>
              </li>
              <li>
                <Link href="/documents" className="text-[#D8C8BB] hover:text-[#D5851F] hover:translate-x-0.5 inline-block transition-all duration-200">
                  Document Vault
                </Link>
              </li>
              <li>
                <Link href="/chat" className="text-[#D8C8BB] hover:text-[#D5851F] hover:translate-x-0.5 inline-block transition-all duration-200">
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-[#D8C8BB] hover:text-[#D5851F] hover:translate-x-0.5 inline-block transition-all duration-200">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Citizens Links (Col 8-9) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-bold text-xs tracking-wider uppercase text-white font-display">
              Citizens
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/register" className="text-[#D8C8BB] hover:text-[#D5851F] hover:translate-x-0.5 inline-block transition-all duration-200">
                  Eligibility Check
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-[#D8C8BB] hover:text-[#D5851F] hover:translate-x-0.5 inline-block transition-all duration-200">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-[#D8C8BB] hover:text-[#D5851F] hover:translate-x-0.5 inline-block transition-all duration-200">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-[#D8C8BB] hover:text-[#D5851F] hover:translate-x-0.5 inline-block transition-all duration-200">
                  Citizen Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal (Col 10-12) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-bold text-xs tracking-wider uppercase text-white font-display">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-[#D8C8BB] hover:text-[#D5851F] hover:translate-x-0.5 inline-block transition-all duration-200">
                  About SchemeFind
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-[#D8C8BB] hover:text-[#D5851F] hover:translate-x-0.5 inline-block transition-all duration-200">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[#D8C8BB] hover:text-[#D5851F] hover:translate-x-0.5 inline-block transition-all duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#D8C8BB] hover:text-[#D5851F] hover:translate-x-0.5 inline-block transition-all duration-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#5A3E2B]/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#BAA99C]">
          <p>© 2026 SchemeFind. All rights reserved. Empowering citizen welfare discovery across India.</p>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-[#BAA99C]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#87A96B]" />
              All Systems Operational
            </span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
