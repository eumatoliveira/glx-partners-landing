import { useState } from "react";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Star,
  Calendar,
  ArrowRight,
  Bell,
  Target,
  Activity,
} from "lucide-react";

// Mock data for sparklines
const generateSparklineData = (trend: "up" | "down" | "stable") => {
  const base = 50;
  const data = [];
  for (let i = 0; i < 6; i++) {
    const variance = Math.random() * 20 - 10;
    const trendFactor = trend === "up" ? i * 3 : trend === "down" ? -i * 3 : 0;
    data.push(Math.max(10, Math.min(90, base + variance + trendFactor)));
  }
  return data;
};

// Sparkline component
function Sparkline({ data, color = "#f97316" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 24;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} className="inline-block ml-2">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// KPI Card component
interface KPICardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  sparklineData: number[];
  trend: "up" | "down" | "stable";
}

function KPICard({ title, value, change, changeLabel, icon, sparklineData, trend }: KPICardProps) {
  const isPositive = change >= 0;
  const trendColor = trend === "up" ? "#22c55e" : trend === "down" ? "#ef4444" : "#f97316";
  
  return (
    <Card className="bg-[#1E1E1E] border-[#2a2a2a] hover:border-orange-500/50 transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
            {icon}
          </div>
          <Sparkline data={sparklineData} color={trendColor} />
        </div>
        <div className="space-y-1">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={cn(
              "text-sm font-medium",
              isPositive ? "text-green-500" : "text-red-500"
            )}>
              {isPositive ? "+" : ""}{change}%
            </span>
            <span className="text-gray-500 text-sm">{changeLabel}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Alert item component
interface AlertItemProps {
  type: "critical" | "warning" | "info";
  message: string;
  time: string;
  action?: string;
}

function AlertItem({ type, message, time, action }: AlertItemProps) {
  const colors = {
    critical: "bg-red-500/10 border-red-500/30 text-red-500",
    warning: "bg-orange-500/10 border-orange-500/30 text-orange-500",
    info: "bg-blue-500/10 border-blue-500/30 text-blue-500",
  };
  
  const icons = {
    critical: <AlertTriangle className="w-5 h-5" />,
    warning: <Clock className="w-5 h-5" />,
    info: <CheckCircle className="w-5 h-5" />,
  };

  return (
    <div className={cn(
      "flex items-start gap-4 p-4 rounded-lg border",
      colors[type]
    )}>
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium">{message}</p>
        <p className="text-gray-500 text-xs mt-1">{time}</p>
      </div>
      {action && (
        <Button size="sm" variant="ghost" className="text-orange-500 hover:text-orange-400 hover:bg-orange-500/10">
          {action}
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      )}
    </div>
  );
}

export default function CEOScorecard() {
  const kpiData = [
    {
      title: "Faturamento",
      value: "R$ 2.4M",
      change: 12.5,
      changeLabel: "vs mês anterior",
      icon: <DollarSign className="w-5 h-5" />,
      sparklineData: generateSparklineData("up"),
      trend: "up" as const,
    },
    {
      title: "EBITDA",
      value: "R$ 480K",
      change: 8.3,
      changeLabel: "vs mês anterior",
      icon: <TrendingUp className="w-5 h-5" />,
      sparklineData: generateSparklineData("up"),
      trend: "up" as const,
    },
    {
      title: "NPS Score",
      value: "72",
      change: -2.1,
      changeLabel: "vs mês anterior",
      icon: <Star className="w-5 h-5" />,
      sparklineData: generateSparklineData("down"),
      trend: "down" as const,
    },
    {
      title: "Ocupação",
      value: "87%",
      change: 5.2,
      changeLabel: "vs mês anterior",
      icon: <Calendar className="w-5 h-5" />,
      sparklineData: generateSparklineData("up"),
      trend: "up" as const,
    },
  ];

  const alerts = [
    {
      type: "critical" as const,
      message: "Taxa de No-show acima do Limite de Controle Superior em Dermatologia (18.5%)",
      time: "2 horas atrás",
      action: "Investigar",
    },
    {
      type: "warning" as const,
      message: "Churn rate aumentou 0.8% esta semana - 3 cancelamentos detectados",
      time: "4 horas atrás",
      action: "Ver detalhes",
    },
    {
      type: "warning" as const,
      message: "Margem de contribuição abaixo da meta em Procedimentos Estéticos",
      time: "6 horas atrás",
      action: "Analisar",
    },
    {
      type: "info" as const,
      message: "Backup automático concluído com sucesso",
      time: "8 horas atrás",
    },
  ];

  // Forecast data
  const forecastData = [
    { month: "Jan", realizado: 2100, meta: 2000, forecast: 2150 },
    { month: "Fev", realizado: 2250, meta: 2100, forecast: 2300 },
    { month: "Mar", realizado: 2180, meta: 2200, forecast: 2250 },
    { month: "Abr", realizado: 2400, meta: 2300, forecast: 2450 },
    { month: "Mai", realizado: null, meta: 2400, forecast: 2500 },
    { month: "Jun", realizado: null, meta: 2500, forecast: 2600 },
  ];

  const maxValue = Math.max(...forecastData.flatMap(d => [d.realizado || 0, d.meta, d.forecast]));

  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">CEO Scorecard</h1>
            <p className="text-gray-400 mt-1">Visão executiva em tempo real • Última atualização: agora</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-green-500 font-medium">Sistema Operacional</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts Section */}
          <div className="lg:col-span-2">
            <Card className="bg-[#1E1E1E] border-[#2a2a2a] h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-500" />
                  <CardTitle className="text-white text-lg">Alertas Andon</CardTitle>
                </div>
                <span className="text-xs text-gray-500 bg-[#2a2a2a] px-2 py-1 rounded">
                  {alerts.filter(a => a.type === "critical").length} críticos
                </span>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.map((alert, index) => (
                  <AlertItem key={index} {...alert} />
                ))}
                <Button variant="ghost" className="w-full text-orange-500 hover:text-orange-400 hover:bg-orange-500/10 mt-2">
                  Ver todos os alertas
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="bg-[#1E1E1E] border-[#2a2a2a] h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-500" />
                  <CardTitle className="text-white text-lg">Ações Pendentes</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#2a2a2a] hover:bg-[#333] transition-colors cursor-pointer">
                  <span className="text-white text-sm">Revisar no-shows críticos</span>
                  <span className="bg-red-500/20 text-red-500 text-xs font-bold px-2 py-1 rounded">5</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#2a2a2a] hover:bg-[#333] transition-colors cursor-pointer">
                  <span className="text-white text-sm">Aprovar orçamentos</span>
                  <span className="bg-orange-500/20 text-orange-500 text-xs font-bold px-2 py-1 rounded">3</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#2a2a2a] hover:bg-[#333] transition-colors cursor-pointer">
                  <span className="text-white text-sm">Responder NPS detratores</span>
                  <span className="bg-yellow-500/20 text-yellow-500 text-xs font-bold px-2 py-1 rounded">8</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#2a2a2a] hover:bg-[#333] transition-colors cursor-pointer">
                  <span className="text-white text-sm">Validar dados pendentes</span>
                  <span className="bg-blue-500/20 text-blue-500 text-xs font-bold px-2 py-1 rounded">12</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Forecast Section */}
        <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-white text-lg">Forecast vs Realizado vs Meta</CardTitle>
              <p className="text-gray-400 text-sm mt-1">Projeção de faturamento (R$ mil)</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-gray-400">Realizado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500" />
                <span className="text-gray-400">Meta</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500" />
                <span className="text-gray-400">Forecast</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2 pt-4">
              {forecastData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center gap-1 h-48">
                    {/* Realizado */}
                    {item.realizado && (
                      <div
                        className="w-6 bg-orange-500 rounded-t transition-all hover:bg-orange-400"
                        style={{ height: `${(item.realizado / maxValue) * 100}%` }}
                        title={`Realizado: R$ ${item.realizado}k`}
                      />
                    )}
                    {/* Meta */}
                    <div
                      className="w-6 bg-gray-600 rounded-t transition-all hover:bg-gray-500"
                      style={{ height: `${(item.meta / maxValue) * 100}%` }}
                      title={`Meta: R$ ${item.meta}k`}
                    />
                    {/* Forecast */}
                    <div
                      className="w-6 bg-cyan-500/50 rounded-t border-2 border-dashed border-cyan-500 transition-all hover:bg-cyan-500/70"
                      style={{ height: `${(item.forecast / maxValue) * 100}%` }}
                      title={`Forecast: R$ ${item.forecast}k`}
                    />
                  </div>
                  <span className="text-gray-400 text-xs font-medium">{item.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientDashboardLayout>
  );
}
