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
  Database,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Server,
  Lock,
  Eye,
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
  dataQualityScore: 94.2,
  dataQualityTarget: 95,
  completeness: 96.8,
  accuracy: 98.2,
  consistency: 92.5,
  timeliness: 89.3,
  totalRecords: 1250000,
  validRecords: 1178000,
  invalidRecords: 72000,
  lastSync: "12 min atrás",
  integrations: [
    { name: "Sistema Agenda", status: "online", lastSync: "2 min", records: 45000, quality: 98 },
    { name: "ERP Financeiro", status: "online", lastSync: "5 min", records: 128000, quality: 96 },
    { name: "CRM Comercial", status: "online", lastSync: "8 min", records: 32000, quality: 94 },
    { name: "BI Analytics", status: "syncing", lastSync: "12 min", records: 890000, quality: 92 },
    { name: "RH Sistema", status: "offline", lastSync: "2h", records: 15000, quality: 88 },
  ],
  qualityTrend: {
    labels: ["Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    data: [88, 90, 91, 92, 93, 94.2],
  },
  issuesByType: [
    { type: "Dados Faltantes", count: 32000, percentage: 44 },
    { type: "Formato Inválido", count: 18000, percentage: 25 },
    { type: "Duplicados", count: 12000, percentage: 17 },
    { type: "Inconsistências", count: 10000, percentage: 14 },
  ],
  recentAlerts: [
    { type: "warning" as const, title: "Sincronização atrasada", description: "RH Sistema offline há 2 horas" },
    { type: "success" as const, title: "Backup concluído", description: "Backup diário realizado com sucesso" },
    { type: "danger" as const, title: "Dados inconsistentes", description: "12.000 registros duplicados detectados" },
  ],
  complianceStatus: [
    { regulation: "LGPD", status: "Compliant", lastAudit: "15/01/2026", score: 98 },
    { regulation: "HIPAA", status: "Compliant", lastAudit: "10/01/2026", score: 96 },
    { regulation: "ISO 27001", status: "In Progress", lastAudit: "05/01/2026", score: 85 },
    { regulation: "SOC 2", status: "Compliant", lastAudit: "20/12/2025", score: 92 },
  ],
  sigmaLevel: 4.5,
};

export default function DataGovernance() {
  const { isDark } = useDashboardTheme();
  const [period, setPeriod] = useState("30d");

  const handleExportPDF = () => {
    exportToPDF(
      "Data Governance",
      "Qualidade e governança de dados",
      [
        { label: "Data Quality Score", value: formatPercentage(mockData.dataQualityScore) },
        { label: "Completeness", value: formatPercentage(mockData.completeness) },
        { label: "Accuracy", value: formatPercentage(mockData.accuracy) },
        { label: "Consistency", value: formatPercentage(mockData.consistency) },
        { label: "Total Records", value: mockData.totalRecords.toLocaleString() },
        { label: "Valid Records", value: formatPercentage((mockData.validRecords / mockData.totalRecords) * 100) },
      ],
      {
        headers: ["Integração", "Status", "Última Sync", "Registros", "Qualidade"],
        rows: mockData.integrations.map((i) => [
          i.name,
          i.status,
          i.lastSync,
          i.records.toLocaleString(),
          `${i.quality}%`,
        ]),
      },
      "data-governance-report"
    );
  };

  const handleExportCSV = () => {
    const data = mockData.integrations.map((i) => ({
      Integracao: i.name,
      Status: i.status,
      Ultima_Sync: i.lastSync,
      Registros: i.records,
      Qualidade: `${i.quality}%`,
    }));
    exportToCSV(data, "integrations-status");
  };

  const qualityTrendData = {
    labels: mockData.qualityTrend.labels,
    datasets: [
      {
        label: "Data Quality %",
        data: mockData.qualityTrend.data,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: "#22c55e",
      },
      {
        label: "Meta",
        data: Array(6).fill(mockData.dataQualityTarget),
        borderColor: "#f97316",
        borderDash: [5, 5],
        backgroundColor: "transparent",
        pointRadius: 0,
      },
    ],
  };

  const issuesDonutData = {
    labels: mockData.issuesByType.map((i) => i.type),
    datasets: [
      {
        data: mockData.issuesByType.map((i) => i.count),
        backgroundColor: ["#ef4444", "#f97316", "#eab308", "#3b82f6"],
        borderWidth: 0,
      },
    ],
  };

  const dimensionsData = {
    labels: ["Completeness", "Accuracy", "Consistency", "Timeliness"],
    datasets: [
      {
        label: "Score %",
        data: [mockData.completeness, mockData.accuracy, mockData.consistency, mockData.timeliness],
        backgroundColor: [
          mockData.completeness >= 95 ? "#22c55e" : "#f97316",
          mockData.accuracy >= 95 ? "#22c55e" : "#f97316",
          mockData.consistency >= 95 ? "#22c55e" : "#f97316",
          mockData.timeliness >= 95 ? "#22c55e" : "#f97316",
        ],
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
        min: 80,
        max: 100,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "text-green-500";
      case "syncing": return "text-yellow-500";
      case "offline": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "syncing": return <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />;
      case "offline": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <GLXDashboardLayout
      title="Data Governance"
      subtitle="Qualidade e governança de dados"
      actions={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Last sync: {mockData.lastSync}
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <KPICard
          title="Data Quality Score"
          value={formatPercentage(mockData.dataQualityScore)}
          subtitle={`Meta: ${mockData.dataQualityTarget}%`}
          trend={{ value: "+1.2pp", isPositive: true }}
          icon={<Database className="w-5 h-5 text-green-500" />}
          highlight
        />
        <KPICard
          title="Completeness"
          value={formatPercentage(mockData.completeness)}
          icon={<CheckCircle className="w-5 h-5 text-blue-500" />}
        />
        <KPICard
          title="Accuracy"
          value={formatPercentage(mockData.accuracy)}
          icon={<Shield className="w-5 h-5 text-purple-500" />}
        />
        <KPICard
          title="Consistency"
          value={formatPercentage(mockData.consistency)}
          icon={<RefreshCw className="w-5 h-5 text-orange-500" />}
        />
        <KPICard
          title="Total Records"
          value={(mockData.totalRecords / 1000000).toFixed(2) + "M"}
          icon={<Server className="w-5 h-5 text-gray-500" />}
        />
        <KPICard
          title="Invalid Records"
          value={(mockData.invalidRecords / 1000).toFixed(0) + "K"}
          subtitle={formatPercentage((mockData.invalidRecords / mockData.totalRecords) * 100)}
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <SectionCard title="Evolução da Qualidade" subtitle="Últimos 6 meses" className="lg:col-span-2">
          <div className="h-64">
            <Line data={qualityTrendData} options={chartOptions as any} />
          </div>
        </SectionCard>

        <SectionCard title="Issues por Tipo" subtitle="Distribuição de problemas">
          <div className="h-48">
            <Doughnut data={issuesDonutData} options={doughnutOptions as any} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-2xl font-bold text-red-500">{(mockData.invalidRecords / 1000).toFixed(0)}K</p>
            <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
              Registros com problemas
            </p>
          </div>
        </SectionCard>
      </div>

      {/* Dimensions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SectionCard title="Dimensões de Qualidade" subtitle="Score por dimensão">
          <div className="h-64">
            <Bar data={dimensionsData} options={barChartOptions as any} />
          </div>
        </SectionCard>

        <SectionCard title="Alertas Recentes" subtitle="Eventos do sistema">
          <div className="space-y-3">
            {mockData.recentAlerts.map((alert, i) => (
              <AlertCard key={i} {...alert} />
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Integrations & Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SectionCard
          title="Status das Integrações"
          subtitle="Conectores de dados"
          actions={
            <Button variant="link" className="text-orange-500">
              Gerenciar →
            </Button>
          }
        >
          <DataTable
            headers={["Sistema", "Status", "Última Sync", "Qualidade"]}
            rows={mockData.integrations.map((i) => [
              <div key={i.name} className="flex items-center gap-2">
                <Server className="w-4 h-4 text-gray-500" />
                <span>{i.name}</span>
              </div>,
              <div key={`status-${i.name}`} className="flex items-center gap-2">
                {getStatusIcon(i.status)}
                <span className={cn("capitalize", getStatusColor(i.status))}>
                  {i.status}
                </span>
              </div>,
              i.lastSync,
              <span
                key={`quality-${i.name}`}
                className={cn(
                  "font-medium",
                  i.quality >= 95 ? "text-green-500" : i.quality >= 90 ? "text-orange-500" : "text-red-500"
                )}
              >
                {i.quality}%
              </span>,
            ])}
          />
        </SectionCard>

        <SectionCard
          title="Compliance Status"
          subtitle="Conformidade regulatória"
          actions={
            <Button variant="link" className="text-orange-500">
              Ver auditorias →
            </Button>
          }
        >
          <DataTable
            headers={["Regulação", "Status", "Última Auditoria", "Score"]}
            rows={mockData.complianceStatus.map((c) => [
              <div key={c.regulation} className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-500" />
                <span>{c.regulation}</span>
              </div>,
              <span
                key={`status-${c.regulation}`}
                className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  c.status === "Compliant" ? "bg-green-500/20 text-green-500" :
                  c.status === "In Progress" ? "bg-yellow-500/20 text-yellow-500" : "bg-red-500/20 text-red-500"
                )}
              >
                {c.status}
              </span>,
              c.lastAudit,
              <span
                key={`score-${c.regulation}`}
                className={cn(
                  "font-medium",
                  c.score >= 95 ? "text-green-500" : c.score >= 85 ? "text-orange-500" : "text-red-500"
                )}
              >
                {c.score}%
              </span>,
            ])}
          />
        </SectionCard>
      </div>

      {/* Lean Six Sigma */}
      <SectionCard title="Lean Six Sigma - Data Quality" subtitle="Indicadores de qualidade de dados">
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
              {leanSixSigma.calculateDPMO(mockData.invalidRecords, mockData.totalRecords).toLocaleString()}
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
              {formatPercentage((mockData.validRecords / mockData.totalRecords) * 100)}
            </p>
            <p className={cn("text-xs mt-1", isDark ? "text-gray-500" : "text-gray-400")}>
              Taxa de dados válidos
            </p>
          </div>
          <div className={cn("p-4 rounded-lg", isDark ? "bg-[#1a1a1a]" : "bg-gray-50")}>
            <p className={cn("text-xs uppercase", isDark ? "text-gray-500" : "text-gray-400")}>
              Data Integrity
            </p>
            <p className="text-2xl font-bold text-blue-500">
              {formatPercentage(mockData.dataQualityScore)}
            </p>
            <p className={cn("text-xs mt-1", isDark ? "text-gray-500" : "text-gray-400")}>
              Índice de integridade
            </p>
          </div>
        </div>
      </SectionCard>
    </GLXDashboardLayout>
  );
}
