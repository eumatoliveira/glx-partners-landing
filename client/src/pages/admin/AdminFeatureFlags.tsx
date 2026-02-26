import AdminLayout from "@/components/AdminLayout";
import { 
  Zap, 
  Plus,
  Search,
  MoreHorizontal,
  Users,
  Globe,
  Lock,
  Trash2,
  Edit,
  Copy
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { MotionPageShell } from "@/animation/components/MotionPageShell";

const featureFlags = [
  { 
    id: 1, 
    key: "novo_dashboard", 
    name: "Novo Dashboard v2", 
    description: "Interface redesenhada do dashboard principal",
    enabled: true, 
    scope: "global",
    percentage: 100,
    createdAt: "15/01/2026",
    updatedAt: "28/01/2026"
  },
  { 
    id: 2, 
    key: "ai_insights", 
    name: "AI Insights", 
    description: "Recomendações baseadas em IA para otimização",
    enabled: true, 
    scope: "beta",
    percentage: 30,
    createdAt: "20/01/2026",
    updatedAt: "30/01/2026"
  },
  { 
    id: 3, 
    key: "dark_mode_v2", 
    name: "Dark Mode v2", 
    description: "Nova paleta de cores para modo escuro",
    enabled: false, 
    scope: "internal",
    percentage: 0,
    createdAt: "25/01/2026",
    updatedAt: "25/01/2026"
  },
  { 
    id: 4, 
    key: "export_pdf_advanced", 
    name: "Exportação PDF Avançada", 
    description: "Relatórios PDF com gráficos e tabelas customizadas",
    enabled: true, 
    scope: "premium",
    percentage: 100,
    createdAt: "10/01/2026",
    updatedAt: "29/01/2026"
  },
  { 
    id: 5, 
    key: "realtime_notifications", 
    name: "Notificações em Tempo Real", 
    description: "Push notifications via WebSocket",
    enabled: true, 
    scope: "global",
    percentage: 100,
    createdAt: "05/01/2026",
    updatedAt: "31/01/2026"
  },
];

const scopeColors: Record<string, string> = {
  global: "bg-green-500/20 text-green-500",
  beta: "bg-blue-500/20 text-blue-500",
  internal: "bg-purple-500/20 text-purple-500",
  premium: "bg-yellow-500/20 text-yellow-500",
  enterprise: "bg-red-500/20 text-red-500",
};

const scopeIcons: Record<string, React.ReactNode> = {
  global: <Globe className="h-3 w-3 mr-1" />,
  beta: <Users className="h-3 w-3 mr-1" />,
  internal: <Lock className="h-3 w-3 mr-1" />,
  premium: <Zap className="h-3 w-3 mr-1" />,
  enterprise: <Lock className="h-3 w-3 mr-1" />,
};

export default function AdminFeatureFlags() {
  const [searchQuery, setSearchQuery] = useState("");
  const [flags, setFlags] = useState(featureFlags);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newFlag, setNewFlag] = useState({
    key: "",
    name: "",
    description: "",
    scope: "internal",
  });

  const filteredFlags = flags.filter(flag => 
    flag.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (id: number) => {
    setFlags(flags.map(flag => 
      flag.id === id ? { ...flag, enabled: !flag.enabled } : flag
    ));
  };

  const handleAddFlag = () => {
    const newId = Math.max(...flags.map(f => f.id)) + 1;
    const now = new Date().toLocaleDateString("pt-BR");
    setFlags([...flags, {
      id: newId,
      key: newFlag.key,
      name: newFlag.name,
      description: newFlag.description,
      enabled: false,
      scope: newFlag.scope,
      percentage: 0,
      createdAt: now,
      updatedAt: now,
    }]);
    setIsAddOpen(false);
    setNewFlag({ key: "", name: "", description: "", scope: "internal" });
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta feature flag?")) {
      setFlags(flags.filter(f => f.id !== id));
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    alert(`Chave "${key}" copiada!`);
  };

  return (
    <AdminLayout>
      <MotionPageShell className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              Feature Flags
            </h1>
            <p className="text-muted-foreground">God Mode - Controle de funcionalidades em tempo real</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Flag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Feature Flag</DialogTitle>
                <DialogDescription>
                  Adicione uma nova flag para controlar funcionalidades.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="key">Chave (key)</Label>
                  <Input 
                    id="key" 
                    value={newFlag.key}
                    onChange={(e) => setNewFlag({...newFlag, key: e.target.value.toLowerCase().replace(/\s/g, '_')})}
                    placeholder="nome_da_feature"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input 
                    id="name" 
                    value={newFlag.name}
                    onChange={(e) => setNewFlag({...newFlag, name: e.target.value})}
                    placeholder="Nome da Feature"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea 
                    id="description" 
                    value={newFlag.description}
                    onChange={(e) => setNewFlag({...newFlag, description: e.target.value})}
                    placeholder="Descrição da funcionalidade..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scope">Escopo</Label>
                  <Select value={newFlag.scope} onValueChange={(v) => setNewFlag({...newFlag, scope: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="beta">Beta</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                      <SelectItem value="global">Global</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddFlag} disabled={!newFlag.key || !newFlag.name}>
                  Criar Flag
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{flags.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ativas</CardTitle>
              <Zap className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{flags.filter(f => f.enabled).length}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inativas</CardTitle>
              <Zap className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-500">{flags.filter(f => !f.enabled).length}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Em Beta</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{flags.filter(f => f.scope === "beta").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Flags Table */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Feature Flags</CardTitle>
                <CardDescription>Ative ou desative funcionalidades instantaneamente</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Feature</TableHead>
                  <TableHead>Escopo</TableHead>
                  <TableHead>Rollout</TableHead>
                  <TableHead>Atualizado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFlags.map((flag) => (
                  <TableRow key={flag.id}>
                    <TableCell>
                      <Switch 
                        checked={flag.enabled}
                        onCheckedChange={() => handleToggle(flag.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{flag.name}</p>
                        <p className="text-sm text-muted-foreground font-mono">{flag.key}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={scopeColors[flag.scope]}>
                        {scopeIcons[flag.scope]}
                        {flag.scope.charAt(0).toUpperCase() + flag.scope.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${flag.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm">{flag.percentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{flag.updatedAt}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleCopyKey(flag.key)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copiar chave
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-500"
                            onClick={() => handleDelete(flag.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
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
      </MotionPageShell>
    </AdminLayout>
  );
}


