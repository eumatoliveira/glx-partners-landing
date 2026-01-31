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
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  TrendingUp,
  Award,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  exportToPDF,
  exportToCSV,
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
  nps: 72,
  npsPrev: 68,
  npsTarget: 75,
  csat: 4.6,
  csatMax: 5,
  responseRate: 68,
  totalResponses: 1240,
  promoters: 58,
  passives: 28,
  detractors: 14,
  avgRating: 4.6,
  totalReviews: 856,
  npsTrend: {
    labels: ["Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    data: [65, 67, 68, 70, 68, 72],
  },
  npsDistribution: {
    promoters: 720,
    passives: 347,
    detractors: 173,
  },
  categoryScores: [
    { category: "Atendimento", score: 4.8, reviews: 320, trend: "up" },
    { category: "Tempo de Espera", score: 3.9, reviews: 280, trend: "down" },
    { category: "Infraestrutura", score: 4.5, reviews: 150, trend: "stable" },
    { category: "Profissionais", score: 4.9, reviews: 420, trend: "up" },
    { category: "Preço", score: 3.8, reviews: 180, trend: "stable" },
  ],
  recentFeedback: [
    { rating: 5, comment: "Excelente atendimento, equipe muito atenciosa!", date: "Hoje", category: "Atendimento" },
    { rating: 4, comment: "Bom serviço, mas o tempo de espera poderia melhorar.", date: "Ontem", category: "Tempo de Espera" },
    { rating: 5, comment: "Dr. Silva é excepcional, muito profissional.", date: "2 dias", category: "Profissionais" },
    { rating: 3, comment: "Preço um pouco acima da média do mercado.", date: "3 dias", category: "Preço" },
  ],
  departmentNPS: [
    { dept: "Dermatologia", nps: 82, responses: 180 },
    { dept: "Cardiologia", nps: 75, responses: 150 },
    { dept: "Ortopedia", nps: 70, responses: 120 },
    { dept: "Pediatria", nps: 78, responses: 100 },
    { dept: "Ginecologia", nps: 65, responses: 90 },
  ],
  sigmaLevel: 4.3,
};

export default function Quality() {
  const { isDark } = useDashboardTheme();
  const [period, setPeriod] = useState("30d");

  const handleExportPDF = () => {
    exportToPDF(
      "Qualidade & NPS",
      "Análise de satisfação do cliente",
      [
        { label: "NPS Score", value: mockData.nps.toString(), trend: "+4pts" },
        { label: "CSAT", value: `${mockData.csat}/${mockData.csatMax}` },
        { label: "Taxa de Resposta", value: formatPercentage(mockData.responseRate) },
        { label: "Total Respostas", value: mockData.totalResponses.toString() },
        { label: "Promotores", value: formatPercentage(mockData.promoters) },
        { label: "Detratores", value: formatPercentage(mockData.detractors) },
      ],
      {
        headers: ["Departamento", "NPS", "Respostas"],
        rows: mockData.departmentNPS.map((d) => [
          d.dept,
          d.nps.toString(),
          d.responses.toString(),
        ]),
      },
      "quality-nps-report"
    );
  };

  const handleExportCSV = () => {
    const data = mockData.departmentNPS.map((d) => ({
      Departamento: d.dept,
      NPS: d.nps,
      Respostas: d.responses,
    }));
    exportToCSV(data, "nps-by-department");
  };

  const npsTrendData = {
    labels: mockData.npsTrend.labels,
    datasets: [
      {
        label: "NPS",
        data: mockData.npsTrend.data,
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: "#f97316",
      },
      {
        label: "Meta",
        data: Array(6).fill(mockData.npsTarget),
        borderColor: "#22c55e",
        borderDash: [5, 5],
        backgroundColor: "transparent",
        pointRadius: 0,
      },
    ],
  };

  const npsDistributionData = {
    labels: ["Promotores (9-10)", "Passivos (7-8)", "Detratores (0-6)"],
    datasets: [
      {
        data: [mockData.npsDistribution.promoters, mockData.npsDistribution.passives, mockData.npsDistribution.detractors],
        backgroundColor: ["#22c55e", "#eab308", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  const categoryScoresData = {
    labels: mockData.categoryScores.map((c) => c.category),
    datasets: [
      {
        label: "Score",
        data: mockData.categoryScores.map((c) => c.score),
        backgroundColor: mockData.categoryScores.map((c) =>
          c.score >= 4.5 ? "#22c55e" : c.score >= 4 ? "#f97316" : "#ef4444"
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
        ticks: { color: isDark ? "#999" : "#666" },
        min: 0,
        max: 100,
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { color: isDark ? "#333" : "#eee" },
        ticks: { color: isDark ? "#999" : "#666" },
        min: 0,
        max: 5,
      },
      y: {
        grid: { display: false },
        ticks: { color: isDark ? "#999" : "#666" },
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
    cutout: "65%",
  };

  const sigmaInfo = leanSixSigma.getSigmaDescription(mockData.sigmaLevel);

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={cn(
          "w-4 h-4",
          i < rating ? "text-yellow-500 fill-yellow-500" : isDark ? "text-gray-600" : "text-gray-300"
        )}
      />
    ));
  };

  return (
    <GLXDashboardLayout
      title="Qualidade & NPS"
      subtitle="Satisfação do cliente e métricas de qualidade"
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
          title="NPS Score"
          value={mockData.nps.toString()}
          subtitle={`Meta: ${mockData.npsTarget}`}
          trend={{ value: "+4pts", isPositive: true }}
          icon={<Award className="w-5 h-5 text-orange-500" />}
          highlight
        />
        <KPICard
          title="CSAT"
          value={`${mockData.csat}`}
          subtitle={`de ${mockData.csatMax}`}
          icon={<Star className="w-5 h-5 text-yellow-500" />}
        />
        <KPICard
          title="Taxa de Resposta"
          value={formatPercentage(mockData.responseRate)}
          icon={<MessageSquare className="w-5 h-5 text-blue-500" />}
        />
        <KPICard
          title="Promotores"
          value={formatPercentage(mockData.promoters)}
          icon={<ThumbsUp className="w-5 h-5 text-green-500" />}
        />
        <KPICard
          title="Detratores"
          value={formatPercentage(mockData.detractors)}
          icon={<ThumbsDown className="w-5 h-5 text-red-500" />}
        />
        <KPICard
          title="Total Reviews"
          value={mockData.totalReviews.toString()}
          icon={<Users className="w-5 h-5 text-purple-500" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <SectionCard title="Evolução do NPS" subtitle="Últimos 6 meses" className="lg:col-span-2">
          <div className="h-64">
            <Line data={npsTrendData} options={chartOptions as any} />
          </div>
        </SectionCard>

        <SectionCard title="Distribuição NPS" subtitle="Promotores vs Detratores">
          <div className="h-48">
            <Doughnut data={npsDistributionData} options={doughnutOptions as any} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-4xl font-bold text-orange-500">{mockData.nps}</p>
            <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
              Net Promoter Score
            </p>
          </div>
        </SectionCard>
      </div>

      {/* Category Scores & Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SectionCard title="Scores por Categoria" subtitle="Avaliação média">
          <div className="h-64">
            <Bar data={categoryScoresData} options={barChartOptions as any} />
          </div>
        </SectionCard>

        <SectionCard title="Feedback Recente" subtitle="Últimas avaliações">
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {mockData.recentFeedback.map((feedback, i) => (
              <div
                key={i}
                className={cn(
                  "p-3 rounded-lg border",
                  isDark ? "bg-[#1a1a1a] border-[#333]" : "bg-gray-50 border-gray-200"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {renderStars(feedback.rating)}
                  </div>
                  <span className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
                    {feedback.date}
                  </span>
                </div>
                <p className="text-sm">{feedback.comment}</p>
                <span className={cn(
                  "inline-block mt-2 px-2 py-0.5 rounded text-xs",
                  isDark ? "bg-[#333] text-gray-400" : "bg-gray-200 text-gray-600"
                )}>
                  {feedback.category}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Department NPS & Sigma */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="NPS por Departamento"
          subtitle="Comparativo"
          actions={
            <Button variant="link" className="text-orange-500">
              Ver detalhes →
            </Button>
          }
        >
          <DataTable
            headers={["Departamento", "NPS", "Respostas", "Status"]}
            rows={mockData.departmentNPS.map((d) => [
              d.dept,
              <span
                key={d.dept}
                className={cn(
                  "font-bold",
                  d.nps >= 75 ? "text-green-500" : d.nps >= 50 ? "text-orange-500" : "text-red-500"
                )}
              >
                {d.nps}
              </span>,
              d.responses,
              <span
                key={`status-${d.dept}`}
                className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  d.nps >= 75 ? "bg-green-500/20 text-green-500" :
                  d.nps >= 50 ? "bg-orange-500/20 text-orange-500" : "bg-red-500/20 text-red-500"
                )}
              >
                {d.nps >= 75 ? "Excelente" : d.nps >= 50 ? "Bom" : "Crítico"}
              </span>,
            ])}
          />
        </SectionCard>

        <SectionCard title="Lean Six Sigma - Qualidade" subtitle="Indicadores de processo">
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
                {leanSixSigma.calculateDPMO(mockData.detractors * 10, 10000).toLocaleString()}
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
                {formatPercentage(100 - mockData.detractors)}
              </p>
              <p className={cn("text-xs mt-1", isDark ? "text-gray-500" : "text-gray-400")}>
                Taxa de satisfação
              </p>
            </div>
            <div className={cn("p-4 rounded-lg", isDark ? "bg-[#1a1a1a]" : "bg-gray-50")}>
              <p className={cn("text-xs uppercase", isDark ? "text-gray-500" : "text-gray-400")}>
                Voice of Customer
              </p>
              <p className="text-2xl font-bold text-blue-500">
                {mockData.totalResponses}
              </p>
              <p className={cn("text-xs mt-1", isDark ? "text-gray-500" : "text-gray-400")}>
                Feedbacks coletados
              </p>
            </div>
          </div>
        </SectionCard>
      </div>
    </GLXDashboardLayout>
  );
}
