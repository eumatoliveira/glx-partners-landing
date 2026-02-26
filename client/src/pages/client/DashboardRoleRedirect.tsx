import { Loader2 } from "lucide-react";
import { Redirect } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  getDefaultDashboardPathByRole,
  resolveClientDashboardRole,
} from "@/lib/clientDashboardRole";

export default function DashboardRoleRedirect() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0d0a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#e67e22]" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Redirect to="/login" />;
  }

  const role = resolveClientDashboardRole(user as any);
  const basePath = getDefaultDashboardPathByRole(role);
  const search = typeof window === "undefined" ? "" : window.location.search;

  return <Redirect to={`${basePath}${search}`} />;
}
