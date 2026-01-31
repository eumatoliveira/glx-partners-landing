import AdminLayout from "@/components/AdminLayout";
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
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";

// Mock data for dashboard
const kpis = [
  {
    title: "MRR",
    value: "R$ 485.000",
    change: "+12.3%",
    trend: "up",
    description: "Receita Mensal Recorrente",
    icon: DollarSign,
  },
  {
    title: "ARR",
    value: "R$ 5.82M",
    change: "+15.8%",
    trend: "up",
    description: "Receita Anual Recorrente",
    icon: TrendingUp,
  },
  {
    title: "Churn Rate",
    value: "3.2%",
    change: "-0.5%",
    trend: "down",
    description: "Taxa de cancelamento",
    icon: TrendingDown,
  },
  {
    title: "Usuários Ativos",
    value: "1,247",
    change: "+8.2%",
    trend: "up",
    description: "Últimos 30 dias",
    icon: Users,
  },
];

const systemStatus = [
  { name: "API", status: "online", latency: "45ms" },
  { name: "Database", status: "online", latency: "12ms" },
  { name: "Workers", status: "online", latency: "89ms" },
  { name: "CDN", status: "online", latency: "23ms" },
];

const recentAlerts = [
  { id: 1, type: "warning", message: "Churn rate aumentou 0.3% esta semana", time: "2h atrás" },
  { id: 2, type: "error", message: "3 falhas de pagamento detectadas", time: "4h atrás" },
  { id: 3, type: "success", message: "Backup automático concluído", time: "6h atrás" },
  { id: 4, type: "info", message: "5 novos usuários cadastrados hoje", time: "8h atrás" },
];

const pendingActions = [
  { id: 1, action: "Revisar pagamentos em atraso", count: 3, priority: "high" },
  { id: 2, action: "Aprovar novos usuários", count: 5, priority: "medium" },
  { id: 3, action: "Atualizar feature flags", count: 2, priority: "low" },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Centro de Comando</h1>
            <p className="text-muted-foreground">Visão geral do sistema em tempo real</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Última atualização: agora
            </span>
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <Card key={kpi.title} className="bg-card/50 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
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
                  <span className="text-xs text-muted-foreground">vs mês anterior</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Status */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Status do Sistema
              </CardTitle>
              <CardDescription>Saúde dos serviços em tempo real</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemStatus.map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${
                      service.status === "online" ? "bg-green-500" : "bg-red-500"
                    }`} />
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
                  Ver detalhes
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alertas Recentes
              </CardTitle>
              <CardDescription>Notificações importantes do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <span className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${
                    alert.type === "error" ? "bg-red-500" :
                    alert.type === "warning" ? "bg-yellow-500" :
                    alert.type === "success" ? "bg-green-500" : "bg-blue-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
              <Link href="/admin/erros">
                <Button variant="outline" className="w-full mt-2">
                  Ver todos os alertas
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pending Actions */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Ações Pendentes
              </CardTitle>
              <CardDescription>Tarefas que requerem atenção</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingActions.map((action) => (
                <div key={action.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <span className={`h-2 w-2 rounded-full ${
                      action.priority === "high" ? "bg-red-500" :
                      action.priority === "medium" ? "bg-yellow-500" : "bg-blue-500"
                    }`} />
                    <span className="text-sm">{action.action}</span>
                  </div>
                  <span className="text-sm font-medium bg-muted px-2 py-0.5 rounded">
                    {action.count}
                  </span>
                </div>
              ))}
              <div className="flex gap-2 mt-4">
                <Link href="/admin/financeiro" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Financeiro
                  </Button>
                </Link>
                <Link href="/admin/usuarios" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Usuários
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resource Usage */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Consumo de Recursos
            </CardTitle>
            <CardDescription>Uso de infraestrutura no mês atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">CPU</span>
                  <span className="text-sm text-muted-foreground">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Memória</span>
                  <span className="text-sm text-muted-foreground">62%</span>
                </div>
                <Progress value={62} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Armazenamento</span>
                  <span className="text-sm text-muted-foreground">38%</span>
                </div>
                <Progress value={38} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Bandwidth</span>
                  <span className="text-sm text-muted-foreground">71%</span>
                </div>
                <Progress value={71} className="h-2" />
              </div>
            </div>
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Previsão de Gastos Cloud</p>
                  <p className="text-sm text-muted-foreground">Baseado no uso atual</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">R$ 2.450</p>
                  <p className="text-sm text-muted-foreground">+8% vs mês anterior</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/financeiro">
            <Card className="bg-card/50 border-border/50 hover:bg-muted/50 cursor-pointer transition-colors">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <DollarSign className="h-8 w-8 text-primary mb-2" />
                <span className="font-medium">Financeiro</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/usuarios">
            <Card className="bg-card/50 border-border/50 hover:bg-muted/50 cursor-pointer transition-colors">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <Users className="h-8 w-8 text-primary mb-2" />
                <span className="font-medium">Usuários</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/sistema">
            <Card className="bg-card/50 border-border/50 hover:bg-muted/50 cursor-pointer transition-colors">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <Server className="h-8 w-8 text-primary mb-2" />
                <span className="font-medium">Sistema</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/flags">
            <Card className="bg-card/50 border-border/50 hover:bg-muted/50 cursor-pointer transition-colors">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <Zap className="h-8 w-8 text-primary mb-2" />
                <span className="font-medium">Feature Flags</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
