import AdminLayout from "@/components/AdminLayout";
import { 
  Users, 
  Shield,
  Search,
  Plus,
  MoreHorizontal,
  UserCheck,
  UserX,
  Key,
  LogIn,
  History,
  Download
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

// Mock data
const usuarios = [
  { id: 1, nome: "Dr. Carlos Silva", email: "carlos@clinicasaude.com", role: "admin", mfa: true, status: "ativo", ultimoAcesso: "Agora" },
  { id: 2, nome: "Ana Beatriz", email: "ana@clinicasaude.com", role: "editor", mfa: true, status: "ativo", ultimoAcesso: "2h atrás" },
  { id: 3, nome: "Roberto Santos", email: "roberto@bemestar.com", role: "viewer", mfa: false, status: "ativo", ultimoAcesso: "1 dia atrás" },
  { id: 4, nome: "Maria Oliveira", email: "maria@centrovida.com", role: "financeiro", mfa: true, status: "ativo", ultimoAcesso: "3h atrás" },
  { id: 5, nome: "João Pedro", email: "joao@dermaplus.com", role: "viewer", mfa: false, status: "inativo", ultimoAcesso: "30 dias atrás" },
  { id: 6, nome: "Fernanda Costa", email: "fernanda@ortopedica.com", role: "editor", mfa: true, status: "ativo", ultimoAcesso: "5h atrás" },
];

const auditLogs = [
  { id: 1, usuario: "Dr. Carlos Silva", acao: "Alterou role de usuário", alvo: "Ana Beatriz", data: "31/01/2026 14:32" },
  { id: 2, usuario: "Ana Beatriz", acao: "Criou novo usuário", alvo: "Roberto Santos", data: "31/01/2026 11:15" },
  { id: 3, usuario: "Dr. Carlos Silva", acao: "Ativou feature flag", alvo: "novo_dashboard", data: "30/01/2026 18:45" },
  { id: 4, usuario: "Maria Oliveira", acao: "Exportou relatório", alvo: "Financeiro Jan/2026", data: "30/01/2026 16:20" },
  { id: 5, usuario: "Dr. Carlos Silva", acao: "Desativou usuário", alvo: "João Pedro", data: "29/01/2026 09:10" },
];

const roleColors: Record<string, string> = {
  admin: "bg-red-500/20 text-red-500",
  editor: "bg-blue-500/20 text-blue-500",
  viewer: "bg-gray-500/20 text-gray-400",
  financeiro: "bg-green-500/20 text-green-500",
};

export default function AdminUsuarios() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({ nome: "", email: "", role: "viewer" });

  const filteredUsers = usuarios.filter(user => {
    const matchesSearch = user.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const mfaStats = {
    total: usuarios.length,
    comMfa: usuarios.filter(u => u.mfa).length,
    semMfa: usuarios.filter(u => !u.mfa).length,
  };

  const handleImpersonate = (user: typeof usuarios[0]) => {
    alert(`Logando como ${user.nome}...`);
  };

  const handleAddUser = () => {
    alert(`Criando usuário: ${newUser.nome} (${newUser.email}) com role ${newUser.role}`);
    setIsAddUserOpen(false);
    setNewUser({ nome: "", email: "", role: "viewer" });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Controle de Acessos</h1>
            <p className="text-muted-foreground">Gestão de usuários e segurança (RBAC)</p>
          </div>
          <div className="flex items-center gap-2">
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
                    <Label htmlFor="nome">Nome</Label>
                    <Input 
                      id="nome" 
                      value={newUser.nome}
                      onChange={(e) => setNewUser({...newUser, nome: e.target.value})}
                      placeholder="Nome completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Permissão</Label>
                    <Select value={newUser.role} onValueChange={(v) => setNewUser({...newUser, role: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="financeiro">Financeiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancelar</Button>
                  <Button onClick={handleAddUser}>Criar Usuário</Button>
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
              <div className="text-2xl font-bold">{usuarios.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Com MFA Ativo</CardTitle>
              <Shield className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{mfaStats.comMfa}</div>
              <p className="text-xs text-muted-foreground">{Math.round(mfaStats.comMfa / mfaStats.total * 100)}% do total</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sem MFA</CardTitle>
              <Shield className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{mfaStats.semMfa}</div>
              <p className="text-xs text-muted-foreground">Requer atenção</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
              <Key className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usuarios.filter(u => u.role === "admin").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Usuários</CardTitle>
                <CardDescription>Gerencie permissões e acessos</CardDescription>
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
                    <SelectValue placeholder="Filtrar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Permissão</TableHead>
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
                            {user.nome.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user.nome}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={roleColors[user.role]}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.mfa ? (
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
                      {user.status === "ativo" ? (
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
                    <TableCell className="text-muted-foreground">{user.ultimoAcesso}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleImpersonate(user)}>
                            <LogIn className="h-4 w-4 mr-2" />
                            Logar como usuário
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Key className="h-4 w-4 mr-2" />
                            Alterar permissão
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="h-4 w-4 mr-2" />
                            Resetar MFA
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">
                            <UserX className="h-4 w-4 mr-2" />
                            Desativar usuário
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Alvo</TableHead>
                  <TableHead>Data/Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.usuario}</TableCell>
                    <TableCell>{log.acao}</TableCell>
                    <TableCell className="text-muted-foreground">{log.alvo}</TableCell>
                    <TableCell className="text-muted-foreground">{log.data}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
