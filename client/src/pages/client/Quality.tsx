import { useState } from "react";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Target,
} from "lucide-react";

// NPS Gauge component
function NPSGauge({ value }: { value: number }) {
  const getColor = (val: number) => {
    if (val >= 50) return "#22c55e";
    if (val >= 0) return "#f97316";
    return "#ef4444";
  };

  const getLabel = (val: number) => {
    if (val >= 75) return "Excelente";
    if (val >= 50) return "Muito Bom";
    if (val >= 0) return "Bom";
    return "Precisa Melhorar";
  };

  // Position on scale from -100 to 100
  const position = ((value + 100) / 200) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl font-bold" style={{ color: getColor(value) }}>
            {value}
          </span>
          <p className="text-gray-400 text-sm mt-1">{getLabel(value)}</p>
        </div>
      </div>
      
      {/* Scale */}
      <div className="relative h-4 bg-gradient-to-r from-red-500 via-orange-500 to-green-500 rounded-full">
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-gray-800 shadow-lg transition-all"
          style={{ left: `calc(${position}% - 8px)` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>-100</span>
        <span>0</span>
        <span>+100</span>
      </div>
    </div>
  );
}

// NPS Distribution
function NPSDistribution() {
  const data = {
    promoters: 65,
    passives: 23,
    detractors: 12,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-green-500 font-medium flex items-center gap-2">
              <ThumbsUp className="w-4 h-4" />
              Promotores (9-10)
            </span>
            <span className="text-white font-bold">{data.promoters}%</span>
          </div>
          <div className="h-3 bg-[#2a2a2a] rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${data.promoters}%` }} />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-400 font-medium">Passivos (7-8)</span>
            <span className="text-white font-bold">{data.passives}%</span>
          </div>
          <div className="h-3 bg-[#2a2a2a] rounded-full overflow-hidden">
            <div className="h-full bg-gray-500 rounded-full" style={{ width: `${data.passives}%` }} />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-red-500 font-medium flex items-center gap-2">
              <ThumbsDown className="w-4 h-4" />
              Detratores (0-6)
            </span>
            <span className="text-white font-bold">{data.detractors}%</span>
          </div>
          <div className="h-3 bg-[#2a2a2a] rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: `${data.detractors}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Control Chart component
function ControlChart() {
  const data = [28, 32, 29, 35, 31, 48, 30, 33, 29, 31, 27, 32, 30, 34, 31];
  const ucl = 40; // Upper Control Limit
  const lcl = 25; // Lower Control Limit
  const mean = 31;
  
  const maxValue = Math.max(...data, ucl) + 5;
  const minValue = Math.min(...data, lcl) - 5;
  const range = maxValue - minValue;

  return (
    <div className="space-y-2">
      <div className="relative h-48 bg-[#2a2a2a] rounded-lg p-4">
        {/* UCL Line */}
        <div 
          className="absolute left-4 right-4 border-t-2 border-dashed border-red-500"
          style={{ top: `${((maxValue - ucl) / range) * 100}%` }}
        >
          <span className="absolute -top-3 right-0 text-xs text-red-500">UCL: {ucl}min</span>
        </div>
        
        {/* Mean Line */}
        <div 
          className="absolute left-4 right-4 border-t-2 border-orange-500"
          style={{ top: `${((maxValue - mean) / range) * 100}%` }}
        >
          <span className="absolute -top-3 right-0 text-xs text-orange-500">Média: {mean}min</span>
        </div>
        
        {/* LCL Line */}
        <div 
          className="absolute left-4 right-4 border-t-2 border-dashed border-green-500"
          style={{ top: `${((maxValue - lcl) / range) * 100}%` }}
        >
          <span className="absolute -top-3 right-0 text-xs text-green-500">LCL: {lcl}min</span>
        </div>
        
        {/* Data Points */}
        <svg className="absolute inset-4" viewBox={`0 0 ${data.length - 1} ${range}`} preserveAspectRatio="none">
          {/* Line connecting points */}
          <polyline
            points={data.map((val, i) => `${i},${maxValue - val}`).join(" ")}
            fill="none"
            stroke="#f97316"
            strokeWidth="0.5"
          />
          {/* Points */}
          {data.map((val, i) => (
            <circle
              key={i}
              cx={i}
              cy={maxValue - val}
              r="0.8"
              fill={val > ucl || val < lcl ? "#ef4444" : "#f97316"}
              className="cursor-pointer"
            />
          ))}
        </svg>
      </div>
      
      <div className="p-3 bg-[#1E1E1E] rounded-lg border border-orange-500/30">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          <span className="text-orange-500 font-medium text-sm">Causa Especial Detectada</span>
        </div>
        <p className="text-gray-400 text-xs">
          Ponto 6 (48min) excede o UCL. Investigar causa raiz: possível atraso de equipamento ou procedimento complexo.
        </p>
      </div>
    </div>
  );
}

// Recent Feedback
function RecentFeedback() {
  const feedback = [
    { score: 10, text: "Atendimento excelente! Dra. Ana foi muito atenciosa.", sentiment: "positive", time: "2h atrás" },
    { score: 9, text: "Procedimento rápido e resultado incrível.", sentiment: "positive", time: "4h atrás" },
    { score: 6, text: "Esperei muito tempo na recepção.", sentiment: "negative", time: "6h atrás" },
    { score: 8, text: "Bom atendimento, mas o estacionamento é difícil.", sentiment: "neutral", time: "8h atrás" },
  ];

  const sentimentColors = {
    positive: "border-green-500/30 bg-green-500/5",
    negative: "border-red-500/30 bg-red-500/5",
    neutral: "border-gray-500/30 bg-gray-500/5",
  };

  return (
    <div className="space-y-3">
      {feedback.map((item, index) => (
        <div key={index} className={cn(
          "p-3 rounded-lg border",
          sentimentColors[item.sentiment as keyof typeof sentimentColors]
        )}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-lg font-bold",
                item.score >= 9 ? "text-green-500" : item.score >= 7 ? "text-orange-500" : "text-red-500"
              )}>
                {item.score}
              </span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-3 h-3",
                      i < Math.round(item.score / 2) ? "text-orange-500 fill-orange-500" : "text-gray-600"
                    )}
                  />
                ))}
              </div>
            </div>
            <span className="text-gray-500 text-xs">{item.time}</span>
          </div>
          <p className="text-gray-300 text-sm">{item.text}</p>
        </div>
      ))}
    </div>
  );
}

export default function Quality() {
  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Quality & NPS</h1>
            <p className="text-gray-400 mt-1">Voz do Cliente e Controle Estatístico de Processos</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-green-500/10">
                  <Star className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">NPS Score</p>
                  <p className="text-2xl font-bold text-green-500">+53</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-orange-500/10">
                  <MessageSquare className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Respostas</p>
                  <p className="text-2xl font-bold text-white">847</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-red-500/10">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">DPMO</p>
                  <p className="text-2xl font-bold text-white">3,420</p>
                  <p className="text-xs text-gray-500">4.2σ</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-green-500/10">
                  <Target className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">First Pass Yield</p>
                  <p className="text-2xl font-bold text-green-500">96.8%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* NPS Gauge */}
          <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Net Promoter Score</CardTitle>
              <p className="text-gray-400 text-sm">Índice de recomendação dos clientes</p>
            </CardHeader>
            <CardContent>
              <NPSGauge value={53} />
              <div className="mt-6">
                <NPSDistribution />
              </div>
            </CardContent>
          </Card>

          {/* Control Chart */}
          <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Gráfico de Controle (X-bar)</CardTitle>
              <p className="text-gray-400 text-sm">Tempo de atendimento - Últimos 15 dias</p>
            </CardHeader>
            <CardContent>
              <ControlChart />
            </CardContent>
          </Card>
        </div>

        {/* Recent Feedback */}
        <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-white text-lg">Feedback Recente</CardTitle>
              <p className="text-gray-400 text-sm">Análise de sentimento em tempo real</p>
            </div>
            <Button variant="ghost" className="text-orange-500 hover:text-orange-400 hover:bg-orange-500/10">
              Ver todos
            </Button>
          </CardHeader>
          <CardContent>
            <RecentFeedback />
          </CardContent>
        </Card>

        {/* Six Sigma Metrics */}
        <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Indicadores Lean Six Sigma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-[#2a2a2a] rounded-lg text-center">
                <p className="text-gray-400 text-xs uppercase tracking-wide">Sigma Level</p>
                <p className="text-3xl font-bold text-orange-500 mt-1">4.2σ</p>
                <p className="text-gray-500 text-xs mt-1">Meta: 6σ</p>
              </div>
              <div className="p-4 bg-[#2a2a2a] rounded-lg text-center">
                <p className="text-gray-400 text-xs uppercase tracking-wide">DPMO</p>
                <p className="text-3xl font-bold text-white mt-1">3,420</p>
                <p className="text-gray-500 text-xs mt-1">Defeitos/Milhão</p>
              </div>
              <div className="p-4 bg-[#2a2a2a] rounded-lg text-center">
                <p className="text-gray-400 text-xs uppercase tracking-wide">Cp</p>
                <p className="text-3xl font-bold text-green-500 mt-1">1.42</p>
                <p className="text-gray-500 text-xs mt-1">Capacidade</p>
              </div>
              <div className="p-4 bg-[#2a2a2a] rounded-lg text-center">
                <p className="text-gray-400 text-xs uppercase tracking-wide">Cpk</p>
                <p className="text-3xl font-bold text-orange-500 mt-1">1.28</p>
                <p className="text-gray-500 text-xs mt-1">Centralização</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientDashboardLayout>
  );
}
