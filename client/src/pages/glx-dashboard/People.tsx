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
  Users,
  UserPlus,
  UserMinus,
  Clock,
  Award,
  TrendingUp,
  Calendar,
  Target,
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
import { Line, Bar, Doughnut } from "react-chartjs-2";

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
  totalEmployees: 85,
  activeEmployees: 82,
  turnoverRate: 8.5,
  turnoverTarget: 10,
  avgTenure: 2.8,
  absenteeismRate: 3.2,
  trainingHours: 24,
  trainingTarget: 20,
  engagementScore: 78,
  engagementTarget: 80,
  productivityIndex: 92,
  headcountByDept: [
    { dept: "Médicos", count: 25, percentage: 29 },
    { dept: "Enfermagem", count: 22, percentage: 26 },
    { dept: "Administrativo", count: 18, percentage: 21 },
    { dept: "Recepção", count: 12, percentage: 14 },
    { dept: "Suporte", count: 8, percentage: 10 },
  ],
  turnoverTrend: {
    labels: ["Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    data: [12, 10, 9, 8, 9, 8.5],
  },
  hiresVsExits: {
    labels: ["Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    hires: [5, 4, 6, 3, 4, 5],
    exits: [3, 2, 2, 1, 2, 2],
  },
  topPerformers: [
    { name: "Dr. Silva", dept: "Dermatologia", score: 98, patients: 420 },
    { name: "Dra. Santos", dept: "Cardiologia", score: 96, patients: 380 },
    { name: "Dr. Oliveira", dept: "Ortopedia", score: 94, patients: 350 },
    { name: "Dra. Costa", dept: "Pediatria", score: 92, patients: 290 },
    { name: "Dr. Lima", dept: "Ginecologia", score: 90, patients: 260 },
  ],
  trainingProgress: [
    { course: "Atendimento ao Cliente", completed: 78, total: 85, deadline: "15/02" },
    { course: "Compliance LGPD", completed: 65, total: 85, deadline: "28/02" },
    { course: "Protocolos Clínicos", completed: 42, total: 50, deadline: "10/03" },
    { course: "Gestão de Tempo", completed: 30, total: 85, deadline: "30/03" },
  ],
  sigmaLevel: 4.0,
};

export default function People() {
  const { isDark } = useDashboardTheme();
  const [period, setPeriod] = useState("30d");

  const handleExportPDF = () => {
    exportToPDF(
      "Pessoas",
      "Gestão de capital humano",
      [
        { label: "Total Colaboradores", value: mockData.totalEmployees.toString() },
        { label: "Turnover", value: formatPercentage(mockData.turnoverRate) },
        { label: "Tempo Médio Casa", value: `${mockData.avgTenure} anos` },
        { label: "Absenteísmo", value: formatPercentage(mockData.absenteeismRate) },
        { label: "Horas Treinamento", value: `${mockData.trainingHours}h/mês` },
        { label: "Engajamento", value: `${mockData.engagementScore}/100` },
      ],
      {
        headers: ["Colaborador", "Departamento", "Score", "Pacientes"],
        rows: mockData.topPerformers.map((p) => [
          p.name,
          p.dept,
          p.score.toString(),
          p.patients.toString(),
        ]),
      },
      "people-report"
    );
  };

  const handleExportCSV = () => {
    const data = mockData.topPerformers.map((p) => ({
      Colaborador: p.name,
      Departamento: p.dept,
      Score: p.score,
      Pacientes: p.patients,
    }));
    exportToCSV(data, "top-performers");
  };

  const turnoverChartData = {
    labels: mockData.turnoverTrend.labels,
    datasets: [
      {
        label: "Turnover %",
        data: mockData.turnoverTrend.data,
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: "#f97316",
      },
      {
        label: "Meta",
        data: Array(6).fill(mockData.turnoverTarget),
        borderColor: "#22c55e",
        borderDash: [5, 5],
        backgroundColor: "transparent",
        pointRadius: 0,
      },
    ],
  };

  const hiresExitsData = {
    labels: mockData.hiresVsExits.labels,
    datasets: [
      {
        label: "Contratações",
        data: mockData.hiresVsExits.hires,
        backgroundColor: "#22c55e",
        borderRadius: 4,
      },
      {
        label: "Desligamentos",
        data: mockData.hiresVsExits.exits,
        backgroundColor: "#ef4444",
        borderRadius: 4,
      },
    ],
  };

  const headcountDonutData = {
    labels: mockData.headcountByDept.map((d) => d.dept),
    datasets: [
      {
        data: mockData.headcountByDept.map((d) => d.count),
        backgroundColor: ["#3b82f6", "#22c55e", "#f97316", "#8b5cf6", "#eab308"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: isDark ? "#999" : "#666", usePointStyle: true },
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
        min: 0,
        max: 15,
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: isDark ? "#999" : "#666", usePointStyle: true },
      },
    },
    scales: {
      x: {
        grid: { color: isDark ? "#333" : "#eee" },
        ticks: { color: isDark ? "#999" : "#666" },
      },
      y: {
        grid: { color: isDark ? "#333" : "#eee" },
        ticks: { color: isDark ? "#999" : "#666" },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: { color: isDark ? "#999" : "#666", usePointStyle: true },
      },
    },
    cutout: "65%",
  };

  const sigmaInfo = leanSixSigma.getSigmaDescription(mockData.sigmaLevel);

  return (
    <GLXDashboardLayout
      title="Pessoas"
      subtitle="Gestão de capital humano"
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
          title="Total Colaboradores"
          value={mockData.totalEmployees.toString()}
          subtitle={`${mockData.activeEmployees} ativos`}
          icon={<Users className="w-5 h-5 text-blue-500" />}
        />
        <KPICard
          title="Turnover"
          value={formatPercentage(mockData.turnoverRate)}
          subtitle={`Meta: ${mockData.turnoverTarget}%`}
          trend={{ value: "-1.5pp", isPositive: true }}
          icon={<UserMinus className="w-5 h-5 text-red-500" />}
          highlight
        />
        <KPICard
          title="Tempo Médio Casa"
          value={`${mockData.avgTenure}a`}
          icon={<Clock className="w-5 h-5 text-purple-500" />}
        />
        <KPICard
          title="Absenteísmo"
          value={formatPercentage(mockData.absenteeismRate)}
          icon={<Calendar className="w-5 h-5 text-orange-500" />}
        />
        <KPICard
          title="Engajamento"
          value={`${mockData.engagementScore}`}
          subtitle={`Meta: ${mockData.engagementTarget}`}
          icon={<Award className="w-5 h-5 text-yellow-500" />}
        />
        <KPICard
          title="Produtividade"
          value={`${mockData.productivityIndex}%`}
          icon={<TrendingUp className="w-5 h-5 text-green-500" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <SectionCard title="Evolução do Turnover" subtitle="Últimos 6 meses">
          <div className="h-64">
            <Line data={turnoverChartData} options={chartOptions as any} />
          </div>
        </SectionCard>

        <SectionCard title="Contratações vs Desligamentos" subtitle="Movimentação mensal">
          <div className="h-64">
            <Bar data={hiresExitsData} options={barChartOptions as any} />
          </div>
        </SectionCard>

        <SectionCard title="Headcount por Área" subtitle="Distribuição">
          <div className="h-64">
            <Doughnut data={headcountDonutData} options={doughnutOptions as any} />
          </div>
        </SectionCard>
      </div>

      {/* Top Performers & Training */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SectionCard
          title="Top Performers"
          subtitle="Melhores avaliações"
          actions={
            <Button variant="link" className="text-orange-500">
              Ver todos →
            </Button>
          }
        >
          <DataTable
            headers={["Colaborador", "Departamento", "Score", "Pacientes"]}
            rows={mockData.topPerformers.map((p, i) => [
              <div key={p.name} className="flex items-center gap-2">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white",
                  i === 0 ? "bg-yellow-500" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-orange-600" : "bg-gray-500"
                )}>
                  {i + 1}
                </div>
                <span>{p.name}</span>
              </div>,
              p.dept,
              <span key={`score-${p.name}`} className="font-bold text-green-500">
                {p.score}
              </span>,
              p.patients,
            ])}
          />
        </SectionCard>

        <SectionCard title="Progresso de Treinamentos" subtitle="Capacitação da equipe">
          <div className="space-y-4">
            {mockData.trainingProgress.map((training, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{training.course}</span>
                  <span className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>
                    Prazo: {training.deadline}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={cn("flex-1 h-2 rounded-full", isDark ? "bg-[#333]" : "bg-gray-200")}>
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        (training.completed / training.total) >= 0.9 ? "bg-green-500" :
                        (training.completed / training.total) >= 0.7 ? "bg-orange-500" : "bg-red-500"
                      )}
                      style={{ width: `${(training.completed / training.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-16 text-right">
                    {training.completed}/{training.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Lean Six Sigma */}
      <SectionCard title="Lean Six Sigma - Gestão de Pessoas" subtitle="Indicadores de eficiência">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={cn("p-4 rounded-lg", isDark ? "bg-[#1a1a1a]" : "bg-gray-50")}>
            <p className={cn("text-xs uppercase", isDark ? "text-gray-500" : "text-gray-400")}>
              Sigma Level
            </p>
            <p className="text-2xl font-bold" style={{ color: sigmaInfo.color }}>
              {mockData.sigmaLevel}σ
            </p>
            <p className="text-xs mt-1" style={{ color: sigmaInfo.color }}>
              {sigmaInfo.level}
            </p>
          </div>
          <div className={cn("p-4 rounded-lg", isDark ? "bg-[#1a1a1a]" : "bg-gray-50")}>
            <p className={cn("text-xs uppercase", isDark ? "text-gray-500" : "text-gray-400")}>
              Retention Rate
            </p>
            <p className="text-2xl font-bold text-green-500">
              {formatPercentage(100 - mockData.turnoverRate)}
            </p>
            <p className={cn("text-xs mt-1", isDark ? "text-gray-500" : "text-gray-400")}>
              Taxa de retenção
            </p>
          </div>
          <div className={cn("p-4 rounded-lg", isDark ? "bg-[#1a1a1a]" : "bg-gray-50")}>
            <p className={cn("text-xs uppercase", isDark ? "text-gray-500" : "text-gray-400")}>
              Training Compliance
            </p>
            <p className="text-2xl font-bold text-blue-500">
              {formatPercentage((mockData.trainingHours / mockData.trainingTarget) * 100)}
            </p>
            <p className={cn("text-xs mt-1", isDark ? "text-gray-500" : "text-gray-400")}>
              vs meta de horas
            </p>
          </div>
          <div className={cn("p-4 rounded-lg", isDark ? "bg-[#1a1a1a]" : "bg-gray-50")}>
            <p className={cn("text-xs uppercase", isDark ? "text-gray-500" : "text-gray-400")}>
              Availability
            </p>
            <p className="text-2xl font-bold text-orange-500">
              {formatPercentage(100 - mockData.absenteeismRate)}
            </p>
            <p className={cn("text-xs mt-1", isDark ? "text-gray-500" : "text-gray-400")}>
              Disponibilidade
            </p>
          </div>
        </div>
      </SectionCard>
    </GLXDashboardLayout>
  );
}
