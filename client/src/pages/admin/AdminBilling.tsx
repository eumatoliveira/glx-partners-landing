import { useAuth } from "@/_core/hooks/useAuth";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { 
  DollarSign, 
  Loader2,
  TrendingUp,
  TrendingDown,
  Users,
  AlertCircle,
  CreditCard,
  RefreshCw
} from "lucide-react";
import { Redirect } from "wouter";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminBilling() {
  const { user, loading: authLoading } = useAuth();
  const { data: metrics, isLoading } = trpc.admin.getFinancialMetrics.useQuery();
  const { data: payments } = trpc.admin.getPayments.useQuery({ limit: 20 });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Redirect to="/" />;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Pago</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pendente</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Falhou</Badge>;
      case 'refunded':
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Reembolsado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleRetryPayment = (paymentId: number) => {
    toast.info("Funcionalidade de retry em desenvolvimento");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-400" />
            Painel Financeiro
          </h1>
          <p className="text-muted-foreground">Acompanhe a saúde financeira do negócio em tempo real</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Main Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">MRR</p>
                      <p className="text-3xl font-bold text-green-400">
                        {formatCurrency(metrics?.mrr ?? 0)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Receita Mensal Recorrente</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-green-400">
                        <TrendingUp className="h-3 w-3" />
                        +12.5% vs mês anterior
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-green-500/20">
                      <DollarSign className="h-6 w-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">ARR</p>
                      <p className="text-3xl font-bold text-blue-400">
                        {formatCurrency(metrics?.arr ?? 0)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Receita Anual Recorrente</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/20">
                      <TrendingUp className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={cn(
                "border",
                (metrics?.churnRate ?? 0) > 5 
                  ? "bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/30" 
                  : "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Churn Rate</p>
                      <p className={cn(
                        "text-3xl font-bold",
                        (metrics?.churnRate ?? 0) > 5 ? "text-red-400" : "text-primary"
                      )}>
                        {(metrics?.churnRate ?? 0).toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Taxa de cancelamento</p>
                      {(metrics?.churnRate ?? 0) > 5 && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-red-400">
                          <AlertCircle className="h-3 w-3" />
                          Acima do ideal (5%)
                        </div>
                      )}
                    </div>
                    <div className={cn(
                      "p-3 rounded-lg",
                      (metrics?.churnRate ?? 0) > 5 ? "bg-red-500/20" : "bg-primary/20"
                    )}>
                      <TrendingDown className={cn(
                        "h-6 w-6",
                        (metrics?.churnRate ?? 0) > 5 ? "text-red-400" : "text-primary"
                      )} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">LTV Médio</p>
                      <p className="text-3xl font-bold text-purple-400">
                        {formatCurrency(metrics?.ltv ?? 0)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Valor do tempo de vida</p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-500/20">
                      <Users className="h-6 w-6 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-500/20">
                    <Users className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Assinaturas Ativas</p>
                    <p className="text-2xl font-bold">{metrics?.activeSubscriptionsCount ?? 0}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className={cn(
                "border",
                (metrics?.pendingPaymentsCount ?? 0) > 0 
                  ? "bg-yellow-500/10 border-yellow-500/30" 
                  : "bg-white/5 border-white/10"
              )}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-yellow-500/20">
                    <CreditCard className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pagamentos Pendentes</p>
                    <p className="text-2xl font-bold">{metrics?.pendingPaymentsCount ?? 0}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className={cn(
                "border",
                (metrics?.failedPaymentsCount ?? 0) > 0 
                  ? "bg-red-500/10 border-red-500/30" 
                  : "bg-white/5 border-white/10"
              )}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-red-500/20">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pagamentos Falhos</p>
                    <p className="text-2xl font-bold">{metrics?.failedPaymentsCount ?? 0}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Failed Payments - Action Required */}
            {metrics?.failedPayments && metrics.failedPayments.length > 0 && (
              <Card className="bg-red-500/5 border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    Ações Necessárias - Pagamentos Falhos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-red-500/20 hover:bg-red-500/5">
                        <TableHead>ID</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Método</TableHead>
                        <TableHead className="text-right">Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {metrics.failedPayments.map((payment) => (
                        <TableRow key={payment.id} className="border-red-500/20 hover:bg-red-500/5">
                          <TableCell className="font-mono text-sm">#{payment.id}</TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(Number(payment.amount))}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(payment.dueDate)}
                          </TableCell>
                          <TableCell>{payment.paymentMethod || "—"}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                              onClick={() => handleRetryPayment(payment.id)}
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Retry
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Recent Payments */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Histórico de Pagamentos</CardTitle>
              </CardHeader>
              <CardContent>
                {payments?.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum pagamento registrado</h3>
                    <p className="text-muted-foreground">
                      Os pagamentos aparecerão aqui quando forem processados
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead>ID</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Método</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Pago em</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments?.map((payment) => (
                        <TableRow key={payment.id} className="border-white/10 hover:bg-white/5">
                          <TableCell className="font-mono text-sm">#{payment.id}</TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(Number(payment.amount))}
                          </TableCell>
                          <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {payment.paymentMethod || "—"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(payment.dueDate)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {payment.paidAt ? formatDate(payment.paidAt) : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
