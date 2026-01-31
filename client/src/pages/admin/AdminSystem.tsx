import { useAuth } from "@/_core/hooks/useAuth";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { 
  Activity, 
  Server, 
  Database, 
  Cloud, 
  Wifi,
  Cpu,
  HardDrive,
  MemoryStick,
  Globe,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Clock,
  Zap,
  Download,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { Redirect } from "wouter";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { toast } from "sonner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "down";
  responseTime: number;
  uptime: number;
  icon: React.ElementType;
}

function ServiceCard({ service }: { service: ServiceStatus }) {
  const statusConfig = {
    operational: { 
      icon: CheckCircle2, 
      color: "text-green-400", 
      bg: "bg-green-500/20", 
      border: "border-green-500/30",
      label: "Operacional" 
    },
    degraded: { 
      icon: AlertCircle, 
      color: "text-yellow-400", 
      bg: "bg-yellow-500/20", 
      border: "border-yellow-500/30",
      label: "Degradado" 
    },
    down: { 
      icon: XCircle, 
      color: "text-red-400", 
      bg: "bg-red-500/20", 
      border: "border-red-500/30",
      label: "Offline" 
    }
  };

  const config = statusConfig[service.status];
  const StatusIcon = config.icon;
  const ServiceIcon = service.icon;

  return (
    <Card className={cn("bg-white/5 border", config.border)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", config.bg)}>
              <ServiceIcon className={cn("h-5 w-5", config.color)} />
            </div>
            <div>
              <h3 className="font-semibold">{service.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <StatusIcon className={cn("h-4 w-4", config.color)} />
                <span className={cn("text-sm", config.color)}>{config.label}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Latência</p>
            <p className={cn(
              "font-semibold",
              service.responseTime < 100 ? "text-green-400" : 
              service.responseTime < 300 ? "text-yellow-400" : "text-red-400"
            )}>
              {service.responseTime}ms
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Uptime</p>
            <p className="font-semibold text-green-400">{service.uptime}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ResourceBar({ 
  label, 
  value, 
  max, 
  unit,
  color = "primary"
}: { 
  label: string; 
  value: number; 
  max: number;
  unit: string;
  color?: "primary" | "green" | "yellow" | "red" | "blue";
}) {
  const percentage = (value / max) * 100;
  const colorStyles = {
    primary: "from-primary to-orange-400",
    green: "from-green-500 to-green-400",
    yellow: "from-yellow-500 to-yellow-400",
    red: "from-red-500 to-red-400",
    blue: "from-blue-500 to-blue-400"
  };

  const getColor = () => {
    if (percentage < 60) return "green";
    if (percentage < 80) return "yellow";
    return "red";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-bold">{percentage.toFixed(0)}%</span>
      </div>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all bg-gradient-to-r",
            colorStyles[color] || colorStyles[getColor()]
          )} 
          style={{ width: `${percentage}%` }} 
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {value.toFixed(1)} {unit} / {max} {unit}
      </p>
    </div>
  );
}

export default function AdminSystem() {
  const { user, loading: authLoading } = useAuth();
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data - in production, this would come from actual monitoring
  const services: ServiceStatus[] = [
    { name: "API Principal", status: "operational", responseTime: 45, uptime: 99.98, icon: Server },
    { name: "Banco de Dados", status: "operational", responseTime: 12, uptime: 99.99, icon: Database },
    { name: "CDN / Assets", status: "operational", responseTime: 23, uptime: 99.95, icon: Cloud },
    { name: "WebSocket", status: "operational", responseTime: 8, uptime: 99.97, icon: Wifi },
    { name: "Workers", status: "operational", responseTime: 156, uptime: 99.90, icon: Zap },
    { name: "DNS", status: "operational", responseTime: 5, uptime: 100, icon: Globe },
  ];

  const resources = {
    cpu: { value: 45, max: 100, unit: "%" },
    memory: { value: 4.96, max: 8, unit: "GB" },
    storage: { value: 28, max: 100, unit: "GB" },
    bandwidth: { value: 1.2, max: 5, unit: "TB" }
  };

  const latencyData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Agora'],
    datasets: [
      {
        label: 'Latência (ms)',
        data: [42, 38, 45, 52, 48, 44, 45],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
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
        ticks: { color: 'rgba(255,255,255,0.5)' },
        min: 0,
        max: 100,
      },
    },
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefresh(new Date());
      setIsRefreshing(false);
      toast.success("Dados atualizados!");
    }, 1000);
  };

  const exportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      services: services.map(s => ({
        name: s.name,
        status: s.status,
        responseTime: s.responseTime,
        uptime: s.uptime
      })),
      resources: {
        cpu: `${resources.cpu.value}%`,
        memory: `${resources.memory.value}GB / ${resources.memory.max}GB`,
        storage: `${resources.storage.value}GB / ${resources.storage.max}GB`,
        bandwidth: `${resources.bandwidth.value}TB / ${resources.bandwidth.max}TB`
      }
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `system_health_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast.success("Relatório exportado!");
  };

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

  const operationalCount = services.filter(s => s.status === "operational").length;
  const avgLatency = Math.round(services.reduce((acc, s) => acc + s.responseTime, 0) / services.length);
  const avgUptime = (services.reduce((acc, s) => acc + s.uptime, 0) / services.length).toFixed(2);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="h-6 w-6 text-green-400" />
              Saúde do Sistema
            </h1>
            <p className="text-muted-foreground">Monitoramento de infraestrutura em tempo real</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-4 w-4" />
              Última atualização: {lastRefresh.toLocaleTimeString('pt-BR')}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-white/5 border-white/10"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
              Atualizar
            </Button>
            <Button variant="outline" size="sm" onClick={exportReport} className="bg-white/5 border-white/10">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Serviços Online</p>
                  <p className="text-3xl font-bold text-green-400">{operationalCount}/{services.length}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Latência Média</p>
                  <p className="text-3xl font-bold text-blue-400">{avgLatency}ms</p>
                </div>
                <Zap className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-purple-500/10 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Uptime Médio</p>
                  <p className="text-3xl font-bold text-purple-400">{avgUptime}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary/10 border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Previsão Cloud</p>
                  <p className="text-3xl font-bold text-primary">R$2.4k</p>
                </div>
                <Cloud className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Grid */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Status dos Serviços</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>

        {/* Resources & Latency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resource Usage */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" />
                Consumo de Recursos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ResourceBar 
                label="CPU" 
                value={resources.cpu.value} 
                max={resources.cpu.max} 
                unit="%" 
              />
              <ResourceBar 
                label="Memória" 
                value={resources.memory.value} 
                max={resources.memory.max} 
                unit="GB" 
              />
              <ResourceBar 
                label="Armazenamento" 
                value={resources.storage.value} 
                max={resources.storage.max} 
                unit="GB" 
              />
              <ResourceBar 
                label="Bandwidth (mês)" 
                value={resources.bandwidth.value} 
                max={resources.bandwidth.max} 
                unit="TB" 
              />
            </CardContent>
          </Card>

          {/* Latency Chart */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-400" />
                Latência (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <Line data={latencyData} options={chartOptions as any} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cloud Cost Breakdown */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Cloud className="h-5 w-5 text-primary" />
              Previsão de Gastos Cloud (Mês Atual)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-muted-foreground">Compute</p>
                <p className="text-xl font-bold">R$1.200</p>
                <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3" /> -5% vs anterior
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-muted-foreground">Database</p>
                <p className="text-xl font-bold">R$650</p>
                <p className="text-xs text-muted-foreground mt-1">Estável</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-muted-foreground">Storage</p>
                <p className="text-xl font-bold">R$320</p>
                <p className="text-xs text-yellow-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> +12% vs anterior
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-muted-foreground">Bandwidth</p>
                <p className="text-xl font-bold">R$230</p>
                <p className="text-xs text-muted-foreground mt-1">Estável</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
