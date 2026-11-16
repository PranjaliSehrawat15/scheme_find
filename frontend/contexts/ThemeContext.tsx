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
  document.documentElement.classList.toggle("dark", dark);
}

function persistTheme(dark: boolean) {
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

  // Initialize theme on client mount from persisted storage or system preference
  useEffect(() => {
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
      // Fallback to light
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
    // isDark is in the dependency array — closure is always fresh
    setTheme(!isDark);
  }, [isDark, setTheme]);

  // Cross-tab synchronization: storage events fire in OTHER tabs only
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

    // Only listen to native storage (cross-tab). The custom event is for
    // same-tab component sync and should NOT loop back into this handler
    // to avoid infinite dispatch cycles.
    window.addEventListener("storage", handleStorageEvent);
    return () => {
      window.removeEventListener("storage", handleStorageEvent);
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
