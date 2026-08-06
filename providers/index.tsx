"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark";
type ThemeMode = Theme | "system";

interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: Theme;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "theme";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;

  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [resolvedTheme, setResolvedTheme] = useState<Theme>("light");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(
      STORAGE_KEY,
    ) as ThemeMode | null;
    const initialTheme =
      storedTheme === "dark" ||
      storedTheme === "light" ||
      storedTheme === "system"
        ? storedTheme
        : "light";
    const initialResolvedTheme =
      initialTheme === "system" ? getSystemTheme() : initialTheme;

    const frame = requestAnimationFrame(() => {
      setThemeState(initialTheme);
      setResolvedTheme(initialResolvedTheme);
      applyTheme(initialResolvedTheme);
    });

    const handleWheel = (e: WheelEvent) => {
      const activeElement = document.activeElement;
      if (
        activeElement &&
        activeElement.tagName === "INPUT" &&
        (activeElement as HTMLInputElement).type === "number"
      ) {
        (activeElement as HTMLInputElement).blur();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const setTheme = (value: ThemeMode) => {
    if (value === "system") {
      const nextTheme = getSystemTheme();
      setThemeState("system");
      setResolvedTheme(nextTheme);
      window.localStorage.setItem(STORAGE_KEY, "system");
      applyTheme(nextTheme);
      return;
    }

    setThemeState(value);
    setResolvedTheme(value);
    window.localStorage.setItem(STORAGE_KEY, value);
    applyTheme(value);
  };

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

const defaultThemeContext: ThemeContextValue = {
  theme: "light",
  resolvedTheme: "light",
  setTheme: () => {},
};

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    return defaultThemeContext;
  }

  return context;
}

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
