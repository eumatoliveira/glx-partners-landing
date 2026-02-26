import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import SpreadsheetUpload from "@/components/admin/SpreadsheetUpload";
import AIDataProcessor from "@/components/admin/AIDataProcessor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Upload,
  FileSpreadsheet,
  Sparkles,
  Edit,
  Plus,
  Building2,
  TrendingUp,
  DollarSign,
  Factory,
  AlertTriangle,
  Megaphone,
  Star,
  Users,
  Database,
  Loader2,
  Check,
  X,
  RefreshCw,
  Download,
  Trash2,
} from "lucide-react";

export default function DataManagement() {
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");
  const [newClientDialog, setNewClientDialog] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [spreadsheetUploadOpen, setSpreadsheetUploadOpen] = useState(false);
  const [aiProcessorOpen, setAiProcessorOpen] = useState(false);
  const [newClientSlug, setNewClientSlug] = useState("");
  const [newClientIndustry, setNewClientIndustry] = useState("");

  // Fetch clients
  const { data: clients, isLoading: loadingClients, refetch: refetchClients } = trpc.dashboardData.getClients.useQuery();
  
  // Fetch data for selected client
  const { data: dashboardData, isLoading: loadingData, refetch: refetchData } = trpc.dashboardData.getAllData.useQuery(
    { clientId: parseInt(selectedClient) },
    { enabled: !!selectedClient }
  );

  // Mutations
  const createClientMutation = trpc.dashboardData.createClient.useMutation({
    onSuccess: () => {
      toast.success("Cliente criado com sucesso!");
      setNewClientDialog(false);
      setNewClientName("");
      setNewClientSlug("");
      setNewClientIndustry("");
      refetchClients();
    },
    onError: (error: { message: string }) => {
      toast.error("Erro ao criar cliente: " + error.message);
    },
  });

  const handleCreateClient = () => {
    if (!newClientName || !newClientSlug) {
      toast.error("Nome e slug são obrigatórios");
      return;
    }
    createClientMutation.mutate({
      name: newClientName,
      slug: newClientSlug,
      industry: newClientIndustry || undefined,
    });
  };

  const dataCategories = [
    { id: "ceo", label: "CEO Scorecard", icon: TrendingUp, color: "text-blue-500" },
    { id: "financial", label: "Financials", icon: DollarSign, color: "text-green-500" },
    { id: "operations", label: "Operations", icon: Factory, color: "text-purple-500" },
    { id: "waste", label: "No-show & Waste", icon: AlertTriangle, color: "text-orange-500" },
    { id: "marketing", label: "Growth & Marketing", icon: Megaphone, color: "text-pink-500" },
    { id: "quality", label: "Quality & NPS", icon: Star, color: "text-yellow-500" },
    { id: "people", label: "People Analytics", icon: Users, color: "text-cyan-500" },
    { id: "governance", label: "Data Governance", icon: Database, color: "text-gray-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão de Dados do Dashboard</h1>
          <p className="text-gray-400">Gerencie os dados exibidos no dashboard dos clientes</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={newClientDialog} onOpenChange={setNewClientDialog}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
                <Plus className="w-4 h-4" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1E1E1E] border-[#2a2a2a] text-white">
              <DialogHeader>
                <DialogTitle>Criar Novo Cliente</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Adicione um novo cliente para gerenciar seus dados do dashboard.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nome do Cliente</Label>
                  <Input
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Ex: Clínica São Paulo"
                    className="bg-[#2a2a2a] border-[#3a3a3a]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug (URL)</Label>
                  <Input
                    value={newClientSlug}
                    onChange={(e) => setNewClientSlug(e.target.value.toLowerCase().replace(/\s/g, '-'))}
                    placeholder="Ex: clinica-sao-paulo"
                    className="bg-[#2a2a2a] border-[#3a3a3a]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Indústria</Label>
                  <Input
                    value={newClientIndustry}
                    onChange={(e) => setNewClientIndustry(e.target.value)}
                    placeholder="Ex: Saúde, Estética, etc."
                    className="bg-[#2a2a2a] border-[#3a3a3a]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewClientDialog(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateClient}
                  disabled={createClientMutation.isPending}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {createClientMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Criar Cliente
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Client Selector */}
      <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-orange-500" />
            Selecionar Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label className="text-gray-400">Cliente</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="bg-[#2a2a2a] border-[#3a3a3a] text-white mt-1">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent className="bg-[#2a2a2a] border-[#3a3a3a]">
                  {loadingClients ? (
                    <SelectItem value="loading" disabled>Carregando...</SelectItem>
                  ) : clients?.length === 0 ? (
                    <SelectItem value="empty" disabled>Nenhum cliente cadastrado</SelectItem>
                  ) : (
                    clients?.map((client: { id: number; name: string; slug: string }) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name} ({client.slug})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            {selectedClient && (
              <Button 
                variant="outline" 
                onClick={() => refetchData()}
                className="border-[#3a3a3a] text-gray-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Entry Methods */}
      {selectedClient && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#1E1E1E] border-[#2a2a2a] hover:border-orange-500/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-500" />
                Upload de Planilha
              </CardTitle>
              <CardDescription className="text-gray-400">
                Importe dados via Excel ou CSV
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setSpreadsheetUploadOpen(true)}
                className="w-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Importar Planilha
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1E1E1E] border-[#2a2a2a] hover:border-orange-500/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Processamento com IA
              </CardTitle>
              <CardDescription className="text-gray-400">
                Análise automática e sugestões
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setAiProcessorOpen(true)}
                className="w-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Usar IA
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1E1E1E] border-[#2a2a2a] hover:border-orange-500/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-green-500" />
                Inserção Manual
              </CardTitle>
              <CardDescription className="text-gray-400">
                Edite cada métrica individualmente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30">
                <Edit className="w-4 h-4 mr-2" />
                Editar Dados
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Categories */}
      {selectedClient && (
        <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="text-white">Categorias de Dados</CardTitle>
            <CardDescription className="text-gray-400">
              Selecione uma categoria para visualizar e editar os dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-[#2a2a2a] flex-wrap h-auto gap-1 p-1">
                <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500">
                  Visão Geral
                </TabsTrigger>
                {dataCategories.map((cat) => (
                  <TabsTrigger 
                    key={cat.id} 
                    value={cat.id}
                    className="data-[state=active]:bg-orange-500"
                  >
                    <cat.icon className={`w-4 h-4 mr-1 ${cat.color}`} />
                    <span className="hidden sm:inline">{cat.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {dataCategories.map((cat) => {
                    const Icon = cat.icon;
                    const hasData = dashboardData && (dashboardData as any)[cat.id + 'Data'] !== undefined;
                    
                    return (
                      <Card 
                        key={cat.id}
                        className="bg-[#2a2a2a] border-[#3a3a3a] cursor-pointer hover:border-orange-500/50 transition-colors"
                        onClick={() => setActiveTab(cat.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <Icon className={`w-8 h-8 ${cat.color}`} />
                            {hasData ? (
                              <Check className="w-5 h-5 text-green-500" />
                            ) : (
                              <X className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                          <h3 className="text-white font-medium mt-2">{cat.label}</h3>
                          <p className="text-xs text-gray-400 mt-1">
                            {hasData ? "Dados configurados" : "Sem dados"}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* CEO Scorecard Tab */}
              <TabsContent value="ceo" className="mt-6">
                <CEOMetricsForm clientId={parseInt(selectedClient)} data={dashboardData?.ceoMetrics} onSave={refetchData} />
              </TabsContent>

              {/* Financial Tab */}
              <TabsContent value="financial" className="mt-6">
                <FinancialDataForm clientId={parseInt(selectedClient)} data={dashboardData?.financialData} onSave={refetchData} />
              </TabsContent>

              {/* Operations Tab */}
              <TabsContent value="operations" className="mt-6">
                <OperationsDataForm clientId={parseInt(selectedClient)} data={dashboardData?.operationsData} onSave={refetchData} />
              </TabsContent>

              {/* Waste Tab */}
              <TabsContent value="waste" className="mt-6">
                <WasteDataForm clientId={parseInt(selectedClient)} data={dashboardData?.wasteData} onSave={refetchData} />
              </TabsContent>

              {/* Marketing Tab */}
              <TabsContent value="marketing" className="mt-6">
                <MarketingDataForm clientId={parseInt(selectedClient)} data={dashboardData?.marketingData} onSave={refetchData} />
              </TabsContent>

              {/* Quality Tab */}
              <TabsContent value="quality" className="mt-6">
                <QualityDataForm clientId={parseInt(selectedClient)} data={dashboardData?.qualityData} onSave={refetchData} />
              </TabsContent>

              {/* People Tab */}
              <TabsContent value="people" className="mt-6">
                <PeopleDataForm clientId={parseInt(selectedClient)} data={dashboardData?.peopleData} onSave={refetchData} />
              </TabsContent>

              {/* Governance Tab */}
              <TabsContent value="governance" className="mt-6">
                <GovernanceDataForm clientId={parseInt(selectedClient)} data={dashboardData?.dataGovernanceData} onSave={refetchData} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* No Client Selected */}
      {!selectedClient && (
        <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
          <CardContent className="py-12 text-center">
            <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Nenhum cliente selecionado</h3>
            <p className="text-gray-400 mb-4">
              Selecione um cliente existente ou crie um novo para gerenciar seus dados.
            </p>
            <Button 
              onClick={() => setNewClientDialog(true)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Cliente
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      {selectedClient && (
        <>
          <SpreadsheetUpload
            clientId={parseInt(selectedClient)}
            isOpen={spreadsheetUploadOpen}
            onClose={() => setSpreadsheetUploadOpen(false)}
            onSuccess={() => {
              refetchData();
              setSpreadsheetUploadOpen(false);
            }}
          />
          <AIDataProcessor
            clientId={parseInt(selectedClient)}
            isOpen={aiProcessorOpen}
            onClose={() => setAiProcessorOpen(false)}
            onSuccess={() => {
              refetchData();
              setAiProcessorOpen(false);
            }}
          />
        </>
      )}
    </div>
  );
}

// ==================== FORM COMPONENTS ====================

interface FormProps {
  clientId: number;
  data: any;
  onSave: () => void;
}

function CEOMetricsForm({ clientId, data, onSave }: FormProps) {
  const [period, setPeriod] = useState(data?.period || new Date().toISOString().slice(0, 7));
  const [faturamento, setFaturamento] = useState(data?.faturamento || "");
  const [faturamentoVar, setFaturamentoVar] = useState(data?.faturamentoVariacao || "");
  const [ebitda, setEbitda] = useState(data?.ebitda || "");
  const [ebitdaVar, setEbitdaVar] = useState(data?.ebitdaVariacao || "");
  const [nps, setNps] = useState(data?.npsScore || "");
  const [npsVar, setNpsVar] = useState(data?.npsVariacao || "");
  const [ocupacao, setOcupacao] = useState(data?.ocupacao || "");
  const [ocupacaoVar, setOcupacaoVar] = useState(data?.ocupacaoVariacao || "");

  const mutation = trpc.dashboardData.upsertCeoMetrics.useMutation({
    onSuccess: () => {
      toast.success("Dados do CEO Scorecard salvos com sucesso!");
      onSave();
    },
    onError: (error: { message: string }) => {
      toast.error("Erro ao salvar: " + error.message);
    },
  });

  const handleSave = () => {
    mutation.mutate({
      clientId,
      period,
      faturamento: faturamento ? parseFloat(faturamento) : undefined,
      faturamentoVariacao: faturamentoVar ? parseFloat(faturamentoVar) : undefined,
      ebitda: ebitda ? parseFloat(ebitda) : undefined,
      ebitdaVariacao: ebitdaVar ? parseFloat(ebitdaVar) : undefined,
      npsScore: nps ? parseInt(nps) : undefined,
      npsVariacao: npsVar ? parseFloat(npsVar) : undefined,
      ocupacao: ocupacao ? parseFloat(ocupacao) : undefined,
      ocupacaoVariacao: ocupacaoVar ? parseFloat(ocupacaoVar) : undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">CEO Scorecard - Métricas Principais</h3>
        <div className="flex items-center gap-2">
          <Label className="text-gray-400">Período:</Label>
          <Input
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-40 bg-[#2a2a2a] border-[#3a3a3a]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Faturamento */}
        <Card className="bg-[#2a2a2a] border-[#3a3a3a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Faturamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <Label className="text-xs text-gray-500">Valor (R$)</Label>
              <Input
                type="number"
                value={faturamento}
                onChange={(e) => setFaturamento(e.target.value)}
                placeholder="2400000"
                className="bg-[#1E1E1E] border-[#3a3a3a]"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Variação (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={faturamentoVar}
                onChange={(e) => setFaturamentoVar(e.target.value)}
                placeholder="12.5"
                className="bg-[#1E1E1E] border-[#3a3a3a]"
              />
            </div>
          </CardContent>
        </Card>

        {/* EBITDA */}
        <Card className="bg-[#2a2a2a] border-[#3a3a3a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">EBITDA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <Label className="text-xs text-gray-500">Valor (R$)</Label>
              <Input
                type="number"
                value={ebitda}
                onChange={(e) => setEbitda(e.target.value)}
                placeholder="480000"
                className="bg-[#1E1E1E] border-[#3a3a3a]"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Variação (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={ebitdaVar}
                onChange={(e) => setEbitdaVar(e.target.value)}
                placeholder="8.3"
                className="bg-[#1E1E1E] border-[#3a3a3a]"
              />
            </div>
          </CardContent>
        </Card>

        {/* NPS */}
        <Card className="bg-[#2a2a2a] border-[#3a3a3a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">NPS Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <Label className="text-xs text-gray-500">Score (-100 a 100)</Label>
              <Input
                type="number"
                min="-100"
                max="100"
                value={nps}
                onChange={(e) => setNps(e.target.value)}
                placeholder="72"
                className="bg-[#1E1E1E] border-[#3a3a3a]"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Variação (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={npsVar}
                onChange={(e) => setNpsVar(e.target.value)}
                placeholder="-2.1"
                className="bg-[#1E1E1E] border-[#3a3a3a]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Ocupação */}
        <Card className="bg-[#2a2a2a] border-[#3a3a3a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Ocupação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <Label className="text-xs text-gray-500">Taxa (%)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={ocupacao}
                onChange={(e) => setOcupacao(e.target.value)}
                placeholder="87"
                className="bg-[#1E1E1E] border-[#3a3a3a]"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Variação (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={ocupacaoVar}
                onChange={(e) => setOcupacaoVar(e.target.value)}
                placeholder="5.2"
                className="bg-[#1E1E1E] border-[#3a3a3a]"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={mutation.isPending}
          className="bg-orange-500 hover:bg-orange-600"
        >
          {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Salvar Dados
        </Button>
      </div>
    </div>
  );
}

// Placeholder forms for other categories
function FinancialDataForm({ clientId, data, onSave }: FormProps) {
  return (
    <div className="text-center py-8 text-gray-400">
      <DollarSign className="w-12 h-12 mx-auto mb-4 text-green-500" />
      <h3 className="text-lg font-medium text-white mb-2">Dados Financeiros</h3>
      <p>Formulário de dados financeiros em desenvolvimento...</p>
    </div>
  );
}

function OperationsDataForm({ clientId, data, onSave }: FormProps) {
  return (
    <div className="text-center py-8 text-gray-400">
      <Factory className="w-12 h-12 mx-auto mb-4 text-purple-500" />
      <h3 className="text-lg font-medium text-white mb-2">Dados Operacionais</h3>
      <p>Formulário de dados operacionais em desenvolvimento...</p>
    </div>
  );
}

function WasteDataForm({ clientId, data, onSave }: FormProps) {
  return (
    <div className="text-center py-8 text-gray-400">
      <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-orange-500" />
      <h3 className="text-lg font-medium text-white mb-2">Dados de No-show & Waste</h3>
      <p>Formulário de dados de desperdício em desenvolvimento...</p>
    </div>
  );
}

function MarketingDataForm({ clientId, data, onSave }: FormProps) {
  return (
    <div className="text-center py-8 text-gray-400">
      <Megaphone className="w-12 h-12 mx-auto mb-4 text-pink-500" />
      <h3 className="text-lg font-medium text-white mb-2">Dados de Marketing</h3>
      <p>Formulário de dados de marketing em desenvolvimento...</p>
    </div>
  );
}

function QualityDataForm({ clientId, data, onSave }: FormProps) {
  return (
    <div className="text-center py-8 text-gray-400">
      <Star className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
      <h3 className="text-lg font-medium text-white mb-2">Dados de Qualidade & NPS</h3>
      <p>Formulário de dados de qualidade em desenvolvimento...</p>
    </div>
  );
}

function PeopleDataForm({ clientId, data, onSave }: FormProps) {
  return (
    <div className="text-center py-8 text-gray-400">
      <Users className="w-12 h-12 mx-auto mb-4 text-cyan-500" />
      <h3 className="text-lg font-medium text-white mb-2">Dados de People Analytics</h3>
      <p>Formulário de dados de RH em desenvolvimento...</p>
    </div>
  );
}

function GovernanceDataForm({ clientId, data, onSave }: FormProps) {
  return (
    <div className="text-center py-8 text-gray-400">
      <Database className="w-12 h-12 mx-auto mb-4 text-gray-500" />
      <h3 className="text-lg font-medium text-white mb-2">Dados de Data Governance</h3>
      <p>Formulário de dados de governança em desenvolvimento...</p>
    </div>
  );
}
