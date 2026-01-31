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
  DollarSign,
  TrendingUp,
  Target,
  Zap,
  BarChart3,
  Lightbulb,
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
  totalSpend: 48250,
  spendGrowth: 12,
  budgetUsage: 92,
  costPerLead: 38.90,
  cplChange: -5.2,
  cac: 268.00,
  cacStable: true,
  marketingROI: 428,
  roiGrowth: 15,
  roiHighest: true,
  leadsGenerated: 1240,
  qualifiedLeads: 850,
  conversions: 180,
  revenue: 225000,
  channelPerformance: [
    { channel: "Google Ads", spend: 18450, leads: 420, cpl: 43.92, convRate: 12.4, roi: 320 },
    { channel: "Meta Ads", spend: 12200, leads: 580, cpl: 21.03, convRate: 4.8, roi: 180 },
    { channel: "LinkedIn", spend: 8500, leads: 120, cpl: 70.83, convRate: 8.2, roi: 145 },
    { channel: "Email Marketing", spend: 2100, leads: 85, cpl: 24.70, convRate: 15.3, roi: 520 },
    { channel: "Content/SEO", spend: 7000, leads: 35, cpl: 200.00, convRate: 22.8, roi: 680 },
  ],
  roiForecast: {
    labels: ["Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    actual: [320, 345, 380, 395, 410, 428],
    projected: [320, 345, 380, 395, 410, 428, 450, 475],
  },
  insights: [
    {
      type: "success",
      title: "Best Performing Channel",
      channel: "Referrals",
      metric: "12.8x ROI",
      description: "Conversion rate 3x higher than paid ads.",
    },
    {
      type: "warning",
      title: "Channel to Optimize",
      channel: "Meta Ads",
      metric: "Low Conv.",
      description: "CPL is low ($21), but lead quality needs filtering.",
    },
  ],
  campaignStatus: "active",
  spendByCategory: [
    { category: "Paid Search", value: 18450, percentage: 38 },
    { category: "Social Ads", value: 12200, percentage: 25 },
    { category: "Display", value: 8500, percentage: 18 },
    { category: "Content", value: 7000, percentage: 15 },
    { category: "Email", value: 2100, percentage: 4 },
  ],
};

export default function MarketingROI() {
  const { isDark } = useDashboardTheme();
  const [period, setPeriod] = useState("30d");

  const handleExportPDF = () => {
    exportToPDF(
      "Growth & Marketing ROI",
      "Análise detalhada de performance de marketing",
      [
        { label: "Total Marketing Spend", value: formatCurrency(mockData.totalSpend), trend: `+${mockData.spendGrowth}%` },
        { label: "Cost Per Lead", value: formatCurrency(mockData.costPerLead), trend: `${mockData.cplChange}%` },
        { label: "CAC", value: formatCurrency(mockData.cac) },
        { label: "Marketing ROI", value: `${mockData.marketingROI}%`, trend: `+${mockData.roiGrowth}%` },
        { label: "Leads Generated", value: mockData.leadsGenerated.toString() },
        { label: "Revenue", value: formatCurrency(mockData.revenue) },
      ],
      {
        headers: ["Channel", "Spend", "Leads", "CPL", "Conv. Rate", "ROI"],
        rows: mockData.channelPerformance.map((c) => [
          c.channel,
          formatCurrency(c.spend),
          c.leads.toString(),
          formatCurrency(c.cpl),
          `${c.convRate}%`,
          `${c.roi}%`,
        ]),
      },
      "marketing-roi-report"
    );
  };

  const handleExportCSV = () => {
    const data = mockData.channelPerformance.map((c) => ({
      Channel: c.channel,
      Spend: c.spend,
      Leads: c.leads,
      CPL: c.cpl,
      Conv_Rate: `${c.convRate}%`,
      ROI: `${c.roi}%`,
    }));
    exportToCSV(data, "marketing-channel-performance");
  };

  const roiChartData = {
    labels: mockData.roiForecast.labels,
    datasets: [
      {
        label: "Actual",
        data: mockData.roiForecast.actual,
        borderColor: "#f97316",
        backgroundColor: "transparent",
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: "#f97316",
      },
      {
        label: "Projected",
        data: [...mockData.roiForecast.actual.slice(0, -1), null, 450, 475],
        borderColor: isDark ? "#666" : "#ccc",
        borderDash: [5, 5],
        backgroundColor: "transparent",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: isDark ? "#666" : "#ccc",
      },
    ],
  };

  const spendDonutData = {
    labels: mockData.spendByCategory.map((s) => s.category),
    datasets: [
      {
        data: mockData.spendByCategory.map((s) => s.value),
        backgroundColor: ["#3b82f6", "#8b5cf6", "#f97316", "#22c55e", "#eab308"],
        borderWidth: 0,
      },
    ],
  };

  const channelROIData = {
    labels: mockData.channelPerformance.map((c) => c.channel),
    datasets: [
      {
        label: "ROI %",
        data: mockData.channelPerformance.map((c) => c.roi),
        backgroundColor: mockData.channelPerformance.map((c) =>
          c.roi >= 400 ? "#22c55e" : c.roi >= 200 ? "#f97316" : "#ef4444"
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
          callback: (value: number) => `${value}%`,
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    plugins: { legend: { display: false } },
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

  return (
    <GLXDashboardLayout
      title="Growth & Marketing ROI"
      subtitle="Detailed analysis of commercial funnel performance"
      actions={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Campaigns Active
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
          title="Total Marketing Spend"
          value={formatCurrency(mockData.totalSpend)}
          subtitle={`Budget usage at ${mockData.budgetUsage}%`}
          trend={{ value: `+${mockData.spendGrowth}%`, isPositive: false }}
          icon={<DollarSign className="w-5 h-5 text-blue-500" />}
        />
        <KPICard
          title="Cost Per Lead (CPL)"
          value={formatCurrency(mockData.costPerLead)}
          subtitle="Optimized Ad targeting"
          trend={{ value: `${mockData.cplChange}%`, isPositive: true }}
          icon={<Target className="w-5 h-5 text-green-500" />}
        />
        <KPICard
          title="Acquisition Cost (CAC)"
          value={formatCurrency(mockData.cac)}
          subtitle="Stable over last quarter"
          icon={<BarChart3 className="w-5 h-5 text-purple-500" />}
        />
        <KPICard
          title="Marketing ROI"
          value={`${mockData.marketingROI}%`}
          subtitle="Highest in 6 months"
          trend={{ value: `+${mockData.roiGrowth}%`, isPositive: true }}
          icon={<TrendingUp className="w-5 h-5 text-orange-500" />}
          highlight
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <SectionCard title="ROI Forecast vs Actual" subtitle="6 Months" className="lg:col-span-2">
          <div className="h-64">
            <Line data={roiChartData} options={chartOptions as any} />
          </div>
        </SectionCard>

        <SectionCard title="Spend by Category" subtitle="Distribution">
          <div className="h-64">
            <Doughnut data={spendDonutData} options={doughnutOptions as any} />
          </div>
        </SectionCard>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {mockData.insights.map((insight, i) => (
          <SectionCard
            key={i}
            title="INSIGHTS"
            className={cn(
              insight.type === "success"
                ? isDark ? "bg-green-500/5 border-green-500/20" : "bg-green-50 border-green-200"
                : isDark ? "bg-orange-500/5 border-orange-500/20" : "bg-orange-50 border-orange-200"
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className={cn("text-xs uppercase font-medium", isDark ? "text-gray-400" : "text-gray-500")}>
                  {insight.title}
                </p>
                <p className="text-xl font-bold mt-1">{insight.channel}</p>
                <p className={cn("text-sm mt-2", isDark ? "text-gray-400" : "text-gray-500")}>
                  {insight.description}
                </p>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                insight.type === "success"
                  ? "bg-green-500/20 text-green-500"
                  : "bg-orange-500/20 text-orange-500"
              )}>
                {insight.metric}
              </div>
            </div>
            {insight.type === "warning" && (
              <Button className="mt-4 w-full bg-orange-500 hover:bg-orange-600">
                View Optimization Plan
              </Button>
            )}
          </SectionCard>
        ))}
      </div>

      {/* ROI by Channel */}
      <SectionCard title="ROI by Channel" subtitle="Performance comparison" className="mb-6">
        <div className="h-64">
          <Bar data={channelROIData} options={barChartOptions as any} />
        </div>
      </SectionCard>

      {/* Channel Performance Table */}
      <SectionCard
        title="Channel Performance"
        subtitle="Detailed metrics by acquisition channel"
        actions={
          <Button variant="link" className="text-orange-500">
            CRM Sync Status →
          </Button>
        }
      >
        <DataTable
          headers={["Channel", "Spend", "Leads", "CPL", "Conv. Rate", "ROI"]}
          rows={mockData.channelPerformance.map((c) => [
            <div key={c.channel} className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold",
                c.channel === "Google Ads" ? "bg-blue-500" :
                c.channel === "Meta Ads" ? "bg-purple-500" :
                c.channel === "LinkedIn" ? "bg-blue-700" :
                c.channel === "Email Marketing" ? "bg-green-500" : "bg-orange-500"
              )}>
                {c.channel.charAt(0)}
              </div>
              <span>{c.channel}</span>
            </div>,
            formatCurrency(c.spend),
            c.leads,
            formatCurrency(c.cpl),
            <span key={`conv-${c.channel}`} className={cn(
              "font-medium",
              c.convRate >= 15 ? "text-green-500" : c.convRate >= 8 ? "text-orange-500" : "text-red-500"
            )}>
              {c.convRate}%
            </span>,
            <span key={`roi-${c.channel}`} className={cn(
              "font-medium",
              c.roi >= 400 ? "text-green-500" : c.roi >= 200 ? "text-orange-500" : "text-red-500"
            )}>
              {c.roi}%
            </span>,
          ])}
        />
      </SectionCard>
    </GLXDashboardLayout>
  );
}
