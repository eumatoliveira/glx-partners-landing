import { useState } from "react";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowRight,
  ArrowDown,
  Minus,
  PiggyBank,
  Wallet,
  Receipt,
  Clock,
} from "lucide-react";

// KPI Card component
interface KPICardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "stable";
}

function KPICard({ title, value, change, changeLabel, subtitle, icon, trend }: KPICardProps) {
  const isPositive = change !== undefined && change >= 0;
  const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    stable: "text-orange-500",
  };
  
  return (
    <Card className="bg-[#1E1E1E] border-[#2a2a2a] hover:border-orange-500/50 transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
            <div className="flex items-center gap-2">
              {change !== undefined && (
                <>
                  {trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : trend === "down" ? (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  ) : (
                    <Minus className="w-4 h-4 text-orange-500" />
                  )}
                  <span className={cn("text-sm font-medium", trendColors[trend || "stable"])}>
                    {isPositive ? "+" : ""}{change}%
                  </span>
                </>
              )}
              {changeLabel && <span className="text-gray-500 text-sm">{changeLabel}</span>}
            </div>
            {subtitle && <p className="text-gray-500 text-xs">{subtitle}</p>}
          </div>
          <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Waterfall Chart component
function WaterfallChart() {
  const data = [
    { label: "Receita Bruta", value: 2400, type: "start", color: "bg-green-500" },
    { label: "Impostos", value: -288, type: "decrease", color: "bg-red-500" },
    { label: "Custos Variáveis", value: -720, type: "decrease", color: "bg-red-500" },
    { label: "Margem Contribuição", value: 1392, type: "subtotal", color: "bg-orange-500" },
    { label: "Custos Fixos", value: -912, type: "decrease", color: "bg-red-500" },
    { label: "EBITDA", value: 480, type: "end", color: "bg-green-500" },
  ];

  const maxValue = 2400;
  let runningTotal = 0;

  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const previousTotal = runningTotal;
        
        if (item.type === "start" || item.type === "subtotal" || item.type === "end") {
          runningTotal = item.value;
        } else {
          runningTotal += item.value;
        }

        const barWidth = Math.abs(item.value) / maxValue * 100;
        const isNegative = item.value < 0;
        
        return (
          <div key={index} className="flex items-center gap-4">
            <div className="w-36 text-right">
              <span className="text-gray-400 text-sm">{item.label}</span>
            </div>
            <div className="flex-1 h-8 bg-[#2a2a2a] rounded-lg relative overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-lg transition-all",
                  item.color
                )}
                style={{ 
                  width: `${barWidth}%`,
                  marginLeft: isNegative ? `${(previousTotal / maxValue * 100) - barWidth}%` : `${previousTotal / maxValue * 100 - (item.type === "start" ? barWidth : 0)}%`
                }}
              />
            </div>
            <div className="w-24 text-right">
              <span className={cn(
                "font-semibold",
                isNegative ? "text-red-500" : "text-green-500"
              )}>
                {isNegative ? "-" : ""}R$ {Math.abs(item.value).toLocaleString()}k
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Margin by Procedure component
function MarginByProcedure() {
  const procedures = [
    { name: "Harmonização Facial", margin: 420, hours: 1.5, marginPerHour: 280, trend: "up" },
    { name: "Botox", margin: 180, hours: 0.5, marginPerHour: 360, trend: "up" },
    { name: "Preenchimento", margin: 320, hours: 1.0, marginPerHour: 320, trend: "stable" },
    { name: "Laser CO2", margin: 280, hours: 1.5, marginPerHour: 187, trend: "down" },
    { name: "Peeling", margin: 150, hours: 0.75, marginPerHour: 200, trend: "stable" },
  ];

  const maxMarginPerHour = Math.max(...procedures.map(p => p.marginPerHour));

  return (
    <div className="space-y-4">
      {procedures.map((proc, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">{proc.name}</span>
              {proc.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
              {proc.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500" />}
            </div>
            <span className="text-orange-500 font-bold">R$ {proc.marginPerHour}/hr</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-[#2a2a2a] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all"
                style={{ width: `${(proc.marginPerHour / maxMarginPerHour) * 100}%` }}
              />
            </div>
            <span className="text-gray-400 text-xs w-20 text-right">{proc.hours}h avg</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// Cash Flow Chart
function CashFlowChart() {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
  const inflow = [180, 195, 210, 225, 240, 255];
  const outflow = [150, 160, 165, 175, 180, 190];
  
  const maxValue = Math.max(...inflow, ...outflow);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2 h-40">
        {months.map((month, index) => (
          <div key={month} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end justify-center gap-1 h-32">
              <div 
                className="w-4 bg-green-500 rounded-t"
                style={{ height: `${(inflow[index] / maxValue) * 100}%` }}
                title={`Entrada: R$ ${inflow[index]}k`}
              />
              <div 
                className="w-4 bg-red-500 rounded-t"
                style={{ height: `${(outflow[index] / maxValue) * 100}%` }}
                title={`Saída: R$ ${outflow[index]}k`}
              />
            </div>
            <span className="text-gray-400 text-xs">{month}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span className="text-gray-400">Entradas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span className="text-gray-400">Saídas</span>
        </div>
      </div>
    </div>
  );
}

export default function Financials() {
  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Financials</h1>
            <p className="text-gray-400 mt-1">Receita, Margem e Fluxo de Caixa • Análise Lean Six Sigma</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Receita Bruta"
            value="R$ 2.4M"
            change={12.5}
            changeLabel="vs mês anterior"
            icon={<DollarSign className="w-6 h-6" />}
            trend="up"
          />
          <KPICard
            title="EBITDA"
            value="R$ 480K"
            change={8.3}
            changeLabel="vs mês anterior"
            subtitle="Margem: 20%"
            icon={<PiggyBank className="w-6 h-6" />}
            trend="up"
          />
          <KPICard
            title="Fluxo de Caixa"
            value="R$ 65K"
            change={-2.1}
            changeLabel="vs mês anterior"
            subtitle="Saldo positivo"
            icon={<Wallet className="w-6 h-6" />}
            trend="down"
          />
          <KPICard
            title="Contas a Receber"
            value="R$ 320K"
            change={0}
            changeLabel="estável"
            subtitle="Prazo médio: 28 dias"
            icon={<Receipt className="w-6 h-6" />}
            trend="stable"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Waterfall Chart */}
          <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Composição da Margem (Waterfall)</CardTitle>
              <p className="text-gray-400 text-sm">Decomposição do resultado operacional</p>
            </CardHeader>
            <CardContent>
              <WaterfallChart />
              <div className="mt-4 p-3 bg-[#2a2a2a] rounded-lg">
                <p className="text-xs text-gray-400">
                  <span className="text-orange-500 font-medium">Análise LSS:</span> A margem de contribuição de 58% está acima do benchmark do setor (52%). 
                  Foco em reduzir custos variáveis pode aumentar EBITDA em até 15%.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Margin by Procedure */}
          <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Margem por Hora Clínica</CardTitle>
              <p className="text-gray-400 text-sm">Rentabilidade por procedimento (gargalo)</p>
            </CardHeader>
            <CardContent>
              <MarginByProcedure />
              <div className="mt-4 p-3 bg-[#2a2a2a] rounded-lg">
                <p className="text-xs text-gray-400">
                  <span className="text-orange-500 font-medium">Insight MBB:</span> Botox apresenta maior margem/hora (R$ 360). 
                  Considere aumentar capacidade deste procedimento para maximizar throughput.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cash Flow */}
        <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-white text-lg">Fluxo de Caixa</CardTitle>
              <p className="text-gray-400 text-sm">Entradas vs Saídas (R$ mil)</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">Últimos 6 meses</span>
            </div>
          </CardHeader>
          <CardContent>
            <CashFlowChart />
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-[#2a2a2a] rounded-lg">
                <p className="text-gray-400 text-xs">Saldo Médio</p>
                <p className="text-white font-bold text-lg">R$ 58K</p>
              </div>
              <div className="p-3 bg-[#2a2a2a] rounded-lg">
                <p className="text-gray-400 text-xs">Dias de Caixa</p>
                <p className="text-white font-bold text-lg">42 dias</p>
              </div>
              <div className="p-3 bg-[#2a2a2a] rounded-lg">
                <p className="text-gray-400 text-xs">Burn Rate</p>
                <p className="text-white font-bold text-lg">R$ 175K/mês</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientDashboardLayout>
  );
}
