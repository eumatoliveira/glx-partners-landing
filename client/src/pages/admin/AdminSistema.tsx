import AdminLayout from "@/components/AdminLayout";
import { 
  Server, 
  Database,
  Cloud,
  Wifi,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Download
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Line } from "react-chartjs-2";
import { MotionPageShell } from "@/animation/components/MotionPageShell";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Mock data
const services = [
  { name: "API Principal", status: "online", latency: 45, uptime: 99.98, icon: Server },
  { name: "Banco de Dados", status: "online", latency: 12, uptime: 99.99, icon: Database },
  { name: "Workers", status: "online", latency: 89, uptime: 99.95, icon: Activity },
  { name: "CDN", status: "online", latency: 23, uptime: 99.99, icon: Cloud },
  { name: "WebSocket", status: "online", latency: 34, uptime: 99.97, icon: Wifi },
  { name: "Cache Redis", status: "warning", latency: 156, uptime: 99.85, icon: Database },
];

const resources = [
  { name: "CPU", usage: 45, limit: 100, unit: "%" },
  { name: "Memória", usage: 62, limit: 100, unit: "%" },
  { name: "Armazenamento", usage: 38, limit: 100, unit: "%" },
  { name: "Bandwidth", usage: 71, limit: 100, unit: "%" },
];

const latencyData = {
  labels: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
  datasets: [
    {
      label: "Latência (ms)",
      data: [42, 38, 35, 33, 45, 52, 68, 75, 82, 78, 65, 48],
      borderColor: "#f97316",
      backgroundColor: "rgba(249, 115, 22, 0.1)",
      tension: 0.4,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(255,255,255,0.1)",
      },
      ticks: {
        callback: (value: number | string) => `${value}ms`,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

const cloudCosts = {
  current: 2450,
  projected: 2650,
  budget: 3000,
  breakdown: [
    { service: "Compute (EC2)", cost: 1200, percentage: 49 },
    { service: "Database (RDS)", cost: 650, percentage: 27 },
    { service: "Storage (S3)", cost: 320, percentage: 13 },
    { service: "CDN (CloudFront)", cost: 180, percentage: 7 },
    { service: "Outros", cost: 100, percentage: 4 },
  ],
};

export default function AdminSistema() {
  const handleRefresh = () => {
    alert("Atualizando status dos serviços...");
  };

  const handleExport = () => {
    alert("Exportando relatório de infraestrutura...");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "offline":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-500/20 text-green-500">Online</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500/20 text-yellow-500">Degradado</Badge>;
      case "offline":
        return <Badge className="bg-red-500/20 text-red-500">Offline</Badge>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <MotionPageShell className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Saúde do Sistema</h1>
            <p className="text-muted-foreground">Monitoramento de infraestrutura em tempo real</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Services Status */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Status dos Serviços
            </CardTitle>
            <CardDescription>Saúde dos componentes de infraestrutura</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <div 
                  key={service.name} 
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      service.status === "online" ? "bg-green-500/20" :
                      service.status === "warning" ? "bg-yellow-500/20" : "bg-red-500/20"
                    }`}>
                      <service.icon className={`h-5 w-5 ${
                        service.status === "online" ? "text-green-500" :
                        service.status === "warning" ? "text-yellow-500" : "text-red-500"
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {service.latency}ms • {service.uptime}% uptime
                      </p>
                    </div>
                  </div>
                  {getStatusIcon(service.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resource Usage */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Consumo de Recursos
            </CardTitle>
            <CardDescription>Uso de infraestrutura no mês atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resources.map((resource) => (
                <div key={resource.name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{resource.name}</span>
                    <span className={`text-sm font-bold ${
                      resource.usage > 80 ? "text-red-500" :
                      resource.usage > 60 ? "text-yellow-500" : "text-green-500"
                    }`}>
                      {resource.usage}{resource.unit}
                    </span>
                  </div>
                  <Progress 
                    value={resource.usage} 
                    className={`h-3 ${
                      resource.usage > 80 ? "[&>div]:bg-red-500" :
                      resource.usage > 60 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-green-500"
                    }`}
                  />
                  <p className="text-xs text-muted-foreground">
                    {resource.usage > 80 ? "?? Atenção: uso elevado" :
                     resource.usage > 60 ? "Uso moderado" : "? Uso normal"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Latency Chart */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Latência Média (24h)</CardTitle>
            <CardDescription>Tempo de resposta global da aplicação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Line data={latencyData} options={chartOptions} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-2xl font-bold text-green-500">35ms</p>
                <p className="text-sm text-muted-foreground">Mínima</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-2xl font-bold">52ms</p>
                <p className="text-sm text-muted-foreground">Média</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-2xl font-bold text-yellow-500">82ms</p>
                <p className="text-sm text-muted-foreground">Máxima</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cloud Costs */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Previsão de Gastos Cloud
            </CardTitle>
            <CardDescription>Estimativa baseada no uso atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cost Summary */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="text-sm text-muted-foreground">Gasto Atual (mês)</p>
                    <p className="text-2xl font-bold">R$ {cloudCosts.current.toLocaleString()}</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-500">
                    {Math.round(cloudCosts.current / cloudCosts.budget * 100)}% do budget
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="text-sm text-muted-foreground">Projeção Final</p>
                    <p className="text-2xl font-bold text-primary">R$ {cloudCosts.projected.toLocaleString()}</p>
                  </div>
                  <Badge variant="outline">
                    +{Math.round((cloudCosts.projected - cloudCosts.current) / cloudCosts.current * 100)}% restante
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="text-sm text-muted-foreground">Budget Mensal</p>
                    <p className="text-2xl font-bold">R$ {cloudCosts.budget.toLocaleString()}</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-500">
                    Dentro do limite
                  </Badge>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3">
                <p className="font-medium">Breakdown por Serviço</p>
                {cloudCosts.breakdown.map((item) => (
                  <div key={item.service} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{item.service}</span>
                      <span className="font-medium">R$ {item.cost.toLocaleString()} ({item.percentage}%)</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionPageShell>
    </AdminLayout>
  );
}


