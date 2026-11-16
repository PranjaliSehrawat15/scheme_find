"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";

export function Navbar() {
  const { user, signOut, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname() || "";
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on path change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const initials = user?.user_metadata?.full_name
    ? (user.user_metadata.full_name as string)
      .split(" ")
      .map((n: string) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "U";

  async function handleSignOut() {
    setMenuOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    router.push("/");
  }

  const isDashboard = pathname === "/dashboard";
  const isHome = pathname === "/";
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const showBackButton = !!user && !loading && !isDashboard && !isHome && !isAuthPage;
  const showBackToHome = !user && !loading && !isHome && !isAuthPage && !pathname.startsWith("/schemes");

  function getNavLinkClass(href: string) {
    const isActive = pathname === href || (href !== "/" && href !== "/dashboard" && pathname.startsWith(href));
    return cn(
      "transition-all py-1.5 px-3 rounded-lg font-medium text-[13.5px]",
      isActive
        ? "text-[#D5851F] bg-[#D5851F]/10 font-semibold"
        : "text-[#5A3E2B]/75 hover:text-[#5A3E2B] hover:bg-[#5A3E2B]/5"
    );
  }

  return (
    <div className="sticky top-0 z-50 flex flex-col w-full shadow-xs">
      <header className="bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#5A3E2B]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Logo href={user ? "/dashboard" : "/"} size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <Link href="/dashboard" className={getNavLinkClass("/dashboard")}>
                  Dashboard
                </Link>
                <Link href="/schemes" className={getNavLinkClass("/schemes")}>
                  Browse Schemes
                </Link>
                <Link href="/documents" className={getNavLinkClass("/documents")}>
                  Document Vault
                </Link>
                <Link href="/chat" className={getNavLinkClass("/chat")}>
                  AI Assistant
                </Link>
                <Link href="/about" className={getNavLinkClass("/about")}>
                  About
                </Link>
              </>
            ) : (
              <>
                <Link href="/#how-it-works" className={getNavLinkClass("/#how-it-works")}>
                  How It Works
                </Link>
                <Link href="/schemes" className={getNavLinkClass("/schemes")}>
                  Browse Schemes
                </Link>
                <Link href="/chat" className={getNavLinkClass("/chat")}>
                  AI Assistant
                </Link>
                <Link href="/about" className={getNavLinkClass("/about")}>
                  About
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-8 w-8 rounded-full bg-slate-100 animate-pulse" />
            ) : user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full px-3 py-1.5 bg-[#FAF8F5] border border-[#5A3E2B]/15 hover:bg-[#5A3E2B]/5 transition-all cursor-pointer"
                  aria-label="User profile menu"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D5851F] text-[11px] font-bold text-white shadow-xs">
                    {initials}
                  </span>
                  <span className="hidden sm:block text-sm font-semibold text-[#5A3E2B] max-w-[120px] truncate">
                    {user.user_metadata?.full_name ?? user.email}
                  </span>
                  <svg className="h-3.5 w-3.5 text-[#5A3E2B]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-lg border border-[#5A3E2B]/10 py-1.5 z-50">
                    <div className="px-4 py-2.5 border-b border-[#5A3E2B]/10">
                      <p className="text-xs font-medium text-[#5A3E2B]/50">Signed in as</p>
                      <p className="text-xs font-semibold text-[#5A3E2B] truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#5A3E2B]/85 hover:bg-[#87A96B]/10 hover:text-[#5A3E2B] transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#5A3E2B]/85 hover:bg-[#87A96B]/10 hover:text-[#5A3E2B] transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/documents"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#5A3E2B]/85 hover:bg-[#87A96B]/10 hover:text-[#5A3E2B] transition-colors"
                    >
                      Document Vault
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#5A3E2B]/85 hover:bg-[#87A96B]/10 hover:text-[#5A3E2B] transition-colors"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-[#5A3E2B]/10 mt-1 cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-block px-4 py-2 text-sm font-semibold text-[#5A3E2B]/80 hover:text-[#D5851F] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#D5851F] to-[#E4A247] hover:from-[#B86C14] hover:to-[#D5851F] rounded-full active:scale-95 transition-all shadow-md shadow-[#D5851F]/20"
                >
                  Check Eligibility
                </Link>
              </>
            )}

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleTheme();
              }}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#5A3E2B]/15 bg-[#FAF8F5] text-[#5A3E2B] hover:bg-[#5A3E2B]/10 hover:border-[#D5851F]/40 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              {isDark ? (
                <svg className="h-4 w-4 text-[#D5851F] transition-transform duration-300 hover:rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-[#5A3E2B]/80 transition-transform duration-300 hover:-rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden relative" ref={mobileMenuRef}>
              <button
                onClick={() => setMobileMenuOpen((o) => !o)}
                className="p-2 rounded-lg text-[#5A3E2B]/80 hover:text-[#5A3E2B] hover:bg-[#5A3E2B]/5 transition-colors"
                aria-label="Open Navigation Menu"
              >
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>

              {mobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-[#5A3E2B]/10 py-2 z-50">
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-[#5A3E2B] hover:bg-[#D5851F]/10 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/schemes"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5A3E2B]/80 hover:bg-[#5A3E2B]/5 transition-colors"
                      >
                        Browse Schemes
                      </Link>
                      <Link
                        href="/documents"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5A3E2B]/80 hover:bg-[#5A3E2B]/5 transition-colors"
                      >
                        Document Vault
                      </Link>
                      <Link
                        href="/chat"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5A3E2B]/80 hover:bg-[#5A3E2B]/5 transition-colors"
                      >
                        AI Assistant
                      </Link>
                      <Link
                        href="/about"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5A3E2B]/80 hover:bg-[#5A3E2B]/5 transition-colors"
                      >
                        About
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 border-t border-[#5A3E2B]/10 mt-1"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/#how-it-works"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5A3E2B]/80 hover:bg-[#5A3E2B]/5 transition-colors"
                      >
                        How It Works
                      </Link>
                      <Link
                        href="/schemes"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5A3E2B]/80 hover:bg-[#5A3E2B]/5 transition-colors"
                      >
                        Browse Schemes
                      </Link>
                      <Link
                        href="/chat"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5A3E2B]/80 hover:bg-[#5A3E2B]/5 transition-colors"
                      >
                        AI Assistant
                      </Link>
                      <Link
                        href="/about"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5A3E2B]/80 hover:bg-[#5A3E2B]/5 transition-colors"
                      >
                        About
                      </Link>
                      <div className="border-t border-[#5A3E2B]/10 my-1 pt-1">
                        <Link
                          href="/login"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-[#5A3E2B] hover:bg-[#5A3E2B]/5 transition-colors"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-[#D5851F] hover:bg-[#D5851F]/10 transition-colors"
                        >
                          Check Eligibility
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Universal Back to Dashboard Header Strip for Logged-In Users on Sub-Pages */}
      {showBackButton && (
        <div className="bg-gradient-to-r from-[#FAF8F5] via-[#F4F7F1] to-white border-b border-[#87A96B]/20 px-6 lg:px-10 py-2.5 shadow-2xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#5A3E2B] hover:text-[#D5851F] transition-all py-0.5 group"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D5851F]/15 text-[#D5851F] group-hover:bg-[#D5851F] group-hover:text-white transition-colors shadow-2xs">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </span>
              <span>Back to Dashboard</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#5A3E2B]/70">
              <span>Citizen Workspace</span>
              <span className="h-2 w-2 rounded-full bg-[#87A96B] animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Back to Home Header Strip for Logged-Out Users on Sub-Pages */}
      {showBackToHome && (
        <div className="bg-gradient-to-r from-[#FAF8F5] via-white to-white border-b border-[#5A3E2B]/10 px-6 lg:px-10 py-2.5 shadow-2xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#5A3E2B] hover:text-[#D5851F] transition-all py-0.5 group"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5A3E2B]/10 text-[#5A3E2B] group-hover:bg-[#D5851F] group-hover:text-white transition-colors">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </span>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
