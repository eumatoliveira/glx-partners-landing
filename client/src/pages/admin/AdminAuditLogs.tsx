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
  FileText, 
  Loader2,
  User,
  Settings,
  Shield,
  Flag,
  Activity
} from "lucide-react";
import { Redirect } from "wouter";
import { cn } from "@/lib/utils";

const actionIcons: Record<string, React.ElementType> = {
  UPDATE_USER_ROLE: Shield,
  CREATE_FEATURE_FLAG: Flag,
  UPDATE_FEATURE_FLAG: Flag,
  DELETE_FEATURE_FLAG: Flag,
  UPDATE_SERVICE_STATUS: Activity,
  DEFAULT: Settings
};

const actionColors: Record<string, string> = {
  UPDATE_USER_ROLE: "bg-blue-500/20 text-blue-400",
  CREATE_FEATURE_FLAG: "bg-green-500/20 text-green-400",
  UPDATE_FEATURE_FLAG: "bg-yellow-500/20 text-yellow-400",
  DELETE_FEATURE_FLAG: "bg-red-500/20 text-red-400",
  UPDATE_SERVICE_STATUS: "bg-purple-500/20 text-purple-400",
  DEFAULT: "bg-gray-500/20 text-gray-400"
};

export default function AdminAuditLogs() {
  const { user, loading: authLoading } = useAuth();
  const { data: logs, isLoading } = trpc.admin.getAuditLogs.useQuery({ limit: 100 });

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

  const getActionIcon = (action: string) => {
    return actionIcons[action] || actionIcons.DEFAULT;
  };

  const getActionColor = (action: string) => {
    return actionColors[action] || actionColors.DEFAULT;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Audit Logs
          </h1>
          <p className="text-muted-foreground">Histórico de todas as alterações no sistema</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Logs</p>
                <p className="text-2xl font-bold">{logs?.length ?? 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <User className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alterações de Usuário</p>
                <p className="text-2xl font-bold">
                  {logs?.filter(l => l.entity === 'users').length ?? 0}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-500/20">
                <Flag className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Feature Flags</p>
                <p className="text-2xl font-bold">
                  {logs?.filter(l => l.entity === 'feature_flags').length ?? 0}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Logs Table */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">Histórico de Ações</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : logs?.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum log encontrado</h3>
                <p className="text-muted-foreground">
                  As ações do sistema serão registradas aqui
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Entidade</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Detalhes</TableHead>
                    <TableHead>IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs?.map((log) => {
                    const ActionIcon = getActionIcon(log.action);
                    return (
                      <TableRow key={log.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-muted-foreground text-sm">
                          {formatDate(log.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={cn("p-1.5 rounded", getActionColor(log.action))}>
                              <ActionIcon className="h-3 w-3" />
                            </div>
                            <span className="text-sm font-mono">{log.action}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs">
                            {log.entity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-sm">
                          {log.entityId || "—"}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          {log.newValue ? (
                            <code className="text-xs bg-white/5 px-2 py-1 rounded block truncate">
                              {JSON.stringify(log.newValue)}
                            </code>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {log.ipAddress || "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
