import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Download, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import jsPDF from "jspdf";

interface PDFExportButtonProps {
  currentPage?: string;
}

const reportTypes = [
  { value: "simplified", label: "Relatório Simplificado", description: "Resumo de performance geral", minPlan: "essencial" },
  { value: "executive", label: "Relatório Executivo", description: "Resumo para C-Level com KPIs principais", minPlan: "pro" },
  { value: "operational", label: "Relatório Operacional", description: "Análise detalhada de processos e gargalos", minPlan: "pro" },
  { value: "financial", label: "Relatório Financeiro", description: "DRE, fluxo de caixa e projeções", minPlan: "pro" },
  { value: "quality", label: "Relatório de Qualidade", description: "NPS, DPMO, Cp/Cpk e análise estatística", minPlan: "pro" },
  { value: "marketing", label: "Relatório de Marketing", description: "ROI, funil e performance de canais", minPlan: "pro" },
  { value: "complete", label: "Relatório Completo", description: "Todos os indicadores consolidados", minPlan: "enterprise" },
];

// Plan-based monthly PDF export limits
const PLAN_LIMITS: Record<string, number> = {
  essencial: 3,
  pro: 10,
  enterprise: Infinity,
};

function getExportKey(userId: string): string {
  const now = new Date();
  return `glx_pdf_exports_${userId}_${now.getFullYear()}_${now.getMonth()}`;
}

function getExportCount(userId: string): number {
  try {
    const key = getExportKey(userId);
    const count = localStorage.getItem(key);
    return count ? parseInt(count, 10) : 0;
  } catch {
    return 0;
  }
}

function incrementExportCount(userId: string): void {
  try {
    const key = getExportKey(userId);
    const current = getExportCount(userId);
    localStorage.setItem(key, String(current + 1));
  } catch {
    // localStorage not available — silent fail
  }
}

function generateRealPDF(reportType: string, plan: string): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const m = 20;
  let y = 20;

  // Header bar
  doc.setFillColor(11, 11, 12);
  doc.rect(0, 0, w, 40, "F");
  doc.setTextColor(255, 122, 0);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("GLX Control Tower", m, 18);
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  const typeLabel = reportTypes.find(t => t.value === reportType)?.label ?? "Relatório";
  doc.text(typeLabel, m, 28);
  doc.setFontSize(9);
  doc.setTextColor(161, 161, 170);
  doc.text(
    `Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`,
    m, 36
  );

  // Orange accent line
  doc.setFillColor(255, 122, 0);
  doc.rect(0, 40, w, 2, "F");
  y = 52;

  // KPI Section
  doc.setTextColor(255, 122, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Métricas Essenciais", m, y);
  y += 10;

  const isEssencial = plan === "essencial";

  const allKpis = [
    { label: "Faturamento Mês", value: "R$ 2.400.000" },
    { label: "Total Agendamentos", value: "1.247" },
    { label: "Taxa de No-Show", value: "18.5%" },
    { label: "Conversão Geral", value: "72.4%" },
    { label: "CAC", value: "R$ 280" },
    { label: "LTV", value: "R$ 1.200" },
    { label: "ROI", value: "4.3x" },
    { label: "NPS", value: "72" },
  ];

  // simplified PDF for essencial
  const kpis = isEssencial ? allKpis.slice(0, 4) : allKpis;

  const colW = (w - 2 * m) / 2;
  kpis.forEach((kpi, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = m + col * colW;
    const ky = y + row * 18;

    // Card background
    doc.setFillColor(17, 17, 19);
    doc.roundedRect(x, ky, colW - 4, 14, 2, 2, "F");

    // Label
    doc.setFontSize(9);
    doc.setTextColor(161, 161, 170);
    doc.setFont("helvetica", "normal");
    doc.text(kpi.label, x + 4, ky + 5);

    // Value
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(kpi.value, x + 4, ky + 11);
  });
  y += Math.ceil(kpis.length / 2) * 18 + 12;

  // Alert Section
  doc.setTextColor(255, 122, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Alertas Ativos", m, y);
  y += 8;

  const alerts = [
    { priority: "P1", title: "No-Show Elevado (18.5%)", impact: "-R$ 72.000" },
    { priority: "P2", title: "Margem Líquida Abaixo da Meta (14.2%)", impact: "-R$ 91.200" },
    { priority: "P1", title: "NPS Crítico (7.2)", impact: "Risco reputacional" },
    { priority: "P2", title: "Faturamento 14% abaixo da meta", impact: "-R$ 400.000" },
  ];

  alerts.forEach((alert) => {
    if (y > 265) { doc.addPage(); y = 20; }
    doc.setFillColor(alert.priority === "P1" ? 239 : 255, alert.priority === "P1" ? 68 : 122, alert.priority === "P1" ? 68 : 0);
    doc.roundedRect(m, y, 3, 10, 1, 1, "F");

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(`${alert.priority} — ${alert.title}`, m + 6, y + 4);

    doc.setFontSize(9);
    doc.setTextColor(161, 161, 170);
    doc.setFont("helvetica", "normal");
    doc.text(`Impacto: ${alert.impact}`, m + 6, y + 9);
    y += 14;
  });
  y += 8;

  if (!isEssencial) {
    // LSS Methodology Note (Only pro/enterprise)
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFillColor(255, 122, 0);
    doc.rect(m, y, w - 2 * m, 0.5, "F");
    y += 6;
    doc.setTextColor(255, 122, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Metodologia Lean Six Sigma", m, y);
    y += 6;
    doc.setFontSize(8);
    doc.setTextColor(161, 161, 170);
    doc.setFont("helvetica", "normal");
    const lssNotes = [
      "• Análise baseada em DMAIC (Define, Measure, Analyze, Improve, Control)",
      "• Sigma Level atual: 3.2σ | DPMO: 44.565 | Yield: 95.5%",
      "• Gargalo principal (TOC): Taxa de No-Show > LCS (Limite de Controle Superior)",
      "• Recomendação: Implementar sistema de confirmação dupla + waiting list ativa",
    ];
    lssNotes.forEach(note => {
      doc.text(note, m, y, { maxWidth: w - 2 * m });
      y += 5;
    });
  }

  // Footer
  doc.setFillColor(11, 11, 12);
  doc.rect(0, 285, w, 12, "F");
  doc.setTextColor(161, 161, 170);
  doc.setFontSize(7);
  doc.text("GLX Partners • Growth. Lean. Execution. | glxpartners.com", m, 291);
  doc.text("Confidencial — Distribuição restrita", w - m - 50, 291);

  // Save
  doc.save(`GLX_${typeLabel.replace(/ /g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export default function PDFExportButton({ currentPage }: PDFExportButtonProps) {
  const { user } = useAuth();
  const plan = (user as any)?.plan || "essencial";
  const userId = user?.id?.toString() || "anonymous";
  const startType = plan === "essencial" ? "simplified" : "executive";
  
  const [reportType, setReportType] = useState(startType);
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const limit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.essencial;
  const [exportCount, setExportCount] = useState(0);

  useEffect(() => {
    setExportCount(getExportCount(userId));
  }, [userId, open]);

  const remaining = limit === Infinity ? Infinity : Math.max(0, limit - exportCount);
  const isLimitReached = remaining <= 0;

  const handleExport = async () => {
    if (isLimitReached) {
      toast.error("Limite de exportações atingido", {
        description: `Seu plano ${plan} permite ${limit} exportações/mês. Faça upgrade para exportar mais.`,
      });
      return;
    }

    setIsGenerating(true);

    // Small delay for UX feedback
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      generateRealPDF(reportType, plan);
      incrementExportCount(userId);
      setExportCount(prev => prev + 1);

      toast.success("Relatório exportado com sucesso!", {
        description: `${reportTypes.find(t => t.value === reportType)?.label} gerado e baixado.`,
      });
    } catch (err: any) {
      toast.error("Erro ao gerar PDF", {
        description: err?.message || "Tente novamente em instantes.",
      });
    } finally {
      setIsGenerating(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="relative gap-2 overflow-hidden border border-[#f6ab67]/25 bg-[linear-gradient(135deg,#e67e22_0%,#f08e36_58%,#cf6719_100%)] text-white shadow-[0_10px_24px_rgba(230,126,34,0.28)] transition hover:brightness-105 hover:shadow-[0_12px_30px_rgba(34,211,238,0.16)] focus-visible:ring-2 focus-visible:ring-cyan-300/40">
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Exportar PDF</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#111113] border-[#2a2a2e] text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold">
              GLX
            </div>
            Exportar Relatório PDF
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Selecione o tipo de relatório. Gráficos, tabelas e análise Lean Six Sigma incluídos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Export Counter */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#1A1A1D] border border-[#2a2a2e]">
            <div>
              <span className="text-sm text-gray-300">Exportações este mês</span>
              <div className="text-lg font-bold text-orange-500">
                {exportCount} / {limit === Infinity ? "∞" : limit}
              </div>
            </div>
            <div className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
              isLimitReached 
                ? "bg-red-500/15 text-red-500" 
                : remaining <= 1 
                  ? "bg-yellow-500/15 text-yellow-500" 
                  : "bg-green-500/15 text-green-500"
            }`}>
              {isLimitReached ? "Limite atingido" : remaining === Infinity ? "Ilimitado" : `${remaining} restantes`}
            </div>
          </div>

          {/* Report Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Tipo de Relatório</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="bg-[#1A1A1D] border-[#2a2a2e] text-white">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1D] border-[#2a2a2e]">
                {reportTypes
                  .filter(type => {
                    if (plan === "essencial") return type.minPlan === "essencial";
                    if (plan === "pro") return type.minPlan !== "enterprise";
                    return true;
                  })
                  .map((type) => (
                  <SelectItem key={type.value} value={type.value} className="text-white hover:bg-[#202024]">
                    <div className="flex flex-col">
                      <span className="font-medium">{type.label}</span>
                      <span className="text-xs text-gray-400">{type.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Report Preview */}
          <div className="p-4 bg-[#1A1A1D] rounded-lg space-y-3">
            <h4 className="font-medium text-white">O relatório incluirá:</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Logo GLX Partners e cabeçalho premium
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                KPIs formatados com dados atuais
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Alertas P1/P2/P3 com impacto financeiro
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Análise LSS (Master Black Belt)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Recomendações e próximos passos
              </li>
            </ul>
          </div>

          {/* LSS Methodology Note */}
          {plan !== "essencial" && (
            <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <p className="text-sm text-orange-400">
                <strong>Metodologia Lean Six Sigma:</strong> Os relatórios incluem análise estatística (Cp, Cpk, DPMO, Sigma Level),
                identificação de gargalos (TOC), e recomendações baseadas em DMAIC.
              </p>
            </div>
          )}

          {/* Export Button */}
          <Button
            onClick={handleExport}
            disabled={isGenerating || isLimitReached}
            className={`w-full ${isLimitReached ? "bg-gray-600 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"} text-white`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando PDF...
              </>
            ) : isLimitReached ? (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Upgrade para Exportar
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Gerar e Baixar PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
