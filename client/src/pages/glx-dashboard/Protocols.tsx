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
  FileText,
  TrendingUp,
  Target,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
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
  totalProtocols: 48,
  activeProtocols: 42,
  complianceRate: 94.5,
  complianceTarget: 95,
  avgCycleTime: 28,
  cycleTimeTarget: 25,
  forecastAccuracy: 87.3,
  revenueForecast: 520000,
  revenueActual: 485000,
  forecastVariance: -6.7,
  protocols: [
    { name: "Consulta Inicial", category: "Atendimento", compliance: 98, volume: 420, cycleTime: 32 },
    { name: "Retorno Padrão", category: "Atendimento", compliance: 96, volume: 280, cycleTime: 22 },
    { name: "Procedimento Estético", category: "Procedimentos", compliance: 92, volume: 180, cycleTime: 45 },
    { name: "Exame Laboratorial", category: "Diagnóstico", compliance: 95, volume: 320, cycleTime: 18 },
    { name: "Cirurgia Ambulatorial", category: "Cirurgia", compliance: 88, volume: 45, cycleTime: 120 },
  ],
  forecastTrend: {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    forecast: [450000, 470000, 490000, 505000, 515000, 520000],
    actual: [445000, 468000, 485000, 498000, 510000, 485000],
  },
  categoryCompliance: [
    { category: "Atendimento", compliance: 97, protocols: 15 },
    { category: "Procedimentos", compliance: 92, protocols: 12 },
    { category: "Diagnóstico", compliance: 95, protocols: 10 },
    { category: "Cirurgia", compliance: 88, protocols: 6 },
    { category: "Administrativo", compliance: 96, protocols: 5 },
  ],
  upcomingDeadlines: [
    { protocol: "Revisão Anual - Consultas", deadline: "05/02/2026", status: "Em dia" },
    { protocol: "Atualização - Procedimentos", deadline: "10/02/2026", status: "Atenção" },
    { protocol: "Auditoria - Cirurgias", deadline: "15/02/2026", status: "Em dia" },
    { protocol: "Treinamento - Equipe", deadline: "20/02/2026", status: "Pendente" },
  ],
  sigmaLevel: 4.1,
};

export default function Protocols() {
  const { isDark } = useDashboardTheme();
  const [period, setPeriod] = useState("30d");

  const handleExportPDF = () => {
    exportToPDF(
      "Protocolos & Forecast",
      "Análise de conformidade e previsões",
      [
        { label: "Total Protocolos", value: mockData.totalProtocols.toString() },
        { label: "Taxa Conformidade", value: formatPercentage(mockData.complianceRate) },
        { label: "Tempo Ciclo Médio", value: `${mockData.avgCycleTime} dias` },
        { label: "Acurácia Forecast", value: formatPercentage(mockData.forecastAccuracy) },
        { label: "Receita Prevista", value: formatCurrency(mockData.revenueForecast) },
        { label: "Receita Real", value: formatCurrency(mockData.revenueActual) },
      ],
      {
        headers: ["Protocolo", "Categoria", "Conformidade", "Volume", "Tempo Ciclo"],
        rows: mockData.protocols.map((p) => [
          p.name,
          p.category,
          `${p.compliance}%`,
          p.volume.toString(),
          `${p.cycleTime} dias`,
        ]),
      },
      "protocols-forecast-report"
    );
  };

  const handleExportCSV = () => {
    const data = mockData.protocols.map((p) => ({
      Protocolo: p.name,
      Categoria: p.category,
      Conformidade: `${p.compliance}%`,
      Volume: p.volume,
      Tempo_Ciclo: `${p.cycleTime} dias`,
    }));
    exportToCSV(data, "protocols-data");
  };

  const forecastChartData = {
    labels: mockData.forecastTrend.labels,
    datasets: [
      {
        label: "Forecast",
        data: mockData.forecastTrend.forecast,
        borderColor: isDark ? "#666" : "#ccc",
        borderDash: [5, 5],
        backgroundColor: "transparent",
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: "Realizado",
        data: mockData.forecastTrend.actual,
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: "#f97316",
      },
    ],
  };

  const complianceByCategory = {
    labels: mockData.categoryCompliance.map((c) => c.category),
    datasets: [
      {
        label: "Conformidade %",
        data: mockData.categoryCompliance.map((c) => c.compliance),
        backgroundColor: mockData.categoryCompliance.map((c) =>
          c.compliance >= 95 ? "#22c55e" : c.compliance >= 90 ? "#f97316" : "#ef4444"
        ),
        borderRadius: 4,
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
          callback: (value: number) => `R$ ${(value / 1000).toFixed(0)}K`,
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
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
        min: 80,
        max: 100,
      },
    },
  };

  const sigmaInfo = leanSixSigma.getSigmaDescription(mockData.sigmaLevel);

  return (
    <GLXDashboardLayout
      title="Protocolos & Forecast"
      subtitle="Conformidade de processos e previsões"
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
          title="Total Protocolos"
          value={mockData.totalProtocols.toString()}
          subtitle={`${mockData.activeProtocols} ativos`}
          icon={<FileText className="w-5 h-5 text-blue-500" />}
        />
        <KPICard
          title="Taxa Conformidade"
          value={formatPercentage(mockData.complianceRate)}
          subtitle={`Meta: ${mockData.complianceTarget}%`}
          trend={{ value: "-0.5pp", isPositive: false }}
          icon={<CheckCircle className="w-5 h-5 text-green-500" />}
          highlight
        />
        <KPICard
          title="Tempo Ciclo Médio"
          value={`${mockData.avgCycleTime}d`}
          subtitle={`Meta: ${mockData.cycleTimeTarget}d`}
          icon={<Clock className="w-5 h-5 text-orange-500" />}
        />
        <KPICard
          title="Acurácia Forecast"
          value={formatPercentage(mockData.forecastAccuracy)}
          icon={<Target className="w-5 h-5 text-purple-500" />}
        />
        <KPICard
          title="Receita Prevista"
          value={formatCurrency(mockData.revenueForecast)}
          icon={<TrendingUp className="w-5 h-5 text-green-500" />}
        />
        <KPICard
          title="Variância"
          value={`${mockData.forecastVariance}%`}
          subtitle="vs forecast"
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SectionCard title="Forecast vs Realizado" subtitle="Evolução mensal">
          <div className="h-64">
            <Line data={forecastChartData} options={chartOptions as any} />
          </div>
        </SectionCard>

        <SectionCard title="Conformidade por Categoria" subtitle="Taxa de aderência">
          <div className="h-64">
            <Bar data={complianceByCategory} options={barChartOptions as any} />
          </div>
        </SectionCard>
      </div>

      {/* Protocols Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SectionCard
          title="Protocolos"
          subtitle="Status de conformidade"
          actions={
            <Button variant="link" className="text-orange-500">
              Ver todos →
            </Button>
          }
        >
          <DataTable
            headers={["Protocolo", "Categoria", "Conformidade", "Volume"]}
            rows={mockData.protocols.map((p) => [
              p.name,
              p.category,
              <span
                key={p.name}
                className={cn(
                  "font-medium",
                  p.compliance >= 95 ? "text-green-500" : p.compliance >= 90 ? "text-orange-500" : "text-red-500"
                )}
              >
                {p.compliance}%
              </span>,
              p.volume,
            ])}
          />
        </SectionCard>

        <SectionCard title="Próximos Prazos" subtitle="Revisões e auditorias">
          <div className="space-y-3">
            {mockData.upcomingDeadlines.map((item, i) => (
              <div
                key={i}
                className={cn(
                  "p-4 rounded-lg border flex items-center justify-between",
                  isDark ? "bg-[#1a1a1a] border-[#333]" : "bg-gray-50 border-gray-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <Calendar className={cn(
                    "w-5 h-5",
                    item.status === "Em dia" ? "text-green-500" :
                    item.status === "Atenção" ? "text-yellow-500" : "text-red-500"
                  )} />
                  <div>
                    <p className="font-medium">{item.protocol}</p>
                    <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                      {item.deadline}
                    </p>
                  </div>
                </div>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  item.status === "Em dia" ? "bg-green-500/20 text-green-500" :
                  item.status === "Atenção" ? "bg-yellow-500/20 text-yellow-500" : "bg-red-500/20 text-red-500"
                )}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Lean Six Sigma */}
      <SectionCard title="Lean Six Sigma - Qualidade de Processos" subtitle="Indicadores de performance">
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
              DPMO
            </p>
            <p className="text-2xl font-bold text-orange-500">
              {leanSixSigma.calculateDPMO(55, 10000).toLocaleString()}
            </p>
            <p className={cn("text-xs mt-1", isDark ? "text-gray-500" : "text-gray-400")}>
              Defeitos por milhão
            </p>
          </div>
          <div className={cn("p-4 rounded-lg", isDark ? "bg-[#1a1a1a]" : "bg-gray-50")}>
            <p className={cn("text-xs uppercase", isDark ? "text-gray-500" : "text-gray-400")}>
              Yield
            </p>
            <p className="text-2xl font-bold text-green-500">
              {formatPercentage(mockData.complianceRate)}
            </p>
            <p className={cn("text-xs mt-1", isDark ? "text-gray-500" : "text-gray-400")}>
              Taxa de sucesso
            </p>
          </div>
          <div className={cn("p-4 rounded-lg", isDark ? "bg-[#1a1a1a]" : "bg-gray-50")}>
            <p className={cn("text-xs uppercase", isDark ? "text-gray-500" : "text-gray-400")}>
              Cp (Capacidade)
            </p>
            <p className="text-2xl font-bold text-blue-500">
              {leanSixSigma.calculateCp(10, 100, 80).toFixed(2)}
            </p>
            <p className={cn("text-xs mt-1", isDark ? "text-gray-500" : "text-gray-400")}>
              Índice de capacidade
            </p>
          </div>
        </div>
      </SectionCard>
    </GLXDashboardLayout>
  );
}
