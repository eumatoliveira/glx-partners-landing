import { Moon, Sun } from "lucide-react";
import { useClientDashboardTheme } from "@/contexts/ClientDashboardThemeContext";
import { cn } from "@/lib/utils";

interface ClientDashboardThemeSelectorProps {
  compact?: boolean;
  className?: string;
}

export default function ClientDashboardThemeSelector({
  compact = false,
  className,
}: ClientDashboardThemeSelectorProps) {
  const { theme, setTheme } = useClientDashboardTheme();

  const baseWrapper =
    "inline-flex items-center rounded-xl border p-1 transition-colors " +
    "bg-white/90 border-gray-200 shadow-sm dark:bg-[#121212]/90 dark:border-zinc-800";

  const itemClass = (active: boolean) =>
    cn(
      "inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition",
      compact ? "w-9 px-0" : "",
      active
        ? "bg-primary text-white shadow-[0_0_0_1px_rgba(255,102,0,0.25),0_6px_18px_rgba(255,102,0,0.22)]"
        : "text-gray-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-white/5",
    );

  return (
    <div className={cn(baseWrapper, className)} role="group" aria-label="Selecionar tema do dashboard">
      <button
        type="button"
        aria-pressed={theme === "light"}
        onClick={() => setTheme("light")}
        className={itemClass(theme === "light")}
        title="Light mode"
      >
        <Sun className="h-4 w-4" />
        {compact ? null : <span>Light</span>}
      </button>
      <button
        type="button"
        aria-pressed={theme === "dark"}
        onClick={() => setTheme("dark")}
        className={itemClass(theme === "dark")}
        title="Dark mode"
      >
        <Moon className="h-4 w-4" />
        {compact ? null : <span>Dark</span>}
      </button>
    </div>
  );
}

