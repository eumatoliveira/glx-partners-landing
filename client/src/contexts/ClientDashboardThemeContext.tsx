import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type ClientDashboardTheme = "light" | "dark";

type ClientDashboardThemeContextValue = {
  theme: ClientDashboardTheme;
  isDark: boolean;
  setTheme: (theme: ClientDashboardTheme) => void;
  toggleTheme: () => void;
};

const STORAGE_KEY = "glx-client-dashboard-theme";

const ClientDashboardThemeContext = createContext<ClientDashboardThemeContextValue | undefined>(undefined);

function readStoredTheme(): ClientDashboardTheme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" ? "light" : "dark";
}

export function ClientDashboardThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ClientDashboardTheme>(readStoredTheme);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo<ClientDashboardThemeContextValue>(
    () => ({
      theme,
      isDark: theme === "dark",
      setTheme,
      toggleTheme: () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
    }),
    [theme],
  );

  return <ClientDashboardThemeContext.Provider value={value}>{children}</ClientDashboardThemeContext.Provider>;
}

export function useClientDashboardTheme() {
  const context = useContext(ClientDashboardThemeContext);
  if (!context) {
    throw new Error("useClientDashboardTheme must be used within ClientDashboardThemeProvider");
  }
  return context;
}

export function ClientDashboardThemeScope({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isDark, theme } = useClientDashboardTheme();

  return (
    <div
      data-client-dashboard-theme={theme}
      className={cn(
        "glx-client-theme min-h-screen",
        isDark ? "dark glx-client-theme-dark" : "glx-client-theme-light",
        className,
      )}
    >
      {children}
    </div>
  );
}

