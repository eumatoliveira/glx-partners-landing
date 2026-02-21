import AdminLayout from "@/components/AdminLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
  Cloud,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

const copyByLang = {
  pt: {
    title: "Centro de Comando",
    subtitle: "Visao geral do sistema em tempo real",
    lastUpdate: "Ultima atualizacao: agora",
    versusPrevMonth: "vs mes anterior",
    systemTitle: "Status do Sistema",
    systemSubtitle: "Saude dos servicos em tempo real",
    viewDetails: "Ver detalhes",
    alertsTitle: "Alertas Recentes",
    alertsSubtitle: "Notificacoes importantes do sistema",
    viewAllAlerts: "Ver todos os alertas",
    pendingTitle: "Acoes Pendentes",
    pendingSubtitle: "Tarefas que requerem atencao",
    financeBtn: "Financeiro",
    usersBtn: "Usuarios",
    resourceTitle: "Consumo de Recursos",
    resourceSubtitle: "Uso de infraestrutura no mes atual",
    cloudForecast: "Previsao de Gastos Cloud",
    basedOnCurrent: "Baseado no uso atual",
    quickActionsTitle: "Acoes Rapidas",
    quickFinance: "Financeiro",
    quickUsers: "Usuarios",
    quickSystem: "Sistema",
    quickFlags: "Feature Flags",
    mrrDesc: "Receita Mensal Recorrente",
    arrDesc: "Receita Anual Recorrente",
    churnDesc: "Taxa de cancelamento",
    activeUsersDesc: "Ultimos 30 dias",
    cpu: "CPU",
    memory: "Memoria",
    storage: "Armazenamento",
    bandwidth: "Bandwidth",
    cloudGrowth: "+8% vs mes anterior",
    alerts: [
      "Churn rate aumentou 0.3% esta semana",
      "3 falhas de pagamento detectadas",
      "Backup automatico concluido",
      "5 novos usuarios cadastrados hoje",
    ],
    alertsTime: ["2h atras", "4h atras", "6h atras", "8h atras"],
    pending: [
      "Revisar pagamentos em atraso",
      "Aprovar novos usuarios",
      "Atualizar feature flags",
    ],
  },
  en: {
    title: "Command Center",
    subtitle: "Real-time system overview",
    lastUpdate: "Last update: now",
    versusPrevMonth: "vs previous month",
    systemTitle: "System Status",
    systemSubtitle: "Real-time service health",
    viewDetails: "View details",
    alertsTitle: "Recent Alerts",
    alertsSubtitle: "Important system notifications",
    viewAllAlerts: "View all alerts",
    pendingTitle: "Pending Actions",
    pendingSubtitle: "Tasks that require attention",
    financeBtn: "Financial",
    usersBtn: "Users",
    resourceTitle: "Resource Usage",
    resourceSubtitle: "Infrastructure usage this month",
    cloudForecast: "Cloud Cost Forecast",
    basedOnCurrent: "Based on current usage",
    quickActionsTitle: "Quick Actions",
    quickFinance: "Financial",
    quickUsers: "Users",
    quickSystem: "System",
    quickFlags: "Feature Flags",
    mrrDesc: "Monthly Recurring Revenue",
    arrDesc: "Annual Recurring Revenue",
    churnDesc: "Cancellation rate",
    activeUsersDesc: "Last 30 days",
    cpu: "CPU",
    memory: "Memory",
    storage: "Storage",
    bandwidth: "Bandwidth",
    cloudGrowth: "+8% vs previous month",
    alerts: [
      "Churn rate increased by 0.3% this week",
      "3 payment failures detected",
      "Automatic backup completed",
      "5 new users created today",
    ],
    alertsTime: ["2h ago", "4h ago", "6h ago", "8h ago"],
    pending: [
      "Review overdue payments",
      "Approve new users",
      "Update feature flags",
    ],
  },
  es: {
    title: "Centro de Comando",
    subtitle: "Vista general del sistema en tiempo real",
    lastUpdate: "Ultima actualizacion: ahora",
    versusPrevMonth: "vs mes anterior",
    systemTitle: "Estado del Sistema",
    systemSubtitle: "Salud de servicios en tiempo real",
    viewDetails: "Ver detalles",
    alertsTitle: "Alertas Recientes",
    alertsSubtitle: "Notificaciones importantes del sistema",
    viewAllAlerts: "Ver todas las alertas",
    pendingTitle: "Acciones Pendientes",
    pendingSubtitle: "Tareas que requieren atencion",
    financeBtn: "Finanzas",
    usersBtn: "Usuarios",
    resourceTitle: "Consumo de Recursos",
    resourceSubtitle: "Uso de infraestructura en el mes actual",
    cloudForecast: "Prevision de Coste Cloud",
    basedOnCurrent: "Basado en uso actual",
    quickActionsTitle: "Acciones Rapidas",
    quickFinance: "Finanzas",
    quickUsers: "Usuarios",
    quickSystem: "Sistema",
    quickFlags: "Feature Flags",
    mrrDesc: "Ingreso Mensual Recurrente",
    arrDesc: "Ingreso Anual Recurrente",
    churnDesc: "Tasa de cancelacion",
    activeUsersDesc: "Ultimos 30 dias",
    cpu: "CPU",
    memory: "Memoria",
    storage: "Almacenamiento",
    bandwidth: "Bandwidth",
    cloudGrowth: "+8% vs mes anterior",
    alerts: [
      "Churn subio 0.3% esta semana",
      "3 fallas de pago detectadas",
      "Backup automatico completado",
      "5 nuevos usuarios creados hoy",
    ],
    alertsTime: ["2h atras", "4h atras", "6h atras", "8h atras"],
    pending: [
      "Revisar pagos vencidos",
      "Aprobar nuevos usuarios",
      "Actualizar feature flags",
    ],
  },
} as const;

const systemStatus = [
  { name: "API", status: "online", latency: "45ms" },
  { name: "Database", status: "online", latency: "12ms" },
  { name: "Workers", status: "online", latency: "89ms" },
  { name: "CDN", status: "online", latency: "23ms" },
];

export default function AdminDashboard() {
  const { language } = useLanguage();
  const c = copyByLang[language];

  const kpis = [
    {
      title: "MRR",
      value: "R$ 485.000",
      change: "+12.3%",
      trend: "up",
      description: c.mrrDesc,
      icon: DollarSign,
    },
    {
      title: "ARR",
      value: "R$ 5.82M",
      change: "+15.8%",
      trend: "up",
      description: c.arrDesc,
      icon: TrendingUp,
    },
    {
      title: "Churn Rate",
      value: "3.2%",
      change: "-0.5%",
      trend: "down",
      description: c.churnDesc,
      icon: TrendingDown,
    },
    {
      title: language === "en" ? "Active Users" : language === "es" ? "Usuarios Activos" : "Usuarios Ativos",
      value: "1,247",
      change: "+8.2%",
      trend: "up",
      description: c.activeUsersDesc,
      icon: Users,
    },
  ];

  const pendingActions = [
    { id: 1, action: c.pending[0], count: 3, priority: "high" },
    { id: 2, action: c.pending[1], count: 5, priority: "medium" },
    { id: 3, action: c.pending[2], count: 2, priority: "low" },
  ];

  const recentAlerts = [
    { id: 1, type: "warning", message: c.alerts[0], time: c.alertsTime[0] },
    { id: 2, type: "error", message: c.alerts[1], time: c.alertsTime[1] },
    { id: 3, type: "success", message: c.alerts[2], time: c.alertsTime[2] },
    { id: 4, type: "info", message: c.alerts[3], time: c.alertsTime[3] },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{c.title}</h1>
            <p className="text-muted-foreground">{c.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              {c.lastUpdate}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <Card key={kpi.title} className="bg-card/50 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {kpi.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-green-500" />
                  )}
                  <span className="text-green-500">{kpi.change}</span>
                  <span className="text-xs text-muted-foreground">{c.versusPrevMonth}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                {c.systemTitle}
              </CardTitle>
              <CardDescription>{c.systemSubtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemStatus.map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={cn("h-3 w-3 rounded-full", service.status === "online" ? "bg-green-500" : "bg-red-500")} />
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{service.latency}</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              ))}
              <Link href="/admin/sistema">
                <Button variant="outline" className="w-full mt-4">
                  {c.viewDetails}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {c.alertsTitle}
              </CardTitle>
              <CardDescription>{c.alertsSubtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full mt-2 flex-shrink-0",
                      alert.type === "error" ? "bg-red-500" : alert.type === "warning" ? "bg-yellow-500" : alert.type === "success" ? "bg-green-500" : "bg-blue-500",
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
              <Link href="/admin/erros">
                <Button variant="outline" className="w-full mt-2">
                  {c.viewAllAlerts}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {c.pendingTitle}
              </CardTitle>
              <CardDescription>{c.pendingSubtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingActions.map((action) => (
                <div key={action.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <span className={cn("h-2 w-2 rounded-full", action.priority === "high" ? "bg-red-500" : action.priority === "medium" ? "bg-yellow-500" : "bg-blue-500")} />
                    <span className="text-sm">{action.action}</span>
                  </div>
                  <span className="text-sm font-medium bg-muted px-2 py-0.5 rounded">{action.count}</span>
                </div>
              ))}
              <div className="flex gap-2 mt-4">
                <Link href="/admin/financeiro" className="flex-1">
                  <Button variant="outline" className="w-full">
                    {c.financeBtn}
                  </Button>
                </Link>
                <Link href="/admin/usuarios" className="flex-1">
                  <Button variant="outline" className="w-full">
                    {c.usersBtn}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              {c.resourceTitle}
            </CardTitle>
            <CardDescription>{c.resourceSubtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{c.cpu}</span>
                  <span className="text-sm text-muted-foreground">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{c.memory}</span>
                  <span className="text-sm text-muted-foreground">62%</span>
                </div>
                <Progress value={62} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{c.storage}</span>
                  <span className="text-sm text-muted-foreground">38%</span>
                </div>
                <Progress value={38} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{c.bandwidth}</span>
                  <span className="text-sm text-muted-foreground">71%</span>
                </div>
                <Progress value={71} className="h-2" />
              </div>
            </div>
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{c.cloudForecast}</p>
                  <p className="text-sm text-muted-foreground">{c.basedOnCurrent}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">R$ 2.450</p>
                  <p className="text-sm text-muted-foreground">{c.cloudGrowth}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/financeiro">
            <Card className="bg-card/50 border-border/50 hover:bg-muted/50 cursor-pointer transition-colors">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <DollarSign className="h-8 w-8 text-primary mb-2" />
                <span className="font-medium">{c.quickFinance}</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/usuarios">
            <Card className="bg-card/50 border-border/50 hover:bg-muted/50 cursor-pointer transition-colors">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <Users className="h-8 w-8 text-primary mb-2" />
                <span className="font-medium">{c.quickUsers}</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/sistema">
            <Card className="bg-card/50 border-border/50 hover:bg-muted/50 cursor-pointer transition-colors">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <Server className="h-8 w-8 text-primary mb-2" />
                <span className="font-medium">{c.quickSystem}</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/flags">
            <Card className="bg-card/50 border-border/50 hover:bg-muted/50 cursor-pointer transition-colors">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <Zap className="h-8 w-8 text-primary mb-2" />
                <span className="font-medium">{c.quickFlags}</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
