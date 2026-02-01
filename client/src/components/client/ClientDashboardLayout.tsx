import { useState } from "react";
import { FileDown } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { cn } from "@/lib/utils";
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
  FileText,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PDFReportGenerator from "@/components/client/PDFReportGenerator";

interface ClientDashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: "CEO Scorecard", path: "/performance" },
  { icon: DollarSign, label: "Financials", path: "/performance/financials" },
  { icon: Calendar, label: "Clinical Operations", path: "/performance/operations" },
  { icon: AlertTriangle, label: "Op. Waste", path: "/performance/waste" },
  { icon: TrendingUp, label: "Growth Engine", path: "/performance/growth" },
  { icon: Star, label: "Quality & NPS", path: "/performance/quality" },
  { icon: Users, label: "People", path: "/performance/people" },
  { icon: Database, label: "Data Governance", path: "/performance/data" },
];

export default function ClientDashboardLayout({ children }: ClientDashboardLayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("light-mode");
  };

  return (
    <div className={cn(
      "min-h-screen flex",
      darkMode ? "bg-[#0a0a0a]" : "bg-[#F5F7FA]"
    )}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          darkMode ? "bg-[#121212] border-r border-[#2a2a2a]" : "bg-white border-r border-gray-200"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
              darkMode ? "bg-orange-500 text-white" : "bg-orange-500 text-white"
            )}>
              GLX
            </div>
            <div>
              <span className={cn(
                "font-bold text-lg",
                darkMode ? "text-white" : "text-gray-900"
              )}>PERFORMANCE</span>
            </div>
          </div>
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location === item.path || 
              (item.path !== "/performance" && location.startsWith(item.path));
            const Icon = item.icon;
            
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer",
                    isActive
                      ? "bg-orange-500/20 text-orange-500 border-l-4 border-orange-500"
                      : darkMode
                        ? "text-gray-400 hover:bg-[#1E1E1E] hover:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2a2a2a]">
          <Link href="/performance/settings">
            <div className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer",
              darkMode
                ? "text-gray-400 hover:bg-[#1E1E1E] hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}>
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </div>
          </Link>
          <Link href="/">
            <div className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer",
              darkMode
                ? "text-gray-400 hover:bg-[#1E1E1E] hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}>
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Voltar ao Site</span>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className={cn(
          "h-16 flex items-center justify-between px-4 lg:px-6 border-b",
          darkMode ? "bg-[#121212] border-[#2a2a2a]" : "bg-white border-gray-200"
        )}>
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E1E1E]"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Period Selector */}
          <div className="hidden sm:flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={cn(
                  "gap-2",
                  darkMode 
                    ? "bg-[#1E1E1E] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]"
                    : "bg-white border-gray-200 text-gray-900 hover:bg-gray-100"
                )}>
                  <Calendar className="w-4 h-4" />
                  Last 30 Days
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={darkMode ? "bg-[#1E1E1E] border-[#2a2a2a]" : ""}>
                <DropdownMenuItem>Last 7 Days</DropdownMenuItem>
                <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
                <DropdownMenuItem>Last 90 Days</DropdownMenuItem>
                <DropdownMenuItem>Last 12 Months</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Custom Range</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-500 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live Data
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Export Button */}
            <Button
              variant="default"
              className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
              onClick={() => setPdfModalOpen(true)}
            >
              <FileDown className="w-4 h-4" />
              <span className="hidden sm:inline">Export Report</span>
            </Button>

            {/* PDF Report Generator Modal */}
            <PDFReportGenerator open={pdfModalOpen} onOpenChange={setPdfModalOpen} />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 ml-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                    darkMode ? "bg-orange-500/20 text-orange-500" : "bg-orange-100 text-orange-600"
                  )}>
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <span className={cn(
                    "hidden md:inline font-medium",
                    darkMode ? "text-white" : "text-gray-900"
                  )}>
                    {user?.name || "Usuário"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={darkMode ? "bg-[#1E1E1E] border-[#2a2a2a]" : ""}>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className={cn(
          "flex-1 p-4 lg:p-6 overflow-auto",
          darkMode ? "bg-[#0a0a0a]" : "bg-[#F5F7FA]"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}
