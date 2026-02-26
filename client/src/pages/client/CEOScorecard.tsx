import { useState, useMemo, useCallback } from "react";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import AlertSlider from "@/components/client/AlertSlider";
import { classifyAlerts, type Alert as AlertType, type KPIData } from "@/lib/alertEngine";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Star,
  ArrowRight,
  Target,
  Activity,
  UploadCloud,
  Database,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react";
import { MotionPageShell } from "@/animation/components/MotionPageShell";

const copyByLang = {
  pt: {
    title: "CEO Scorecard",
    subtitle: "Visao executiva em tempo real - ultima atualizacao: agora",
    syncData: "Sincronizar dados",
    syncTitle: "Sincronizacao de dados",
    syncDescription: "Escolha o metodo de importacao para atualizar o dashboard.",
    crmTab: "API CRM",
    sheetTab: "Planilha",
    crmHelp: "Integracao automatica com Salesforce, HubSpot ou Pipedrive.",
    syncNow: "Sincronizar agora",
    syncing: "Sincronizando...",
    sheetDrop: "Clique ou arraste a planilha (Excel/CSV)",
    sheetFallback: "Fallback manual para preenchimento de equipe.",
    opsSystem: "Sistema Operacional",
    targetLabel: "Meta",
    versusGoal: "vs meta",
    pendingActions: "Acoes pendentes",
    actionItems: [
      "Revisar no-shows criticos",
      "Aprovar orcamentos",
      "Responder NPS detratores",
      "Validar dados pendentes",
    ],
    forecastTitle: "Forecast vs Realizado vs Meta",
    forecastSubtitle: "Projecao de faturamento (R$ mil)",
    realized: "Realizado",
    target: "Meta",
    forecast: "Forecast",
    crmToast: "Dados do CRM sincronizados com sucesso!",
    sheetToast: "Planilha processada com sucesso!",
    sheetToastDesc: "Dashboard e scorecards atualizados.",
    kpis: ["Faturamento", "Margem Liquida", "NPS Score", "No-Show"],
    months: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
  },
  en: {
    title: "CEO Scorecard",
    subtitle: "Real-time executive view - last update: now",
    syncData: "Sync data",
    syncTitle: "Data synchronization",
    syncDescription: "Choose the import method to update the dashboard.",
    crmTab: "CRM API",
    sheetTab: "Spreadsheet",
    crmHelp: "Automatic integration with Salesforce, HubSpot or Pipedrive.",
    syncNow: "Sync now",
    syncing: "Syncing...",
    sheetDrop: "Click or drag the spreadsheet (Excel/CSV)",
    sheetFallback: "Manual fallback for team updates.",
    opsSystem: "Operating System",
    targetLabel: "Target",
    versusGoal: "vs target",
    pendingActions: "Pending actions",
    actionItems: [
      "Review critical no-shows",
      "Approve budgets",
      "Respond to NPS detractors",
      "Validate pending data",
    ],
    forecastTitle: "Forecast vs Actual vs Target",
    forecastSubtitle: "Revenue projection (R$ thousand)",
    realized: "Actual",
    target: "Target",
    forecast: "Forecast",
    crmToast: "CRM data synced successfully!",
    sheetToast: "Spreadsheet processed successfully!",
    sheetToastDesc: "Dashboard and scorecards updated.",
    kpis: ["Revenue", "Net Margin", "NPS Score", "No-Show"],
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  },
  es: {
    title: "CEO Scorecard",
    subtitle: "Vision ejecutiva en tiempo real - ultima actualizacion: ahora",
    syncData: "Sincronizar datos",
    syncTitle: "Sincronizacion de datos",
    syncDescription: "Elija el metodo de importacion para actualizar el dashboard.",
    crmTab: "API CRM",
    sheetTab: "Planilla",
    crmHelp: "Integracion automatica con Salesforce, HubSpot o Pipedrive.",
    syncNow: "Sincronizar ahora",
    syncing: "Sincronizando...",
    sheetDrop: "Haga clic o arrastre la planilla (Excel/CSV)",
    sheetFallback: "Fallback manual para carga del equipo.",
    opsSystem: "Sistema Operacional",
    targetLabel: "Meta",
    versusGoal: "vs meta",
    pendingActions: "Acciones pendientes",
    actionItems: [
      "Revisar no-shows criticos",
      "Aprobar presupuestos",
      "Responder NPS detractores",
      "Validar datos pendientes",
    ],
    forecastTitle: "Forecast vs Real vs Meta",
    forecastSubtitle: "Proyeccion de ingresos (R$ mil)",
    realized: "Real",
    target: "Meta",
    forecast: "Forecast",
    crmToast: "Datos del CRM sincronizados con exito!",
    sheetToast: "Planilla procesada con exito!",
    sheetToastDesc: "Dashboard y scorecards actualizados.",
    kpis: ["Facturacion", "Margen Neto", "NPS Score", "No-Show"],
    months: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  },
} as const;

const generateSparklineData = (trend: "up" | "down" | "stable", seedLabel: string) => {
  const seed = seedLabel.split("").reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 3), 97);
  const seededNoise = (index: number) => {
    const x = Math.sin(seed * (index + 1) * 0.137) * 10000;
    return x - Math.floor(x);
  };
  const base = 50;
  const data = [];
  for (let i = 0; i < 6; i++) {
    const variance = seededNoise(i) * 20 - 10;
    const trendFactor = trend === "up" ? i * 3 : trend === "down" ? -i * 3 : 0;
    data.push(Math.max(10, Math.min(90, base + variance + trendFactor)));
  }
  return data;
};

function Sparkline({ data, color = "#f97316" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 24;
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="inline-block ml-2">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface KPICardProps {
  title: string;
  value: string;
  target?: string;
  status?: "green" | "yellow" | "red";
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  sparklineData: number[];
}

function KPICard({ title, value, target, status = "green", change, changeLabel, icon, sparklineData }: KPICardProps) {
  const isPositive = change >= 0;
  const statusStyles = {
    green: "bg-green-500/10 border-green-500/30",
    yellow: "bg-yellow-500/10 border-yellow-500/30",
    red: "bg-red-500/10 border-red-500/30",
  };
  const hexColors = { green: "#22c55e", yellow: "#eab308", red: "#ef4444" };
  const currentColor = hexColors[status];

  return (
    <Card className={cn("transition-all", statusStyles[status])}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="p-1.5 sm:p-2 rounded-lg bg-black/20" style={{ color: currentColor }}>
            {icon}
          </div>
          <Sparkline data={sparklineData} color={currentColor} />
        </div>
        <div className="space-y-1">
          <p className="text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-wide">{title}</p>
          <div className="flex items-end gap-2">
            <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
            {target ? (
              <p className="text-xs sm:text-sm font-medium pb-1" style={{ color: currentColor }}>
                {target}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap mt-2">
            {isPositive ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />}
            <span className={cn("text-xs sm:text-sm font-medium", isPositive ? "text-green-500" : "text-red-500")}>
              {isPositive ? "+" : ""}
              {change}%
            </span>
            <span className="text-gray-500 text-xs sm:text-sm">{changeLabel}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CEOScorecard() {
  const { language } = useLanguage();
  const c = copyByLang[language];
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncModalOpen, setSyncModalOpen] = useState(false);

  const kpiCardData = useMemo(
    () => [
      {
        title: c.kpis[0],
        value: "R$ 2.4M",
        target: `${c.targetLabel} 2.8M`,
        status: "red" as const,
        change: -14.2,
        changeLabel: c.versusGoal,
        icon: <DollarSign className="w-5 h-5" />,
        sparklineData: generateSparklineData("down", `${language}-rev`),
      },
      {
        title: c.kpis[1],
        value: "14.2%",
        target: `${c.targetLabel} 20%`,
        status: "yellow" as const,
        change: -5.8,
        changeLabel: c.versusGoal,
        icon: <TrendingUp className="w-5 h-5" />,
        sparklineData: generateSparklineData("stable", `${language}-margin`),
      },
      {
        title: c.kpis[2],
        value: "72",
        target: `${c.targetLabel} 85`,
        status: "red" as const,
        change: -13,
        changeLabel: c.versusGoal,
        icon: <Star className="w-5 h-5" />,
        sparklineData: generateSparklineData("down", `${language}-nps`),
      },
      {
        title: c.kpis[3],
        value: "18.5%",
        target: `${c.targetLabel} 5%`,
        status: "red" as const,
        change: 13.5,
        changeLabel: c.versusGoal,
        icon: <Users className="w-5 h-5" />,
        sparklineData: generateSparklineData("up", `${language}-noshow`),
      },
    ],
    [c.kpis, c.targetLabel, c.versusGoal, language],
  );

  const alertKpiData: KPIData = useMemo(
    () => ({
      noShowRate: 18.5,
      margemLiquida: 14.2,
      nps: 7.2,
      faturamento: 2400000,
      metaFaturamento: 2800000,
      churnRate: 3.2,
      fluxoCaixa: 120000,
      occupancyRate: 87,
      cac: 280,
      ltv: 1200,
    }),
    [],
  );

  const [alertState, setAlertState] = useState<AlertType[]>(() => classifyAlerts(alertKpiData));

  const handleResolve = useCallback((alertId: string) => {
    setAlertState((prev) => prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true, resolvedAt: new Date() } : a)));
  }, []);

  const handleDismiss = useCallback((alertId: string) => {
    setAlertState((prev) => prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a)));
  }, []);

  const forecastData = [
    { month: c.months[0], realizado: 2100, meta: 2000, forecast: 2150 },
    { month: c.months[1], realizado: 2250, meta: 2100, forecast: 2300 },
    { month: c.months[2], realizado: 2180, meta: 2200, forecast: 2250 },
    { month: c.months[3], realizado: 2400, meta: 2300, forecast: 2450 },
    { month: c.months[4], realizado: null, meta: 2400, forecast: 2500 },
    { month: c.months[5], realizado: null, meta: 2500, forecast: 2600 },
  ];

  const maxValue = Math.max(...forecastData.flatMap((d) => [d.realizado || 0, d.meta, d.forecast]));

  return (
    <ClientDashboardLayout>
      <MotionPageShell className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">{c.title}</h1>
            <p className="text-gray-400 mt-1">{c.subtitle}</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Dialog open={syncModalOpen} onOpenChange={setSyncModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2 h-9">
                  <RefreshCw className="w-4 h-4" />
                  {c.syncData}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#111113] border-[#2a2a2e] text-white sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-xl">{c.syncTitle}</DialogTitle>
                  <DialogDescription className="text-gray-400">{c.syncDescription}</DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="crm" className="w-full mt-4">
                  <TabsList className="grid w-full grid-cols-2 bg-[#1A1A1D] border border-[#2a2a2e]">
                    <TabsTrigger value="crm" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-500 text-gray-400">
                      <Database className="w-4 h-4 mr-2" />
                      {c.crmTab}
                    </TabsTrigger>
                    <TabsTrigger value="excel" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-500 text-gray-400">
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      {c.sheetTab}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="crm" className="space-y-4 pt-4">
                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <p className="text-sm text-gray-300">{c.crmHelp}</p>
                    </div>
                    <Button
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      disabled={isSyncing}
                      onClick={() => {
                        setIsSyncing(true);
                        setTimeout(() => {
                          setIsSyncing(false);
                          setSyncModalOpen(false);
                          toast.success(c.crmToast);
                        }, 2000);
                      }}
                    >
                      {isSyncing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Database className="w-4 h-4 mr-2" />}
                      {isSyncing ? c.syncing : c.syncNow}
                    </Button>
                  </TabsContent>

                  <TabsContent value="excel" className="space-y-4 pt-4">
                    <div
                      className="border-2 border-dashed border-[#2a2a2e] rounded-lg p-6 text-center hover:bg-[#1A1A1D] transition-colors cursor-pointer"
                      onClick={() => {
                        setIsSyncing(true);
                        setTimeout(() => {
                          setIsSyncing(false);
                          setSyncModalOpen(false);
                          toast.success(c.sheetToast, { description: c.sheetToastDesc });
                        }, 2000);
                      }}
                    >
                      <UploadCloud className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-white">{c.sheetDrop}</p>
                      <p className="text-xs text-gray-500 mt-1">{c.sheetFallback}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-green-500 font-medium hidden sm:inline">{c.opsSystem}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
          {kpiCardData.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AlertSlider alerts={alertState} onResolve={handleResolve} onDismiss={handleDismiss} />
          </div>

          <div>
            <Card className="bg-[#111113] border-[#2a2a2e] h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-500" />
                  <CardTitle className="text-white text-lg">{c.pendingActions}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {c.actionItems.map((item, idx) => (
                  <div key={item} className="flex items-center justify-between p-3 rounded-lg bg-[#1A1A1D] hover:bg-[#333] transition-colors cursor-pointer">
                    <span className="text-white text-sm">{item}</span>
                    <span
                      className={cn(
                        "text-xs font-bold px-2 py-1 rounded",
                        idx === 0 ? "bg-red-500/20 text-red-500" : idx === 1 ? "bg-orange-500/20 text-orange-500" : idx === 2 ? "bg-yellow-500/20 text-yellow-500" : "bg-blue-500/20 text-blue-500",
                      )}
                    >
                      {idx === 0 ? "5" : idx === 1 ? "3" : idx === 2 ? "8" : "12"}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-[#111113] border-[#2a2a2e]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-white text-lg">{c.forecastTitle}</CardTitle>
              <p className="text-gray-400 text-sm mt-1">{c.forecastSubtitle}</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-gray-400">{c.realized}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500" />
                <span className="text-gray-400">{c.target}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500" />
                <span className="text-gray-400">{c.forecast}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2 pt-4">
              {forecastData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center gap-1 h-48">
                    {item.realizado ? (
                      <div className="w-6 bg-orange-500 rounded-t transition-all hover:bg-orange-400" style={{ height: `${(item.realizado / maxValue) * 100}%` }} title={`${c.realized}: R$ ${item.realizado}k`} />
                    ) : null}
                    <div className="w-6 bg-gray-600 rounded-t transition-all hover:bg-gray-500" style={{ height: `${(item.meta / maxValue) * 100}%` }} title={`${c.target}: R$ ${item.meta}k`} />
                    <div className="w-6 bg-cyan-500/50 rounded-t border-2 border-dashed border-cyan-500 transition-all hover:bg-cyan-500/70" style={{ height: `${(item.forecast / maxValue) * 100}%` }} title={`${c.forecast}: R$ ${item.forecast}k`} />
                  </div>
                  <span className="text-gray-400 text-xs font-medium">{item.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </MotionPageShell>
    </ClientDashboardLayout>
  );
}


