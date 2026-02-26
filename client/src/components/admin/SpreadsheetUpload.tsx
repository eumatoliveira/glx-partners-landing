import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import Papa from "papaparse";

interface SpreadsheetUploadProps {
  clientId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type DataCategory = 
  | "ceo" 
  | "financial" 
  | "operations" 
  | "waste" 
  | "marketing" 
  | "quality" 
  | "people" 
  | "governance";

const categoryLabels: Record<DataCategory, string> = {
  ceo: "CEO Scorecard",
  financial: "Financials",
  operations: "Operations",
  waste: "No-show & Waste",
  marketing: "Growth & Marketing",
  quality: "Quality & NPS",
  people: "People Analytics",
  governance: "Data Governance",
};

const categoryFields: Record<DataCategory, { key: string; label: string }[]> = {
  ceo: [
    { key: "faturamento", label: "Faturamento (R$)" },
    { key: "faturamentoVariacao", label: "Faturamento Variação (%)" },
    { key: "ebitda", label: "EBITDA (R$)" },
    { key: "ebitdaVariacao", label: "EBITDA Variação (%)" },
    { key: "npsScore", label: "NPS Score" },
    { key: "npsVariacao", label: "NPS Variação (%)" },
    { key: "ocupacao", label: "Ocupação (%)" },
    { key: "ocupacaoVariacao", label: "Ocupação Variação (%)" },
  ],
  financial: [
    { key: "receitaBruta", label: "Receita Bruta (R$)" },
    { key: "impostos", label: "Impostos (R$)" },
    { key: "receitaLiquida", label: "Receita Líquida (R$)" },
    { key: "custosPessoal", label: "Custos Pessoal (R$)" },
    { key: "custosInsumos", label: "Custos Insumos (R$)" },
    { key: "custosOperacionais", label: "Custos Operacionais (R$)" },
    { key: "custosMarketing", label: "Custos Marketing (R$)" },
    { key: "margemBruta", label: "Margem Bruta (%)" },
    { key: "margemOperacional", label: "Margem Operacional (%)" },
    { key: "margemLiquida", label: "Margem Líquida (%)" },
  ],
  operations: [
    { key: "oeeGeral", label: "OEE Geral (%)" },
    { key: "disponibilidade", label: "Disponibilidade (%)" },
    { key: "performance", label: "Performance (%)" },
    { key: "qualidade", label: "Qualidade (%)" },
    { key: "taxaOcupacao", label: "Taxa Ocupação (%)" },
    { key: "tempoMedioEspera", label: "Tempo Médio Espera (min)" },
    { key: "atendimentosDia", label: "Atendimentos/Dia" },
  ],
  waste: [
    { key: "noShowRate", label: "No-show Rate (%)" },
    { key: "noShowVariacao", label: "No-show Variação (%)" },
    { key: "financialLoss", label: "Financial Loss (R$)" },
    { key: "idleCapacityHours", label: "Idle Capacity (horas)" },
    { key: "efficiencyScore", label: "Efficiency Score (0-100)" },
  ],
  marketing: [
    { key: "totalSpend", label: "Total Spend (R$)" },
    { key: "spendVariacao", label: "Spend Variação (%)" },
    { key: "costPerLead", label: "Cost Per Lead (R$)" },
    { key: "cplVariacao", label: "CPL Variação (%)" },
    { key: "acquisitionCost", label: "CAC (R$)" },
    { key: "cacVariacao", label: "CAC Variação (%)" },
    { key: "marketingRoi", label: "Marketing ROI (%)" },
    { key: "roiVariacao", label: "ROI Variação (%)" },
  ],
  quality: [
    { key: "npsScore", label: "NPS Score" },
    { key: "npsRespostas", label: "NPS Respostas" },
    { key: "promotores", label: "Promotores (%)" },
    { key: "passivos", label: "Passivos (%)" },
    { key: "detratores", label: "Detratores (%)" },
    { key: "dpmo", label: "DPMO" },
    { key: "sigmaLevel", label: "Sigma Level" },
    { key: "cp", label: "Cp" },
    { key: "cpk", label: "Cpk" },
    { key: "firstPassYield", label: "First Pass Yield (%)" },
  ],
  people: [
    { key: "headcount", label: "Headcount" },
    { key: "headcountVariacao", label: "Headcount Variação (%)" },
    { key: "turnover", label: "Turnover (%)" },
    { key: "turnoverVariacao", label: "Turnover Variação (%)" },
    { key: "absenteismo", label: "Absenteísmo (%)" },
    { key: "absenteismoVariacao", label: "Absenteísmo Variação (%)" },
    { key: "revenuePerFte", label: "Revenue per FTE (R$)" },
    { key: "revenueFteVariacao", label: "Revenue/FTE Variação (%)" },
  ],
  governance: [
    { key: "registrosTotais", label: "Registros Totais" },
    { key: "dataQualityScore", label: "Data Quality Score (0-100)" },
    { key: "lgpdCompliance", label: "LGPD Compliance (%)" },
    { key: "issuesPendentes", label: "Issues Pendentes" },
    { key: "completude", label: "Completude (%)" },
    { key: "precisao", label: "Precisão (%)" },
    { key: "consistencia", label: "Consistência (%)" },
    { key: "atualidade", label: "Atualidade (%)" },
    { key: "validade", label: "Validade (%)" },
  ],
};

export default function SpreadsheetUpload({
  clientId,
  isOpen,
  onClose,
  onSuccess,
}: SpreadsheetUploadProps) {
  const [selectedCategory, setSelectedCategory] = useState<DataCategory | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<Record<string, unknown>[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"upload" | "preview" | "mapping" | "complete">("upload");
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});

  // Mutations for each category
  const ceoMutation = trpc.dashboardData.upsertCeoMetrics.useMutation();
  const financialMutation = trpc.dashboardData.upsertFinancialData.useMutation();
  const operationsMutation = trpc.dashboardData.upsertOperationsData.useMutation();
  const wasteMutation = trpc.dashboardData.upsertWasteData.useMutation();
  const marketingMutation = trpc.dashboardData.upsertMarketingData.useMutation();
  const qualityMutation = trpc.dashboardData.upsertQualityData.useMutation();
  const peopleMutation = trpc.dashboardData.upsertPeopleData.useMutation();
  const governanceMutation = trpc.dashboardData.upsertDataGovernanceData.useMutation();

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const extension = selectedFile.name.split(".").pop()?.toLowerCase();
    if (extension === "xlsx" || extension === "xls") {
      toast.error("Importacao .xlsx/.xls temporariamente desabilitada por atualizacao de seguranca. Exporte em CSV.");
      return;
    }
    if (extension !== "csv") {
      toast.error("Formato nao suportado. Use um arquivo CSV.");
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = String(event.target?.result ?? "");
        const parsed = Papa.parse<Record<string, unknown>>(content, {
          header: true,
          skipEmptyLines: true,
        });
        const jsonData = parsed.data;

        if (parsed.errors.length > 0 && jsonData.length === 0) {
          throw new Error(parsed.errors[0]?.message || "Falha ao processar CSV.");
        }
        
        setParsedData(jsonData);
        setStep("preview");
        
        // Auto-detect column mapping
        if (jsonData.length > 0 && selectedCategory) {
          const columns = Object.keys(jsonData[0]);
          const fields = categoryFields[selectedCategory];
          const autoMapping: Record<string, string> = {};
          
          fields.forEach(field => {
            const matchingColumn = columns.find(col => 
              col.toLowerCase().includes(field.key.toLowerCase()) ||
              col.toLowerCase().includes(field.label.toLowerCase().split(" ")[0].toLowerCase())
            );
            if (matchingColumn) {
              autoMapping[field.key] = matchingColumn;
            }
          });
          
          setColumnMapping(autoMapping);
        }
      } catch (error) {
        toast.error("Erro ao processar arquivo. Verifique se e um CSV valido.");
        console.error(error);
      } finally {
        setIsProcessing(false);
      }
    };
    
    reader.readAsText(selectedFile, "utf-8");
  }, [selectedCategory]);

  const handleImport = async () => {
    if (!parsedData || !selectedCategory || parsedData.length === 0) {
      toast.error("Nenhum dado para importar");
      return;
    }

    setIsProcessing(true);

    try {
      // Get the first row of data (or aggregate if multiple rows)
      const row = parsedData[0];
      const mappedData: Record<string, unknown> = {};

      // Apply column mapping
      Object.entries(columnMapping).forEach(([fieldKey, columnName]) => {
        if (columnName && row[columnName] !== undefined) {
          mappedData[fieldKey] = row[columnName];
        }
      });

      // Get current period
      const now = new Date();
      const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      // Call the appropriate mutation based on category
      switch (selectedCategory) {
        case "ceo":
          await ceoMutation.mutateAsync({
            clientId,
            period,
            faturamento: Number(mappedData.faturamento) || undefined,
            faturamentoVariacao: Number(mappedData.faturamentoVariacao) || undefined,
            ebitda: Number(mappedData.ebitda) || undefined,
            ebitdaVariacao: Number(mappedData.ebitdaVariacao) || undefined,
            npsScore: Number(mappedData.npsScore) || undefined,
            npsVariacao: Number(mappedData.npsVariacao) || undefined,
            ocupacao: Number(mappedData.ocupacao) || undefined,
            ocupacaoVariacao: Number(mappedData.ocupacaoVariacao) || undefined,
          });
          break;
        case "financial":
          await financialMutation.mutateAsync({
            clientId,
            period,
            receitaBruta: Number(mappedData.receitaBruta) || undefined,
            impostos: Number(mappedData.impostos) || undefined,
            receitaLiquida: Number(mappedData.receitaLiquida) || undefined,
            custosPessoal: Number(mappedData.custosPessoal) || undefined,
            custosInsumos: Number(mappedData.custosInsumos) || undefined,
            custosOperacionais: Number(mappedData.custosOperacionais) || undefined,
            custosMarketing: Number(mappedData.custosMarketing) || undefined,
            margemBruta: Number(mappedData.margemBruta) || undefined,
            margemOperacional: Number(mappedData.margemOperacional) || undefined,
            margemLiquida: Number(mappedData.margemLiquida) || undefined,
          });
          break;
        case "operations":
          await operationsMutation.mutateAsync({
            clientId,
            period,
            oeeGeral: Number(mappedData.oeeGeral) || undefined,
            disponibilidade: Number(mappedData.disponibilidade) || undefined,
            performance: Number(mappedData.performance) || undefined,
            qualidade: Number(mappedData.qualidade) || undefined,
            taxaOcupacao: Number(mappedData.taxaOcupacao) || undefined,
            tempoMedioEspera: Number(mappedData.tempoMedioEspera) || undefined,
            atendimentosDia: Number(mappedData.atendimentosDia) || undefined,
          });
          break;
        case "waste":
          await wasteMutation.mutateAsync({
            clientId,
            period,
            noShowRate: Number(mappedData.noShowRate) || undefined,
            noShowVariacao: Number(mappedData.noShowVariacao) || undefined,
            financialLoss: Number(mappedData.financialLoss) || undefined,
            idleCapacityHours: Number(mappedData.idleCapacityHours) || undefined,
            efficiencyScore: Number(mappedData.efficiencyScore) || undefined,
          });
          break;
        case "marketing":
          await marketingMutation.mutateAsync({
            clientId,
            period,
            totalSpend: Number(mappedData.totalSpend) || undefined,
            spendVariacao: Number(mappedData.spendVariacao) || undefined,
            costPerLead: Number(mappedData.costPerLead) || undefined,
            cplVariacao: Number(mappedData.cplVariacao) || undefined,
            acquisitionCost: Number(mappedData.acquisitionCost) || undefined,
            cacVariacao: Number(mappedData.cacVariacao) || undefined,
            marketingRoi: Number(mappedData.marketingRoi) || undefined,
            roiVariacao: Number(mappedData.roiVariacao) || undefined,
          });
          break;
        case "quality":
          await qualityMutation.mutateAsync({
            clientId,
            period,
            npsScore: Number(mappedData.npsScore) || undefined,
            npsRespostas: Number(mappedData.npsRespostas) || undefined,
            promotores: Number(mappedData.promotores) || undefined,
            passivos: Number(mappedData.passivos) || undefined,
            detratores: Number(mappedData.detratores) || undefined,
            dpmo: Number(mappedData.dpmo) || undefined,
            sigmaLevel: Number(mappedData.sigmaLevel) || undefined,
            cp: Number(mappedData.cp) || undefined,
            cpk: Number(mappedData.cpk) || undefined,
            firstPassYield: Number(mappedData.firstPassYield) || undefined,
          });
          break;
        case "people":
          await peopleMutation.mutateAsync({
            clientId,
            period,
            headcount: Number(mappedData.headcount) || undefined,
            headcountVariacao: Number(mappedData.headcountVariacao) || undefined,
            turnover: Number(mappedData.turnover) || undefined,
            turnoverVariacao: Number(mappedData.turnoverVariacao) || undefined,
            absenteismo: Number(mappedData.absenteismo) || undefined,
            absenteismoVariacao: Number(mappedData.absenteismoVariacao) || undefined,
            revenuePerFte: Number(mappedData.revenuePerFte) || undefined,
            revenueFteVariacao: Number(mappedData.revenueFteVariacao) || undefined,
          });
          break;
        case "governance":
          await governanceMutation.mutateAsync({
            clientId,
            period,
            registrosTotais: Number(mappedData.registrosTotais) || undefined,
            dataQualityScore: Number(mappedData.dataQualityScore) || undefined,
            lgpdCompliance: Number(mappedData.lgpdCompliance) || undefined,
            issuesPendentes: Number(mappedData.issuesPendentes) || undefined,
            completude: Number(mappedData.completude) || undefined,
            precisao: Number(mappedData.precisao) || undefined,
            consistencia: Number(mappedData.consistencia) || undefined,
            atualidade: Number(mappedData.atualidade) || undefined,
            validade: Number(mappedData.validade) || undefined,
          });
          break;
      }

      toast.success("Dados importados com sucesso!");
      setStep("complete");
      onSuccess();
    } catch (error) {
      toast.error("Erro ao importar dados: " + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setParsedData(null);
    setStep("upload");
    setColumnMapping({});
    setSelectedCategory("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Importar Planilha
          </DialogTitle>
          <DialogDescription>
            Importe dados de uma planilha CSV para o dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === "upload" && (
            <>
              {/* Category Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria de Dados</label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value as DataCategory)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* File Upload */}
              {selectedCategory && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="hidden"
                      id="spreadsheet-upload"
                    />
                    <label
                      htmlFor="spreadsheet-upload"
                      className="cursor-pointer flex flex-col items-center gap-4"
                    >
                      <Upload className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Clique para selecionar um arquivo</p>
                        <p className="text-sm text-muted-foreground">
                          Suporta arquivo .csv
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Expected Fields */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Campos esperados para {categoryLabels[selectedCategory]}:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      {categoryFields[selectedCategory].map((field) => (
                        <div key={field.key}>• {field.label}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {step === "preview" && parsedData && selectedCategory && (
            <>
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle className="h-5 w-5" />
                <span>Arquivo processado: {file?.name}</span>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Mapeamento de Colunas</h4>
                <p className="text-sm text-muted-foreground">
                  Associe as colunas da planilha aos campos do sistema:
                </p>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {categoryFields[selectedCategory].map((field) => (
                    <div key={field.key} className="flex items-center gap-4">
                      <span className="w-40 text-sm">{field.label}:</span>
                      <Select
                        value={columnMapping[field.key] || ""}
                        onValueChange={(value) =>
                          setColumnMapping((prev) => ({ ...prev, [field.key]: value }))
                        }
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Selecione a coluna" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Não mapear</SelectItem>
                          {Object.keys(parsedData[0] || {}).map((col) => (
                            <SelectItem key={col} value={col}>
                              {col}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>

                {/* Preview Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted px-4 py-2 font-medium text-sm">
                    Preview ({parsedData.length} linhas)
                  </div>
                  <div className="overflow-x-auto max-h-40">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          {Object.keys(parsedData[0] || {}).map((col) => (
                            <th key={col} className="px-3 py-2 text-left whitespace-nowrap">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.slice(0, 3).map((row, idx) => (
                          <tr key={idx} className="border-t">
                            {Object.values(row).map((val, vidx) => (
                              <td key={vidx} className="px-3 py-2 whitespace-nowrap">
                                {String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={resetForm}>
                  Voltar
                </Button>
                <Button onClick={handleImport} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    "Importar Dados"
                  )}
                </Button>
              </div>
            </>
          )}

          {step === "complete" && (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Importação Concluída!</h3>
              <p className="text-muted-foreground mb-6">
                Os dados foram importados com sucesso para o dashboard.
              </p>
              <Button onClick={handleClose}>Fechar</Button>
            </div>
          )}

          {isProcessing && step === "upload" && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3">Processando arquivo...</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

