import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { 
  Users, 
  Shield,
  Search,
  Plus,
  MoreHorizontal,
  UserCheck,
  UserX,
  Key,
  History,
  Download,
  Loader2,
  Trash2,
  RefreshCw,
  Crown,
  Zap,
  Building2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MIN_PLAN_BY_SECTION, PLAN_ACCESS, type PlanTier, type SectionId } from "@shared/controlTowerRules";

const roleColors: Record<string, string> = {
  admin: "bg-red-500/20 text-red-500",
  user: "bg-blue-500/20 text-blue-500",
  editor: "bg-green-500/20 text-green-500",
  viewer: "bg-gray-500/20 text-gray-400",
};

const roleLabels: Record<string, string> = {
  admin: "Admin",
  user: "Usuário",
  editor: "Editor",
  viewer: "Viewer",
};

const planColors: Record<string, string> = {
  essencial: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  pro: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  enterprise: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const planLabels: Record<string, string> = {
  essencial: "Essencial",
  pro: "Pro",
  enterprise: "Enterprise",
};

const planIcons: Record<string, React.ReactNode> = {
  essencial: <Zap className="h-3 w-3 mr-1" />,
  pro: <Crown className="h-3 w-3 mr-1" />,
  enterprise: <Building2 className="h-3 w-3 mr-1" />,
};

const DASHBOARD_SECTION_ORDER: SectionId[] = [
  "dashboard",
  "realtime",
  "agenda",
  "equipe",
  "sprints",
  "funil",
  "canais",
  "integracoes",
  "dados",
  "relatorios",
  "configuracoes",
];

const DASHBOARD_SECTION_LABELS: Record<SectionId, string> = {
  dashboard: "Dashboard",
  realtime: "Realtime",
  agenda: "Agenda",
  equipe: "Equipe",
  sprints: "Sprints",
  funil: "Funil",
  canais: "Canais",
  integracoes: "Integracoes",
  dados: "Dados",
  relatorios: "Relatorios",
  configuracoes: "Configuracoes",
};

const PLAN_ORDER: PlanTier[] = ["essencial", "pro", "enterprise"];

export default function AdminUsuarios() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({ nome: "", email: "", password: "", role: "user" as "user" | "admin", plan: "essencial" as PlanTier });

  // Fetch users from database
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = trpc.admin.getUsers.useQuery();
  
  // Fetch audit logs
  const { data: auditLogs, isLoading: auditLoading } = trpc.admin.getAuditLogs.useQuery();

  // Mutations
  const updateRoleMutation = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => {
      toast.success("Permissão atualizada com sucesso!");
      refetchUsers();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar permissão: ${error.message}`);
    }
  });

  const updatePlanMutation = trpc.admin.updateUserPlan.useMutation({
    onSuccess: () => {
      toast.success("Plano atualizado com sucesso!");
      refetchUsers();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar plano: ${error.message}`);
    }
  });

  const createUserMutation = trpc.emailAuth.createUser.useMutation({
    onSuccess: () => {
      toast.success("Usuário criado com sucesso!");
      setIsAddUserOpen(false);
      setNewUser({ nome: "", email: "", password: "", role: "user", plan: "essencial" });
      refetchUsers();
    },
    onError: (error) => {
      toast.error(`Erro ao criar usuário: ${error.message}`);
    }
  });

  const users = usersData ?? [];

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesPlan = planFilter === "all" || (user as any).plan === planFilter;
    return matchesSearch && matchesRole && matchesPlan;
  });

  const mfaStats = {
    total: users.length,
    comMfa: users.filter(u => u.mfaEnabled).length,
    semMfa: users.filter(u => !u.mfaEnabled).length,
    admins: users.filter(u => u.role === "admin").length,
    essencial: users.filter(u => (u as any).plan === "essencial").length,
    pro: users.filter(u => (u as any).plan === "pro").length,
    enterprise: users.filter(u => (u as any).plan === "enterprise").length,
  };

  const handleAddUser = () => {
    if (!newUser.nome || !newUser.email || !newUser.password) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    if (newUser.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    createUserMutation.mutate({
      name: newUser.nome,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
      plan: newUser.plan,
    });
  };

  const handleUpdateRole = (userId: number, newRole: "user" | "admin") => {
    updateRoleMutation.mutate({ userId, role: newRole });
  };

  const handleUpdatePlan = (userId: number, newPlan: PlanTier) => {
    updatePlanMutation.mutate({ userId, plan: newPlan });
  };

  const handleToggleActive = (user: any) => {
    toast.info("Funcionalidade em desenvolvimento");
  };

  const formatLastAccess = (date: Date | null) => {
    if (!date) return "Nunca";
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
    } catch {
      return "Desconhecido";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Controle de Acessos</h1>
            <p className="text-muted-foreground">Gestão de usuários, planos e segurança (RBAC)</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => refetchUsers()}>
              <RefreshCw className={`h-4 w-4 mr-2 ${usersLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                  <DialogDescription>
                    Preencha os dados para criar um novo usuário no sistema.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome *</Label>
                    <Input 
                      id="nome" 
                      value={newUser.nome}
                      onChange={(e) => setNewUser({...newUser, nome: e.target.value})}
                      placeholder="Nome completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha *</Label>
                    <Input 
                      id="password" 
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      placeholder="Senha segura"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Permissão</Label>
                    <Select value={newUser.role} onValueChange={(v: "user" | "admin") => setNewUser({...newUser, role: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Usuário</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plan">Plano</Label>
                    <Select value={newUser.plan} onValueChange={(v) => setNewUser({...newUser, plan: v as PlanTier})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="essencial">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-emerald-400" />
                            Essencial
                          </div>
                        </SelectItem>
                        <SelectItem value="pro">
                          <div className="flex items-center gap-2">
                            <Crown className="h-4 w-4 text-amber-400" />
                            Pro
                          </div>
                        </SelectItem>
                        <SelectItem value="enterprise">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-purple-400" />
                            Enterprise
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancelar</Button>
                  <Button onClick={handleAddUser} disabled={createUserMutation.isPending}>
                    {createUserMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Criar Usuário
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usersLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : mfaStats.total}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-400">Essencial</CardTitle>
              <Zap className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">
                {usersLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : mfaStats.essencial}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-amber-400">Pro</CardTitle>
              <Crown className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-400">
                {usersLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : mfaStats.pro}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-400">Enterprise</CardTitle>
              <Building2 className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                {usersLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : mfaStats.enterprise}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Acesso por Plano no Dashboard</CardTitle>
            <CardDescription>
              Matriz centralizada por funcao. Alteracoes de plano aqui impactam diretamente os modulos liberados no dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funcao</TableHead>
                  <TableHead>Plano Minimo</TableHead>
                  <TableHead>Essencial</TableHead>
                  <TableHead>Pro</TableHead>
                  <TableHead>Enterprise</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DASHBOARD_SECTION_ORDER.map((sectionId) => (
                  <TableRow key={sectionId}>
                    <TableCell className="font-medium">{DASHBOARD_SECTION_LABELS[sectionId]}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={planColors[MIN_PLAN_BY_SECTION[sectionId]]}>
                        {planLabels[MIN_PLAN_BY_SECTION[sectionId]]}
                      </Badge>
                    </TableCell>
                    {PLAN_ORDER.map((planTier) => (
                      <TableCell key={`${sectionId}-${planTier}`}>
                        {PLAN_ACCESS[planTier].includes(sectionId) ? (
                          <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
                            Liberado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-zinc-400 border-zinc-500/30">
                            Bloqueado
                          </Badge>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Usuários</CardTitle>
                <CardDescription>Gerencie permissões, planos e acessos</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar por nome ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Permissão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">Usuário</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={planFilter} onValueChange={setPlanFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos Planos</SelectItem>
                    <SelectItem value="essencial">Essencial</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Permissão</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>MFA</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último Acesso</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">
                              {(user.name || user.email || "?").charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{user.name || "Sem nome"}</p>
                            <p className="text-sm text-muted-foreground">{user.email || "Sem email"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={roleColors[user.role] || roleColors.user}>
                          {roleLabels[user.role] || user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={(user as any).plan || "essencial"} 
                          onValueChange={(v) => handleUpdatePlan(user.id, v as PlanTier)}
                        >
                          <SelectTrigger className="w-36 h-8">
                            <SelectValue>
                              <Badge variant="outline" className={planColors[(user as any).plan || "essencial"]}>
                                {planIcons[(user as any).plan || "essencial"]}
                                {planLabels[(user as any).plan || "essencial"]}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="essencial">
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-emerald-400" />
                                Essencial
                              </div>
                            </SelectItem>
                            <SelectItem value="pro">
                              <div className="flex items-center gap-2">
                                <Crown className="h-4 w-4 text-amber-400" />
                                Pro
                              </div>
                            </SelectItem>
                            <SelectItem value="enterprise">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-purple-400" />
                                Enterprise
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {user.mfaEnabled ? (
                          <Badge variant="outline" className="text-green-500 border-green-500">
                            <Shield className="h-3 w-3 mr-1" />
                            Ativo
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                            Inativo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.isActive ? (
                          <Badge variant="outline" className="text-green-500 border-green-500">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Ativo
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500 border-gray-500">
                            <UserX className="h-3 w-3 mr-1" />
                            Inativo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatLastAccess(user.lastSignedIn)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleUpdateRole(user.id, user.role === "admin" ? "user" : "admin")}
                            >
                              <Key className="h-4 w-4 mr-2" />
                              {user.role === "admin" ? "Remover Admin" : "Tornar Admin"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-xs text-muted-foreground">Alterar Plano</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleUpdatePlan(user.id, "essencial")}>
                              <Zap className="h-4 w-4 mr-2 text-emerald-400" />
                              Essencial
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdatePlan(user.id, "pro")}>
                              <Crown className="h-4 w-4 mr-2 text-amber-400" />
                              Pro
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdatePlan(user.id, "enterprise")}>
                              <Building2 className="h-4 w-4 mr-2 text-purple-400" />
                              Enterprise
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggleActive(user)}>
                              {user.isActive ? (
                                <>
                                  <UserX className="h-4 w-4 mr-2" />
                                  Desativar
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Ativar
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir usuário
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Audit Log */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Audit Log
            </CardTitle>
            <CardDescription>Histórico de alterações no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {auditLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : !auditLogs || auditLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum registro de auditoria
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário ID</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Entidade</TableHead>
                    <TableHead>Data/Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.slice(0, 10).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.userId || "Sistema"}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell className="text-muted-foreground">{log.entity} {log.entityId ? `#${log.entityId}` : ""}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {log.createdAt ? formatDistanceToNow(new Date(log.createdAt), { addSuffix: true, locale: ptBR }) : ""}
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
