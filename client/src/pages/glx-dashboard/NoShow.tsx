import { useState } from "react";
import GLXDashboardLayout, {
  KPICard,
  SectionCard,
  DataTable,
  AlertCard,
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
  UserX,
  DollarSign,
  Clock,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
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
import { Line, Doughnut, Bar } from "react-chartjs-2";

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
  noShowRate: 12.5,
  noShowRatePrev: 13.7,
  noShowTarget: 8,
  financialLoss: 42500,
  dailyLossAvg: 1416,
  idleCapacity: 145,
  efficiencyScore: 84,
  totalWaste: 58200,
  wasteBreakdown: [
    { type: "No-shows", value: 26190, percentage: 45 },
    { type: "Cancelamentos Tardios", value: 14550, percentage: 25 },
    { type: "Equipamento Ocioso", value: 8730, percentage: 15 },
    { type: "Overstaffing", value: 8730, percentage: 15 },
  ],
  heatmapData: [
    { period: "Manhã (8h-12h)", mon: 15, tue: 12, wed: 14, thu: 11, fri: 18 },
    { period: "Tarde (13h-17h)", mon: 10, tue: 8, wed: 12, thu: 9, fri: 14 },
    { period: "Noite (17h-20h)", mon: 8, tue: 6, wed: 10, thu: 7, fri: 12 },
  ],
  departmentImpact: [
    { dept: "Dermatologia", appts: 420, rate: 18.5, loss: 12450, trend: "up" },
    { dept: "Ortopedia", appts: 380, rate: 14.2, loss: 9800, trend: "down" },
    { dept: "Cardiologia", appts: 350, rate: 11.8, loss: 8200, trend: "stable" },
    { dept: "Pediatria", appts: 290, rate: 9.5, loss: 5400, trend: "down" },
    { dept: "Ginecologia", appts: 260, rate: 8.2, loss: 4100, trend: "stable" },
  ],
  recoveryActions: [
    { action: "Waitlist Filled", description: "Auto-filled 3 slots in Dermatologia", time: "2m ago", recovered: 450 },
    { action: "SMS Reminders", description: "Sent 142 confirmations for tomorrow", time: "1h ago", recovered: 0 },
    { action: "Overbooking Applied", description: "Added 5% buffer to high-risk slots", time: "3h ago", recovered: 280 },
  ],
  trendData: {
    labels: ["Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    noShowRate: [15.2, 14.8, 14.1, 13.5, 13.7, 12.5],
    target: [8, 8, 8, 8, 8, 8],
  },
  sigmaLevel: 3.8,
  dpmo: 125000,
};

export default function NoShow() {
  const { isDark } = useDashboardTheme();
  const [period, setPeriod] = useState("30d");

  const handleExportPDF = () => {
    exportToPDF(
      "No-show & Operational Waste",
      "Análise de desperdício operacional",
      [
        { label: "Taxa No-show", value: formatPercentage(mockData.noShowRate), trend: "-1.2pp" },
        { label: "Perda Financeira", value: formatCurrency(mockData.financialLoss) },
        { label: "Capacidade Ociosa", value: `${mockData.idleCapacity}h` },
        { label: "Efficiency Score", value: `${mockData.efficiencyScore}/100` },
        { label: "Total Waste", value: formatCurrency(mockData.totalWaste) },
        { label: "Sigma Level", value: `${mockData.sigmaLevel}σ` },
      ],
      {
        headers: ["Departamento", "Agendamentos", "Taxa No-show", "Perda Est."],
        rows: mockData.departmentImpact.map((d) => [
          d.dept,
          d.appts.toString(),
          `${d.rate}%`,
          formatCurrency(d.loss),
        ]),
      },
      "no-show-waste-report"
    );
  };

  const handleExportCSV = () => {
    const data = mockData.departmentImpact.map((d) => ({
      Departamento: d.dept,
      Agendamentos: d.appts,
      Taxa_NoShow: `${d.rate}%`,
      Perda_Estimada: d.loss,
      Tendencia: d.trend,
    }));
    exportToCSV(data, "no-show-by-department");
  };

  const trendChartData = {
    labels: mockData.trendData.labels,
    datasets: [
      {
        label: "Taxa No-show",
        data: mockData.trendData.noShowRate,
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: "#f97316",
      },
      {
        label: "Meta",
        data: mockData.trendData.target,
        borderColor: "#22c55e",
        borderDash: [5, 5],
        backgroundColor: "transparent",
        tension: 0,
        pointRadius: 0,
      },
    ],
  };

  const wasteDonutData = {
    labels: mockData.wasteBreakdown.map((w) => w.type),
    datasets: [
      {
        data: mockData.wasteBreakdown.map((w) => w.value),
        backgroundColor: ["#f97316", "#eab308", "#3b82f6", "#6b7280"],
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
        max: 20,
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

  const getHeatmapColor = (value: number) => {
    if (value >= 15) return "#ef4444";
    if (value >= 12) return "#f97316";
    if (value >= 10) return "#eab308";
    if (value >= 8) return "#84cc16";
    return "#22c55e";
  };

  const sigmaInfo = leanSixSigma.getSigmaDescription(mockData.sigmaLevel);

  return (
    <GLXDashboardLayout
      title="No-show & Operational Waste"
      subtitle="Análise de desperdício e ações de recuperação"
      actions={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-500 text-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Live Data
          </div>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="No-show Rate %"
          value={formatPercentage(mockData.noShowRate)}
          trend={{ value: "-1.2pp", isPositive: true }}
          icon={<UserX className="w-5 h-5 text-orange-500" />}
          highlight
        />
        <KPICard
          title="Financial Loss (Est.)"
          value={formatCurrency(mockData.financialLoss)}
          subtitle={`~${formatCurrency(mockData.dailyLossAvg)} daily avg.`}
          icon={<DollarSign className="w-5 h-5 text-red-500" />}
        />
        <KPICard
          title="Idle Capacity"
          value={`${mockData.idleCapacity} Hrs`}
          subtitle="Across 3 departments"
          icon={<Clock className="w-5 h-5 text-yellow-500" />}
        />
        <KPICard
          title="Efficiency Score"
          value={`${mockData.efficiencyScore}/100`}
          subtitle="Top 15% of peers"
          icon={<CheckCircle className="w-5 h-5 text-green-500" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Heatmap */}
        <SectionCard title="No-show Frequency" subtitle="Heatmap by Day & Time" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className={cn("text-left py-3 px-4 text-sm font-medium", isDark ? "text-gray-400" : "text-gray-500")} />
                  <th className={cn("text-center py-3 px-4 text-sm font-medium", isDark ? "text-gray-400" : "text-gray-500")}>Mon</th>
                  <th className={cn("text-center py-3 px-4 text-sm font-medium", isDark ? "text-gray-400" : "text-gray-500")}>Tue</th>
                  <th className={cn("text-center py-3 px-4 text-sm font-medium", isDark ? "text-gray-400" : "text-gray-500")}>Wed</th>
                  <th className={cn("text-center py-3 px-4 text-sm font-medium", isDark ? "text-gray-400" : "text-gray-500")}>Thu</th>
                  <th className={cn("text-center py-3 px-4 text-sm font-medium", isDark ? "text-gray-400" : "text-gray-500")}>Fri</th>
                </tr>
              </thead>
              <tbody>
                {mockData.heatmapData.map((row, i) => (
                  <tr key={i}>
                    <td className={cn("py-2 px-4 text-sm", isDark ? "text-gray-400" : "text-gray-500")}>{row.period}</td>
                    {[row.mon, row.tue, row.wed, row.thu, row.fri].map((value, j) => (
                      <td key={j} className="py-2 px-4">
                        <div
                          className="h-12 rounded-lg flex items-center justify-center text-sm font-medium text-white"
                          style={{ backgroundColor: getHeatmapColor(value) }}
                        >
                          {value}%
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-end gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "#22c55e" }} />
              <span className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "#f97316" }} />
              <span className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>High</span>
            </div>
          </div>
        </SectionCard>

        {/* Waste Breakdown */}
        <SectionCard title="Waste Breakdown" subtitle="Monetary Value Distribution">
          <div className="h-48">
            <Doughnut data={wasteDonutData} options={doughnutOptions as any} />
          </div>
          <div className="mt-4 text-center">
            <p className={cn("text-xs uppercase", isDark ? "text-gray-500" : "text-gray-400")}>Total Waste</p>
            <p className="text-3xl font-bold text-orange-500">{formatCurrency(mockData.totalWaste)}</p>
          </div>
        </SectionCard>
      </div>

      {/* Department Impact & Recovery Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SectionCard
          title="Department Impact"
          subtitle="Ranked by revenue loss"
          actions={
            <Button variant="link" className="text-orange-500">
              View Full Report →
            </Button>
          }
        >
          <DataTable
            headers={["Department", "Appts", "No-show Rate", "Est. Loss", "Trend"]}
            rows={mockData.departmentImpact.map((d) => [
              <div key={d.dept}>
                <p className="font-medium">{d.dept}</p>
              </div>,
              d.appts,
              <span key={`rate-${d.dept}`} className={cn(
                "font-medium",
                d.rate >= 15 ? "text-red-500" : d.rate >= 10 ? "text-orange-500" : "text-green-500"
              )}>
                {d.rate}%
              </span>,
              formatCurrency(d.loss),
              <span key={`trend-${d.dept}`}>
                {d.trend === "up" ? "📈" : d.trend === "down" ? "📉" : "➡️"}
              </span>,
            ])}
          />
        </SectionCard>

        <SectionCard title="Recovery Actions" subtitle="Automated interventions">
          <div className="space-y-4">
            {mockData.recoveryActions.map((action, i) => (
              <div
                key={i}
                className={cn(
                  "p-4 rounded-lg border",
                  isDark ? "bg-[#1a1a1a] border-[#333]" : "bg-gray-50 border-gray-200"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      action.recovered > 0 ? "bg-green-500/20" : "bg-blue-500/20"
                    )}>
                      {action.recovered > 0 ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{action.action}</p>
                      <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                        {action.description}
                      </p>
                      {action.recovered > 0 && (
                        <p className="text-sm text-green-500 mt-1">
                          +{formatCurrency(action.recovered)} Recovered
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
                    {action.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Trend & Lean Six Sigma */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="No-show Trend" subtitle="Evolução vs Meta">
          <div className="h-64">
            <Line data={trendChartData} options={chartOptions as any} />
          </div>
        </SectionCard>

        <SectionCard title="Lean Six Sigma Metrics" subtitle="Process Quality Analysis">
          <div className="grid grid-cols-2 gap-4">
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
                {mockData.dpmo.toLocaleString()}
              </p>
              <p className={cn("text-xs mt-1", isDark ? "text-gray-500" : "text-gray-400")}>
                Defects per million
              </p>
            </div>
            <div className={cn("p-4 rounded-lg", isDark ? "bg-[#1a1a1a]" : "bg-gray-50")}>
              <p className={cn("text-xs uppercase", isDark ? "text-gray-500" : "text-gray-400")}>
                Yield
              </p>
              <p className="text-2xl font-bold text-green-500">
                {formatPercentage(100 - mockData.noShowRate)}
              </p>
              <p className={cn("text-xs mt-1", isDark ? "text-gray-500" : "text-gray-400")}>
                Success rate
              </p>
            </div>
            <div className={cn("p-4 rounded-lg", isDark ? "bg-[#1a1a1a]" : "bg-gray-50")}>
              <p className={cn("text-xs uppercase", isDark ? "text-gray-500" : "text-gray-400")}>
                Target Gap
              </p>
              <p className="text-2xl font-bold text-red-500">
                {formatPercentage(mockData.noShowRate - mockData.noShowTarget)}
              </p>
              <p className={cn("text-xs mt-1", isDark ? "text-gray-500" : "text-gray-400")}>
                Above target
              </p>
            </div>
          </div>
        </SectionCard>
      </div>
    </GLXDashboardLayout>
  );
}
