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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  // Initialize theme on client mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.darkMode === "boolean") {
          setIsDark(parsed.darkMode);
          if (parsed.darkMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return;
        }
      }
      // System preference fallback
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setIsDark(true);
        document.documentElement.classList.add("dark");
      }
    } catch {
      // Fallback to light
    }
  }, []);

  const setTheme = useCallback((dark: boolean) => {
    setIsDark(dark);
    if (typeof document !== "undefined") {
      if (dark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      const settings = raw ? JSON.parse(raw) : {};
      settings.darkMode = dark;
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Ignore localStorage write error
    }
    // Defer dispatch so React finishes render pass cleanly
    setTimeout(() => {
      window.dispatchEvent(new Event("schemefind_theme_change"));
    }, 10);
  }, []);

  const toggleTheme = useCallback(() => {
    // Read truth directly from DOM to avoid stale closure
    const currentIsDark =
      typeof document !== "undefined"
        ? document.documentElement.classList.contains("dark")
        : isDark;
    const next = !currentIsDark;
    setTheme(next);
  }, [isDark, setTheme]);

  // Listen for sync from other tabs or other components
  useEffect(() => {
    const handleSync = () => {
      try {
        const isHtmlDark = document.documentElement.classList.contains("dark");
        setIsDark(isHtmlDark);
      } catch {}
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("schemefind_theme_change", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("schemefind_theme_change", handleSync);
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
