import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { LogOut, BarChart3, FileText, Users, Settings, TrendingUp, Calendar, Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [, setLocation] = useLocation();

  // Redireciona para login se não estiver autenticado
  if (!loading && !isAuthenticated) {
    setLocation("/login");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const quickActions = [
    { icon: BarChart3, title: "Dashboards", description: "Visualize seus KPIs em tempo real", color: "bg-blue-500/10 text-blue-500" },
    { icon: FileText, title: "Relatórios", description: "Acesse relatórios de performance", color: "bg-green-500/10 text-green-500" },
    { icon: Users, title: "Equipe", description: "Gerencie sua equipe", color: "bg-purple-500/10 text-purple-500" },
    { icon: Calendar, title: "Agenda", description: "Próximas reuniões e eventos", color: "bg-orange-500/10 text-orange-500" },
  ];

  const stats = [
    { label: "Faturamento Mensal", value: "R$ 450.000", change: "+12%", positive: true },
    { label: "Margem de Lucro", value: "28%", change: "+3%", positive: true },
    { label: "Novos Pacientes", value: "156", change: "+8%", positive: true },
    { label: "Taxa de Retorno", value: "72%", change: "-2%", positive: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <img src="/images/logo-white-on-black.jpg" alt="GLX Partners" className="h-10 mix-blend-screen" />
            <span className="text-xl font-bold text-white">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3 pl-4 border-l border-border/40">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.name || "Usuário"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-red-500"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Bem-vindo de volta, {user?.name?.split(" ")[0] || "Parceiro"}!
          </h1>
          <p className="text-muted-foreground">
            Aqui está um resumo da performance da sua clínica.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-secondary/30 border-border/40">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                    <span className={`text-sm font-medium flex items-center gap-1 ${stat.positive ? "text-green-500" : "text-red-500"}`}>
                      <TrendingUp className={`h-4 w-4 ${!stat.positive && "rotate-180"}`} />
                      {stat.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-white mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <Card className="bg-secondary/30 border-border/40 hover:border-primary/50 transition-colors cursor-pointer group">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <Card className="bg-primary/10 border-primary/30">
          <CardHeader>
            <CardTitle className="text-white">Em Breve: Novos Recursos</CardTitle>
            <CardDescription className="text-muted-foreground">
              Estamos trabalhando em novos recursos exclusivos para parceiros GLX, incluindo:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Dashboards interativos em tempo real
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Relatórios automatizados por e-mail
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Biblioteca de materiais exclusivos
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Chat de suporte direto com consultores
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
