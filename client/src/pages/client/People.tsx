import { useState } from "react";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Users,
  UserMinus,
  Clock,
  DollarSign,
  Award,
  Calendar,
  Target,
} from "lucide-react";

// KPI Card
interface KPICardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  subtitle?: string;
  icon: React.ReactNode;
  status?: "good" | "warning" | "critical";
}

function KPICard({ title, value, change, changeLabel, subtitle, icon, status }: KPICardProps) {
  const statusColors = {
    good: "text-green-500",
    warning: "text-orange-500",
    critical: "text-red-500",
  };
  
  return (
    <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className={cn(
              "text-3xl font-bold",
              status ? statusColors[status] : "text-white"
            )}>
              {value}
            </p>
            {change !== undefined && (
              <div className="flex items-center gap-2">
                {change >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={cn(
                  "text-sm font-medium",
                  change >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  {change >= 0 ? "+" : ""}{change}%
                </span>
                {changeLabel && <span className="text-gray-500 text-sm">{changeLabel}</span>}
              </div>
            )}
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

// Productivity Chart
function ProductivityChart() {
  const data = [
    { month: "Jan", value: 42 },
    { month: "Fev", value: 45 },
    { month: "Mar", value: 43 },
    { month: "Abr", value: 48 },
    { month: "Mai", value: 52 },
    { month: "Jun", value: 55 },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2 h-40">
        {data.map((item, index) => (
          <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end justify-center h-32">
              <div 
                className="w-8 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t transition-all hover:from-orange-500 hover:to-orange-300"
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              >
                <span className="block text-center text-xs text-white font-medium pt-1">
                  {item.value}k
                </span>
              </div>
            </div>
            <span className="text-gray-400 text-xs">{item.month}</span>
          </div>
        ))}
      </div>
      <div className="text-center text-gray-400 text-sm">
        Receita por FTE (R$ mil/mês)
      </div>
    </div>
  );
}

// Turnover & Absenteeism Chart
function TurnoverChart() {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
  const turnover = [2.1, 1.8, 2.5, 1.9, 2.2, 1.5];
  const absenteeism = [3.2, 3.5, 3.1, 3.8, 3.4, 3.0];

  const maxValue = Math.max(...turnover, ...absenteeism) + 1;

  return (
    <div className="space-y-4">
      <div className="relative h-40">
        <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={50 - y / 2}
              x2="100"
              y2={50 - y / 2}
              stroke="#2a2a2a"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Turnover line */}
          <polyline
            points={turnover.map((val, i) => `${(i / (turnover.length - 1)) * 100},${50 - (val / maxValue) * 50}`).join(" ")}
            fill="none"
            stroke="#f97316"
            strokeWidth="1.5"
          />
          
          {/* Absenteeism line */}
          <polyline
            points={absenteeism.map((val, i) => `${(i / (absenteeism.length - 1)) * 100},${50 - (val / maxValue) * 50}`).join(" ")}
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeDasharray="3,2"
          />
          
          {/* Data points */}
          {turnover.map((val, i) => (
            <circle
              key={`t-${i}`}
              cx={(i / (turnover.length - 1)) * 100}
              cy={50 - (val / maxValue) * 50}
              r="1.5"
              fill="#f97316"
            />
          ))}
          {absenteeism.map((val, i) => (
            <circle
              key={`a-${i}`}
              cx={(i / (absenteeism.length - 1)) * 100}
              cy={50 - (val / maxValue) * 50}
              r="1.5"
              fill="#ef4444"
            />
          ))}
        </svg>
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-gray-500">
        {months.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-orange-500" />
          <span className="text-gray-400">Turnover</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-red-500 border-dashed" style={{ borderTop: "2px dashed #ef4444", height: 0 }} />
          <span className="text-gray-400">Absenteísmo</span>
        </div>
      </div>
    </div>
  );
}

// Team Performance Table
function TeamPerformance() {
  const team = [
    { name: "Dra. Ana Silva", role: "Dermatologista", revenue: 185, patients: 142, nps: 92, trend: "up" },
    { name: "Dr. Carlos Mendes", role: "Cirurgião Plástico", revenue: 220, patients: 98, nps: 88, trend: "up" },
    { name: "Dra. Maria Santos", role: "Dermatologista", revenue: 165, patients: 128, nps: 95, trend: "stable" },
    { name: "Dr. João Lima", role: "Clínico Geral", revenue: 120, patients: 185, nps: 78, trend: "down" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#2a2a2a]">
            <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wide py-3">Profissional</th>
            <th className="text-center text-gray-400 text-xs font-medium uppercase tracking-wide py-3">Receita (R$k)</th>
            <th className="text-center text-gray-400 text-xs font-medium uppercase tracking-wide py-3">Pacientes</th>
            <th className="text-center text-gray-400 text-xs font-medium uppercase tracking-wide py-3">NPS</th>
            <th className="text-center text-gray-400 text-xs font-medium uppercase tracking-wide py-3">Trend</th>
          </tr>
        </thead>
        <tbody>
          {team.map((member, index) => (
            <tr key={index} className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a]/50 transition-colors">
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold">
                    {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-white font-medium">{member.name}</div>
                    <div className="text-gray-500 text-xs">{member.role}</div>
                  </div>
                </div>
              </td>
              <td className="text-center text-white font-medium">{member.revenue}k</td>
              <td className="text-center text-gray-300">{member.patients}</td>
              <td className="text-center">
                <span className={cn(
                  "font-medium",
                  member.nps >= 90 ? "text-green-500" : member.nps >= 80 ? "text-orange-500" : "text-red-500"
                )}>
                  {member.nps}
                </span>
              </td>
              <td className="text-center">
                {member.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500 mx-auto" />}
                {member.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500 mx-auto" />}
                {member.trend === "stable" && <span className="text-gray-500">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function People() {
  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">People Analytics</h1>
            <p className="text-gray-400 mt-1">Produtividade, Turnover e Performance da Equipe</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Headcount"
            value="42"
            change={2.4}
            changeLabel="vs mês anterior"
            icon={<Users className="w-6 h-6" />}
          />
          <KPICard
            title="Turnover"
            value="1.5%"
            change={-0.7}
            subtitle="Meta: < 2%"
            icon={<UserMinus className="w-6 h-6" />}
            status="good"
          />
          <KPICard
            title="Absenteísmo"
            value="3.0%"
            change={-0.4}
            subtitle="Meta: < 3.5%"
            icon={<Clock className="w-6 h-6" />}
            status="good"
          />
          <KPICard
            title="Revenue/FTE"
            value="R$ 55K"
            change={5.8}
            changeLabel="vs mês anterior"
            icon={<DollarSign className="w-6 h-6" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Productivity Chart */}
          <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Produtividade (Revenue per FTE)</CardTitle>
              <p className="text-gray-400 text-sm">Receita gerada por funcionário</p>
            </CardHeader>
            <CardContent>
              <ProductivityChart />
            </CardContent>
          </Card>

          {/* Turnover & Absenteeism */}
          <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Turnover & Absenteísmo</CardTitle>
              <p className="text-gray-400 text-sm">Comparativo mês a mês (%)</p>
            </CardHeader>
            <CardContent>
              <TurnoverChart />
            </CardContent>
          </Card>
        </div>

        {/* Team Performance */}
        <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-white text-lg">Performance da Equipe</CardTitle>
              <p className="text-gray-400 text-sm">Ranking por receita gerada</p>
            </div>
            <Button variant="ghost" className="text-orange-500 hover:text-orange-400 hover:bg-orange-500/10">
              Ver todos
            </Button>
          </CardHeader>
          <CardContent>
            <TeamPerformance />
          </CardContent>
        </Card>

        {/* Training & Development */}
        <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Treinamento & Desenvolvimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#2a2a2a] rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-5 h-5 text-orange-500" />
                  <span className="text-white font-medium">Certificações</span>
                </div>
                <p className="text-3xl font-bold text-white">28</p>
                <p className="text-gray-500 text-xs mt-1">+5 este trimestre</p>
              </div>
              <div className="p-4 bg-[#2a2a2a] rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <span className="text-white font-medium">Horas Treinamento</span>
                </div>
                <p className="text-3xl font-bold text-white">156h</p>
                <p className="text-gray-500 text-xs mt-1">Média: 3.7h/FTE</p>
              </div>
              <div className="p-4 bg-[#2a2a2a] rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-5 h-5 text-orange-500" />
                  <span className="text-white font-medium">Meta Atingida</span>
                </div>
                <p className="text-3xl font-bold text-green-500">92%</p>
                <p className="text-gray-500 text-xs mt-1">Colaboradores no target</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientDashboardLayout>
  );
}
