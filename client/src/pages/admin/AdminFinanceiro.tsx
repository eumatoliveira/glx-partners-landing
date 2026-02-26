import AdminLayout from "@/components/AdminLayout";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  RefreshCw,
  Mail,
  Phone
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { MotionPageShell } from "@/animation/components/MotionPageShell";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Mock data
const mrrData = {
  labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  datasets: [
    {
      label: "MRR",
      data: [320000, 345000, 368000, 392000, 415000, 438000, 452000, 468000, 475000, 482000, 485000, 498000],
      borderColor: "#f97316",
      backgroundColor: "rgba(249, 115, 22, 0.1)",
      fill: true,
      tension: 0.4,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: false,
      grid: {
        color: "rgba(255,255,255,0.1)",
      },
      ticks: {
        callback: (value: number | string) => `R$ ${Number(value).toLocaleString()}`,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

const inadimplentes = [
  { id: 1, cliente: "Clínica Saúde Total", email: "financeiro@saudetotal.com", valor: 4500, diasAtraso: 15, tentativas: 2 },
  { id: 2, cliente: "Instituto Bem Estar", email: "contato@bemestar.com", valor: 3200, diasAtraso: 8, tentativas: 1 },
  { id: 3, cliente: "Centro Médico Vida", email: "adm@centrovida.com", valor: 6800, diasAtraso: 22, tentativas: 3 },
  { id: 4, cliente: "Clínica Derma Plus", email: "financeiro@dermaplus.com", valor: 2100, diasAtraso: 5, tentativas: 1 },
];

const transacoes = [
  { id: 1, cliente: "Hospital São Lucas", tipo: "Assinatura", valor: 12500, status: "Aprovado", data: "31/01/2026" },
  { id: 2, cliente: "Clínica Ortopédica", tipo: "Upgrade", valor: 3500, status: "Aprovado", data: "30/01/2026" },
  { id: 3, cliente: "Centro Médico Vida", tipo: "Assinatura", valor: 6800, status: "Falhou", data: "29/01/2026" },
  { id: 4, cliente: "Instituto Cardiológico", tipo: "Assinatura", valor: 8900, status: "Aprovado", data: "28/01/2026" },
  { id: 5, cliente: "Clínica Derma Plus", tipo: "Downgrade", valor: -1500, status: "Aprovado", data: "27/01/2026" },
];

export default function AdminFinanceiro() {
  const [periodo, setPeriodo] = useState("12m");

  const handleExportPDF = () => {
    alert("Exportando relatório PDF...");
  };

  const handleExportCSV = () => {
    alert("Exportando dados CSV...");
  };

  const handleRetryPayment = (id: number) => {
    alert(`Tentando cobrar novamente o cliente ${id}...`);
  };

  const handleContactClient = (email: string) => {
    window.location.href = `mailto:${email}?subject=Pagamento%20Pendente`;
  };

  return (
    <AdminLayout>
      <MotionPageShell className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Painel Financeiro</h1>
            <p className="text-muted-foreground">Health Check do negócio em tempo real</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={periodo} onValueChange={setPeriodo}>
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
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">MRR</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 485.000</div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-green-500">+12.3%</span>
                <span className="text-xs text-muted-foreground">vs mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">ARR</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 5.82M</div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-green-500">+15.8%</span>
                <span className="text-xs text-muted-foreground">vs ano anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Churn Rate</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2%</div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowDownRight className="h-4 w-4 text-green-500" />
                <span className="text-green-500">-0.5%</span>
                <span className="text-xs text-muted-foreground">vs mês anterior</span>
              </div>
              <Badge variant="outline" className="mt-2 text-green-500 border-green-500">
                Saudável (&lt; 5%)
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">LTV / CAC</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2x</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-muted-foreground">LTV: R$ 42.000 | CAC: R$ 10.000</span>
              </div>
              <Badge variant="outline" className="mt-2 text-green-500 border-green-500">
                Excelente (&gt; 3x)
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* MRR Chart */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Evolução do MRR</CardTitle>
            <CardDescription>Receita Mensal Recorrente nos últimos 12 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Line data={mrrData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Inadimplência */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Inadimplência
                </CardTitle>
                <CardDescription>Pagamentos atrasados que requerem ação</CardDescription>
              </div>
              <Badge variant="destructive">{inadimplentes.length} pendentes</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Dias em Atraso</TableHead>
                  <TableHead>Tentativas</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inadimplentes.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.cliente}</p>
                        <p className="text-sm text-muted-foreground">{item.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      R$ {item.valor.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.diasAtraso > 15 ? "destructive" : "secondary"}>
                        {item.diasAtraso} dias
                      </Badge>
                    </TableCell>
                    <TableCell>{item.tentativas}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRetryPayment(item.id)}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Cobrar
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleContactClient(item.email)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Transações Recentes */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
            <CardDescription>Últimas movimentações financeiras</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transacoes.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium">{tx.cliente}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{tx.tipo}</Badge>
                    </TableCell>
                    <TableCell className={tx.valor < 0 ? "text-red-500" : "text-green-500"}>
                      {tx.valor < 0 ? "-" : "+"}R$ {Math.abs(tx.valor).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={tx.status === "Aprovado" ? "default" : "destructive"}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{tx.data}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </MotionPageShell>
    </AdminLayout>
  );
}


