import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const themes: Record<Theme, Record<string, string>> = {
  dark: {
    "--bg-gradient": "radial-gradient(circle at top, #05070f, #000)",
    "--text-primary": "#eaeaea",
    "--text-secondary": "#c6c6c6",
    "--text-muted": "#9aa0a6",
    "--card-bg": "rgba(12, 14, 22, 0.75)",
    "--card-border": "rgba(255, 255, 255, 0.08)",
    "--accent": "#00eaff",
    "--accent-glow": "#00eaff95",
    "--input-bg": "rgba(255, 255, 255, 0.03)",
    "--input-border": "rgba(255, 255, 255, 0.1)",
    "--footer-bg": "rgba(255, 255, 255, 0.01)",
    "--btn-ghost-border": "rgba(255, 255, 255, 0.15)",
    "--btn-ghost-border-hover": "rgba(255, 255, 255, 0.4)",
  },
  light: {
    "--bg-gradient": "radial-gradient(circle at top, #e8f0ff, #f5f5f5)",
    "--text-primary": "#1a1a2e",
    "--text-secondary": "#444",
    "--text-muted": "#666",
    "--card-bg": "rgba(255, 255, 255, 0.85)",
    "--card-border": "rgba(0, 0, 0, 0.1)",
    "--accent": "#0077cc",
    "--accent-glow": "#0077cc95",
    "--input-bg": "rgba(0, 0, 0, 0.03)",
    "--input-border": "rgba(0, 0, 0, 0.15)",
    "--footer-bg": "rgba(0, 0, 0, 0.03)",
    "--btn-ghost-border": "rgba(0, 0, 0, 0.15)",
    "--btn-ghost-border-hover": "rgba(0, 0, 0, 0.4)",
  },
};

interface UseThemeReturn {
  theme: Theme;
  toggle: () => void;
}

export function useTheme(): UseThemeReturn {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || "dark",
  );

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(themes[theme]).forEach(([k, v]) =>
      root.style.setProperty(k, v),
    );
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggle };
}
