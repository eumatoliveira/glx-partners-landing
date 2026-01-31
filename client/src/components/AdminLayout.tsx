import { useAuth } from "@/_core/hooks/useAuth";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Activity,
  AlertTriangle,
  Flag,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Moon,
  Sun,
  Server
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState, createContext, useContext, useEffect } from "react";

// Theme context for admin
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export const useAdminTheme = () => useContext(ThemeContext);

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Financeiro", href: "/admin/financeiro", icon: CreditCard },
  { name: "Usuários", href: "/admin/usuarios", icon: Users },
  { name: "Sistema", href: "/admin/sistema", icon: Server },
  { name: "Erros & Logs", href: "/admin/erros", icon: AlertTriangle },
  { name: "Feature Flags", href: "/admin/flags", icon: Flag },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [environment, setEnvironment] = useState<"production" | "staging">("production");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Churn acima de 5%", type: "warning", time: "2min" },
    { id: 2, title: "Novo usuário cadastrado", type: "info", time: "15min" },
    { id: 3, title: "Erro 500 detectado", type: "error", time: "1h" },
  ]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/admin/usuarios?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Theme classes
  const bgMain = theme === "dark" ? "bg-[#0a0a0a]" : "bg-gray-50";
  const bgSidebar = theme === "dark" ? "bg-[#111111]" : "bg-white";
  const bgHeader = theme === "dark" ? "bg-[#0a0a0a]/80" : "bg-white/80";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const borderColor = theme === "dark" ? "border-white/10" : "border-gray-200";
  const hoverBg = theme === "dark" ? "hover:bg-white/5" : "hover:bg-gray-100";
  const inputBg = theme === "dark" ? "bg-white/5" : "bg-gray-100";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={cn("min-h-screen", bgMain, textPrimary)}>
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          bgSidebar,
          borderColor,
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={cn("flex items-center justify-between h-16 px-4 border-b", borderColor)}>
              <Link href="/admin" className="flex items-center gap-2">
                <img 
                  src="/images/logo-transparent.png" 
                  alt="GLX Partners" 
                  className="h-10 w-auto" 
                />
                <span className="font-bold text-sm text-primary">ADMIN</span>
              </Link>
              <button 
                onClick={() => setSidebarOpen(false)}
                className={cn("lg:hidden p-1 rounded", hoverBg)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              <ul className="space-y-1">
                {navigation.map((item) => {
                  const isActive = location === item.href || 
                    (item.href !== "/admin" && location.startsWith(item.href));
                  return (
                    <li key={item.name}>
                      <Link href={item.href}>
                        <div className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                          isActive 
                            ? "bg-primary text-primary-foreground" 
                            : cn(textSecondary, hoverBg, "hover:text-primary")
                        )}>
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          {item.name}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Environment Selector */}
            <div className={cn("p-4 border-t", borderColor)}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "w-full justify-between",
                      inputBg,
                      borderColor,
                      hoverBg
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span className={cn(
                        "h-2 w-2 rounded-full",
                        environment === "production" ? "bg-green-500" : "bg-yellow-500"
                      )} />
                      {environment === "production" ? "Production" : "Staging"}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem onClick={() => setEnvironment("production")}>
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                    Production
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEnvironment("staging")}>
                    <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                    Staging
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Quick Links */}
            <div className={cn("p-4 border-t", borderColor)}>
              <Link href="/glx">
                <Button variant="ghost" className={cn("w-full justify-start gap-2", textSecondary, hoverBg)}>
                  <Activity className="h-4 w-4" />
                  Dashboard GLX
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className={cn("w-full justify-start gap-2", textSecondary, hoverBg)}>
                  <LayoutDashboard className="h-4 w-4" />
                  Voltar ao Site
                </Button>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top bar */}
          <header className={cn(
            "sticky top-0 z-30 h-16 backdrop-blur-md border-b",
            bgHeader,
            borderColor
          )}>
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
              {/* Mobile menu button */}
              <button 
                onClick={() => setSidebarOpen(true)}
                className={cn("lg:hidden p-2 rounded-lg", hoverBg)}
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Buscar usuários por email ou ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn("pl-10", inputBg, borderColor, "focus:border-primary")}
                  />
                </div>
              </form>

              {/* Right side */}
              <div className="flex items-center gap-2">
                {/* Theme toggle */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleTheme}
                  className={hoverBg}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>

                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className={cn("relative", hoverBg)}>
                      <Bell className="h-5 w-5" />
                      {notifications.length > 0 && (
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.map((notif) => (
                      <DropdownMenuItem key={notif.id} className="flex items-start gap-3 py-3">
                        <span className={cn(
                          "h-2 w-2 rounded-full mt-1.5 flex-shrink-0",
                          notif.type === "error" ? "bg-red-500" :
                          notif.type === "warning" ? "bg-yellow-500" : "bg-blue-500"
                        )} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notif.title}</p>
                          <p className="text-xs text-muted-foreground">{notif.time} atrás</p>
                        </div>
                      </DropdownMenuItem>
                    ))}
                    {notifications.length === 0 && (
                      <div className="py-4 text-center text-sm text-muted-foreground">
                        Nenhuma notificação
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={cn("flex items-center gap-2", hoverBg)}>
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {user?.name?.charAt(0) || "A"}
                        </span>
                      </div>
                      <span className="hidden md:block text-sm">{user?.name || "Admin"}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{user?.name || "Admin"}</span>
                        <span className="text-xs text-muted-foreground">{user?.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/glx">
                        <span className="cursor-pointer flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Dashboard GLX
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/">
                        <span className="cursor-pointer flex items-center gap-2">
                          <LayoutDashboard className="h-4 w-4" />
                          Voltar ao Site
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-400">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
