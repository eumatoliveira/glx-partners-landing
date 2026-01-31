import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { LogOut, BarChart3, FileText, Users, Settings, TrendingUp, Calendar, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

export default function Dashboard() {
  const { language } = useLanguage();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [, setLocation] = useLocation();

  const content = {
    pt: {
      loading: "Carregando...",
      welcome: "Bem-vindo de volta,",
      partner: "Parceiro",
      summary: "Aqui está um resumo da performance da sua clínica.",
      quickAccess: "Acesso Rápido",
      user: "Usuário",
      stats: {
        revenue: "Faturamento Mensal",
        margin: "Margem de Lucro",
        patients: "Novos Pacientes",
        returnRate: "Taxa de Retorno"
      },
      actions: [
        { title: "Dashboards", description: "Visualize seus KPIs em tempo real" },
        { title: "Relatórios", description: "Acesse relatórios de performance" },
        { title: "Equipe", description: "Gerencie sua equipe" },
        { title: "Agenda", description: "Próximas reuniões e eventos" }
      ],
      comingSoon: {
        title: "Em Breve: Novos Recursos",
        description: "Estamos trabalhando em novos recursos exclusivos para parceiros GLX, incluindo:",
        features: [
          "Dashboards interativos em tempo real",
          "Relatórios automatizados por e-mail",
          "Biblioteca de materiais exclusivos",
          "Chat de suporte direto com consultores"
        ]
      }
    },
    en: {
      loading: "Loading...",
      welcome: "Welcome back,",
      partner: "Partner",
      summary: "Here's a summary of your clinic's performance.",
      quickAccess: "Quick Access",
      user: "User",
      stats: {
        revenue: "Monthly Revenue",
        margin: "Profit Margin",
        patients: "New Patients",
        returnRate: "Return Rate"
      },
      actions: [
        { title: "Dashboards", description: "View your KPIs in real time" },
        { title: "Reports", description: "Access performance reports" },
        { title: "Team", description: "Manage your team" },
        { title: "Calendar", description: "Upcoming meetings and events" }
      ],
      comingSoon: {
        title: "Coming Soon: New Features",
        description: "We're working on new exclusive features for GLX partners, including:",
        features: [
          "Real-time interactive dashboards",
          "Automated email reports",
          "Exclusive materials library",
          "Direct support chat with consultants"
        ]
      }
    },
    es: {
      loading: "Cargando...",
      welcome: "Bienvenido de vuelta,",
      partner: "Socio",
      summary: "Aquí tienes un resumen del rendimiento de tu clínica.",
      quickAccess: "Acceso Rápido",
      user: "Usuario",
      stats: {
        revenue: "Facturación Mensual",
        margin: "Margen de Ganancia",
        patients: "Nuevos Pacientes",
        returnRate: "Tasa de Retorno"
      },
      actions: [
        { title: "Dashboards", description: "Visualiza tus KPIs en tiempo real" },
        { title: "Informes", description: "Accede a informes de rendimiento" },
        { title: "Equipo", description: "Gestiona tu equipo" },
        { title: "Agenda", description: "Próximas reuniones y eventos" }
      ],
      comingSoon: {
        title: "Próximamente: Nuevas Funciones",
        description: "Estamos trabajando en nuevas funciones exclusivas para socios GLX, incluyendo:",
        features: [
          "Dashboards interactivos en tiempo real",
          "Informes automatizados por e-mail",
          "Biblioteca de materiales exclusivos",
          "Chat de soporte directo con consultores"
        ]
      }
    }
  };

  const t = content[language];

  // Redireciona para login se não estiver autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [loading, isAuthenticated, setLocation]);

  // Retorna null enquanto verifica autenticação ou se não autenticado
  if (!loading && !isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const quickActions = [
    { icon: BarChart3, title: t.actions[0].title, description: t.actions[0].description, color: "bg-blue-500/10 text-blue-500" },
    { icon: FileText, title: t.actions[1].title, description: t.actions[1].description, color: "bg-green-500/10 text-green-500" },
    { icon: Users, title: t.actions[2].title, description: t.actions[2].description, color: "bg-purple-500/10 text-purple-500" },
    { icon: Calendar, title: t.actions[3].title, description: t.actions[3].description, color: "bg-orange-500/10 text-orange-500" },
  ];

  const stats = [
    { label: t.stats.revenue, value: "R$ 450.000", change: "+12%", positive: true },
    { label: t.stats.margin, value: "28%", change: "+3%", positive: true },
    { label: t.stats.patients, value: "156", change: "+8%", positive: true },
    { label: t.stats.returnRate, value: "72%", change: "-2%", positive: false },
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
                <p className="text-sm font-medium text-white">{user?.name || t.user}</p>
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
            {t.welcome} {user?.name?.split(" ")[0] || t.partner}!
          </h1>
          <p className="text-muted-foreground">
            {t.summary}
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
        <h2 className="text-xl font-bold text-white mb-4">{t.quickAccess}</h2>
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
            <CardTitle className="text-white">{t.comingSoon.title}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {t.comingSoon.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
              {t.comingSoon.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
