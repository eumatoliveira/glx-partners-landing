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
import { trpc } from "@/lib/trpc";
import { 
  AlertTriangle, 
  Loader2,
  AlertCircle,
  XCircle,
  Clock,
  Terminal
} from "lucide-react";
import { Redirect } from "wouter";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function AdminErrors() {
  const { user, loading: authLoading } = useAuth();
  const { data: errors, isLoading } = trpc.admin.getErrorLogs.useQuery({ limit: 100 });
  const { data: stats } = trpc.admin.getErrorStats.useQuery({ hours: 24 });
  
  // Simulated live logs
  const [liveLogs, setLiveLogs] = useState<string[]>([
    "[2026-01-31 14:32:15] INFO: System health check passed",
    "[2026-01-31 14:32:10] INFO: API request processed successfully",
    "[2026-01-31 14:32:05] DEBUG: Cache hit for user session",
  ]);

  useEffect(() => {
    // Simulate live log updates
    const interval = setInterval(() => {
      const logTypes = ["INFO", "DEBUG", "WARN"];
      const messages = [
        "API request processed",
        "Cache updated",
        "User session validated",
        "Database query executed",
        "Background job completed"
      ];
      const type = logTypes[Math.floor(Math.random() * logTypes.length)];
      const message = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      
      setLiveLogs(prev => {
        const newLogs = [`[${now}] ${type}: ${message}`, ...prev];
        return newLogs.slice(0, 20); // Keep only last 20 logs
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getErrorTypeColor = (type: string) => {
    switch (type) {
      case '4xx': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case '5xx': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'timeout': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            Monitoramento de Erros
          </h1>
          <p className="text-muted-foreground">Identifique e resolva problemas antes que afetem os usuários</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className={cn(
            "border",
            (stats?.total ?? 0) > 100 ? "bg-red-500/10 border-red-500/30" : "bg-white/5 border-white/10"
          )}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-lg",
                (stats?.total ?? 0) > 100 ? "bg-red-500/20" : "bg-primary/20"
              )}>
                <AlertTriangle className={cn(
                  "h-5 w-5",
                  (stats?.total ?? 0) > 100 ? "text-red-400" : "text-primary"
                )} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total (24h)</p>
                <p className="text-2xl font-bold">{stats?.total ?? 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-500/20">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Erros 4xx</p>
                <p className="text-2xl font-bold">{stats?.by4xx ?? 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card className={cn(
            "border",
            (stats?.by5xx ?? 0) > 10 ? "bg-red-500/10 border-red-500/30" : "bg-white/5 border-white/10"
          )}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-lg",
                (stats?.by5xx ?? 0) > 10 ? "bg-red-500/20" : "bg-red-500/20"
              )}>
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Erros 5xx</p>
                <p className="text-2xl font-bold">{stats?.by5xx ?? 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-orange-500/20">
                <Clock className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Timeouts</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Logs */}
        <Card className="bg-[#0d0d0d] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Terminal className="h-5 w-5 text-green-400" />
              Live Logs
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black/50 rounded-lg p-4 font-mono text-xs h-48 overflow-y-auto">
              {liveLogs.map((log, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "py-0.5",
                    log.includes("ERROR") ? "text-red-400" :
                    log.includes("WARN") ? "text-yellow-400" :
                    log.includes("INFO") ? "text-green-400" :
                    "text-gray-400"
                  )}
                >
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Logs Table */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">Histórico de Erros</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : errors?.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum erro registrado</h3>
                <p className="text-muted-foreground">
                  Ótimo! O sistema está funcionando sem erros
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Mensagem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {errors?.map((error) => (
                    <TableRow key={error.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(error.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={cn("font-mono text-xs", getErrorTypeColor(error.errorType))}
                        >
                          {error.errorType}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {error.statusCode || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm font-mono">
                        {error.endpoint || "—"}
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm truncate">{error.message}</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
