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
  TrendingDown,
  Wallet,
  PiggyBank,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
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
  mrr: 485000,
  mrrGrowth: 12.3,
  arr: 5820000,
  grossRevenue: 520000,
  netRevenue: 485000,
  grossMargin: 68.5,
  grossMarginPrev: 65.2,
  operatingMargin: 42.3,
  ebitda: 205000,
  cashBalance: 1250000,
  cashBurn: 85000,
  runway: 18,
  arpu: 850,
  ltv: 24000,
  cac: 2800,
  ltvCacRatio: 8.6,
  revenueByService: [
    { service: "Consultas", value: 180000, percentage: 37 },
    { service: "Procedimentos", value: 145000, percentage: 30 },
    { service: "Exames", value: 95000, percentage: 20 },
    { service: "Retornos", value: 65000, percentage: 13 },
  ],
  monthlyRevenue: {
    labels: ["Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    revenue: [380000, 395000, 420000, 445000, 468000, 485000],
    costs: [125000, 130000, 135000, 140000, 145000, 153000],
    margin: [67.1, 67.1, 67.9, 68.5, 69.0, 68.5],
  },
  cashFlow: {
    labels: ["Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    inflow: [400000, 420000, 450000, 470000, 490000, 520000],
    outflow: [320000, 340000, 360000, 380000, 400000, 435000],
  },
  topPayers: [
    { name: "Unimed", value: 125000, percentage: 26 },
    { name: "Particular", value: 98000, percentage: 20 },
    { name: "Bradesco Saúde", value: 85000, percentage: 18 },
    { name: "SulAmérica", value: 72000, percentage: 15 },
    { name: "Outros", value: 105000, percentage: 21 },
  ],
};

export default function Financials() {
  const { isDark } = useDashboardTheme();
  const [period, setPeriod] = useState("30d");

  const handleExportPDF = () => {
    exportToPDF(
      "Receita / Margem / Caixa",
      "Análise financeira detalhada",
      [
        { label: "MRR", value: formatCurrency(mockData.mrr), trend: `+${mockData.mrrGrowth}%` },
        { label: "ARR", value: formatCurrency(mockData.arr) },
        { label: "Margem Bruta", value: formatPercentage(mockData.grossMargin), trend: "+3.3pp" },
        { label: "EBITDA", value: formatCurrency(mockData.ebitda) },
        { label: "Caixa", value: formatCurrency(mockData.cashBalance) },
        { label: "Runway", value: `${mockData.runway} meses` },
        { label: "LTV/CAC", value: `${mockData.ltvCacRatio}x` },
        { label: "ARPU", value: formatCurrency(mockData.arpu) },
      ],
      {
        headers: ["Serviço", "Receita", "% do Total"],
        rows: mockData.revenueByService.map((s) => [
          s.service,
          formatCurrency(s.value),
          `${s.percentage}%`,
        ]),
      },
      "financials-report"
    );
  };

  const handleExportCSV = () => {
    const data = [
      { Metrica: "MRR", Valor: mockData.mrr, Variacao: `+${mockData.mrrGrowth}%` },
      { Metrica: "ARR", Valor: mockData.arr, Variacao: "" },
      { Metrica: "Margem Bruta", Valor: `${mockData.grossMargin}%`, Variacao: "+3.3pp" },
      { Metrica: "EBITDA", Valor: mockData.ebitda, Variacao: "" },
      { Metrica: "Caixa", Valor: mockData.cashBalance, Variacao: "" },
      { Metrica: "Runway", Valor: `${mockData.runway} meses`, Variacao: "" },
      ...mockData.revenueByService.map((s) => ({
        Metrica: `Receita - ${s.service}`,
        Valor: s.value,
        Variacao: `${s.percentage}%`,
      })),
    ];
    exportToCSV(data, "financials-data");
  };

  const revenueChartData = {
    labels: mockData.monthlyRevenue.labels,
    datasets: [
      {
        label: "Receita",
        data: mockData.monthlyRevenue.revenue,
        backgroundColor: "#f97316",
        borderRadius: 4,
      },
      {
        label: "Custos",
        data: mockData.monthlyRevenue.costs,
        backgroundColor: isDark ? "#444" : "#ddd",
        borderRadius: 4,
      },
    ],
  };

  const marginChartData = {
    labels: mockData.monthlyRevenue.labels,
    datasets: [
      {
        label: "Margem Bruta %",
        data: mockData.monthlyRevenue.margin,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#22c55e",
      },
    ],
  };

  const cashFlowChartData = {
    labels: mockData.cashFlow.labels,
    datasets: [
      {
        label: "Entradas",
        data: mockData.cashFlow.inflow,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Saídas",
        data: mockData.cashFlow.outflow,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const revenueByServiceData = {
    labels: mockData.revenueByService.map((s) => s.service),
    datasets: [
      {
        data: mockData.revenueByService.map((s) => s.value),
        backgroundColor: ["#f97316", "#22c55e", "#3b82f6", "#8b5cf6"],
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
          callback: (value: number) => `R$ ${(value / 1000).toFixed(0)}K`,
        },
      },
    },
  };

  const marginChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        ticks: {
          color: isDark ? "#999" : "#666",
          callback: (value: number) => `${value}%`,
        },
        min: 60,
        max: 75,
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
    cutout: "70%",
  };

  return (
    <GLXDashboardLayout
      title="Receita / Margem / Caixa"
      subtitle="Análise financeira detalhada"
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        <KPICard
          title="MRR"
          value={formatCurrency(mockData.mrr)}
          trend={{ value: `+${mockData.mrrGrowth}%`, isPositive: true }}
          icon={<DollarSign className="w-5 h-5 text-green-500" />}
          highlight
        />
        <KPICard
          title="ARR"
          value={formatCurrency(mockData.arr)}
          icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
        />
        <KPICard
          title="Margem Bruta"
          value={formatPercentage(mockData.grossMargin)}
          trend={{ value: "+3.3pp", isPositive: true }}
          icon={<ArrowUpRight className="w-5 h-5 text-green-500" />}
        />
        <KPICard
          title="EBITDA"
          value={formatCurrency(mockData.ebitda)}
          icon={<Wallet className="w-5 h-5 text-purple-500" />}
        />
        <KPICard
          title="Caixa"
          value={formatCurrency(mockData.cashBalance)}
          icon={<PiggyBank className="w-5 h-5 text-blue-500" />}
        />
        <KPICard
          title="Runway"
          value={`${mockData.runway}m`}
          subtitle="meses"
          icon={<CreditCard className="w-5 h-5 text-orange-500" />}
        />
        <KPICard
          title="LTV/CAC"
          value={`${mockData.ltvCacRatio}x`}
          icon={<TrendingUp className="w-5 h-5 text-green-500" />}
        />
        <KPICard
          title="ARPU"
          value={formatCurrency(mockData.arpu)}
          icon={<DollarSign className="w-5 h-5 text-orange-500" />}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SectionCard title="Receita vs Custos" subtitle="Evolução mensal">
          <div className="h-64">
            <Bar data={revenueChartData} options={chartOptions as any} />
          </div>
        </SectionCard>

        <SectionCard title="Evolução da Margem" subtitle="Margem bruta %">
          <div className="h-64">
            <Line data={marginChartData} options={marginChartOptions as any} />
          </div>
        </SectionCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <SectionCard title="Fluxo de Caixa" subtitle="Entradas vs Saídas" className="lg:col-span-2">
          <div className="h-64">
            <Line data={cashFlowChartData} options={chartOptions as any} />
          </div>
        </SectionCard>

        <SectionCard title="Receita por Serviço" subtitle="Distribuição">
          <div className="h-64">
            <Doughnut data={revenueByServiceData} options={doughnutOptions as any} />
          </div>
        </SectionCard>
      </div>

      {/* Unit Economics & Top Payers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Unit Economics" subtitle="Métricas por cliente">
          <div className="grid grid-cols-2 gap-4">
            <div className={cn("p-4 rounded-lg", isDark ? "bg-[#1a1a1a]" : "bg-gray-50")}>
              <p className={cn("text-xs uppercase", isDark ? "text-gray-500" : "text-gray-400")}>
                LTV
              </p>
              <p className="text-2xl font-bold text-green-500">{formatCurrency(mockData.ltv)}</p>
              <p className={cn("text-xs mt-1", isDark ? "text-gray-500" : "text-gray-400")}>
                Lifetime Value
              </p>
            </div>
            <div className={cn("p-4 rounded-lg", isDark ? "bg-[#1a1a1a]" : "bg-gray-50")}>
              <p className={cn("text-xs uppercase", isDark ? "text-gray-500" : "text-gray-400")}>
                CAC
              </p>
              <p className="text-2xl font-bold text-red-500">{formatCurrency(mockData.cac)}</p>
              <p className={cn("text-xs mt-1", isDark ? "text-gray-500" : "text-gray-400")}>
                Custo de Aquisição
              </p>
            </div>
            <div className={cn("p-4 rounded-lg", isDark ? "bg-[#1a1a1a]" : "bg-gray-50")}>
              <p className={cn("text-xs uppercase", isDark ? "text-gray-500" : "text-gray-400")}>
                LTV/CAC Ratio
              </p>
              <p className="text-2xl font-bold text-blue-500">{mockData.ltvCacRatio}x</p>
              <p className={cn("text-xs mt-1", isDark ? "text-gray-500" : "text-gray-400")}>
                Ideal: &gt; 3x
              </p>
            </div>
            <div className={cn("p-4 rounded-lg", isDark ? "bg-[#1a1a1a]" : "bg-gray-50")}>
              <p className={cn("text-xs uppercase", isDark ? "text-gray-500" : "text-gray-400")}>
                Payback
              </p>
              <p className="text-2xl font-bold text-orange-500">
                {Math.round(mockData.cac / mockData.arpu)}m
              </p>
              <p className={cn("text-xs mt-1", isDark ? "text-gray-500" : "text-gray-400")}>
                Meses para recuperar CAC
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Top Pagadores"
          subtitle="Receita por convênio/fonte"
          actions={
            <Button variant="link" className="text-orange-500">
              Ver todos →
            </Button>
          }
        >
          <DataTable
            headers={["Fonte", "Receita", "%"]}
            rows={mockData.topPayers.map((p) => [
              p.name,
              formatCurrency(p.value),
              <div key={p.name} className="flex items-center gap-2">
                <div className={cn("h-2 rounded-full", isDark ? "bg-[#333]" : "bg-gray-200")} style={{ width: "60px" }}>
                  <div
                    className="h-full rounded-full bg-orange-500"
                    style={{ width: `${p.percentage}%` }}
                  />
                </div>
                <span>{p.percentage}%</span>
              </div>,
            ])}
          />
        </SectionCard>
      </div>
    </GLXDashboardLayout>
  );
}
