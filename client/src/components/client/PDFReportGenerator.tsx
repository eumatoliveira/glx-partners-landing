import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, Loader2, CheckCircle, FileText, BarChart3, TrendingUp, Target, AlertTriangle } from "lucide-react";
import jsPDF from "jspdf";

interface PDFReportGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPage?: string;
}

// Tipos de relatório disponíveis
const reportTypes = [
  { 
    id: "executive", 
    name: "Relatório Executivo", 
    description: "Visão geral para C-Level com KPIs principais e recomendações estratégicas",
    icon: Target
  },
  { 
    id: "operational", 
    name: "Relatório Operacional", 
    description: "Análise detalhada de processos com métricas LSS (OEE, DPMO, Cp/Cpk)",
    icon: BarChart3
  },
  { 
    id: "financial", 
    name: "Relatório Financeiro", 
    description: "Análise de receita, margem e COPQ com projeções",
    icon: TrendingUp
  },
  { 
    id: "waste", 
    name: "Relatório de Desperdício", 
    description: "Análise de no-shows, COPQ e oportunidades de recuperação",
    icon: AlertTriangle
  },
  { 
    id: "marketing", 
    name: "Relatório de Marketing", 
    description: "ROI de canais, funil comercial e otimização de CAC",
    icon: Target
  },
];

export default function PDFReportGenerator({ open, onOpenChange, currentPage }: PDFReportGeneratorProps) {
  const [selectedReport, setSelectedReport] = useState<string>("executive");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    setIsComplete(false);

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Cores da marca GLX
      const colors = {
        primary: [249, 115, 22], // Orange
        dark: [26, 26, 26],
        gray: [107, 114, 128],
        white: [255, 255, 255],
        green: [16, 185, 129],
        red: [239, 68, 68],
      };

      // Header com logo GLX
      pdf.setFillColor(26, 26, 26);
      pdf.rect(0, 0, pageWidth, 35, "F");
      
      // Logo GLX (círculo + texto)
      pdf.setFillColor(249, 115, 22);
      pdf.circle(margin + 8, 17.5, 8, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("GLX", margin + 8, 19, { align: "center" });
      
      pdf.setFontSize(14);
      pdf.text("GLX PARTNERS", margin + 22, 15);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text("Growth. Lean. Execution.", margin + 22, 21);
      
      // Data do relatório
      pdf.setFontSize(9);
      pdf.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, pageWidth - margin, 17, { align: "right" });
      
      yPosition = 50;

      // Título do relatório
      const reportType = reportTypes.find(r => r.id === selectedReport);
      pdf.setTextColor(26, 26, 26);
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.text(reportType?.name || "Relatório", margin, yPosition);
      yPosition += 10;

      // Linha divisória laranja
      pdf.setDrawColor(249, 115, 22);
      pdf.setLineWidth(1);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 15;

      // Conteúdo baseado no tipo de relatório
      if (selectedReport === "executive") {
        yPosition = addExecutiveContent(pdf, margin, yPosition, pageWidth, colors);
      } else if (selectedReport === "operational") {
        yPosition = addOperationalContent(pdf, margin, yPosition, pageWidth, colors);
      } else if (selectedReport === "waste") {
        yPosition = addWasteContent(pdf, margin, yPosition, pageWidth, colors);
      } else if (selectedReport === "marketing") {
        yPosition = addMarketingContent(pdf, margin, yPosition, pageWidth, colors);
      } else if (selectedReport === "financial") {
        yPosition = addFinancialContent(pdf, margin, yPosition, pageWidth, colors);
      }

      // Footer
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFillColor(26, 26, 26);
        pdf.rect(0, pageHeight - 15, pageWidth, 15, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.text(`GLX Partners | Consultoria de Performance em Saúde`, margin, pageHeight - 6);
        pdf.text(`Página ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: "right" });
      }

      // Download do PDF
      pdf.save(`GLX_${reportType?.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`);
      
      setIsComplete(true);
      setTimeout(() => {
        setIsComplete(false);
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-[#1a1a1a] border-[#2a2a2a] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <FileDown className="w-5 h-5 text-orange-500" />
            Exportar Relatório PDF
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Gere relatórios profissionais com análise Lean Six Sigma (Master Black Belt)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Seletor de tipo de relatório */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Tipo de Relatório</label>
            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger className="bg-[#242424] border-[#3a3a3a] text-white">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-[#242424] border-[#3a3a3a]">
                {reportTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id} className="text-white hover:bg-[#3a3a3a]">
                    <div className="flex items-center gap-2">
                      <type.icon className="w-4 h-4 text-orange-500" />
                      {type.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Descrição do relatório selecionado */}
          <div className="bg-[#242424] rounded-lg p-4 border border-[#3a3a3a]">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <h4 className="text-white font-medium text-sm">
                  {reportTypes.find(r => r.id === selectedReport)?.name}
                </h4>
                <p className="text-gray-400 text-xs mt-1">
                  {reportTypes.find(r => r.id === selectedReport)?.description}
                </p>
              </div>
            </div>
          </div>

          {/* O que será incluído */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300">Conteúdo do Relatório:</h4>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                Logo GLX Partners e cabeçalho profissional
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                KPIs e métricas com gráficos ilustrativos
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                Análise técnica com metodologia LSS
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                Explicação prática de cada indicador
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                Recomendações e próximos passos
              </li>
            </ul>
          </div>

          {/* Nota sobre metodologia */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
            <p className="text-xs text-orange-400">
              <strong>Metodologia LSS:</strong> Relatórios incluem análise com conceitos de Lean Six Sigma 
              (OEE, DPMO, Cp/Cpk, Sigma Level, COPQ, Pareto, Control Charts) com explicações práticas 
              para tomada de decisão.
            </p>
          </div>
        </div>

        {/* Botão de gerar */}
        <Button
          onClick={generatePDF}
          disabled={isGenerating || isComplete}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Gerando PDF...
            </>
          ) : isComplete ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Download Concluído!
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4 mr-2" />
              Gerar e Baixar PDF
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// Funções auxiliares para adicionar conteúdo ao PDF

function addSectionTitle(pdf: jsPDF, title: string, margin: number, y: number): number {
  pdf.setTextColor(249, 115, 22);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text(title, margin, y);
  return y + 8;
}

function addParagraph(pdf: jsPDF, text: string, margin: number, y: number, maxWidth: number): number {
  pdf.setTextColor(60, 60, 60);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  const lines = pdf.splitTextToSize(text, maxWidth);
  pdf.text(lines, margin, y);
  return y + (lines.length * 5) + 5;
}

function addKPIBox(pdf: jsPDF, label: string, value: string, x: number, y: number, width: number): number {
  pdf.setFillColor(245, 245, 245);
  pdf.roundedRect(x, y, width, 25, 3, 3, "F");
  pdf.setTextColor(107, 114, 128);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.text(label, x + 5, y + 8);
  pdf.setTextColor(26, 26, 26);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text(value, x + 5, y + 18);
  return y + 30;
}

function addExecutiveContent(pdf: jsPDF, margin: number, y: number, pageWidth: number, colors: any): number {
  const contentWidth = pageWidth - (margin * 2);
  
  // Resumo Executivo
  y = addSectionTitle(pdf, "1. Resumo Executivo", margin, y);
  y = addParagraph(pdf, 
    "Este relatório apresenta uma visão consolidada dos principais indicadores de performance da operação. " +
    "A análise utiliza metodologia Lean Six Sigma para identificar oportunidades de melhoria e otimização de processos.",
    margin, y, contentWidth
  );
  
  // KPIs principais
  y = addSectionTitle(pdf, "2. Indicadores-Chave de Performance (KPIs)", margin, y + 5);
  
  const kpiWidth = (contentWidth - 15) / 4;
  addKPIBox(pdf, "Faturamento", "R$ 2.4M", margin, y, kpiWidth);
  addKPIBox(pdf, "EBITDA", "R$ 480K", margin + kpiWidth + 5, y, kpiWidth);
  addKPIBox(pdf, "NPS Score", "72", margin + (kpiWidth + 5) * 2, y, kpiWidth);
  y = addKPIBox(pdf, "Ocupação", "87%", margin + (kpiWidth + 5) * 3, y, kpiWidth);
  
  // Análise LSS
  y = addSectionTitle(pdf, "3. Análise Lean Six Sigma", margin, y + 5);
  y = addParagraph(pdf,
    "INTERPRETAÇÃO TÉCNICA (Master Black Belt):\n\n" +
    "• Sigma Level: A operação atual opera em aproximadamente 3.2σ, indicando oportunidade de melhoria. " +
    "O benchmark para operações de saúde de alta performance é 4.5σ ou superior.\n\n" +
    "• OEE (Overall Equipment Effectiveness): Com ocupação de 87%, o OEE estimado é de 78%, " +
    "considerando disponibilidade de 95% e qualidade de 94%. Meta recomendada: 85%.\n\n" +
    "• DPMO (Defeitos por Milhão de Oportunidades): Taxa de no-show de 12.5% equivale a 125.000 DPMO, " +
    "classificando o processo como 2.6σ neste aspecto específico.",
    margin, y, contentWidth
  );
  
  // Aplicação Prática
  y = addSectionTitle(pdf, "4. Aplicação Prática", margin, y + 5);
  y = addParagraph(pdf,
    "O QUE ISSO SIGNIFICA PARA SUA OPERAÇÃO:\n\n" +
    "1. Faturamento de R$ 2.4M representa crescimento de 12.5% vs período anterior, " +
    "indicando que as estratégias de captação estão funcionando.\n\n" +
    "2. EBITDA de 20% está dentro da faixa saudável para clínicas (15-25%), " +
    "mas há espaço para otimização através da redução de desperdícios operacionais.\n\n" +
    "3. NPS de 72 é considerado 'Bom' (zona de qualidade), mas o objetivo deve ser alcançar " +
    "a zona de excelência (>75). Foco em tempo de espera e comunicação.\n\n" +
    "4. Ocupação de 87% indica boa utilização da capacidade, mas os 13% de ociosidade " +
    "representam aproximadamente R$ 312K/mês em receita potencial não realizada.",
    margin, y, contentWidth
  );
  
  // Recomendações
  y = addSectionTitle(pdf, "5. Recomendações Estratégicas", margin, y + 5);
  y = addParagraph(pdf,
    "PRÓXIMOS PASSOS RECOMENDADOS:\n\n" +
    "□ Implementar sistema de confirmação automatizada 48h antes (redução esperada de no-show: 30%)\n" +
    "□ Criar lista de espera dinâmica para preenchimento de cancelamentos de última hora\n" +
    "□ Revisar mix de procedimentos para otimizar margem por hora clínica\n" +
    "□ Estabelecer reunião semanal de análise de indicadores (Gemba Walk)",
    margin, y, contentWidth
  );
  
  return y;
}

function addOperationalContent(pdf: jsPDF, margin: number, y: number, pageWidth: number, colors: any): number {
  const contentWidth = pageWidth - (margin * 2);
  
  y = addSectionTitle(pdf, "1. Análise Operacional - Metodologia LSS", margin, y);
  y = addParagraph(pdf,
    "Este relatório detalha a performance operacional utilizando métricas Lean Six Sigma " +
    "para identificar gargalos, desperdícios e oportunidades de melhoria contínua.",
    margin, y, contentWidth
  );
  
  // OEE
  y = addSectionTitle(pdf, "2. OEE - Overall Equipment Effectiveness", margin, y + 5);
  y = addParagraph(pdf,
    "O OEE é o indicador padrão-ouro para medir eficiência operacional, composto por três fatores:\n\n" +
    "• Disponibilidade: 95% (tempo que as salas estão disponíveis vs planejado)\n" +
    "• Performance: 82% (velocidade real vs velocidade padrão dos procedimentos)\n" +
    "• Qualidade: 94% (procedimentos sem retrabalho ou complicações)\n\n" +
    "OEE CALCULADO: 95% × 82% × 94% = 73.2%\n\n" +
    "INTERPRETAÇÃO: OEE de 73.2% está abaixo do benchmark de classe mundial (85%). " +
    "O principal fator limitante é a Performance, indicando que os procedimentos estão " +
    "levando mais tempo que o padrão estabelecido.",
    margin, y, contentWidth
  );
  
  // Takt Time vs Cycle Time
  y = addSectionTitle(pdf, "3. Takt Time vs Cycle Time", margin, y + 5);
  y = addParagraph(pdf,
    "CONCEITO TÉCNICO:\n" +
    "• Takt Time: Ritmo necessário para atender a demanda (tempo disponível ÷ demanda)\n" +
    "• Cycle Time: Tempo real para completar um procedimento\n\n" +
    "ANÁLISE ATUAL:\n" +
    "• Takt Time: 45 minutos (baseado em demanda de 12 pacientes/dia por sala)\n" +
    "• Cycle Time Médio: 52 minutos\n" +
    "• Gap: +7 minutos (15.5% acima do ideal)\n\n" +
    "APLICAÇÃO PRÁTICA: O gap de 7 minutos por procedimento resulta em 1-2 pacientes " +
    "a menos por dia por sala. Em uma clínica com 5 salas, isso representa " +
    "aproximadamente 150-300 consultas perdidas por mês.",
    margin, y, contentWidth
  );
  
  return y;
}

function addWasteContent(pdf: jsPDF, margin: number, y: number, pageWidth: number, colors: any): number {
  const contentWidth = pageWidth - (margin * 2);
  
  y = addSectionTitle(pdf, "1. Análise de Desperdício Operacional", margin, y);
  y = addParagraph(pdf,
    "Este relatório quantifica os desperdícios operacionais utilizando o conceito de COPQ " +
    "(Cost of Poor Quality) do Lean Six Sigma, identificando oportunidades de recuperação de receita.",
    margin, y, contentWidth
  );
  
  // KPIs de Desperdício
  y = addSectionTitle(pdf, "2. Indicadores de Desperdício", margin, y + 5);
  
  const kpiWidth = (contentWidth - 10) / 3;
  addKPIBox(pdf, "Taxa No-Show", "12.5%", margin, y, kpiWidth);
  addKPIBox(pdf, "Perda Financeira", "$42,500", margin + kpiWidth + 5, y, kpiWidth);
  y = addKPIBox(pdf, "Capacidade Ociosa", "145 Hrs", margin + (kpiWidth + 5) * 2, y, kpiWidth);
  
  // COPQ
  y = addSectionTitle(pdf, "3. COPQ - Cost of Poor Quality", margin, y + 5);
  y = addParagraph(pdf,
    "CONCEITO TÉCNICO (Master Black Belt):\n" +
    "O COPQ representa o custo total da não-qualidade, incluindo custos visíveis e ocultos.\n\n" +
    "COMPOSIÇÃO DO COPQ ATUAL:\n" +
    "• No-shows: $26,235 (45% do total) - Pacientes que não comparecem\n" +
    "• Cancelamentos Tardios: $14,575 (25%) - Cancelamentos < 24h\n" +
    "• Equipamento Ocioso: $8,745 (15%) - Salas/equipamentos sem uso\n" +
    "• Overstaffing: $8,745 (15%) - Excesso de pessoal em horários de baixa demanda\n\n" +
    "COPQ TOTAL: $58,300/mês (aproximadamente 2.4% do faturamento)\n\n" +
    "BENCHMARK: Operações de classe mundial mantêm COPQ abaixo de 1.5% do faturamento.",
    margin, y, contentWidth
  );
  
  // Análise de Pareto
  y = addSectionTitle(pdf, "4. Análise de Pareto - Causas de No-Show", margin, y + 5);
  y = addParagraph(pdf,
    "Aplicando o Princípio de Pareto (80/20), identificamos que:\n\n" +
    "• 78% dos no-shows concentram-se em 3 causas principais:\n" +
    "  1. Esquecimento (42%) - Falta de lembrete efetivo\n" +
    "  2. Conflito de agenda (23%) - Compromissos de última hora\n" +
    "  3. Dificuldade de transporte (13%) - Problemas de deslocamento\n\n" +
    "APLICAÇÃO PRÁTICA: Focando nestas 3 causas, é possível reduzir o no-show em até 60%, " +
    "recuperando aproximadamente $25,000/mês em receita perdida.",
    margin, y, contentWidth
  );
  
  // Ações de Recuperação
  y = addSectionTitle(pdf, "5. Ações de Recuperação Implementadas", margin, y + 5);
  y = addParagraph(pdf,
    "INTERVENÇÕES AUTOMATIZADAS:\n\n" +
    "✓ Waitlist Filled: 3 slots preenchidos automaticamente em Dermatologia (+$450 recuperados)\n" +
    "✓ SMS Reminders: 142 confirmações enviadas para amanhã\n" +
    "✓ Overbooking Inteligente: 5% de overbooking em horários de alto no-show\n\n" +
    "RESULTADO ESPERADO: Redução de 25-35% no no-show com implementação completa.",
    margin, y, contentWidth
  );
  
  return y;
}

function addMarketingContent(pdf: jsPDF, margin: number, y: number, pageWidth: number, colors: any): number {
  const contentWidth = pageWidth - (margin * 2);
  
  y = addSectionTitle(pdf, "1. Análise de ROI de Marketing", margin, y);
  y = addParagraph(pdf,
    "Este relatório analisa a eficiência dos investimentos em marketing utilizando métricas de " +
    "funil comercial e retorno sobre investimento por canal.",
    margin, y, contentWidth
  );
  
  // KPIs de Marketing
  y = addSectionTitle(pdf, "2. Indicadores de Marketing", margin, y + 5);
  
  const kpiWidth = (contentWidth - 15) / 4;
  addKPIBox(pdf, "Investimento Total", "$48,250", margin, y, kpiWidth);
  addKPIBox(pdf, "CPL", "$38.90", margin + kpiWidth + 5, y, kpiWidth);
  addKPIBox(pdf, "CAC", "$268.00", margin + (kpiWidth + 5) * 2, y, kpiWidth);
  y = addKPIBox(pdf, "ROI Marketing", "428%", margin + (kpiWidth + 5) * 3, y, kpiWidth);
  
  // Funil Comercial
  y = addSectionTitle(pdf, "3. Análise do Funil Comercial", margin, y + 5);
  y = addParagraph(pdf,
    "MÉTRICAS DO FUNIL:\n\n" +
    "Stage 1 - Leads Gerados: 1,240 (+8% MoM)\n" +
    "  → Taxa de conversão para Stage 2: 68%\n\n" +
    "Stage 2 - Leads Qualificados: 850 (Target: 800) ✓\n" +
    "  → Taxa de conversão para Stage 3: 49%\n\n" +
    "Stage 3 - Consultas Agendadas: 420 ⚠️ High Drop-off\n" +
    "  → Taxa de conversão para Stage 4: 42%\n\n" +
    "Stage 4 - Vendas Convertidas: 180 (Revenue: $225k)\n\n" +
    "INTERPRETAÇÃO TÉCNICA:\n" +
    "O gargalo principal está na transição Stage 2 → Stage 3 (49% de conversão). " +
    "Isso indica que leads qualificados não estão sendo convertidos em agendamentos. " +
    "Causas prováveis: tempo de resposta lento, falta de follow-up, ou objeções não tratadas.",
    margin, y, contentWidth
  );
  
  // Performance por Canal
  y = addSectionTitle(pdf, "4. Performance por Canal", margin, y + 5);
  y = addParagraph(pdf,
    "ANÁLISE COMPARATIVA:\n\n" +
    "Google Ads: CPL $43.92 | Conv. 12.4% | ROI: 8.2x\n" +
    "  → Alto custo por lead, mas alta qualidade e conversão\n\n" +
    "Meta Ads: CPL $21.03 | Conv. 4.8% | ROI: 3.1x\n" +
    "  → Baixo custo, mas leads de menor qualidade\n\n" +
    "Referrals: CPL $11.67 | Conv. 18.5% | ROI: 12.8x ⭐ MELHOR CANAL\n" +
    "  → Menor custo e maior conversão - expandir programa de indicações\n\n" +
    "RECOMENDAÇÃO: Realocar 20% do budget de Meta Ads para programa de referrals, " +
    "potencialmente aumentando ROI geral em 15-20%.",
    margin, y, contentWidth
  );
  
  return y;
}

function addFinancialContent(pdf: jsPDF, margin: number, y: number, pageWidth: number, colors: any): number {
  const contentWidth = pageWidth - (margin * 2);
  
  y = addSectionTitle(pdf, "1. Análise Financeira", margin, y);
  y = addParagraph(pdf,
    "Este relatório apresenta a análise financeira detalhada com foco em receita, " +
    "margem de contribuição e oportunidades de otimização.",
    margin, y, contentWidth
  );
  
  // KPIs Financeiros
  y = addSectionTitle(pdf, "2. Indicadores Financeiros", margin, y + 5);
  
  const kpiWidth = (contentWidth - 15) / 4;
  addKPIBox(pdf, "Receita Bruta", "R$ 2.4M", margin, y, kpiWidth);
  addKPIBox(pdf, "EBITDA", "R$ 480K", margin + kpiWidth + 5, y, kpiWidth);
  addKPIBox(pdf, "Margem EBITDA", "20%", margin + (kpiWidth + 5) * 2, y, kpiWidth);
  y = addKPIBox(pdf, "Ticket Médio", "R$ 850", margin + (kpiWidth + 5) * 3, y, kpiWidth);
  
  // Waterfall de Margem
  y = addSectionTitle(pdf, "3. Composição da Margem (Waterfall)", margin, y + 5);
  y = addParagraph(pdf,
    "ANÁLISE DE MARGEM DE CONTRIBUIÇÃO:\n\n" +
    "Receita Bruta: R$ 2,400,000 (100%)\n" +
    "(-) Impostos: R$ 216,000 (9%)\n" +
    "(-) Custos Variáveis: R$ 720,000 (30%)\n" +
    "= Margem de Contribuição: R$ 1,464,000 (61%)\n" +
    "(-) Custos Fixos: R$ 984,000 (41%)\n" +
    "= EBITDA: R$ 480,000 (20%)\n\n" +
    "INTERPRETAÇÃO: A margem de contribuição de 61% está saudável. " +
    "O principal ponto de atenção são os custos fixos (41%), que estão " +
    "acima do benchmark de 35% para clínicas de alta performance.",
    margin, y, contentWidth
  );
  
  // Margem por Hora Clínica
  y = addSectionTitle(pdf, "4. Margem por Hora Clínica", margin, y + 5);
  y = addParagraph(pdf,
    "CONCEITO TÉCNICO:\n" +
    "A margem por hora clínica é o indicador mais preciso de rentabilidade operacional, " +
    "pois normaliza a receita pelo recurso mais escasso: tempo de atendimento.\n\n" +
    "CÁLCULO:\n" +
    "• Horas clínicas disponíveis/mês: 1,200 horas\n" +
    "• Horas efetivamente utilizadas: 1,044 horas (87% ocupação)\n" +
    "• Receita por hora clínica: R$ 2,299\n" +
    "• Margem por hora clínica: R$ 460 (20%)\n\n" +
    "APLICAÇÃO PRÁTICA: Cada 1% de aumento na ocupação representa " +
    "aproximadamente R$ 27,600/mês em receita adicional.",
    margin, y, contentWidth
  );
  
  return y;
}
