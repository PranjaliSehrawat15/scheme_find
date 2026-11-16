"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { getUserMatches, refreshUserMatches, listDocuments, type EligibilityMatch, type UserDocument } from "@/lib/api";
import { getCategoryInfo, normalizeCategoryKey } from "@/lib/categories";

// ─── GSAP entrance ───────────────────────────────────────────────────────────
const useGSAPAnimation = (pageRef: React.RefObject<HTMLDivElement | null>, deps: unknown[]) => {
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      const gsap = (await import("gsap")).default;
      try {
        const ctx = gsap.context(() => {
          gsap.fromTo(".db-hero", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", clearProps: "all" });
          gsap.fromTo(".db-stat", { opacity: 0, y: 16, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.08, delay: 0.2, ease: "power2.out", clearProps: "all" });
          gsap.fromTo(".db-section", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.35, ease: "power2.out", clearProps: "all" });
        }, pageRef);
        cleanup = () => ctx.revert();
      } catch { return; }
    })();
    return () => { cleanup?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

function formatTimeAgo(isoString?: string | null) {
  if (!isoString) return null;
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSecs = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffSecs < 60) return "just now";
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch { return null; }
}

// ─── Score ring component ─────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const pct = score > 0 && score <= 1 ? Math.round(score * 100) : Math.round(score || 0);
  const r = 18;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct >= 70 ? "#87A96B" : pct >= 40 ? "#D5851F" : "#C48B60";
  return (
    <svg width="48" height="48" className="shrink-0" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r={r} fill="none" className="stroke-[#F1F5F9] dark:stroke-white/10" strokeWidth="5" />
      <circle
        cx="24" cy="24" r={r} fill="none"
        stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 24 24)"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text x="24" y="28" textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>{pct}%</text>
    </svg>
  );
}

// ─── Document badge component ─────────────────────────────────────────────────
const DOC_LABELS: Record<string, string> = {
  aadhaar: "Aadhaar",
  income_certificate: "Income Cert.",
  caste_certificate: "Caste Cert.",
  ration_card: "Ration Card",
  domicile_certificate: "Domicile",
  disability_certificate: "Disability",
  land_record: "Land Record",
  bank_passbook: "Bank Passbook",
  voter_id: "Voter ID",
  education_marksheet: "Marksheet",
};
function docLabel(key: string) { return DOC_LABELS[key] ?? key.replace(/_/g, " "); }

function DocStatusBadge({ status }: { status: string }) {
  if (status === "verified") return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#87A96B]/15 px-2 py-0.5 text-[11px] font-semibold text-[#3D522D]">
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M5 13l4 4L19 7" /></svg>
      Verified
    </span>
  );
  if (status === "rejected") return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-500">Failed</span>
  );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#D5851F]/15 px-2 py-0.5 text-[11px] font-semibold text-[#92520B]">
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
      Pending
    </span>
  );
}


// ─── Main page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { session, user } = useAuth();
  const pageRef = useRef<HTMLDivElement>(null);
  const [matches, setMatches] = useState<EligibilityMatch[]>([]);
  const [docs, setDocs] = useState<UserDocument[]>([]);
  const [filter, setFilter] = useState<"all" | "ready" | "pending">("all");
  const [category, setCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, category]);

  useEffect(() => {
    if (!session?.access_token) return;
    Promise.all([getUserMatches(session.access_token), listDocuments(session.access_token)])
      .then(([m, d]) => {
        setMatches(m);
        setDocs(d);
        if (m[0]?.matched_at) setLastRefreshed(m[0].matched_at);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session?.access_token]);

  useGSAPAnimation(pageRef, [matches]);

  const toggleExpanded = useCallback((id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  }, []);

  const handleRefresh = async () => {
    if (!session?.access_token || refreshing) return;
    setRefreshing(true);
    setRefreshMsg(null);
    try {
      const res = await refreshUserMatches(session.access_token);
      if (res.status === "error") {
        setRefreshMsg({ type: res.retry_after_seconds ? "info" : "error", text: res.message || "Failed to refresh matches." });
        if (res.last_refreshed) setLastRefreshed(res.last_refreshed);
      } else {
        const m = await getUserMatches(session.access_token);
        setMatches(m);
        if (res.last_refreshed || m[0]?.matched_at) setLastRefreshed(res.last_refreshed || m[0]?.matched_at || null);
        setRefreshMsg({ type: "success", text: res.message || `Found ${m.length} eligible schemes!` });
      }
    } catch {
      setRefreshMsg({ type: "error", text: "Network error while refreshing matches." });
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-white to-warm-paper dark:from-[#0E0C0A] dark:to-[#161311]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-orange-100 dark:border-white/20 border-t-orange-500" />
            <p className="text-sm font-medium text-slate-500 dark:text-[#C7B8AA]">Loading your dashboard…</p>
          </div>
        </main>
      </div>
    );
  }

  const totalMatches = matches.length;
  const readyCount = matches.filter((m) => m.missing_documents.length === 0).length;
  const pendingCount = matches.filter((m) => m.missing_documents.length > 0).length;
  const appliedCount = matches.filter((m) => m.application_status === "applied" || m.application_status === "approved").length;
  const verifiedDocs = docs.filter((d) => d.verification_status === "verified").length;
  const allMissingDocs = Array.from(new Set(matches.flatMap((m) => m.missing_documents)));
  const docsVerifiedPct = docs.length > 0 ? Math.round((verifiedDocs / docs.length) * 100) : 0;

  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? "there";

  // Derive unique categories dynamically from actual matched schemes
  const availableCategories: string[] = Array.from(
    new Set(matches.map((m) => normalizeCategoryKey(m.scheme_category)).filter((c) => c && c !== "all"))
  ).sort();

  // Combined filter: status × category
  const filteredMatches = matches.filter((m) => {
    const passStatus =
      filter === "all" ||
      (filter === "ready" && m.missing_documents.length === 0) ||
      (filter === "pending" && m.missing_documents.length > 0);
    const passCategory = category === "all" || normalizeCategoryKey(m.scheme_category) === category;
    return passStatus && passCategory;
  });

  const ITEMS_PER_PAGE = 15;
  const totalPages = Math.ceil(filteredMatches.length / ITEMS_PER_PAGE);
  const paginatedMatches = filteredMatches.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#FAF8F5] dark:bg-[#0E0C0A]">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

        {/* ── Hero Banner ─────────────────────────────────────────────────── */}
        <div className="db-hero relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4A3222] via-[#5A3E2B] to-[#38261A] px-6 py-8 sm:px-10 sm:py-10 text-white shadow-xl mb-8">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#D5851F]/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-[#87A96B]/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <p className="text-sm font-medium text-[#D5851F]">Welcome back 👋</p>
                {lastRefreshed && (
                  <span className="text-[11px] font-semibold text-[#D8C8BB] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                    Updated {formatTimeAgo(lastRefreshed)}
                  </span>
                )}
              </div>
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl text-white">
                Hi, {firstName}!
              </h1>
              <p className="mt-2 text-sm text-[#ECE4DD] max-w-md leading-relaxed">
                {totalMatches > 0
                  ? `You match ${totalMatches} government scheme${totalMatches !== 1 ? "s" : ""}. ${readyCount > 0 ? `${readyCount} ${readyCount === 1 ? "is" : "are"} ready to apply right now.` : "Upload missing documents to unlock applications."}`
                  : "Complete your profile to discover schemes you qualify for."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                title="Re-run matching agent on your latest profile"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 disabled:opacity-60 transition-all cursor-pointer"
              >
                <svg className={cn("h-4 w-4", refreshing && "animate-spin")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                {refreshing ? "Refreshing…" : "Refresh"}
              </button>
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 transition-all"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Edit Profile
              </Link>
              <Link
                href="/documents"
                className="inline-flex items-center gap-2 rounded-xl bg-[#D5851F] hover:bg-[#B86C14] px-4 py-2.5 text-sm font-bold text-white transition-all shadow-lg shadow-[#D5851F]/30"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 4v16m8-8H4"/></svg>
                Upload Docs
              </Link>
            </div>
          </div>

          {refreshMsg && (
            <div className={cn(
              "relative z-10 mt-5 rounded-xl px-4 py-3 text-xs font-semibold flex items-center justify-between backdrop-blur border transition-all",
              refreshMsg.type === "success" && "bg-[#87A96B]/20 text-[#E6EEDF] border-[#87A96B]/40",
              refreshMsg.type === "info" && "bg-[#D5851F]/20 text-[#FCEFD8] border-[#D5851F]/40",
              refreshMsg.type === "error" && "bg-rose-500/20 text-rose-200 border-rose-400/30"
            )}>
              <span>{refreshMsg.text}</span>
              <button onClick={() => setRefreshMsg(null)} className="opacity-70 hover:opacity-100 ml-3">✕</button>
            </div>
          )}
        </div>

        {/* ── Stats Row ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
          {[
            {
              label: "Applied Schemes",
              value: appliedCount,
              icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              ),
              iconBg: "bg-[#D5851F]",
              valColor: "text-[#D5851F]",
              href: undefined,
            },
            {
              label: "Ready to Apply",
              value: readyCount,
              icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
              ),
              iconBg: "bg-[#87A96B]",
              valColor: "text-[#55703F]",
              href: undefined,
            },
            {
              label: "Need Documents",
              value: pendingCount,
              icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
              ),
              iconBg: "bg-[#D5851F]/80",
              valColor: "text-[#B86C14]",
              href: "/documents",
            },
            {
              label: "Docs Verified",
              value: `${verifiedDocs}/${docs.length || "—"}`,
              icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              ),
              iconBg: "bg-[#5A3E2B]",
              valColor: "text-[#5A3E2B] dark:text-[#F0E6DA]",
              href: "/documents",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={cn(
                "db-stat relative overflow-hidden rounded-2xl bg-white dark:bg-[#161311] border border-[#5A3E2B]/10 dark:border-white/10 p-5 shadow-sm",
                stat.href && "hover:shadow-md dark:hover:shadow-black/40 hover:border-[#5A3E2B]/25 dark:hover:border-white/20 transition-all cursor-pointer group"
              )}
              onClick={stat.href ? () => window.location.href = stat.href! : undefined}
            >
              <div className="flex items-start justify-between">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl text-white", stat.iconBg)}>
                  {stat.icon}
                </div>
                {stat.href && (
                  <svg className="h-4 w-4 text-[#5A3E2B]/40 dark:text-[#C7B8AA] group-hover:text-[#5A3E2B] dark:group-hover:text-[#F0E6DA] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6"/></svg>
                )}
              </div>
              <p className={cn("mt-3 text-2xl font-bold font-display", stat.valColor)}>{stat.value}</p>
              <p className="text-xs font-medium text-[#5A3E2B]/70 dark:text-[#C7B8AA] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── Two-column layout ───────────────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* ── Left: Scheme Cards (2/3 width) ─────────────────────────── */}
          <div className="lg:col-span-2 db-section space-y-4">
            {/* ── Header row with title + status pills ── */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-lg font-bold text-[#5A3E2B] dark:text-[#F0E6DA]">
                Matched Schemes
                <span className="ml-2 text-sm font-normal text-[#5A3E2B]/50 dark:text-[#A8988B]">({filteredMatches.length})</span>
              </h2>
              {/* Status filter pills */}
              <div className="flex gap-1.5 rounded-xl bg-[#5A3E2B]/10 dark:bg-white/10 p-1 self-start">
                {(["all", "ready", "pending"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "rounded-lg px-3 py-1 text-xs font-semibold transition-all capitalize cursor-pointer",
                      filter === f
                        ? "bg-white dark:bg-[#221D19] text-[#5A3E2B] dark:text-[#F0E6DA] shadow-sm"
                        : "text-[#5A3E2B]/70 dark:text-[#C7B8AA] hover:text-[#5A3E2B] dark:hover:text-[#F0E6DA]"
                    )}
                  >
                    {f === "all" ? "All" : f === "ready" ? `✅ Ready (${readyCount})` : `⏳ Pending (${pendingCount})`}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Category filter pills (dynamic, from actual data) ── */}
            {availableCategories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategory("all")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all cursor-pointer",
                    category === "all"
                      ? "border-[#5A3E2B] bg-[#5A3E2B] text-white shadow-sm dark:bg-[#D5851F] dark:border-[#D5851F]"
                      : "border-[#5A3E2B]/15 bg-white text-[#5A3E2B]/75 hover:border-[#5A3E2B]/30 hover:bg-[#FAF8F5] dark:border-white/15 dark:bg-[#1A1613] dark:text-[#C7B8AA] dark:hover:bg-[#221D19] dark:hover:text-[#F0E6DA]"
                  )}
                >
                  All Categories
                </button>
                {availableCategories.map((cat) => {
                  const info = getCategoryInfo(cat);
                  const count = matches.filter(
                    (m) =>
                      normalizeCategoryKey(m.scheme_category) === cat &&
                      (filter === "all" ||
                        (filter === "ready" && m.missing_documents.length === 0) ||
                        (filter === "pending" && m.missing_documents.length > 0))
                  ).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all cursor-pointer",
                        category === cat
                          ? `${info.badge} border-transparent shadow-sm ring-1 ring-current/20`
                          : "border-slate-200 dark:border-white/10 bg-white dark:bg-[#1A1613] text-slate-600 dark:text-[#C7B8AA] hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-[#221D19]"
                      )}
                    >
                      <span>{info.icon}</span>
                      <span>{info.label}</span>
                      <span className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                        category === cat ? "bg-black/10" : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-[#E8DCCF]"
                      )}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {filteredMatches.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-[#161311] p-10 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-[#221D19]">
                  <svg className="h-6 w-6 text-slate-400 dark:text-[#C7B8AA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                </div>
                <p className="font-semibold text-slate-700 dark:text-[#F0E6DA]">{totalMatches === 0 ? "No matches yet" : "No schemes in this filter"}</p>
                <p className="mt-1 text-sm text-slate-400 dark:text-[#A8988B]">
                  {totalMatches === 0 ? "Complete your profile to see matched schemes." : "Try changing the status or category filter above."}
                </p>
                {totalMatches === 0 ? (
                  <Link href="/profile" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600 transition-all cursor-pointer">
                    Complete Profile
                  </Link>
                ) : (
                  <button
                    onClick={() => { setFilter("all"); setCategory("all"); }}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#1A1613] px-4 py-2 text-sm font-semibold text-slate-600 dark:text-[#F0E6DA] hover:bg-slate-50 dark:hover:bg-[#221D19] transition-all cursor-pointer"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              paginatedMatches.map((m) => {
                const isOpen = expanded === m.scheme_id;
                const isReady = m.missing_documents.length === 0;
                const info = getCategoryInfo(m.scheme_category);
                return (
                  <div
                    key={m.scheme_id}
                    className={cn(
                      "rounded-2xl border bg-white dark:bg-[#161311] shadow-sm transition-all duration-200",
                      isOpen ? "border-orange-200 dark:border-[#D5851F]/40 shadow-md" : "border-slate-100 dark:border-white/10 hover:border-slate-200 dark:hover:border-white/20 hover:shadow-md"
                    )}
                  >
                    <button
                      onClick={() => toggleExpanded(m.scheme_id)}
                      className="flex w-full items-start gap-4 px-5 py-4 text-left sm:items-center cursor-pointer"
                    >
                      {/* Score ring */}
                      <ScoreRing score={m.match_score} />

                      {/* Scheme info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border", info.badge)}>
                            <span>{info.icon}</span>
                            <span>{info.label}</span>
                          </span>
                          {isReady ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#87A96B]/15 dark:bg-[#87A96B]/25 px-2 py-0.5 text-[11px] font-semibold text-[#3D522D] dark:text-[#A7D18C]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#87A96B]" />
                              Ready to Apply
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#D5851F]/15 dark:bg-[#D5851F]/25 px-2 py-0.5 text-[11px] font-semibold text-[#92520B] dark:text-[#F3B768]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#D5851F]" />
                              {m.missing_documents.length} doc{m.missing_documents.length !== 1 ? "s" : ""} needed
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-[#5A3E2B] dark:text-[#F0E6DA] leading-snug">{m.scheme_name}</p>
                        <p className="text-xs text-[#5A3E2B]/60 dark:text-[#A8988B] mt-0.5 truncate">{m.issuing_authority}</p>
                      </div>

                      {/* Chevron */}
                      <svg
                        className={cn("h-5 w-5 shrink-0 text-[#5A3E2B]/40 dark:text-[#C7B8AA] transition-transform duration-300", isOpen && "rotate-180")}
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>

                    {/* Expanded details */}
                    {isOpen && (
                      <div className="border-t border-[#5A3E2B]/10 dark:border-white/10 px-5 py-5 space-y-4">
                        <p className="text-sm text-[#5A3E2B]/85 dark:text-[#C7B8AA] leading-relaxed">{m.benefit_summary}</p>

                        {m.missing_documents.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-[#D5851F] uppercase tracking-wider mb-2">Missing Documents</p>
                            <div className="flex flex-wrap gap-2">
                              {m.missing_documents.map((doc) => (
                                <span
                                  key={doc}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#D5851F]/10 border border-[#D5851F]/25 px-2.5 py-1 text-xs font-semibold text-[#92520B]"
                                >
                                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                                  {docLabel(doc)}
                                </span>
                              ))}
                            </div>
                            <Link href="/documents" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#D5851F] hover:text-[#B86C14] transition-colors">
                              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 4v16m8-8H4"/></svg>
                              Upload missing documents →
                            </Link>
                          </div>
                        )}

                        <div className="flex gap-2 pt-1">
                          {m.application_url && (
                            <a
                              href={m.application_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-xl border border-[#5A3E2B]/20 bg-white px-4 py-2 text-xs font-semibold text-[#5A3E2B] hover:border-[#5A3E2B]/40 hover:bg-[#FAF8F5] transition-all"
                            >
                              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                              View Scheme
                            </a>
                          )}
                          {isReady && (
                            <button className="inline-flex items-center gap-2 rounded-xl bg-[#87A96B] px-4 py-2 text-xs font-bold text-white hover:bg-[#6E8E53] transition-all shadow-sm">
                              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 13l4 4L19 7"/></svg>
                              Mark as Applied
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-[#5A3E2B]/10 pt-4 mt-6">
                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={currentPage === 1}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#5A3E2B]/15 bg-white text-[#5A3E2B] hover:bg-[#FAF8F5] disabled:opacity-50 disabled:hover:bg-white transition-all shadow-sm"
                  aria-label="Previous page"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M15 19l-7-7 7-7"/></svg>
                </button>
                <span className="text-xs font-semibold text-[#5A3E2B]/70">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={currentPage === totalPages}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#5A3E2B]/15 bg-white text-[#5A3E2B] hover:bg-[#FAF8F5] disabled:opacity-50 disabled:hover:bg-white transition-all shadow-sm"
                  aria-label="Next page"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            )}
          </div>

          {/* ── Right sidebar (1/3 width) ───────────────────────────────── */}
          <div className="space-y-5 db-section">

            {/* Document progress card */}
            <div className="rounded-2xl bg-white dark:bg-[#161311] border border-[#5A3E2B]/10 dark:border-white/10 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-sm font-bold text-[#5A3E2B] dark:text-[#F0E6DA]">Document Progress</h3>
                <Link href="/documents" className="text-xs font-semibold text-[#D5851F] hover:text-[#B86C14] transition-colors">
                  View all →
                </Link>
              </div>

              {/* Radial-ish ring for verified % */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" fill="none" className="stroke-[#F8F5F2] dark:stroke-white/10" strokeWidth="8" />
                    <circle
                      cx="32" cy="32" r="26" fill="none"
                      stroke={docsVerifiedPct === 100 ? "#87A96B" : "#D5851F"}
                      strokeWidth="8"
                      strokeDasharray={`${(docsVerifiedPct / 100) * 163.4} 163.4`}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dasharray 0.8s ease" }}
                    />
                  </svg>
                  <span className="absolute text-sm font-bold text-[#5A3E2B] dark:text-[#F0E6DA]">{docsVerifiedPct}%</span>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#5A3E2B] dark:text-[#F0E6DA]">{verifiedDocs}<span className="text-[#5A3E2B]/50 dark:text-[#A8988B] font-normal text-sm">/{docs.length}</span></p>
                  <p className="text-xs text-[#5A3E2B]/70 dark:text-[#C7B8AA]">Verified</p>
                  {docs.length < 10 && (
                    <p className="text-[11px] text-[#D5851F] font-medium mt-0.5">{10 - docs.length} more to upload</p>
                  )}
                </div>
              </div>

              {docs.length > 0 ? (
                <div className="space-y-2">
                  {docs.slice(0, 5).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between py-1">
                      <p className="text-xs font-medium text-slate-700 dark:text-[#C7B8AA] capitalize truncate mr-2">{docLabel(doc.doc_type)}</p>
                      <DocStatusBadge status={doc.verification_status ?? "pending"} />
                    </div>
                  ))}
                  {docs.length > 5 && (
                    <Link href="/documents" className="block text-center text-xs font-semibold text-orange-500 hover:text-orange-600 pt-1 transition-colors">
                      +{docs.length - 5} more →
                    </Link>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-slate-200 dark:border-white/15 p-4 text-center">
                  <p className="text-xs font-medium text-slate-500 dark:text-[#A8988B]">No documents yet</p>
                  <Link href="/documents" className="mt-2 inline-block text-xs font-bold text-orange-500 hover:underline">
                    Upload now →
                  </Link>
                </div>
              )}
            </div>

            {/* Missing docs summary */}
            {allMissingDocs.length > 0 && (
              <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-200 uppercase tracking-wide">Upload to unlock {pendingCount} scheme{pendingCount !== 1 ? "s" : ""}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {allMissingDocs.slice(0, 6).map((doc) => (
                        <span key={doc} className="rounded-lg bg-amber-100 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-700/50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:text-amber-200">{docLabel(doc)}</span>
                      ))}
                      {allMissingDocs.length > 6 && (
                        <span className="rounded-lg bg-amber-100 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-700/50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:text-amber-200">+{allMissingDocs.length - 6} more</span>
                      )}
                    </div>
                    <Link href="/documents" className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600 transition-all cursor-pointer">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 4v16m8-8H4"/></svg>
                      Upload Documents
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Quick actions */}
            <div className="rounded-2xl bg-white dark:bg-[#161311] border border-[#5A3E2B]/10 dark:border-white/10 p-5 shadow-sm">
              <h3 className="font-display text-sm font-bold text-[#5A3E2B] dark:text-[#F0E6DA] mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { href: "/chat", label: "Ask AI Assistant", sub: "Get scheme guidance instantly", icon: "💬", badge: "" },
                  { href: "/schemes", label: "Browse All Schemes", sub: "Explore the full database", icon: "🔍", badge: "" },
                  { href: "/profile", label: "Update Profile", sub: "Keep your details current", icon: "✏️", badge: "" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl border border-[#5A3E2B]/10 dark:border-white/10 p-3 hover:border-[#D5851F]/30 dark:hover:border-white/20 hover:bg-[#D5851F]/5 dark:hover:bg-white/5 transition-all group"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#5A3E2B] dark:text-[#F0E6DA] group-hover:text-[#D5851F] dark:group-hover:text-[#E8952B] transition-colors">{item.label}</p>
                      <p className="text-[11px] text-[#5A3E2B]/60 dark:text-[#A8988B]">{item.sub}</p>
                    </div>
                    <svg className="h-4 w-4 shrink-0 text-[#5A3E2B]/40 dark:text-[#C7B8AA] group-hover:text-[#D5851F] dark:group-hover:text-[#E8952B] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6"/></svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tip card */}
            <div className="rounded-2xl bg-gradient-to-br from-[#0F2645] to-[#1E487A] border border-white/10 p-5 text-white">
              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-300 mb-2">💡 Pro Tip</p>
              <p className="text-sm font-semibold leading-relaxed">
                Upload your <span className="text-orange-300">Income Certificate</span> — it unlocks the most schemes. Most means-tested benefits require it.
              </p>
              <Link
                href="/documents"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-orange-300 hover:text-orange-200 transition-colors"
              >
                Upload now →
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
