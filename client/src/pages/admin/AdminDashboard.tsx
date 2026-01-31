import { useAuth } from "@/_core/hooks/useAuth";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Loader2,
  ArrowRight,
  Bell,
  Clock,
  Zap,
  Eye,
  RefreshCw
} from "lucide-react";
import { Redirect, Link } from "wouter";
import { cn } from "@/lib/utils";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendValue,
  variant = "default",
  href
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "success" | "warning" | "danger" | "primary";
  href?: string;
}) {
  const variantStyles = {
    default: "bg-white/5 border-white/10 hover:bg-white/10",
    success: "bg-green-500/10 border-green-500/30 hover:bg-green-500/20",
    warning: "bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20",
    danger: "bg-red-500/10 border-red-500/30 hover:bg-red-500/20",
    primary: "bg-primary/10 border-primary/30 hover:bg-primary/20"
  };

  const iconStyles = {
    default: "bg-white/10 text-white",
    success: "bg-green-500/20 text-green-400",
    warning: "bg-yellow-500/20 text-yellow-400",
    danger: "bg-red-500/20 text-red-400",
    primary: "bg-primary/20 text-primary"
  };

  const content = (
    <Card className={cn("border transition-all cursor-pointer", variantStyles[variant])}>
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
                "flex items-center gap-1 mt-2 text-xs font-medium",
                trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-gray-400"
              )}>
                {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {trendValue}
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", iconStyles[variant])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

function ServiceStatusCard({ 
  name, 
  status, 
  responseTime,
  icon: Icon
}: { 
  name: string; 
  status: "operational" | "degraded" | "down";
  responseTime?: number;
  icon: React.ElementType;
}) {
  const statusConfig = {
    operational: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400", label: "Operacional" },
    degraded: { icon: AlertCircle, color: "text-yellow-400", bg: "bg-yellow-400", label: "Degradado" },
    down: { icon: XCircle, color: "text-red-400", bg: "bg-red-400", label: "Offline" }
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="flex items-center justify-between py-3 px-4 bg-white/5 rounded-lg mb-2 last:mb-0">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/10">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <span className="text-sm font-medium">{name}</span>
          {responseTime && (
            <p className="text-xs text-muted-foreground">{responseTime}ms</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={cn("text-xs font-medium", config.color)}>{config.label}</span>
        <span className={cn("h-2.5 w-2.5 rounded-full animate-pulse", config.bg)} />
      </div>
    </div>
  );
}

function AlertItem({ 
  title, 
  description, 
  time, 
  severity 
}: { 
  title: string; 
  description: string; 
  time: string;
  severity: "info" | "warning" | "critical";
}) {
  const severityStyles = {
    info: "border-l-blue-500 bg-blue-500/5",
    warning: "border-l-yellow-500 bg-yellow-500/5",
    critical: "border-l-red-500 bg-red-500/5"
  };

  return (
    <div className={cn("border-l-4 rounded-r-lg p-3 mb-2 last:mb-0", severityStyles[severity])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { data: stats, isLoading, refetch } = trpc.admin.getDashboardStats.useQuery();

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
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Mock data for charts
  const revenueChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'MRR',
        data: [45000, 52000, 58000, 62000, 68000, stats?.financial?.mrr ?? 75000],
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(255,255,255,0.5)' },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { 
          color: 'rgba(255,255,255,0.5)',
          callback: (value: number) => `R$${value/1000}k`
        },
      },
    },
  };

  const userDistributionData = {
    labels: ['Ativos', 'Inativos', 'Trial'],
    datasets: [
      {
        data: [stats?.users?.total ?? 85, 10, 5],
        backgroundColor: ['#22c55e', '#ef4444', '#f97316'],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: 'rgba(255,255,255,0.7)', padding: 20 },
      },
    },
    cutout: '70%',
  };

  // Mock services data
  const services = [
    { name: "API Principal", status: "operational" as const, responseTime: 45, icon: Server },
    { name: "Banco de Dados", status: "operational" as const, responseTime: 12, icon: Database },
    { name: "CDN / Assets", status: "operational" as const, responseTime: 23, icon: Cloud },
    { name: "WebSocket", status: "operational" as const, responseTime: 8, icon: Wifi },
  ];

  // Mock alerts
  const alerts = [
    { title: "Novo usuário registrado", description: "cliente@empresa.com acabou de se cadastrar", time: "2min", severity: "info" as const },
    { title: "Pagamento pendente", description: "Fatura #1234 vence em 3 dias", time: "1h", severity: "warning" as const },
    { title: "Taxa de erro elevada", description: "5xx errors acima de 2% nos últimos 30min", time: "30min", severity: "critical" as const },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Centro de Comando</h1>
            <p className="text-muted-foreground">Visão geral do sistema em tempo real</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="bg-white/5 border-white/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Live Data
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="MRR"
                value={formatCurrency(stats?.financial?.mrr ?? 0)}
                icon={DollarSign}
                trend="up"
                trendValue="+12.5% vs mês anterior"
                variant="success"
                href="/admin/billing"
              />
              <StatCard
                title="Usuários Ativos"
                value={stats?.users?.total ?? 0}
                subtitle={`${stats?.users?.mfaEnabled ?? 0} com MFA`}
                icon={Users}
                variant="primary"
                href="/admin/users"
              />
              <StatCard
                title="Churn Rate"
                value={`${(stats?.financial?.churnRate ?? 0).toFixed(1)}%`}
                icon={TrendingDown}
                variant={(stats?.financial?.churnRate ?? 0) > 5 ? "danger" : "success"}
                href="/admin/billing"
              />
              <StatCard
                title="Erros (24h)"
                value={stats?.errors?.total ?? 0}
                subtitle={`${stats?.errors?.by5xx ?? 0} críticos`}
                icon={AlertTriangle}
                variant={(stats?.errors?.total ?? 0) > 50 ? "warning" : "default"}
                href="/admin/errors"
              />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Chart */}
              <Card className="lg:col-span-2 bg-white/5 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Evolução da Receita</CardTitle>
                    <p className="text-sm text-muted-foreground">MRR nos últimos 6 meses</p>
                  </div>
                  <Link href="/admin/billing">
                    <Button variant="ghost" size="sm">
                      Ver detalhes <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <Line data={revenueChartData} options={chartOptions as any} />
                  </div>
                </CardContent>
              </Card>

              {/* User Distribution */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg">Distribuição de Usuários</CardTitle>
                  <p className="text-sm text-muted-foreground">Por status da conta</p>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <Doughnut data={userDistributionData} options={doughnutOptions} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* System Health */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-400" />
                      Saúde do Sistema
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Status dos serviços</p>
                  </div>
                  <Link href="/admin/system">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {services.map((service, index) => (
                    <ServiceStatusCard
                      key={index}
                      name={service.name}
                      status={service.status}
                      responseTime={service.responseTime}
                      icon={service.icon}
                    />
                  ))}
                </CardContent>
              </Card>

              {/* Alerts */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bell className="h-5 w-5 text-yellow-400" />
                      Alertas Recentes
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Últimas 24 horas</p>
                  </div>
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                    3 novos
                  </span>
                </CardHeader>
                <CardContent>
                  {alerts.map((alert, index) => (
                    <AlertItem
                      key={index}
                      title={alert.title}
                      description={alert.description}
                      time={alert.time}
                      severity={alert.severity}
                    />
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Ações Rápidas
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Acesso direto</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/admin/users">
                    <Button variant="outline" className="w-full justify-start bg-white/5 border-white/10 hover:bg-white/10">
                      <Users className="h-4 w-4 mr-3" />
                      Gerenciar Usuários
                    </Button>
                  </Link>
                  <Link href="/admin/billing">
                    <Button variant="outline" className="w-full justify-start bg-white/5 border-white/10 hover:bg-white/10">
                      <DollarSign className="h-4 w-4 mr-3" />
                      Ver Financeiro
                    </Button>
                  </Link>
                  <Link href="/admin/logs">
                    <Button variant="outline" className="w-full justify-start bg-white/5 border-white/10 hover:bg-white/10">
                      <Clock className="h-4 w-4 mr-3" />
                      Audit Logs
                    </Button>
                  </Link>
                  <Link href="/admin/errors">
                    <Button variant="outline" className="w-full justify-start bg-white/5 border-white/10 hover:bg-white/10">
                      <AlertTriangle className="h-4 w-4 mr-3" />
                      Monitorar Erros
                    </Button>
                  </Link>
                  <Link href="/admin/flags">
                    <Button variant="outline" className="w-full justify-start bg-white/5 border-white/10 hover:bg-white/10">
                      <Shield className="h-4 w-4 mr-3" />
                      Feature Flags
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Resource Usage */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-primary" />
                  Consumo de Recursos
                </CardTitle>
                <p className="text-sm text-muted-foreground">Utilização atual da infraestrutura</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">CPU</span>
                      <span className="text-sm font-bold">45%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all" style={{ width: '45%' }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">4 cores disponíveis</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Memória</span>
                      <span className="text-sm font-bold">62%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all" style={{ width: '62%' }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">4.96 GB / 8 GB</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Armazenamento</span>
                      <span className="text-sm font-bold">28%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all" style={{ width: '28%' }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">28 GB / 100 GB</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Latência Média</span>
                      <span className="text-sm font-bold text-green-400">89ms</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full transition-all" style={{ width: '35%' }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Excelente (&lt;100ms)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
