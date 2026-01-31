import { useState } from "react";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Activity,
  Gauge,
  Calendar,
  Users,
  CheckCircle,
  AlertTriangle,
  Timer,
} from "lucide-react";

// KPI Card component
interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  status?: "good" | "warning" | "critical";
  icon: React.ReactNode;
}

function KPICard({ title, value, subtitle, status, icon }: KPICardProps) {
  const statusColors = {
    good: "text-green-500 bg-green-500/10",
    warning: "text-orange-500 bg-orange-500/10",
    critical: "text-red-500 bg-red-500/10",
  };
  
  return (
    <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className={cn(
              "text-3xl font-bold",
              status ? statusColors[status].split(" ")[0] : "text-white"
            )}>
              {value}
            </p>
            {subtitle && <p className="text-gray-500 text-xs">{subtitle}</p>}
          </div>
          <div className={cn(
            "p-3 rounded-xl",
            status ? statusColors[status] : "bg-orange-500/10 text-orange-500"
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// OEE Gauge component
function OEEGauge({ value, label }: { value: number; label: string }) {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  const getColor = (val: number) => {
    if (val >= 85) return "#22c55e";
    if (val >= 70) return "#f97316";
    return "#ef4444";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#2a2a2a"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={getColor(value)}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-white">{value}%</span>
        </div>
      </div>
      <span className="text-gray-400 text-sm mt-2">{label}</span>
    </div>
  );
}

// Gantt-style room occupancy
function RoomOccupancy() {
  const rooms = [
    { name: "Sala 1", slots: [1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0] },
    { name: "Sala 2", slots: [1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0] },
    { name: "Sala 3", slots: [0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1] },
    { name: "Sala 4", slots: [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1] },
    { name: "Sala 5", slots: [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1] },
  ];

  const hours = ["8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h"];

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Header */}
        <div className="flex items-center mb-2">
          <div className="w-20"></div>
          <div className="flex-1 flex">
            {hours.map((hour) => (
              <div key={hour} className="flex-1 text-center text-xs text-gray-500">
                {hour}
              </div>
            ))}
          </div>
        </div>
        
        {/* Rooms */}
        {rooms.map((room) => (
          <div key={room.name} className="flex items-center mb-2">
            <div className="w-20 text-sm text-gray-400">{room.name}</div>
            <div className="flex-1 flex gap-0.5">
              {room.slots.map((slot, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex-1 h-8 rounded transition-all",
                    slot === 1 ? "bg-orange-500" : "bg-[#2a2a2a]"
                  )}
                  title={slot === 1 ? "Ocupado" : "Disponível"}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="flex items-center justify-end gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500" />
            <span className="text-gray-400">Ocupado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#2a2a2a]" />
            <span className="text-gray-400">Disponível</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Takt Time vs Cycle Time comparison
function TaktVsCycleTime() {
  const procedures = [
    { name: "Consulta", takt: 30, cycle: 28, status: "good" },
    { name: "Botox", takt: 45, cycle: 42, status: "good" },
    { name: "Preenchimento", takt: 60, cycle: 72, status: "critical" },
    { name: "Harmonização", takt: 90, cycle: 85, status: "good" },
    { name: "Laser", takt: 45, cycle: 48, status: "warning" },
  ];

  const maxTime = Math.max(...procedures.flatMap(p => [p.takt, p.cycle]));

  return (
    <div className="space-y-4">
      {procedures.map((proc) => (
        <div key={proc.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">{proc.name}</span>
            <div className="flex items-center gap-2">
              {proc.status === "good" && <CheckCircle className="w-4 h-4 text-green-500" />}
              {proc.status === "warning" && <AlertTriangle className="w-4 h-4 text-orange-500" />}
              {proc.status === "critical" && <AlertTriangle className="w-4 h-4 text-red-500" />}
              <span className={cn(
                "text-xs font-medium",
                proc.status === "good" ? "text-green-500" : 
                proc.status === "warning" ? "text-orange-500" : "text-red-500"
              )}>
                {proc.cycle - proc.takt > 0 ? `+${proc.cycle - proc.takt}min` : `${proc.cycle - proc.takt}min`}
              </span>
            </div>
          </div>
          <div className="relative h-6 bg-[#2a2a2a] rounded-lg overflow-hidden">
            {/* Takt Time (target) */}
            <div 
              className="absolute top-0 h-full bg-gray-600 rounded-lg"
              style={{ width: `${(proc.takt / maxTime) * 100}%` }}
            />
            {/* Cycle Time (actual) */}
            <div 
              className={cn(
                "absolute top-0 h-full rounded-lg opacity-80",
                proc.status === "good" ? "bg-green-500" : 
                proc.status === "warning" ? "bg-orange-500" : "bg-red-500"
              )}
              style={{ width: `${(proc.cycle / maxTime) * 100}%` }}
            />
            {/* Labels */}
            <div className="absolute inset-0 flex items-center justify-between px-2 text-xs">
              <span className="text-white font-medium">Cycle: {proc.cycle}min</span>
              <span className="text-gray-300">Takt: {proc.takt}min</span>
            </div>
          </div>
        </div>
      ))}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gray-600" />
          <span className="text-gray-400">Takt Time (Meta)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-orange-500" />
          <span className="text-gray-400">Cycle Time (Real)</span>
        </div>
      </div>
    </div>
  );
}

export default function Operations() {
  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Clinical Operations</h1>
            <p className="text-gray-400 mt-1">Agenda, Capacidade e Fluxo Contínuo • Teoria das Restrições</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="OEE Geral"
            value="78%"
            subtitle="Disponibilidade x Performance x Qualidade"
            status="warning"
            icon={<Gauge className="w-6 h-6" />}
          />
          <KPICard
            title="Taxa de Ocupação"
            value="87%"
            subtitle="Capacidade utilizada"
            status="good"
            icon={<Calendar className="w-6 h-6" />}
          />
          <KPICard
            title="Tempo Médio Espera"
            value="12 min"
            subtitle="Meta: < 15 min"
            status="good"
            icon={<Clock className="w-6 h-6" />}
          />
          <KPICard
            title="Atendimentos/Dia"
            value="48"
            subtitle="+5% vs semana anterior"
            icon={<Users className="w-6 h-6" />}
          />
        </div>

        {/* OEE Breakdown */}
        <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">OEE das Salas (Overall Equipment Effectiveness)</CardTitle>
            <p className="text-gray-400 text-sm">Disponibilidade × Performance × Qualidade = OEE</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <OEEGauge value={92} label="Disponibilidade" />
              <OEEGauge value={85} label="Performance" />
              <OEEGauge value={98} label="Qualidade" />
              <OEEGauge value={78} label="OEE Total" />
            </div>
            <div className="mt-6 p-3 bg-[#2a2a2a] rounded-lg">
              <p className="text-xs text-gray-400">
                <span className="text-orange-500 font-medium">Análise LSS:</span> O OEE de 78% indica oportunidade de melhoria. 
                A Performance (85%) é o fator limitante. Investigar causas de micro-paradas e setup entre procedimentos.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Room Occupancy Gantt */}
          <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Ocupação das Salas (Tempo Real)</CardTitle>
              <p className="text-gray-400 text-sm">Visualização estilo Gantt simplificado</p>
            </CardHeader>
            <CardContent>
              <RoomOccupancy />
            </CardContent>
          </Card>

          {/* Takt Time vs Cycle Time */}
          <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Takt Time vs Cycle Time</CardTitle>
              <p className="text-gray-400 text-sm">Ritmo da demanda vs tempo real de atendimento</p>
            </CardHeader>
            <CardContent>
              <TaktVsCycleTime />
              <div className="mt-4 p-3 bg-[#2a2a2a] rounded-lg">
                <p className="text-xs text-gray-400">
                  <span className="text-orange-500 font-medium">Insight MBB:</span> Preenchimento excede o Takt Time em 20%. 
                  Este é o gargalo atual. Considere padronizar o procedimento ou adicionar capacidade.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottleneck Analysis */}
        <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Análise de Gargalos (Teoria das Restrições)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="text-red-500 font-medium">Gargalo Identificado</span>
                </div>
                <p className="text-white font-semibold">Sala de Preenchimento</p>
                <p className="text-gray-400 text-sm mt-1">Utilização: 98% | Fila: 3 pacientes</p>
              </div>
              <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="w-5 h-5 text-orange-500" />
                  <span className="text-orange-500 font-medium">Atenção</span>
                </div>
                <p className="text-white font-semibold">Recepção</p>
                <p className="text-gray-400 text-sm mt-1">Tempo médio check-in: 8 min (meta: 5 min)</p>
              </div>
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-500 font-medium">Otimizado</span>
                </div>
                <p className="text-white font-semibold">Sala de Botox</p>
                <p className="text-gray-400 text-sm mt-1">Utilização: 75% | Sem fila</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientDashboardLayout>
  );
}
