import { useState } from "react";
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
import { FileText, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PDFExportButtonProps {
  currentPage?: string;
}

const reportTypes = [
  { value: "executive", label: "Relatório Executivo", description: "Resumo para C-Level com KPIs principais" },
  { value: "operational", label: "Relatório Operacional", description: "Análise detalhada de processos e gargalos" },
  { value: "financial", label: "Relatório Financeiro", description: "DRE, fluxo de caixa e projeções" },
  { value: "quality", label: "Relatório de Qualidade", description: "NPS, DPMO, Cp/Cpk e análise estatística" },
  { value: "marketing", label: "Relatório de Marketing", description: "ROI, funil e performance de canais" },
  { value: "complete", label: "Relatório Completo", description: "Todos os indicadores consolidados" },
];

export default function PDFExportButton({ currentPage }: PDFExportButtonProps) {
  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState("executive");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = async () => {
    setIsGenerating(true);
    
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Relatório gerado com sucesso!", {
      description: "O download iniciará automaticamente.",
    });
    
    setIsGenerating(false);
    setOpen(false);
    
    // In production, this would trigger actual PDF download
    // For now, show a toast with the feature info
    toast.info("Funcionalidade em desenvolvimento", {
      description: "A exportação de PDF com gráficos será implementada na próxima versão.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Export Report</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1E1E1E] border-[#2a2a2a] text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold">
              GLX
            </div>
            Exportar Relatório PDF
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Selecione o tipo de relatório para exportar com gráficos, tabelas e análise Lean Six Sigma.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Report Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Tipo de Relatório</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="bg-[#2a2a2a] border-[#3a3a3a] text-white">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2a2a] border-[#3a3a3a]">
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="text-white hover:bg-[#3a3a3a]">
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
          <div className="p-4 bg-[#2a2a2a] rounded-lg space-y-3">
            <h4 className="font-medium text-white">O relatório incluirá:</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Logo GLX Partners e cabeçalho padrão
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Gráficos de alta resolução (PNG)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Tabelas formatadas com dados atuais
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
          <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <p className="text-sm text-orange-400">
              <strong>Metodologia Lean Six Sigma:</strong> Os relatórios incluem análise estatística (Cp, Cpk, DPMO, Sigma Level), 
              identificação de gargalos (TOC), e recomendações baseadas em DMAIC.
            </p>
          </div>

          {/* Export Button */}
          <Button 
            onClick={handleExport} 
            disabled={isGenerating}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando PDF...
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
