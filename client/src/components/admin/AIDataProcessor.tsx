import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2, CheckCircle, Copy, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface AIDataProcessorProps {
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
  | "governance"
  | "all";

const categoryLabels: Record<DataCategory, string> = {
  ceo: "CEO Scorecard",
  financial: "Financials",
  operations: "Operations",
  waste: "No-show & Waste",
  marketing: "Growth & Marketing",
  quality: "Quality & NPS",
  people: "People Analytics",
  governance: "Data Governance",
  all: "Todas as Categorias",
};

interface AIResponse {
  category: string;
  data: Record<string, unknown>;
  insights: string[];
  recommendations: string[];
}

export default function AIDataProcessor({
  clientId,
  isOpen,
  onClose,
  onSuccess,
}: AIDataProcessorProps) {
  const [selectedCategory, setSelectedCategory] = useState<DataCategory>("all");
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [step, setStep] = useState<"input" | "processing" | "result">("input");

  // Mutations for each category
  const ceoMutation = trpc.dashboardData.upsertCeoMetrics.useMutation();
  const financialMutation = trpc.dashboardData.upsertFinancialData.useMutation();
  const operationsMutation = trpc.dashboardData.upsertOperationsData.useMutation();
  const wasteMutation = trpc.dashboardData.upsertWasteData.useMutation();
  const marketingMutation = trpc.dashboardData.upsertMarketingData.useMutation();
  const qualityMutation = trpc.dashboardData.upsertQualityData.useMutation();
  const peopleMutation = trpc.dashboardData.upsertPeopleData.useMutation();
  const governanceMutation = trpc.dashboardData.upsertDataGovernanceData.useMutation();

  const processWithAI = async () => {
    if (!inputText.trim()) {
      toast.error("Por favor, insira os dados para processar");
      return;
    }

    setIsProcessing(true);
    setStep("processing");

    try {
      // Simulate AI processing (in a real implementation, this would call an LLM API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Parse the input text and extract data
      const extractedData = parseInputText(inputText, selectedCategory);
      
      setAiResponse(extractedData);
      setStep("result");
    } catch (error) {
      toast.error("Erro ao processar com IA: " + (error as Error).message);
      setStep("input");
    } finally {
      setIsProcessing(false);
    }
  };

  const parseInputText = (text: string, category: DataCategory): AIResponse => {
    // Simple parsing logic - in production, this would use an LLM
    const lines = text.split("\n").filter(line => line.trim());
    const data: Record<string, unknown> = {};
    const insights: string[] = [];
    const recommendations: string[] = [];

    // Extract numbers from text
    const numberPattern = /(\d+(?:[.,]\d+)?)/g;
    const numbers = text.match(numberPattern)?.map(n => parseFloat(n.replace(",", "."))) || [];

    // Try to identify category-specific data
    if (category === "ceo" || category === "all") {
      if (text.toLowerCase().includes("faturamento") || text.toLowerCase().includes("receita")) {
        const faturamento = numbers.find(n => n > 100000);
        if (faturamento) data.faturamento = faturamento;
      }
      if (text.toLowerCase().includes("ebitda")) {
        const ebitda = numbers.find(n => n > 10000 && n < 1000000);
        if (ebitda) data.ebitda = ebitda;
      }
      if (text.toLowerCase().includes("nps")) {
        const nps = numbers.find(n => n >= -100 && n <= 100);
        if (nps) data.npsScore = nps;
      }
      if (text.toLowerCase().includes("ocupação") || text.toLowerCase().includes("ocupacao")) {
        const ocupacao = numbers.find(n => n > 0 && n <= 100);
        if (ocupacao) data.ocupacao = ocupacao;
      }
    }

    if (category === "waste" || category === "all") {
      if (text.toLowerCase().includes("no-show") || text.toLowerCase().includes("falta")) {
        const noShow = numbers.find(n => n > 0 && n <= 50);
        if (noShow) data.noShowRate = noShow;
      }
      if (text.toLowerCase().includes("perda") || text.toLowerCase().includes("prejuízo")) {
        const loss = numbers.find(n => n > 1000);
        if (loss) data.financialLoss = loss;
      }
    }

    if (category === "marketing" || category === "all") {
      if (text.toLowerCase().includes("cpl") || text.toLowerCase().includes("custo por lead")) {
        const cpl = numbers.find(n => n > 0 && n < 500);
        if (cpl) data.costPerLead = cpl;
      }
      if (text.toLowerCase().includes("roi")) {
        const roi = numbers.find(n => n > 0 && n < 1000);
        if (roi) data.marketingRoi = roi;
      }
    }

    // Generate insights based on extracted data
    if (Object.keys(data).length > 0) {
      insights.push("Dados extraídos automaticamente do texto fornecido");
      
      if (data.npsScore && Number(data.npsScore) > 50) {
        insights.push("NPS Score acima de 50 indica boa satisfação dos clientes");
      }
      if (data.ocupacao && Number(data.ocupacao) < 70) {
        insights.push("Taxa de ocupação abaixo de 70% indica oportunidade de melhoria");
      }
      if (data.noShowRate && Number(data.noShowRate) > 10) {
        insights.push("Taxa de no-show acima de 10% requer atenção imediata");
      }
    }

    // Generate recommendations
    recommendations.push("Revise os dados extraídos antes de salvar");
    recommendations.push("Complete os campos que não foram identificados automaticamente");
    if (data.noShowRate && Number(data.noShowRate) > 10) {
      recommendations.push("Implemente sistema de confirmação de agendamentos");
    }

    return {
      category: category === "all" ? "multiple" : category,
      data,
      insights,
      recommendations,
    };
  };

  const applyData = async () => {
    if (!aiResponse) return;

    setIsProcessing(true);

    try {
      const now = new Date();
      const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const data = aiResponse.data;

      // Apply data based on what was extracted
      if (data.faturamento || data.ebitda || data.npsScore || data.ocupacao) {
        await ceoMutation.mutateAsync({
          clientId,
          period,
          faturamento: Number(data.faturamento) || undefined,
          ebitda: Number(data.ebitda) || undefined,
          npsScore: Number(data.npsScore) || undefined,
          ocupacao: Number(data.ocupacao) || undefined,
        });
      }

      if (data.noShowRate || data.financialLoss) {
        await wasteMutation.mutateAsync({
          clientId,
          period,
          noShowRate: Number(data.noShowRate) || undefined,
          financialLoss: Number(data.financialLoss) || undefined,
        });
      }

      if (data.costPerLead || data.marketingRoi) {
        await marketingMutation.mutateAsync({
          clientId,
          period,
          costPerLead: Number(data.costPerLead) || undefined,
          marketingRoi: Number(data.marketingRoi) || undefined,
        });
      }

      toast.success("Dados aplicados com sucesso!");
      onSuccess();
      handleClose();
    } catch (error) {
      toast.error("Erro ao aplicar dados: " + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setInputText("");
    setAiResponse(null);
    setStep("input");
    setSelectedCategory("all");
    onClose();
  };

  const exampleTexts = [
    "Faturamento de R$ 2.4 milhões com EBITDA de R$ 480 mil. NPS de 72 pontos e ocupação de 87%.",
    "Taxa de no-show de 12.5% gerando perda estimada de R$ 42.500 no mês.",
    "CPL de R$ 38.90 com ROI de marketing de 428%.",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Processamento com IA
          </DialogTitle>
          <DialogDescription>
            Cole dados em texto livre e a IA irá extrair e organizar automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === "input" && (
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

              {/* Text Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Dados em Texto</label>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Cole aqui os dados que deseja processar. Pode ser um relatório, email, ou qualquer texto com métricas..."
                  className="min-h-[150px]"
                />
              </div>

              {/* Example Texts */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Exemplos:</label>
                <div className="space-y-2">
                  {exampleTexts.map((text, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputText(text)}
                      className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm"
                    >
                      <Copy className="h-4 w-4 inline mr-2 text-muted-foreground" />
                      {text}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={processWithAI} disabled={!inputText.trim()} className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Processar com IA
              </Button>
            </>
          )}

          {step === "processing" && (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Processando com IA...</h3>
              <p className="text-muted-foreground">
                Analisando o texto e extraindo métricas relevantes
              </p>
            </div>
          )}

          {step === "result" && aiResponse && (
            <>
              <div className="flex items-center gap-2 text-green-500 mb-4">
                <CheckCircle className="h-5 w-5" />
                <span>Análise concluída!</span>
              </div>

              {/* Extracted Data */}
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Dados Extraídos</h4>
                  {Object.keys(aiResponse.data).length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(aiResponse.data).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center p-2 bg-background rounded">
                          <span className="text-sm text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Nenhum dado numérico identificado no texto.
                    </p>
                  )}
                </div>

                {/* Insights */}
                {aiResponse.insights.length > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h4 className="font-medium mb-2 text-blue-400">💡 Insights</h4>
                    <ul className="space-y-1 text-sm">
                      {aiResponse.insights.map((insight, idx) => (
                        <li key={idx}>• {insight}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {aiResponse.recommendations.length > 0 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <h4 className="font-medium mb-2 text-yellow-400">📋 Recomendações</h4>
                    <ul className="space-y-1 text-sm">
                      {aiResponse.recommendations.map((rec, idx) => (
                        <li key={idx}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("input")}>
                  Voltar
                </Button>
                <Button 
                  onClick={applyData} 
                  disabled={isProcessing || Object.keys(aiResponse.data).length === 0}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Aplicando...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Aplicar Dados
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
