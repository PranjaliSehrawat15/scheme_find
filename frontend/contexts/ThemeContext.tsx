"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const SETTINGS_KEY = "schemefind_settings";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

function applyTheme(dark: boolean) {
  if (typeof document === "undefined") return;
  if (dark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

function persistTheme(dark: boolean) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const settings = raw ? JSON.parse(raw) : {};
    settings.darkMode = dark;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore localStorage write errors
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  // Initialize theme on client mount from DOM reality, persisted storage or system preference
  useEffect(() => {
    // 1. Immediately read what layout.tsx <script> established on <html>
    const isDomDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
    setIsDark(isDomDark);

    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.darkMode === "boolean") {
          setIsDark(parsed.darkMode);
          applyTheme(parsed.darkMode);
          return;
        }
      }
      // System preference fallback
      if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
        setIsDark(true);
        applyTheme(true);
      }
    } catch {
      // Fallback
    }
  }, []);

  const setTheme = useCallback((dark: boolean) => {
    setIsDark(dark);
    applyTheme(dark);
    persistTheme(dark);
    // Defer dispatch so React finishes current render pass cleanly
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("schemefind_theme_change", { detail: { dark } }));
    }, 10);
  }, []);

  const toggleTheme = useCallback(() => {
    // Determine target based on the real DOM state so toggling can never desync
    const isCurrentlyDark = typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : isDark;
    setTheme(!isCurrentlyDark);
  }, [isDark, setTheme]);

  // Synchronize across tabs and listen for internal settings updates
  useEffect(() => {
    const handleStorageEvent = () => {
      try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (typeof parsed.darkMode === "boolean") {
            setIsDark(parsed.darkMode);
            applyTheme(parsed.darkMode);
          }
        }
      } catch {}
    };

    const handleThemeChangeEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ dark?: boolean }>;
      if (typeof customEvent.detail?.dark === "boolean") {
        const next = customEvent.detail.dark;
        setIsDark((prev) => (prev !== next ? next : prev));
        applyTheme(next);
      } else {
        try {
          const raw = localStorage.getItem(SETTINGS_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (typeof parsed.darkMode === "boolean") {
              setIsDark((prev) => (prev !== parsed.darkMode ? parsed.darkMode : prev));
              applyTheme(parsed.darkMode);
              return;
            }
          }
        } catch {}
        if (typeof document !== "undefined") {
          const domDark = document.documentElement.classList.contains("dark");
          setIsDark((prev) => (prev !== domDark ? domDark : prev));
        }
      }
    };

    window.addEventListener("storage", handleStorageEvent);
    window.addEventListener("schemefind_theme_change", handleThemeChangeEvent);
    return () => {
      window.removeEventListener("storage", handleStorageEvent);
      window.removeEventListener("schemefind_theme_change", handleThemeChangeEvent);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
