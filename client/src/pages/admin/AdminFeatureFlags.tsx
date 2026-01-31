import { useAuth } from "@/_core/hooks/useAuth";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { 
  Flag, 
  Plus, 
  Trash2, 
  Zap,
  Loader2,
  Power,
  PowerOff
} from "lucide-react";
import { Redirect } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminFeatureFlags() {
  const { user, loading: authLoading } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newFlag, setNewFlag] = useState({
    name: "",
    description: "",
    enabled: false
  });
  
  const { data: flags, isLoading, refetch } = trpc.admin.getFeatureFlags.useQuery();
  
  const createMutation = trpc.admin.createFeatureFlag.useMutation({
    onSuccess: () => {
      toast.success("Feature flag criada com sucesso!");
      setIsCreateOpen(false);
      setNewFlag({ name: "", description: "", enabled: false });
      refetch();
    },
    onError: (error) => {
      toast.error("Erro ao criar feature flag: " + error.message);
    }
  });

  const updateMutation = trpc.admin.updateFeatureFlag.useMutation({
    onSuccess: () => {
      toast.success("Feature flag atualizada!");
      refetch();
    },
    onError: (error) => {
      toast.error("Erro ao atualizar: " + error.message);
    }
  });

  const deleteMutation = trpc.admin.deleteFeatureFlag.useMutation({
    onSuccess: () => {
      toast.success("Feature flag removida!");
      refetch();
    },
    onError: (error) => {
      toast.error("Erro ao remover: " + error.message);
    }
  });

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

  const handleCreate = () => {
    if (!newFlag.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }
    createMutation.mutate(newFlag);
  };

  const handleToggle = (id: number, currentEnabled: boolean) => {
    updateMutation.mutate({ id, enabled: !currentEnabled });
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover esta feature flag?")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-400" />
              God Mode - Feature Flags
            </h1>
            <p className="text-muted-foreground">Ative ou desative funcionalidades para clientes específicos</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nova Feature Flag
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#111111] border-white/10">
              <DialogHeader>
                <DialogTitle>Criar Feature Flag</DialogTitle>
                <DialogDescription>
                  Adicione uma nova flag para controlar funcionalidades do sistema
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Flag</Label>
                  <Input
                    id="name"
                    placeholder="ex: new_dashboard_v2"
                    value={newFlag.name}
                    onChange={(e) => setNewFlag({ ...newFlag, name: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o que esta flag controla..."
                    value={newFlag.description}
                    onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enabled">Ativar imediatamente</Label>
                  <Switch
                    id="enabled"
                    checked={newFlag.enabled}
                    onCheckedChange={(checked) => setNewFlag({ ...newFlag, enabled: checked })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreate}
                  disabled={createMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Criar Flag
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <Flag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Flags</p>
                <p className="text-2xl font-bold">{flags?.length ?? 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/20">
                <Power className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ativas</p>
                <p className="text-2xl font-bold">
                  {flags?.filter(f => f.enabled).length ?? 0}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gray-500/20">
                <PowerOff className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inativas</p>
                <p className="text-2xl font-bold">
                  {flags?.filter(f => !f.enabled).length ?? 0}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Flags List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : flags?.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-12 text-center">
              <Flag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma Feature Flag</h3>
              <p className="text-muted-foreground mb-4">
                Crie sua primeira feature flag para começar a controlar funcionalidades
              </p>
              <Button onClick={() => setIsCreateOpen(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Criar Feature Flag
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flags?.map((flag) => (
              <Card 
                key={flag.id} 
                className={cn(
                  "border transition-all duration-200",
                  flag.enabled 
                    ? "bg-green-500/5 border-green-500/30 hover:border-green-500/50" 
                    : "bg-white/5 border-white/10 hover:border-white/20"
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        flag.enabled ? "bg-green-400" : "bg-gray-500"
                      )} />
                      <CardTitle className="text-base font-mono">{flag.name}</CardTitle>
                    </div>
                    <Switch
                      checked={flag.enabled}
                      onCheckedChange={() => handleToggle(flag.id, flag.enabled)}
                      disabled={updateMutation.isPending}
                    />
                  </div>
                  {flag.description && (
                    <CardDescription className="mt-2">
                      {flag.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Criada em {new Date(flag.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => handleDelete(flag.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
