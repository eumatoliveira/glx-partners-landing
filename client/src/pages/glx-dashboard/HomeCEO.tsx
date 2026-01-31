import { useState } from "react";
import GLXDashboardLayout, {
  KPICard,
  SectionCard,
  AlertCard,
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
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
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
import { Line, Doughnut } from "react-chartjs-2";

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

// Mock data
const mockData = {
  mrr: 485000,
  mrrPrev: 432000,
  arr: 5820000,
  grossMargin: 68.5,
  grossMarginPrev: 65.2,
  cashBalance: 1250000,
  runway: 18,
  occupancyRate: 78.5,
  noShowRate: 12.5,
  nps: 72,
  churnRate: 3.2,
  ltv: 24000,
  cac: 2800,
  sigmaLevel: 4.2,
  oee: 0.82,
  alerts: [
    { type: "danger" as const, title: "No-show crítico", description: "Taxa de no-show acima de 10% na Dermatologia" },
    { type: "warning" as const, title: "Capacidade ociosa", description: "145 horas não utilizadas esta semana" },
    { type: "success" as const, title: "Meta atingida", description: "Receita mensal superou meta em 8%" },
  ],
  actions: [
    { action: "Revisar política de confirmação", responsible: "Dr. Silva", deadline: "02/02", status: "Em andamento" },
    { action: "Implementar SMS automático", responsible: "TI", deadline: "05/02", status: "Pendente" },
    { action: "Treinar recepção", responsible: "RH", deadline: "10/02", status: "Concluído" },
  ],
  forecast: {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    actual: [420000, 445000, 468000, 485000, null, null],
    projected: [420000, 445000, 468000, 485000, 510000, 535000],
  },
  scorecard: [
    { metric: "Receita", target: "R$ 500K", actual: "R$ 485K", status: 97 },
    { metric: "Margem Bruta", target: "70%", actual: "68.5%", status: 98 },
    { metric: "Ocupação", target: "85%", actual: "78.5%", status: 92 },
    { metric: "NPS", target: "75", actual: "72", status: 96 },
    { metric: "No-show", target: "< 8%", actual: "12.5%", status: 64 },
    { metric: "Churn", target: "< 3%", actual: "3.2%", status: 94 },
  ],
};

export default function HomeCEO() {
  const { isDark } = useDashboardTheme();
  const [period, setPeriod] = useState("30d");

  const handleExportPDF = () => {
    exportToPDF(
      "Home CEO - Scorecard Executivo",
      "Visão geral de performance da clínica",
      [
        { label: "MRR", value: formatCurrency(mockData.mrr), trend: "+12.3%" },
        { label: "Margem Bruta", value: formatPercentage(mockData.grossMargin), trend: "+3.3pp" },
        { label: "Ocupação", value: formatPercentage(mockData.occupancyRate) },
        { label: "NPS", value: mockData.nps.toString(), trend: "+5pts" },
        { label: "No-show Rate", value: formatPercentage(mockData.noShowRate), trend: "-1.2pp" },
        { label: "Sigma Level", value: `${mockData.sigmaLevel.toFixed(1)}σ` },
      ],
      {
        headers: ["Métrica", "Meta", "Atual", "Atingimento"],
        rows: mockData.scorecard.map((s) => [s.metric, s.target, s.actual, `${s.status}%`]),
      },
      "home-ceo-scorecard"
    );
  };

  const handleExportCSV = () => {
    exportToCSV(
      mockData.scorecard.map((s) => ({
        Metrica: s.metric,
        Meta: s.target,
        Atual: s.actual,
        Atingimento: `${s.status}%`,
      })),
      "home-ceo-scorecard"
    );
  };

  const forecastChartData = {
    labels: mockData.forecast.labels,
    datasets: [
      {
        label: "Realizado",
        data: mockData.forecast.actual,
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: "#f97316",
      },
      {
        label: "Projetado",
        data: mockData.forecast.projected,
        borderColor: isDark ? "#666" : "#ccc",
        borderDash: [5, 5],
        backgroundColor: "transparent",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: isDark ? "#666" : "#ccc",
      },
    ],
  };

  const forecastChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: isDark ? "#999" : "#666",
          usePointStyle: true,
        },
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

  const sigmaInfo = leanSixSigma.getSigmaDescription(mockData.sigmaLevel);

  return (
    <GLXDashboardLayout
      title="Home CEO"
      subtitle="Scorecard + Alertas + Ações + Forecast"
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
          title="MRR"
          value={formatCurrency(mockData.mrr)}
          subtitle="Receita Mensal Recorrente"
          trend={{ value: "+12.3%", isPositive: true }}
          icon={<DollarSign className="w-5 h-5 text-green-500" />}
          highlight
        />
        <KPICard
          title="Margem Bruta"
          value={formatPercentage(mockData.grossMargin)}
          trend={{ value: "+3.3pp", isPositive: true }}
          icon={<TrendingUp className="w-5 h-5 text-green-500" />}
        />
        <KPICard
          title="Ocupação"
          value={formatPercentage(mockData.occupancyRate)}
          icon={<Calendar className="w-5 h-5 text-blue-500" />}
        />
        <KPICard
          title="No-show"
          value={formatPercentage(mockData.noShowRate)}
          trend={{ value: "-1.2pp", isPositive: true }}
          icon={<Users className="w-5 h-5 text-orange-500" />}
        />
        <KPICard
          title="NPS"
          value={mockData.nps.toString()}
          subtitle="Net Promoter Score"
          trend={{ value: "+5pts", isPositive: true }}
          icon={<Target className="w-5 h-5 text-purple-500" />}
        />
        <KPICard
          title="Sigma Level"
          value={`${mockData.sigmaLevel.toFixed(1)}σ`}
          subtitle={sigmaInfo.level}
          icon={
            <div
              className="w-5 h-5 rounded-full"
              style={{ backgroundColor: sigmaInfo.color }}
            />
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Scorecard */}
        <SectionCard title="Scorecard Executivo" subtitle="Metas vs Realizado" className="lg:col-span-2">
          <div className="space-y-3">
            {mockData.scorecard.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium">{item.metric}</div>
                <div className="flex-1">
                  <div className={cn("h-2 rounded-full", isDark ? "bg-[#333]" : "bg-gray-200")}>
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        item.status >= 95 ? "bg-green-500" : item.status >= 80 ? "bg-yellow-500" : "bg-red-500"
                      )}
                      style={{ width: `${Math.min(100, item.status)}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 text-sm text-right">{item.actual}</div>
                <div className="w-12 text-sm text-right font-medium">
                  <span
                    className={cn(
                      item.status >= 95 ? "text-green-500" : item.status >= 80 ? "text-yellow-500" : "text-red-500"
                    )}
                  >
                    {item.status}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Alerts */}
        <SectionCard title="Alertas" subtitle="Ações necessárias">
          <div className="space-y-3">
            {mockData.alerts.map((alert, i) => (
              <AlertCard key={i} {...alert} />
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Forecast Chart */}
        <SectionCard title="Forecast de Receita" subtitle="Realizado vs Projetado">
          <div className="h-64">
            <Line data={forecastChartData} options={forecastChartOptions as any} />
          </div>
        </SectionCard>

        {/* Lean Six Sigma Metrics */}
        <SectionCard title="Indicadores Lean Six Sigma" subtitle="Qualidade do processo">
          <div className="grid grid-cols-2 gap-4">
            <div className={cn("p-4 rounded-lg", isDark ? "bg-[#1a1a1a]" : "bg-gray-50")}>
              <p className={cn("text-xs uppercase", isDark ? "text-gray-500" : "text-gray-400")}>
                Sigma Level
              </p>
              <p className="text-2xl font-bold" style={{ color: sigmaInfo.color }}>
                {mockData.sigmaLevel.toFixed(2)}σ
              </p>
              <p className="text-xs mt-1" style={{ color: sigmaInfo.color }}>
                {sigmaInfo.level}
              </p>
            </div>
            <div className={cn("p-4 rounded-lg", isDark ? "bg-[#1a1a1a]" : "bg-gray-50")}>
              <p className={cn("text-xs uppercase", isDark ? "text-gray-500" : "text-gray-400")}>
                DPMO
              </p>
              <p className="text-2xl font-bold">
                {leanSixSigma.calculateDPMO(125, 10000).toLocaleString()}
              </p>
              <p className={cn("text-xs mt-1", isDark ? "text-gray-500" : "text-gray-400")}>
                Defeitos por milhão
              </p>
            </div>
            <div className={cn("p-4 rounded-lg", isDark ? "bg-[#1a1a1a]" : "bg-gray-50")}>
              <p className={cn("text-xs uppercase", isDark ? "text-gray-500" : "text-gray-400")}>
                OEE
              </p>
              <p className="text-2xl font-bold text-blue-500">
                {formatPercentage(mockData.oee * 100)}
              </p>
              <p className={cn("text-xs mt-1", isDark ? "text-gray-500" : "text-gray-400")}>
                Eficiência geral
              </p>
            </div>
            <div className={cn("p-4 rounded-lg", isDark ? "bg-[#1a1a1a]" : "bg-gray-50")}>
              <p className={cn("text-xs uppercase", isDark ? "text-gray-500" : "text-gray-400")}>
                Yield
              </p>
              <p className="text-2xl font-bold text-green-500">
                {formatPercentage(leanSixSigma.calculateYield(10000, 125))}
              </p>
              <p className={cn("text-xs mt-1", isDark ? "text-gray-500" : "text-gray-400")}>
                Taxa de sucesso
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Actions Table */}
      <SectionCard
        title="Plano de Ação"
        subtitle="Acompanhamento de iniciativas"
        actions={
          <Button variant="link" className="text-orange-500">
            Ver todas →
          </Button>
        }
      >
        <DataTable
          headers={["Ação", "Responsável", "Prazo", "Status"]}
          rows={mockData.actions.map((a) => [
            a.action,
            a.responsible,
            a.deadline,
            <span
              key={a.action}
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                a.status === "Concluído"
                  ? "bg-green-500/20 text-green-500"
                  : a.status === "Em andamento"
                  ? "bg-yellow-500/20 text-yellow-500"
                  : "bg-gray-500/20 text-gray-500"
              )}
            >
              {a.status}
            </span>,
          ])}
        />
      </SectionCard>
    </GLXDashboardLayout>
  );
}
