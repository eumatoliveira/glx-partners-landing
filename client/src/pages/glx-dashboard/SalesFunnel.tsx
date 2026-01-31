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
  TrendingUp,
  Target,
  Phone,
  Calendar,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  exportToPDF,
  exportToCSV,
  formatCurrency,
  formatPercentage,
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
import { Line, Bar } from "react-chartjs-2";

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
  totalLeads: 1240,
  leadGrowth: 8,
  qualifiedLeads: 850,
  qualificationRate: 68,
  scheduledConsults: 420,
  conversionToSchedule: 49,
  convertedSales: 180,
  finalConversionRate: 42,
  totalRevenue: 225000,
  avgTicket: 1250,
  cycleTime: 12,
  costPerLead: 38.90,
  funnelStages: [
    { stage: "Leads Generated", count: 1240, conversion: 100, target: 1200 },
    { stage: "Qualified Leads", count: 850, conversion: 68, target: 800 },
    { stage: "Scheduled Consults", count: 420, conversion: 49, target: 450 },
    { stage: "Converted (Sales)", count: 180, conversion: 42, target: 200 },
  ],
  sourcePerformance: [
    { source: "Google Ads", leads: 420, qualified: 285, converted: 62, revenue: 77500, cpl: 43.92, convRate: 14.8 },
    { source: "Meta Ads", leads: 380, qualified: 245, converted: 48, revenue: 60000, cpl: 32.10, convRate: 12.6 },
    { source: "Referrals", leads: 180, qualified: 145, converted: 42, revenue: 52500, cpl: 15.00, convRate: 23.3 },
    { source: "Organic", leads: 160, qualified: 110, converted: 18, revenue: 22500, cpl: 0, convRate: 11.3 },
    { source: "Email", leads: 100, qualified: 65, converted: 10, revenue: 12500, cpl: 8.50, convRate: 10.0 },
  ],
  weeklyTrend: {
    labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
    leads: [280, 310, 320, 330],
    conversions: [38, 42, 48, 52],
  },
  lostReasons: [
    { reason: "Preço", count: 85, percentage: 35 },
    { reason: "Sem resposta", count: 60, percentage: 25 },
    { reason: "Concorrência", count: 48, percentage: 20 },
    { reason: "Timing", count: 30, percentage: 12 },
    { reason: "Outros", count: 17, percentage: 8 },
  ],
};

export default function SalesFunnel() {
  const { isDark } = useDashboardTheme();
  const [period, setPeriod] = useState("30d");

  const handleExportPDF = () => {
    exportToPDF(
      "Funil Comercial",
      "Análise detalhada do funil de vendas",
      [
        { label: "Total Leads", value: mockData.totalLeads.toString(), trend: `+${mockData.leadGrowth}%` },
        { label: "Taxa Qualificação", value: formatPercentage(mockData.qualificationRate) },
        { label: "Consultas Agendadas", value: mockData.scheduledConsults.toString() },
        { label: "Conversão Final", value: formatPercentage(mockData.finalConversionRate) },
        { label: "Receita Total", value: formatCurrency(mockData.totalRevenue) },
        { label: "Ticket Médio", value: formatCurrency(mockData.avgTicket) },
      ],
      {
        headers: ["Fonte", "Leads", "Qualificados", "Convertidos", "Receita", "Conv. Rate"],
        rows: mockData.sourcePerformance.map((s) => [
          s.source,
          s.leads.toString(),
          s.qualified.toString(),
          s.converted.toString(),
          formatCurrency(s.revenue),
          `${s.convRate}%`,
        ]),
      },
      "sales-funnel-report"
    );
  };

  const handleExportCSV = () => {
    const data = mockData.sourcePerformance.map((s) => ({
      Fonte: s.source,
      Leads: s.leads,
      Qualificados: s.qualified,
      Convertidos: s.converted,
      Receita: s.revenue,
      CPL: s.cpl,
      Taxa_Conversao: `${s.convRate}%`,
    }));
    exportToCSV(data, "sales-funnel-by-source");
  };

  const trendChartData = {
    labels: mockData.weeklyTrend.labels,
    datasets: [
      {
        label: "Leads",
        data: mockData.weeklyTrend.leads,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Conversões",
        data: mockData.weeklyTrend.conversions,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        tension: 0.4,
        yAxisID: "y1",
      },
    ],
  };

  const lostReasonsData = {
    labels: mockData.lostReasons.map((r) => r.reason),
    datasets: [
      {
        data: mockData.lostReasons.map((r) => r.count),
        backgroundColor: ["#ef4444", "#f97316", "#eab308", "#3b82f6", "#6b7280"],
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
        type: "linear" as const,
        position: "left" as const,
        grid: { color: isDark ? "#333" : "#eee" },
        ticks: { color: isDark ? "#999" : "#666" },
      },
      y1: {
        type: "linear" as const,
        position: "right" as const,
        grid: { display: false },
        ticks: { color: isDark ? "#999" : "#666" },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { color: isDark ? "#333" : "#eee" },
        ticks: { color: isDark ? "#999" : "#666" },
      },
      y: {
        grid: { display: false },
        ticks: { color: isDark ? "#999" : "#666" },
      },
    },
  };

  return (
    <GLXDashboardLayout
      title="Funil Comercial"
      subtitle="Análise do pipeline de vendas"
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
          title="Total Leads"
          value={mockData.totalLeads.toString()}
          trend={{ value: `+${mockData.leadGrowth}% MoM`, isPositive: true }}
          icon={<Users className="w-5 h-5 text-blue-500" />}
          highlight
        />
        <KPICard
          title="Taxa Qualificação"
          value={formatPercentage(mockData.qualificationRate)}
          icon={<Target className="w-5 h-5 text-purple-500" />}
        />
        <KPICard
          title="Consultas Agendadas"
          value={mockData.scheduledConsults.toString()}
          subtitle="High Drop-off"
          icon={<Calendar className="w-5 h-5 text-orange-500" />}
        />
        <KPICard
          title="Conversão Final"
          value={formatPercentage(mockData.finalConversionRate)}
          icon={<TrendingUp className="w-5 h-5 text-green-500" />}
        />
        <KPICard
          title="Receita Total"
          value={formatCurrency(mockData.totalRevenue)}
          icon={<DollarSign className="w-5 h-5 text-green-500" />}
        />
        <KPICard
          title="CPL Médio"
          value={formatCurrency(mockData.costPerLead)}
          subtitle="-5.2% vs mês anterior"
          icon={<DollarSign className="w-5 h-5 text-blue-500" />}
        />
      </div>

      {/* Visual Funnel */}
      <SectionCard title="Commercial Funnel Flow" subtitle="Visualização do funil de conversão" className="mb-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-6">
          {mockData.funnelStages.map((stage, i) => (
            <div key={i} className="flex items-center gap-4">
              <div
                className={cn(
                  "relative p-6 rounded-xl border-2 text-center transition-all",
                  i === mockData.funnelStages.length - 1
                    ? "bg-orange-500/20 border-orange-500"
                    : isDark
                    ? "bg-[#1a1a1a] border-[#333] hover:border-[#444]"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300"
                )}
                style={{
                  minWidth: `${180 - i * 15}px`,
                }}
              >
                <p className={cn("text-xs uppercase font-medium mb-2", isDark ? "text-gray-400" : "text-gray-500")}>
                  Stage {i + 1}
                </p>
                <p className="font-semibold text-sm mb-1">{stage.stage}</p>
                <p className={cn(
                  "text-3xl font-bold",
                  i === mockData.funnelStages.length - 1 ? "text-orange-500" : ""
                )}>
                  {stage.count.toLocaleString()}
                </p>
                {stage.target && (
                  <p className={cn(
                    "text-xs mt-1",
                    stage.count >= stage.target ? "text-green-500" : "text-red-500"
                  )}>
                    Target: {stage.target}
                  </p>
                )}
                {i > 0 && (
                  <div className={cn(
                    "absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-xs font-medium",
                    stage.conversion >= 50 ? "bg-green-500/20 text-green-500" : "bg-orange-500/20 text-orange-500"
                  )}>
                    {stage.conversion}% Conversion
                  </div>
                )}
              </div>
              {i < mockData.funnelStages.length - 1 && (
                <ArrowRight className={cn("w-6 h-6 hidden md:block", isDark ? "text-gray-600" : "text-gray-300")} />
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SectionCard title="Tendência Semanal" subtitle="Leads vs Conversões">
          <div className="h-64">
            <Line data={trendChartData} options={chartOptions as any} />
          </div>
        </SectionCard>

        <SectionCard title="Motivos de Perda" subtitle="Leads não convertidos">
          <div className="h-64">
            <Bar data={lostReasonsData} options={barChartOptions as any} />
          </div>
        </SectionCard>
      </div>

      {/* Source Performance Table */}
      <SectionCard
        title="Channel Performance"
        subtitle="Performance por fonte de aquisição"
        actions={
          <Button variant="link" className="text-orange-500">
            View Source Data →
          </Button>
        }
      >
        <DataTable
          headers={["Channel", "Leads", "Qualified", "Converted", "Revenue", "CPL", "Conv. Rate"]}
          rows={mockData.sourcePerformance.map((s) => [
            <div key={s.source} className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold",
                s.source === "Google Ads" ? "bg-blue-500" :
                s.source === "Meta Ads" ? "bg-purple-500" :
                s.source === "Referrals" ? "bg-green-500" :
                s.source === "Organic" ? "bg-orange-500" : "bg-gray-500"
              )}>
                {s.source.charAt(0)}
              </div>
              <span>{s.source}</span>
            </div>,
            s.leads,
            s.qualified,
            s.converted,
            formatCurrency(s.revenue),
            s.cpl > 0 ? formatCurrency(s.cpl) : "-",
            <span key={`rate-${s.source}`} className={cn(
              "font-medium",
              s.convRate >= 20 ? "text-green-500" : s.convRate >= 12 ? "text-orange-500" : "text-red-500"
            )}>
              {s.convRate}%
            </span>,
          ])}
        />
      </SectionCard>
    </GLXDashboardLayout>
  );
}
