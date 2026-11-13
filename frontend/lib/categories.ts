export type CategoryKey =
  | "all"
  | "agriculture"
  | "education"
  | "health"
  | "housing"
  | "pension"
  | "women_child"
  | "livelihood"
  | "scholarship"
  | "financial_inclusion"
  | "disability"
  | "other";

export interface CategoryInfo {
  key: CategoryKey;
  label: string;
  icon: string;
  badge: string;
  border: string;
  glow: string;
  bg: string;
  text: string;
}

export const CATEGORY_LIST: CategoryInfo[] = [
  {
    key: "all",
    label: "All",
    icon: "🏛️",
    badge: "bg-[#5A3E2B]/10 text-[#5A3E2B] border-[#5A3E2B]/20",
    border: "border-l-[#5A3E2B]",
    glow: "hover:shadow-[#5A3E2B]/10",
    bg: "bg-[#FAF8F5]",
    text: "text-[#5A3E2B]",
  },
  {
    key: "agriculture",
    label: "Agriculture",
    icon: "🌾",
    badge: "bg-[#87A96B]/15 text-[#3D522D] border-[#87A96B]/30",
    border: "border-l-[#87A96B]",
    glow: "hover:shadow-[#87A96B]/20",
    bg: "bg-[#F4F7F1]",
    text: "text-[#55703F]",
  },
  {
    key: "education",
    label: "Education",
    icon: "🎓",
    badge: "bg-[#D5851F]/15 text-[#92520B] border-[#D5851F]/30",
    border: "border-l-[#D5851F]",
    glow: "hover:shadow-[#D5851F]/20",
    bg: "bg-[#FEF9F0]",
    text: "text-[#B86C14]",
  },
  {
    key: "health",
    label: "Health",
    icon: "🏥",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    border: "border-l-rose-400",
    glow: "hover:shadow-rose-100",
    bg: "bg-rose-50",
    text: "text-rose-700",
  },
  {
    key: "housing",
    label: "Housing",
    icon: "🏠",
    badge: "bg-[#5A3E2B]/10 text-[#5A3E2B] border-[#5A3E2B]/20",
    border: "border-l-[#5A3E2B]",
    glow: "hover:shadow-[#5A3E2B]/15",
    bg: "bg-[#F8F5F2]",
    text: "text-[#5A3E2B]",
  },
  {
    key: "pension",
    label: "Pension",
    icon: "👴",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    border: "border-l-purple-400",
    glow: "hover:shadow-purple-100",
    bg: "bg-purple-50",
    text: "text-purple-700",
  },
  {
    key: "women_child",
    label: "Women & Child",
    icon: "👩‍👧",
    badge: "bg-pink-50 text-pink-700 border-pink-200",
    border: "border-l-pink-400",
    glow: "hover:shadow-pink-100",
    bg: "bg-pink-50",
    text: "text-pink-700",
  },
  {
    key: "livelihood",
    label: "Livelihood",
    icon: "💼",
    badge: "bg-[#D5851F]/15 text-[#92520B] border-[#D5851F]/30",
    border: "border-l-[#D5851F]",
    glow: "hover:shadow-[#D5851F]/20",
    bg: "bg-[#FEF9F0]",
    text: "text-[#92520B]",
  },
  {
    key: "scholarship",
    label: "Scholarship",
    icon: "📚",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    border: "border-l-indigo-400",
    glow: "hover:shadow-indigo-100",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
  },
  {
    key: "financial_inclusion",
    label: "Finance",
    icon: "💰",
    badge: "bg-[#87A96B]/15 text-[#3D522D] border-[#87A96B]/30",
    border: "border-l-[#87A96B]",
    glow: "hover:shadow-[#87A96B]/20",
    bg: "bg-[#F4F7F1]",
    text: "text-[#3D522D]",
  },
  {
    key: "disability",
    label: "Disability",
    icon: "♿",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    border: "border-l-blue-400",
    glow: "hover:shadow-blue-100",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  {
    key: "other",
    label: "Other",
    icon: "📌",
    badge: "bg-[#5A3E2B]/10 text-[#5A3E2B]/75 border-[#5A3E2B]/20",
    border: "border-l-[#5A3E2B]/40",
    glow: "hover:shadow-[#5A3E2B]/10",
    bg: "bg-[#FAF8F5]",
    text: "text-[#5A3E2B]/80",
  },
];

const KEY_MAP: Record<string, CategoryKey> = {
  all: "all",
  agriculture: "agriculture",
  education: "education",
  health: "health",
  housing: "housing",
  pension: "pension",
  women_child: "women_child",
  "women & child": "women_child",
  "women and child": "women_child",
  livelihood: "livelihood",
  employment: "livelihood",
  scholarship: "scholarship",
  financial_inclusion: "financial_inclusion",
  finance: "financial_inclusion",
  disability: "disability",
  other: "other",
};

const INFO_MAP: Record<CategoryKey, CategoryInfo> = CATEGORY_LIST.reduce(
  (acc, item) => {
    acc[item.key] = item;
    return acc;
  },
  {} as Record<CategoryKey, CategoryInfo>
);

/**
 * Normalizes any category string (from backend or UI or legacy JSON) to a standardized CategoryKey.
 */
export function normalizeCategoryKey(cat?: string | null): CategoryKey {
  if (!cat) return "other";
  const normalized = cat.toLowerCase().trim();
  return KEY_MAP[normalized] ?? "other";
}

/**
 * Returns full styling and label info for any category input.
 */
export function getCategoryInfo(cat?: string | null): CategoryInfo {
  const key = normalizeCategoryKey(cat);
  return INFO_MAP[key] ?? INFO_MAP.other;
}
