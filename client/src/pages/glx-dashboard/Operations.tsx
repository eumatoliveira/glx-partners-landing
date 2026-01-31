import { useState } from "react";
import GLXDashboardLayout, {
  KPICard,
  SectionCard,
  DataTable,
  useDashboardTheme,
} from "@/components/GLXDashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Calendar,
  Clock,
  Users,
  Activity,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  exportToPDF,
  exportToCSV,
  formatCurrency,
  formatPercentage,
  leanSixSigma,
} from "@/lib/exportUtils";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const mockData = {
  totalSlots: 1200,
  scheduledSlots: 942,
  occupancyRate: 78.5,
  occupancyTarget: 85,
  idleCapacity: 145,
  idleCapacityCost: 42500,
  avgWaitTime: 18,
  avgConsultTime: 32,
  throughput: 156,
  oee: 82,
  availability: 92,
  performance: 89,
  quality: 100,
  capacityByDepartment: [
    { dept: "Dermatologia", total: 320, used: 275, rate: 86 },
    { dept: "Cardiologia", total: 280, used: 210, rate: 75 },
    { dept: "Ortopedia", total: 240, used: 195, rate: 81 },
    { dept: "Pediatria", total: 200, used: 148, rate: 74 },
    { dept: "Ginecologia", total: 160, used: 114, rate: 71 },
  ],
  weeklyOccupancy: {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    data: [85, 82, 78, 75, 72, 65],
  },
  hourlyDistribution: {
    labels: ["8h", "9h", "10h", "11h", "12h", "14h", "15h", "16h", "17h", "18h"],
    data: [45, 85, 92, 88, 42, 78, 85, 82, 75, 55],
  },
  heatmapData: [
    { day: "Segunda", morning: 85, afternoon: 78, evening: 65 },
    { day: "Terça", morning: 82, afternoon: 80, evening: 70 },
    { day: "Quarta", morning: 78, afternoon: 75, evening: 62 },
    { day: "Quinta", morning: 75, afternoon: 72, evening: 58 },
    { day: "Sexta", morning: 72, afternoon: 68, evening: 52 },
    { day: "Sábado", morning: 65, afternoon: 45, evening: 0 },
  ],
  professionals: [
    { name: "Dr. Silva", specialty: "Dermatologia", slots: 80, used: 72, rate: 90 },
    { name: "Dra. Santos", specialty: "Cardiologia", slots: 70, used: 58, rate: 83 },
    { name: "Dr. Oliveira", specialty: "Ortopedia", slots: 60, used: 52, rate: 87 },
    { name: "Dra. Costa", specialty: "Pediatria", slots: 50, used: 38, rate: 76 },
  ],
};

export default function Operations() {
  const { isDark } = useDashboardTheme();
  const [period, setPeriod] = useState("30d");

  const handleExportPDF = () => {
    exportToPDF(
      "Operação - Agenda/Capacidade",
      "Análise de capacidade operacional",
      [
        { label: "Ocupação", value: formatPercentage(mockData.occupancyRate), trend: "-6.5pp vs meta" },
        { label: "Slots Agendados", value: mockData.scheduledSlots.toString() },
        { label: "Capacidade Ociosa", value: `${mockData.idleCapacity}h` },
        { label: "Custo Ociosidade", value: formatCurrency(mockData.idleCapacityCost) },
        { label: "OEE", value: formatPercentage(mockData.oee) },
        { label: "Throughput", value: `${mockData.throughput}/dia` },
      ],
      {
        headers: ["Departamento", "Total", "Usado", "Ocupação"],
        rows: mockData.capacityByDepartment.map((d) => [
          d.dept,
          d.total.toString(),
          d.used.toString(),
          `${d.rate}%`,
        ]),
      },
      "operations-report"
    );
  };

  const handleExportCSV = () => {
    const data = mockData.capacityByDepartment.map((d) => ({
      Departamento: d.dept,
      Total_Slots: d.total,
      Slots_Usados: d.used,
      Taxa_Ocupacao: `${d.rate}%`,
    }));
    exportToCSV(data, "operations-capacity");
  };

  const weeklyChartData = {
    labels: mockData.weeklyOccupancy.labels,
    datasets: [
      {
        label: "Ocupação %",
        data: mockData.weeklyOccupancy.data,
        backgroundColor: mockData.weeklyOccupancy.data.map((v) =>
          v >= 80 ? "#22c55e" : v >= 70 ? "#f97316" : "#ef4444"
        ),
        borderRadius: 4,
      },
    ],
  };

  const hourlyChartData = {
    labels: mockData.hourlyDistribution.labels,
    datasets: [
      {
        label: "Ocupação %",
        data: mockData.hourlyDistribution.data,
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#f97316",
      },
    ],
  };

  const oeeData = {
    labels: ["Disponibilidade", "Performance", "Qualidade"],
    datasets: [
      {
        data: [mockData.availability, mockData.performance, mockData.quality],
        backgroundColor: ["#3b82f6", "#f97316", "#22c55e"],
        borderWidth: 0,
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
      x: {
        grid: { color: isDark ? "#333" : "#eee" },
        ticks: { color: isDark ? "#999" : "#666" },
      },
      y: {
        grid: { color: isDark ? "#333" : "#eee" },
        ticks: {
          color: isDark ? "#999" : "#666",
          callback: (value: number) => `${value}%`,
        },
        max: 100,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { color: isDark ? "#999" : "#666", usePointStyle: true },
      },
    },
    cutout: "70%",
  };

  const getHeatmapColor = (value: number) => {
    if (value === 0) return isDark ? "#1a1a1a" : "#f5f5f5";
    if (value >= 80) return "#22c55e";
    if (value >= 70) return "#84cc16";
    if (value >= 60) return "#eab308";
    if (value >= 50) return "#f97316";
    return "#ef4444";
  };

  return (
    <GLXDashboardLayout
      title="Operação"
      subtitle="Agenda / Capacidade"
      actions={
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="12m">12 meses</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-1" />
            CSV
          </Button>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-1" />
            PDF
          </Button>
        </div>
      }
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <KPICard
          title="Taxa de Ocupação"
          value={formatPercentage(mockData.occupancyRate)}
          subtitle={`Meta: ${mockData.occupancyTarget}%`}
          trend={{ value: "-6.5pp", isPositive: false }}
          icon={<Calendar className="w-5 h-5 text-orange-500" />}
          highlight
        />
        <KPICard
          title="Slots Agendados"
          value={mockData.scheduledSlots.toString()}
          subtitle={`de ${mockData.totalSlots} total`}
          icon={<Users className="w-5 h-5 text-blue-500" />}
        />
        <KPICard
          title="Capacidade Ociosa"
          value={`${mockData.idleCapacity}h`}
          subtitle={formatCurrency(mockData.idleCapacityCost)}
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
        />
        <KPICard
          title="OEE"
          value={formatPercentage(mockData.oee)}
          subtitle="Overall Equipment Effectiveness"
          icon={<Activity className="w-5 h-5 text-green-500" />}
        />
        <KPICard
          title="Tempo Médio Espera"
          value={`${mockData.avgWaitTime}min`}
          icon={<Clock className="w-5 h-5 text-yellow-500" />}
        />
        <KPICard
          title="Throughput"
          value={`${mockData.throughput}`}
          subtitle="atendimentos/dia"
          icon={<TrendingUp className="w-5 h-5 text-green-500" />}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <SectionCard title="Ocupação por Dia da Semana" subtitle="Média semanal">
          <div className="h-64">
            <Bar data={weeklyChartData} options={chartOptions as any} />
          </div>
        </SectionCard>

        <SectionCard title="Distribuição por Horário" subtitle="Ocupação ao longo do dia">
          <div className="h-64">
            <Line data={hourlyChartData} options={chartOptions as any} />
          </div>
        </SectionCard>

        <SectionCard title="OEE - Eficiência Geral" subtitle="Lean Six Sigma">
          <div className="h-48">
            <Doughnut data={oeeData} options={doughnutOptions as any} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-3xl font-bold text-orange-500">{mockData.oee}%</p>
            <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
              {mockData.availability}% × {mockData.performance}% × {mockData.quality}%
            </p>
          </div>
        </SectionCard>
      </div>

      {/* Heatmap */}
      <SectionCard title="Heatmap de Ocupação" subtitle="Por dia e período" className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className={cn("text-left py-2 px-4 text-sm font-medium", isDark ? "text-gray-400" : "text-gray-500")}>
                  Dia
                </th>
                <th className={cn("text-center py-2 px-4 text-sm font-medium", isDark ? "text-gray-400" : "text-gray-500")}>
                  Manhã (8h-12h)
                </th>
                <th className={cn("text-center py-2 px-4 text-sm font-medium", isDark ? "text-gray-400" : "text-gray-500")}>
                  Tarde (13h-17h)
                </th>
                <th className={cn("text-center py-2 px-4 text-sm font-medium", isDark ? "text-gray-400" : "text-gray-500")}>
                  Noite (17h-20h)
                </th>
              </tr>
            </thead>
            <tbody>
              {mockData.heatmapData.map((row, i) => (
                <tr key={i}>
                  <td className="py-2 px-4 text-sm font-medium">{row.day}</td>
                  {[row.morning, row.afternoon, row.evening].map((value, j) => (
                    <td key={j} className="py-2 px-4">
                      <div
                        className="h-10 rounded-lg flex items-center justify-center text-sm font-medium text-white"
                        style={{ backgroundColor: getHeatmapColor(value) }}
                      >
                        {value > 0 ? `${value}%` : "-"}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>&lt;50%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500" />
            <span className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>50-60%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500" />
            <span className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>60-70%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-lime-500" />
            <span className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>70-80%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>&gt;80%</span>
          </div>
        </div>
      </SectionCard>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="Capacidade por Departamento"
          subtitle="Slots disponíveis vs utilizados"
          actions={
            <Button variant="link" className="text-orange-500">
              Ver detalhes →
            </Button>
          }
        >
          <DataTable
            headers={["Departamento", "Total", "Usado", "Ocupação"]}
            rows={mockData.capacityByDepartment.map((d) => [
              d.dept,
              d.total,
              d.used,
              <div key={d.dept} className="flex items-center gap-2">
                <div className={cn("h-2 w-16 rounded-full", isDark ? "bg-[#333]" : "bg-gray-200")}>
                  <div
                    className={cn(
                      "h-full rounded-full",
                      d.rate >= 80 ? "bg-green-500" : d.rate >= 70 ? "bg-yellow-500" : "bg-red-500"
                    )}
                    style={{ width: `${d.rate}%` }}
                  />
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  d.rate >= 80 ? "text-green-500" : d.rate >= 70 ? "text-yellow-500" : "text-red-500"
                )}>
                  {d.rate}%
                </span>
              </div>,
            ])}
          />
        </SectionCard>

        <SectionCard
          title="Performance por Profissional"
          subtitle="Ocupação individual"
          actions={
            <Button variant="link" className="text-orange-500">
              Ver todos →
            </Button>
          }
        >
          <DataTable
            headers={["Profissional", "Especialidade", "Slots", "Ocupação"]}
            rows={mockData.professionals.map((p) => [
              p.name,
              p.specialty,
              `${p.used}/${p.slots}`,
              <span
                key={p.name}
                className={cn(
                  "font-medium",
                  p.rate >= 85 ? "text-green-500" : p.rate >= 75 ? "text-yellow-500" : "text-red-500"
                )}
              >
                {p.rate}%
              </span>,
            ])}
          />
        </SectionCard>
      </div>
    </GLXDashboardLayout>
  );
}
