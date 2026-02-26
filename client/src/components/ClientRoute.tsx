import { useAuth } from "@/_core/hooks/useAuth";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";
import {
  ClientDashboardThemeProvider,
  ClientDashboardThemeScope,
} from "@/contexts/ClientDashboardThemeContext";

interface ClientRouteProps {
  children: React.ReactNode;
}

export default function ClientRoute({ children }: ClientRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();

  return (
    <ClientDashboardThemeProvider>
      <ClientDashboardThemeScope>
        {loading ? (
          <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white dark:bg-[#0a0a0a] dark:text-white">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              <p className="text-gray-500 dark:text-gray-400">Verificando acesso...</p>
            </div>
          </div>
        ) : !isAuthenticated || !user ? (
          <Redirect to="/login" />
        ) : (
          <>{children}</>
        )}
      </ClientDashboardThemeScope>
    </ClientDashboardThemeProvider>
  );
}
