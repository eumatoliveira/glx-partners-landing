import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/i18n";
import {
  getClientLayoutCopy,
  resolveClientLegend,
} from "@/lib/dashboardLocale";
import {
  LayoutDashboard,
  DollarSign,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Star,
  Users,
  Database,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  ChevronDown,
  Bell,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PDFExportButton from "@/components/client/PDFExportButton";
import { AnimatePresence, m } from "framer-motion";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";
import { hoverLift, tapPress } from "@/animation/config/motionPresets";
import { shouldEnableHoverMotion } from "@/animation/utils/perfGuards";

interface ClientDashboardLayoutProps {
  children: React.ReactNode;
}

type ClientMenuKey =
  | "ceo"
  | "financials"
  | "operations"
  | "waste"
  | "growth"
  | "quality"
  | "people"
  | "data";

const menuItems: Array<{ icon: React.ComponentType<{ className?: string }>; labelKey: ClientMenuKey; path: string }> = [
  { icon: LayoutDashboard, labelKey: "ceo", path: "/performance" },
  { icon: DollarSign, labelKey: "financials", path: "/performance/financials" },
  { icon: Calendar, labelKey: "operations", path: "/performance/operations" },
  { icon: AlertTriangle, labelKey: "waste", path: "/performance/waste" },
  { icon: TrendingUp, labelKey: "growth", path: "/performance/growth" },
  { icon: Star, labelKey: "quality", path: "/performance/quality" },
  { icon: Users, labelKey: "people", path: "/performance/people" },
  { icon: Database, labelKey: "data", path: "/performance/data" },
];

const TEST_NOTIFICATION_EMAILS = new Set(
  (import.meta.env.VITE_TEST_NOTIFICATION_EMAILS ?? "")
    .split(",")
    .map((item: string) => item.trim().toLowerCase())
    .filter((item: string) => item.length > 0),
);
const LANGUAGE_OPTIONS: Array<{ code: Language; label: string }> = [
  { code: "pt", label: "PT" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
];

export default function ClientDashboardLayout({ children }: ClientDashboardLayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const copy = getClientLayoutCopy(language);
  const legend = resolveClientLegend(language, location);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const motionCaps = useMotionCapabilities();
  const hoverEnabled = shouldEnableHoverMotion(motionCaps);
  const sharedHover = hoverEnabled ? hoverLift(motionCaps.motionLevel) : undefined;
  const sharedTap = tapPress(motionCaps.motionLevel);

  useEffect(() => {
    const email = user?.email?.toLowerCase();
    if (email && TEST_NOTIFICATION_EMAILS.has(email)) {
      setHasUnread(true);
      const timer = setTimeout(() => setShowNotification(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout({ redirectTo: "/login" });
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("light-mode");
  };

  return (
    <div className={cn("min-h-screen flex", darkMode ? "bg-[#0B0B0C]" : "bg-[#F5F7FA]")}>
      <AnimatePresence>
        {sidebarOpen ? (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <m.aside
        layout
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          darkMode ? "bg-[#1A1A1D] border-r border-[#2a2a2e]" : "bg-white border-r border-gray-200",
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#2a2a2e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg bg-orange-500 text-white">
              GLX
            </div>
            <div>
              <span className={cn("font-bold text-lg", darkMode ? "text-white" : "text-gray-900")}>
                {copy.brand}
              </span>
            </div>
          </div>
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location === item.path || (item.path !== "/performance" && location.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path}>
                <m.div
                  layout
                  whileHover={sharedHover}
                  whileTap={sharedTap}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer",
                    isActive
                      ? "bg-orange-500/20 text-orange-500 border-l-4 border-orange-500"
                      : darkMode
                        ? "text-gray-400 hover:bg-[#202024] hover:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{copy.menu[item.labelKey]}</span>
                </m.div>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2a2a2e]">
          <Link href="/performance/settings">
            <m.div
              whileHover={sharedHover}
              whileTap={sharedTap}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer",
                darkMode
                  ? "text-gray-400 hover:bg-[#1E1E1E] hover:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">{copy.sidebarSettings}</span>
            </m.div>
          </Link>
          <Link href="/">
            <m.div
              whileHover={sharedHover}
              whileTap={sharedTap}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer",
                darkMode
                  ? "text-gray-400 hover:bg-[#1E1E1E] hover:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{copy.backToSite}</span>
            </m.div>
          </Link>
        </div>
      </m.aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header
          className={cn(
            "h-16 flex items-center justify-between px-4 lg:px-6 border-b",
            darkMode ? "bg-[#111113] border-[#2a2a2e]" : "bg-white border-gray-200",
          )}
        >
          <button
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#202024]"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden sm:flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "gap-2",
                    darkMode
                      ? "bg-[#1A1A1D] border-[#2a2a2e] text-white hover:bg-[#202024]"
                      : "bg-white border-gray-200 text-gray-900 hover:bg-gray-100",
                  )}
                >
                  <Calendar className="w-4 h-4" />
                  {copy.periods.last30}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={darkMode ? "bg-[#111113] border-[#2a2a2e]" : ""}>
                <DropdownMenuItem>{copy.periods.last7}</DropdownMenuItem>
                <DropdownMenuItem>{copy.periods.last30}</DropdownMenuItem>
                <DropdownMenuItem>{copy.periods.last90}</DropdownMenuItem>
                <DropdownMenuItem>{copy.periods.last12m}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{copy.periods.custom}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-500 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {copy.liveData}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={cn(
                "hidden md:flex items-center gap-1 px-2 py-1 rounded-lg border",
                darkMode ? "border-[#2a2a2e] bg-[#1A1A1D]" : "border-gray-200 bg-white",
              )}
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => setLanguage(option.code)}
                  className={cn(
                    "px-2 py-1 rounded text-[11px] font-semibold transition",
                    language === option.code
                      ? "bg-orange-500 text-white"
                      : darkMode
                        ? "text-gray-300 hover:text-white hover:bg-[#202024]"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowNotification(!showNotification);
                  setHasUnread(false);
                }}
                className={
                  darkMode ? "text-gray-400 hover:text-white relative" : "text-gray-600 hover:text-gray-900 relative"
                }
              >
                <Bell className="w-5 h-5" />
                {hasUnread ? (
                  <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 animate-pulse border border-[#111113]" />
                ) : null}
              </Button>

              {showNotification ? (
                <div
                  className={cn(
                    "absolute top-full right-0 mt-2 w-80 rounded-lg shadow-xl border overflow-hidden z-50 animate-in slide-in-from-top-2",
                    darkMode ? "bg-[#1A1A1D] border-[#2a2a2e]" : "bg-white border-gray-200",
                  )}
                >
                  <div className="flex items-center justify-between p-3 border-b border-[#2a2a2e]">
                    <h3 className={cn("text-sm font-semibold", darkMode ? "text-white" : "text-gray-900")}>
                      {copy.notificationsTitle}
                    </h3>
                    <button
                      onClick={() => setShowNotification(false)}
                      className="text-gray-400 hover:text-white p-1 rounded-md"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                      </div>
                      <div>
                        <p className={cn("text-sm font-medium", darkMode ? "text-white" : "text-gray-900")}>
                          {copy.notificationHeadline}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{copy.notificationBody}</p>
                        <span className="text-[10px] text-gray-400 mt-2 block">{copy.notificationNow}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <PDFExportButton />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 ml-2">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      darkMode ? "bg-orange-500/20 text-orange-500" : "bg-orange-100 text-orange-600",
                    )}
                  >
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <span className={cn("hidden md:inline font-medium", darkMode ? "text-white" : "text-gray-900")}>
                    {user?.name || copy.userFallback}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={darkMode ? "bg-[#1E1E1E] border-[#2a2a2a]" : ""}>
                <DropdownMenuItem>{copy.profile}</DropdownMenuItem>
                <DropdownMenuItem>{copy.settings}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <LogOut className="w-4 h-4 mr-2" />
                  {copy.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <m.main layout className={cn("flex-1 p-4 lg:p-6 overflow-auto", darkMode ? "bg-[#0a0a0a]" : "bg-[#F5F7FA]")}>
          <div
            className={cn(
              "mb-4 rounded-xl border p-4",
              darkMode ? "border-[#2a2a2e] bg-[#111113]" : "border-gray-200 bg-white",
            )}
          >
            <p className={cn("text-xs uppercase tracking-[0.18em] mb-2", darkMode ? "text-orange-400" : "text-orange-600")}>
              {copy.periodLabel}
            </p>
            <h2 className={cn("text-base md:text-lg font-semibold", darkMode ? "text-white" : "text-gray-900")}>
              {legend.title}
            </h2>
            <p className={cn("text-sm mt-1", darkMode ? "text-gray-400" : "text-gray-600")}>{legend.description}</p>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              {legend.bullets.map((bullet) => (
                <div
                  key={bullet}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-xs",
                    darkMode ? "border-[#2a2a2e] bg-[#1A1A1D] text-gray-300" : "border-gray-200 bg-gray-50 text-gray-700",
                  )}
                >
                  {bullet}
                </div>
              ))}
            </div>
          </div>
          {children}
        </m.main>
      </div>
    </div>
  );
}

