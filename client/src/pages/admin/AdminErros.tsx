import AdminLayout from "@/components/AdminLayout";
import { 
  AlertTriangle, 
  AlertCircle,
  XCircle,
  Terminal,
  RefreshCw,
  Download,
  Filter,
  Bell,
  BellOff
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect, useRef } from "react";
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
const errorRateData = {
  labels: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
  datasets: [
    {
      label: "Erros 4xx",
      data: [12, 8, 5, 3, 15, 28, 45, 38, 52, 35, 22, 18],
      borderColor: "#eab308",
      backgroundColor: "rgba(234, 179, 8, 0.1)",
      tension: 0.4,
    },
    {
      label: "Erros 5xx",
      data: [2, 1, 0, 1, 3, 8, 12, 15, 18, 10, 5, 3],
      borderColor: "#ef4444",
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      tension: 0.4,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(255,255,255,0.1)",
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

const alerts = [
  { id: 1, type: "critical", module: "API", message: "Taxa de erro 5xx acima de 10% no módulo de pagamentos", time: "5 min atrás", active: true },
  { id: 2, type: "warning", module: "Database", message: "Latência do banco de dados acima de 100ms", time: "15 min atrás", active: true },
  { id: 3, type: "warning", module: "Workers", message: "Fila de processamento com 500+ itens pendentes", time: "30 min atrás", active: false },
  { id: 4, type: "info", module: "CDN", message: "Cache invalidado para /api/v2/*", time: "1h atrás", active: false },
];

const initialLogs = [
  { timestamp: "16:37:28", level: "ERROR", module: "payment", message: "Failed to process payment for user_id=12345: Card declined" },
  { timestamp: "16:37:25", level: "WARN", module: "auth", message: "Multiple failed login attempts for email=test@example.com" },
  { timestamp: "16:37:22", level: "INFO", module: "api", message: "Request completed: POST /api/v2/appointments (200) - 145ms" },
  { timestamp: "16:37:18", level: "ERROR", module: "database", message: "Connection timeout after 30000ms - retrying..." },
  { timestamp: "16:37:15", level: "INFO", module: "worker", message: "Job completed: send_email_batch (processed: 250, failed: 2)" },
  { timestamp: "16:37:12", level: "DEBUG", module: "cache", message: "Cache miss for key: user_preferences_12345" },
  { timestamp: "16:37:08", level: "WARN", module: "api", message: "Rate limit approaching for client_id=abc123 (80/100 requests)" },
  { timestamp: "16:37:05", level: "INFO", module: "system", message: "Health check passed - all services operational" },
];

export default function AdminErros() {
  const [periodo, setPeriodo] = useState("24h");
  const [logFilter, setLogFilter] = useState("all");
  const [logs, setLogs] = useState(initialLogs);
  const [isLive, setIsLive] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Simulate live logs
  useEffect(() => {
    if (!isLive) return;

    const newLogMessages = [
      { level: "INFO", module: "api", message: "Request completed: GET /api/v2/users (200) - 45ms" },
      { level: "WARN", module: "auth", message: "Token refresh required for session_id=xyz789" },
      { level: "ERROR", module: "payment", message: "Webhook delivery failed: timeout after 5000ms" },
      { level: "DEBUG", module: "cache", message: "Cache hit for key: clinic_settings_456" },
      { level: "INFO", module: "worker", message: "Starting job: generate_monthly_report" },
    ];

    const interval = setInterval(() => {
      const randomLog = newLogMessages[Math.floor(Math.random() * newLogMessages.length)];
      const now = new Date();
      const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      setLogs(prev => [{
        timestamp,
        ...randomLog
      }, ...prev.slice(0, 49)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const filteredLogs = logs.filter(log => {
    if (logFilter === "all") return true;
    return log.level.toLowerCase() === logFilter;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "ERROR": return "text-red-500";
      case "WARN": return "text-yellow-500";
      case "INFO": return "text-blue-500";
      case "DEBUG": return "text-gray-500";
      default: return "text-white";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical": return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "info": return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default: return null;
    }
  };

  return (
    <AdminLayout>
      <MotionPageShell className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Identificação de Erros</h1>
            <p className="text-muted-foreground">Observabilidade e monitoramento em tempo real</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 hora</SelectItem>
                <SelectItem value="6h">6 horas</SelectItem>
                <SelectItem value="24h">24 horas</SelectItem>
                <SelectItem value="7d">7 dias</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Error Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Erros 4xx (24h)</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">287</div>
              <p className="text-xs text-muted-foreground">+12% vs ontem</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Erros 5xx (24h)</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">78</div>
              <p className="text-xs text-muted-foreground">-5% vs ontem</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Error Rate</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0.8%</div>
              <Badge className="mt-1 bg-green-500/20 text-green-500">Saudável</Badge>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Alertas Ativos</CardTitle>
              <Bell className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alerts.filter(a => a.active).length}</div>
              <p className="text-xs text-muted-foreground">Requerem atenção</p>
            </CardContent>
          </Card>
        </div>

        {/* Error Rate Chart */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Taxa de Erros (24h)</CardTitle>
            <CardDescription>Distribuição de erros 4xx e 5xx ao longo do dia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Line data={errorRateData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Alertas Inteligentes
            </CardTitle>
            <CardDescription>Notificações automáticas de anomalias</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`flex items-start gap-4 p-4 rounded-lg border ${
                  alert.active ? "bg-muted/50 border-border" : "bg-muted/20 border-border/50 opacity-60"
                }`}
              >
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{alert.module}</Badge>
                    {alert.active && <Badge className="bg-red-500/20 text-red-500">Ativo</Badge>}
                  </div>
                  <p className="mt-1">{alert.message}</p>
                  <p className="text-sm text-muted-foreground mt-1">{alert.time}</p>
                </div>
                <Button variant="ghost" size="sm">
                  {alert.active ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Live Logs */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Live Logs
                </CardTitle>
                <CardDescription>Feed em tempo real dos eventos do sistema</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={logFilter} onValueChange={setLogFilter}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant={isLive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsLive(!isLive)}
                >
                  {isLive ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2" />
                      Live
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Pausado
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-sm h-96 overflow-y-auto">
              {filteredLogs.map((log, index) => (
                <div key={index} className="flex gap-4 py-1 hover:bg-white/5">
                  <span className="text-gray-500 flex-shrink-0">{log.timestamp}</span>
                  <span className={`flex-shrink-0 w-14 ${getLevelColor(log.level)}`}>
                    [{log.level}]
                  </span>
                  <span className="text-cyan-400 flex-shrink-0 w-20">[{log.module}]</span>
                  <span className="text-gray-300">{log.message}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </CardContent>
        </Card>
      </MotionPageShell>
    </AdminLayout>
  );
}


