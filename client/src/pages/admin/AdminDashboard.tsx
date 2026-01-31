import { useAuth } from "@/_core/hooks/useAuth";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  AlertTriangle,
  Shield,
  Activity,
  Server,
  Database,
  Cloud,
  Wifi,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Redirect } from "wouter";
import { cn } from "@/lib/utils";

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendValue,
  variant = "default"
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  const variantStyles = {
    default: "bg-white/5 border-white/10",
    success: "bg-green-500/10 border-green-500/30",
    warning: "bg-yellow-500/10 border-yellow-500/30",
    danger: "bg-red-500/10 border-red-500/30"
  };

  const iconStyles = {
    default: "bg-primary/20 text-primary",
    success: "bg-green-500/20 text-green-400",
    warning: "bg-yellow-500/20 text-yellow-400",
    danger: "bg-red-500/20 text-red-400"
  };

  return (
    <Card className={cn("border", variantStyles[variant])}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trend && trendValue && (
              <div className={cn(
                "flex items-center gap-1 mt-2 text-xs",
                trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-gray-400"
              )}>
                {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {trendValue}
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-lg", iconStyles[variant])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ServiceStatusCard({ 
  name, 
  status, 
  responseTime 
}: { 
  name: string; 
  status: "operational" | "degraded" | "down";
  responseTime?: number;
}) {
  const statusConfig = {
    operational: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400" },
    degraded: { icon: AlertCircle, color: "text-yellow-400", bg: "bg-yellow-400" },
    down: { icon: XCircle, color: "text-red-400", bg: "bg-red-400" }
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3">
        <StatusIcon className={cn("h-4 w-4", config.color)} />
        <span className="text-sm">{name}</span>
      </div>
      <div className="flex items-center gap-3">
        {responseTime && (
          <span className="text-xs text-muted-foreground">{responseTime}ms</span>
        )}
        <span className={cn("h-2 w-2 rounded-full", config.bg)} />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { data: stats, isLoading } = trpc.admin.getDashboardStats.useQuery();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Redirect to="/" />;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Mock data for services (will be replaced with real data)
  const services = stats?.services?.length ? stats.services : [
    { serviceName: "API Principal", status: "operational" as const, responseTime: 45 },
    { serviceName: "Banco de Dados", status: "operational" as const, responseTime: 12 },
    { serviceName: "Workers", status: "operational" as const, responseTime: 89 },
    { serviceName: "CDN", status: "operational" as const, responseTime: 23 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Centro de Comando - Visão geral do sistema</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Financial Health */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Painel Financeiro
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="MRR"
                  value={formatCurrency(stats?.financial?.mrr ?? 0)}
                  subtitle="Receita Mensal Recorrente"
                  icon={DollarSign}
                  trend="up"
                  trendValue="+12% vs mês anterior"
                />
                <StatCard
                  title="ARR"
                  value={formatCurrency(stats?.financial?.arr ?? 0)}
                  subtitle="Receita Anual Recorrente"
                  icon={TrendingUp}
                />
                <StatCard
                  title="Churn Rate"
                  value={`${(stats?.financial?.churnRate ?? 0).toFixed(1)}%`}
                  subtitle="Taxa de cancelamento"
                  icon={TrendingDown}
                  variant={(stats?.financial?.churnRate ?? 0) > 5 ? "danger" : "success"}
                />
                <StatCard
                  title="LTV Médio"
                  value={formatCurrency(24000)}
                  subtitle="Valor do tempo de vida"
                  icon={Users}
                />
              </div>
            </div>

            {/* Users & Security */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Usuários & Segurança
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <StatCard
                    title="Total de Usuários"
                    value={stats?.users?.total ?? 0}
                    icon={Users}
                  />
                  <StatCard
                    title="MFA Ativo"
                    value={`${(stats?.users?.mfaPercentage ?? 0).toFixed(0)}%`}
                    subtitle={`${stats?.users?.mfaEnabled ?? 0} usuários`}
                    icon={Shield}
                    variant={(stats?.users?.mfaPercentage ?? 0) < 50 ? "warning" : "success"}
                  />
                </div>
              </div>

              {/* System Health */}
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Saúde do Sistema
                </h2>
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    {services.map((service, index) => (
                      <ServiceStatusCard
                        key={index}
                        name={service.serviceName}
                        status={service.status as "operational" | "degraded" | "down"}
                        responseTime={service.responseTime ?? undefined}
                      />
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Error Monitoring */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Monitoramento de Erros (24h)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  title="Total de Erros"
                  value={stats?.errors?.total ?? 0}
                  icon={AlertTriangle}
                  variant={(stats?.errors?.total ?? 0) > 100 ? "danger" : "default"}
                />
                <StatCard
                  title="Erros 4xx"
                  value={stats?.errors?.by4xx ?? 0}
                  subtitle="Client errors"
                  icon={AlertCircle}
                  variant={(stats?.errors?.by4xx ?? 0) > 50 ? "warning" : "default"}
                />
                <StatCard
                  title="Erros 5xx"
                  value={stats?.errors?.by5xx ?? 0}
                  subtitle="Server errors"
                  icon={XCircle}
                  variant={(stats?.errors?.by5xx ?? 0) > 10 ? "danger" : "default"}
                />
              </div>
            </div>

            {/* Resource Usage */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Cloud className="h-5 w-5 text-primary" />
                Consumo de Recursos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">CPU</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '45%' }} />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Memória</span>
                      <span className="text-sm font-medium">62%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: '62%' }} />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Armazenamento</span>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '28%' }} />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Latência Média</span>
                      <span className="text-sm font-medium">89ms</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '35%' }} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
