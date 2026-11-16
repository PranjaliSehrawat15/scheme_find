"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ConfidenceBadge } from "@/components/ui/confidence-badge";
import { cn } from "@/lib/utils";

type Step = "form" | "results";

interface SchemeRule {
  id: string;
  name: string;
  description: string;
  minAge?: number;
  maxAge?: number;
  maxIncome?: number;
  state?: string; // If undefined, applies to all states (Central)
  baseConfidence: number;
  category: "education" | "skill" | "health" | "housing" | "pension" | "farmer" | "welfare";
}

const DEMO_SCHEMES: SchemeRule[] = [
  // ── Central: Youth / Education / Skill ──
  {
    id: "pmkvy",
    name: "PM Kaushal Vikas Yojana (PMKVY)",
    description: "Industry skill certification, practical training & ₹8,000 stipend for youth",
    minAge: 15,
    maxAge: 45,
    baseConfidence: 94,
    category: "skill",
  },
  {
    id: "post-matric",
    name: "Post-Matric Scholarship Scheme",
    description: "100% tuition fee reimbursement & monthly maintenance allowance for students",
    minAge: 15,
    maxAge: 30,
    maxIncome: 250000,
    baseConfidence: 92,
    category: "education",
  },
  {
    id: "naps",
    name: "National Apprenticeship Promotion Scheme",
    description: "On-the-job industrial stipend and skill development for youth (18–35)",
    minAge: 18,
    maxAge: 35,
    baseConfidence: 88,
    category: "skill",
  },

  // ── Central: Health & Welfare ──
  {
    id: "ayushman",
    name: "Ayushman Bharat PM-JAY",
    description: "Cashless hospital treatment up to ₹5 Lakh/family per year across India",
    minAge: 0,
    maxAge: 100,
    maxIncome: 500000,
    baseConfidence: 89,
    category: "health",
  },
  {
    id: "pmay",
    name: "Pradhan Mantri Awas Yojana (PMAY)",
    description: "Direct financial subsidy up to ₹1.2 Lakh to construct a pucca house",
    minAge: 18,
    maxAge: 75,
    maxIncome: 300000,
    baseConfidence: 86,
    category: "housing",
  },
  {
    id: "pm-svanidhi",
    name: "PM Street Vendor's AtmaNirbhar Nidhi",
    description: "Collateral-free working capital loan up to ₹50,000 with 7% interest subsidy",
    minAge: 18,
    maxAge: 65,
    maxIncome: 300000,
    baseConfidence: 85,
    category: "welfare",
  },
  {
    id: "pm-kisan",
    name: "PM-KISAN Samman Nidhi",
    description: "₹6,000/year direct income support in 3 equal installments for farmer families",
    minAge: 21,
    maxAge: 75,
    maxIncome: 400000,
    baseConfidence: 90,
    category: "farmer",
  },

  // ── Central: Senior Citizens ──
  {
    id: "ignoaps",
    name: "Indira Gandhi Old Age Pension Scheme",
    description: "Direct monthly pension for senior citizens (60+) from low-income families",
    minAge: 60,
    maxAge: 120,
    maxIncome: 200000,
    baseConfidence: 96,
    category: "pension",
  },
  {
    id: "pmvvy",
    name: "Pradhan Mantri Vaya Vandana Yojana",
    description: "Assured 7.4% annual pension interest & social security for senior citizens",
    minAge: 60,
    maxAge: 120,
    baseConfidence: 91,
    category: "pension",
  },

  // ── State-Specific: Uttar Pradesh ──
  {
    id: "up-abhyudaya",
    name: "UP Mukhyamantri Abhyudaya Scheme",
    description: "Free competitive coaching & digital tablet assistance for UP students",
    minAge: 16,
    maxAge: 35,
    state: "Uttar Pradesh",
    baseConfidence: 96,
    category: "education",
  },
  {
    id: "up-berojgari",
    name: "UP Berojgari Bhatta & CM Apprenticeship",
    description: "Monthly allowance of ₹2,500 and job training for unemployed UP youth",
    minAge: 18,
    maxAge: 35,
    maxIncome: 300000,
    state: "Uttar Pradesh",
    baseConfidence: 93,
    category: "welfare",
  },
  {
    id: "up-vridhajan",
    name: "UP Vridhajan Pension Yojana",
    description: "Monthly ₹1,000 social security pension for senior citizens in Uttar Pradesh",
    minAge: 60,
    maxAge: 120,
    maxIncome: 200000,
    state: "Uttar Pradesh",
    baseConfidence: 96,
    category: "pension",
  },

  // ── State-Specific: Odisha ──
  {
    id: "kalia",
    name: "KALIA Scheme (Odisha)",
    description: "₹10,000/year financial support for small farmers & labourers in Odisha",
    minAge: 18,
    maxAge: 75,
    maxIncome: 300000,
    state: "Odisha",
    baseConfidence: 95,
    category: "farmer",
  },
  {
    id: "bsky",
    name: "Biju Swasthya Kalyan Yojana (BSKY)",
    description: "Cashless healthcare coverage up to ₹10 Lakh for Odisha families",
    minAge: 0,
    maxAge: 100,
    maxIncome: 500000,
    state: "Odisha",
    baseConfidence: 93,
    category: "health",
  },

  // ── State-Specific: Bihar ──
  {
    id: "bihar-scc",
    name: "Bihar Student Credit Card Scheme",
    description: "Higher education loan up to ₹4 Lakh at 1% interest for Bihar youth",
    minAge: 18,
    maxAge: 25,
    state: "Bihar",
    baseConfidence: 96,
    category: "education",
  },
  {
    id: "kyp-bihar",
    name: "Kushal Yuva Program (KYP Bihar)",
    description: "Computer, soft skills & language communication training with stipend",
    minAge: 15,
    maxAge: 28,
    state: "Bihar",
    baseConfidence: 93,
    category: "skill",
  },

  // ── State-Specific: Maharashtra ──
  {
    id: "mjpjay",
    name: "Mahatma Jyotirao Phule Jan Arogya Yojana",
    description: "Cashless medical treatment up to ₹5 Lakh for Maharashtra families",
    minAge: 0,
    maxAge: 100,
    maxIncome: 500000,
    state: "Maharashtra",
    baseConfidence: 95,
    category: "health",
  },
  {
    id: "mahadbt",
    name: "MahaDBT Post-Matric Scholarship",
    description: "Full tuition & exam fee reimbursement for Maharashtra students",
    minAge: 16,
    maxAge: 30,
    maxIncome: 250000,
    state: "Maharashtra",
    baseConfidence: 94,
    category: "education",
  },

  // ── State-Specific: Madhya Pradesh ──
  {
    id: "mp-seekho-kamao",
    name: "MP Mukhyamantri Seekho Kamao Yojana",
    description: "On-the-job training with ₹8,000 to ₹10,000 monthly stipend for MP youth",
    minAge: 18,
    maxAge: 29,
    state: "Madhya Pradesh",
    baseConfidence: 95,
    category: "skill",
  },
  {
    id: "ladli-behna",
    name: "Ladli Behna Yojana (Madhya Pradesh)",
    description: "Direct monthly financial transfer of ₹1,250 for women in Madhya Pradesh",
    minAge: 21,
    maxAge: 60,
    maxIncome: 250000,
    state: "Madhya Pradesh",
    baseConfidence: 93,
    category: "welfare",
  },

  // ── State-Specific: Rajasthan ──
  {
    id: "raj-yuva-sambal",
    name: "Mukhyamantri Yuva Sambal Yojana (Rajasthan)",
    description: "Monthly unemployment allowance up to ₹4,500 for Rajasthan graduates",
    minAge: 18,
    maxAge: 35,
    maxIncome: 200000,
    state: "Rajasthan",
    baseConfidence: 94,
    category: "welfare",
  },
  {
    id: "raj-vridhjan",
    name: "Rajasthan Mukhyamantri Vridhjan Samman Pension",
    description: "Monthly social security pension for senior citizens in Rajasthan",
    minAge: 58,
    maxAge: 120,
    maxIncome: 200000,
    state: "Rajasthan",
    baseConfidence: 96,
    category: "pension",
  },

  // ── State-Specific: Tamil Nadu ──
  {
    id: "cmchis-tn",
    name: "CM Comprehensive Health Insurance (TN)",
    description: "Cashless hospital cover up to ₹5 Lakh for low-income Tamil Nadu families",
    minAge: 0,
    maxAge: 100,
    maxIncome: 500000,
    state: "Tamil Nadu",
    baseConfidence: 95,
    category: "health",
  },
  {
    id: "tn-pudhumai-penn",
    name: "Pudhumai Penn Scheme (Tamil Nadu)",
    description: "Monthly ₹1,000 financial aid for girl students pursuing higher education",
    minAge: 17,
    maxAge: 25,
    state: "Tamil Nadu",
    baseConfidence: 94,
    category: "education",
  },

  // ── State-Specific: Karnataka ──
  {
    id: "kar-yuva-nidhi",
    name: "Yuva Nidhi Scheme (Karnataka)",
    description: "Monthly unemployment assistance up to ₹3,000 for Karnataka graduates",
    minAge: 18,
    maxAge: 30,
    state: "Karnataka",
    baseConfidence: 95,
    category: "welfare",
  },
  {
    id: "kar-arogya",
    name: "Ayushman Bharat - Arogya Karnataka",
    description: "Free secondary & tertiary healthcare treatment for Karnataka residents",
    minAge: 0,
    maxAge: 100,
    maxIncome: 500000,
    state: "Karnataka",
    baseConfidence: 92,
    category: "health",
  },
];

const STATES = [
  "Uttar Pradesh",
  "Maharashtra",
  "Bihar",
  "Madhya Pradesh",
  "Rajasthan",
  "Odisha",
  "West Bengal",
  "Tamil Nadu",
  "Karnataka",
  "Gujarat",
  "Andhra Pradesh",
  "Telangana",
  "Kerala",
  "Punjab",
  "Haryana",
  "Delhi",
  "Jharkhand",
  "Chhattisgarh",
  "Uttarakhand",
  "Assam",
  "Himachal Pradesh",
  "Other / All India",
];

function parseIncome(val: string): number {
  if (!val) return 0;
  const clean = val.replace(/[^0-9.LkK]/gi, "").trim().toLowerCase();
  if (clean.endsWith("l")) {
    return (parseFloat(clean) || 0) * 100000;
  }
  if (clean.endsWith("k")) {
    return (parseFloat(clean) || 0) * 1000;
  }
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

export function DemoWidget() {
  const [step, setStep] = useState<Step>("form");
  const [age, setAge] = useState("19");
  const [income, setIncome] = useState("0");
  const [state, setState] = useState("Uttar Pradesh");
  const [animating, setAnimating] = useState(false);

  // Deterministically match schemes based on real user parameters
  const matchedSchemes = useMemo(() => {
    const ageNum = parseInt(age, 10) || 20;
    const incomeNum = parseIncome(income);
    const selectedState = state.trim();

    // 1. Strict filtering
    const eligible = DEMO_SCHEMES.filter((scheme) => {
      // State rule: if scheme is state-specific, it MUST match the selected state
      if (scheme.state && scheme.state.toLowerCase() !== selectedState.toLowerCase()) {
        return false;
      }
      // Age rule
      if (scheme.minAge !== undefined && ageNum < scheme.minAge) return false;
      if (scheme.maxAge !== undefined && ageNum > scheme.maxAge) return false;
      // Income rule
      if (scheme.maxIncome !== undefined && incomeNum > scheme.maxIncome) return false;

      return true;
    });

    // 2. Score adjustments and ranking
    const scored = eligible.map((scheme) => {
      let finalConfidence = scheme.baseConfidence;

      // State-specific schemes get priority bonus
      if (scheme.state) {
        finalConfidence = Math.min(98, finalConfidence + 2);
      }

      // Demographic contextual boosts
      if (ageNum <= 24 && (scheme.category === "education" || scheme.category === "skill")) {
        finalConfidence = Math.min(97, finalConfidence + 2);
      }
      if (ageNum >= 60 && scheme.category === "pension") {
        finalConfidence = Math.min(98, finalConfidence + 2);
      }
      if (incomeNum === 0 && (scheme.category === "education" || scheme.category === "health")) {
        finalConfidence = Math.min(96, finalConfidence + 1);
      }

      return {
        id: scheme.id,
        name: scheme.name,
        confidence: finalConfidence, // Integer 0-100 for ConfidenceBadge
        description: scheme.description,
      };
    });

    // 3. Sort by highest confidence and return top 3-4 schemes
    scored.sort((a, b) => b.confidence - a.confidence);

    if (scored.length === 0) {
      // Fallback safe universal scheme
      return [
        {
          id: "ayushman-fallback",
          name: "Ayushman Bharat PM-JAY",
          confidence: 88,
          description: "Universal healthcare coverage up to ₹5 Lakh per family per year",
        },
      ];
    }

    return scored.slice(0, 3);
  }, [age, income, state]);

  function handleCheck() {
    setAnimating(true);
    setTimeout(() => {
      setStep("results");
      setAnimating(false);
    }, 800);
  }

  function handleReset() {
    setStep("form");
  }

  const requestId = useMemo(() => {
    const code = state.slice(0, 2).toUpperCase() || "IN";
    return `req_${code}_${age}y_${Math.random().toString(36).substring(2, 6)}`;
  }, [state, age, step]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-navy/10 bg-white shadow-lg shadow-ink-navy/5">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-signal-orange via-petal-gold to-verified-teal" />

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-blue-400">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Live demo — see how it works
        </div>

        {step === "form" && (
          <div className={cn("space-y-4 transition-opacity", animating && "opacity-50")}>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-blue">Your age</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full rounded-lg border-2 border-ink-navy/10 bg-warm-paper/50 px-3 py-2 text-sm text-ink-navy focus:border-signal-orange focus:outline-none"
                  aria-label="Your age"
                  placeholder="e.g. 19"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-blue">Annual income (₹)</label>
                <input
                  type="text"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full rounded-lg border-2 border-ink-navy/10 bg-warm-paper/50 px-3 py-2 text-sm text-ink-navy focus:border-signal-orange focus:outline-none"
                  aria-label="Annual income"
                  placeholder="e.g. 0 or 2,50,000"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-blue">Your state</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-lg border-2 border-ink-navy/10 bg-warm-paper/50 px-3 py-2 text-sm text-ink-navy focus:border-signal-orange focus:outline-none"
                  aria-label="Your state"
                >
                  {STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleCheck}
              disabled={animating}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-signal-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-signal-orange-600 active:bg-signal-orange-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {animating ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Matching deterministic rules...
                </>
              ) : (
                <>
                  Check eligibility
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}

        {step === "results" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink-navy">
                You may qualify for{" "}
                <span className="text-signal-orange">{matchedSchemes.length} schemes</span>{" "}
                in <span className="underline decoration-signal-orange/40">{state}</span>
              </p>
              <button
                onClick={handleReset}
                className="text-xs font-medium text-slate-blue-400 underline underline-offset-2 hover:text-ink-navy transition-colors"
              >
                Try again
              </button>
            </div>

            <div className="space-y-2">
              {matchedSchemes.map((scheme) => (
                <div
                  key={scheme.id}
                  className="flex items-center gap-3 rounded-lg border border-ink-navy/8 bg-warm-paper/50 p-3 transition-colors hover:border-ink-navy/15"
                >
                  <ConfidenceBadge score={scheme.confidence} size="sm" showLabel={false} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-navy">{scheme.name}</p>
                    <p className="truncate text-xs text-slate-blue-400">{scheme.description}</p>
                  </div>
                  <Link
                    href={`/schemes?search=${encodeURIComponent(scheme.name.split(" ")[0])}`}
                    className="group-hover:translate-x-0.5 text-slate-blue-400 transition-transform"
                    title="View scheme details"
                  >
                    <svg
                      className="h-4 w-4 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between pt-1 gap-2">
              <p className="text-xs text-slate-blue-400">
                Calculated deterministically based on your age ({age}), income (₹{income}), and {state}.
              </p>
              <Link
                href="/register"
                className="text-xs font-semibold text-signal-orange hover:underline inline-flex items-center gap-1"
              >
                Explore all 4,700+ schemes →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Terminal-style status bar */}
      <div className="border-t border-ink-navy/8 bg-ink-navy/5 px-5 py-2 sm:px-6 flex items-center justify-between">
        <span className="font-mono text-[11px] text-slate-blue-400">
          {step === "results"
            ? `✓ deterministic match • ${requestId} • ${matchedSchemes.length} qualifying schemes`
            : "⏎ enter your details above →"}
        </span>
        {step === "results" && (
          <span className="font-mono text-[10px] text-verified-teal hidden sm:inline">
            100% rule-verified
          </span>
        )}
      </div>
    </div>
  );
}
