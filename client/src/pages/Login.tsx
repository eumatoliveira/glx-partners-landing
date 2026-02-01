import { useState, useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function Login() {
  const { language } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const { user, isAuthenticated, loading, refresh } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
  const utils = trpc.useUtils();
  const pollCountRef = useRef(0);

  // Polling para verificar se o cookie foi setado corretamente
  useEffect(() => {
    if (!pendingRedirect) return;

    const pollAuth = async () => {
      pollCountRef.current += 1;
      console.log("[Login] Polling auth status, attempt:", pollCountRef.current);
      
      try {
        // Forçar uma nova requisição para auth.me
        await utils.auth.me.invalidate();
        const result = await utils.auth.me.fetch();
        
        console.log("[Login] Poll result:", result);
        
        if (result && result.email) {
          console.log("[Login] Auth confirmed, redirecting to:", pendingRedirect);
          // Usar window.location.href para um redirecionamento completo
          window.location.href = pendingRedirect;
          return;
        }
      } catch (error) {
        console.error("[Login] Poll error:", error);
      }

      // Se ainda não autenticado após 10 tentativas, tentar redirecionar mesmo assim
      if (pollCountRef.current >= 10) {
        console.log("[Login] Max polls reached, forcing redirect to:", pendingRedirect);
        window.location.href = pendingRedirect;
        return;
      }
    };

    const timer = setTimeout(pollAuth, 300);
    return () => clearTimeout(timer);
  }, [pendingRedirect, utils.auth.me, pollCountRef.current]);

  const loginMutation = trpc.emailAuth.login.useMutation({
    onSuccess: async (data) => {
      console.log("[Login] Login successful:", data);
      toast.success("Login realizado com sucesso!");
      setLoginSuccess(true);
      setIsRedirecting(true);
      
      // Determinar URL de destino
      const targetUrl = data.user.role === "admin" ? "/admin" : "/dashboard";
      console.log("[Login] Target URL:", targetUrl);
      
      // Invalidar o cache e iniciar o polling
      await utils.auth.me.invalidate();
      pollCountRef.current = 0;
      setPendingRedirect(targetUrl);
    },
    onError: (error) => {
      console.error("[Login] Login error:", error);
      toast.error(error.message || "Erro ao fazer login");
      setIsRedirecting(false);
      setLoginSuccess(false);
      setPendingRedirect(null);
    },
  });

  const content = {
    pt: {
      title: "Acesso Exclusivo para",
      titleHighlight: "Parceiros.",
      subtitle: "Acesse seus dashboards, relatórios de performance e materiais exclusivos da metodologia GLX.",
      back: "Voltar para Home",
      backMobile: "Voltar",
      email: "E-mail Corporativo",
      emailPlaceholder: "seu@email.com",
      password: "Senha",
      passwordPlaceholder: "••••••••",
      remember: "Lembrar-me",
      forgot: "Esqueceu a senha?",
      submit: "Acessar Plataforma",
      submitting: "Entrando...",
      redirecting: "Redirecionando...",
      notClient: "Ainda não é cliente?",
      schedule: "Agende um diagnóstico",
      plans: "Conheça nossos planos",
      validation: {
        email: "E-mail inválido",
        password: "A senha deve ter no mínimo 6 caracteres"
      }
    },
    en: {
      title: "Exclusive Access for",
      titleHighlight: "Partners.",
      subtitle: "Access your dashboards, performance reports, and exclusive GLX methodology materials.",
      back: "Back to Home",
      backMobile: "Back",
      email: "Corporate Email",
      emailPlaceholder: "your@email.com",
      password: "Password",
      passwordPlaceholder: "••••••••",
      remember: "Remember me",
      forgot: "Forgot password?",
      submit: "Access Platform",
      submitting: "Logging in...",
      redirecting: "Redirecting...",
      notClient: "Not a client yet?",
      schedule: "Schedule a diagnosis",
      plans: "See our plans",
      validation: {
        email: "Invalid email",
        password: "Password must be at least 6 characters"
      }
    },
    es: {
      title: "Acceso Exclusivo para",
      titleHighlight: "Socios.",
      subtitle: "Accede a tus dashboards, informes de rendimiento y materiales exclusivos de la metodología GLX.",
      back: "Volver al Inicio",
      backMobile: "Volver",
      email: "E-mail Corporativo",
      emailPlaceholder: "tu@email.com",
      password: "Contraseña",
      passwordPlaceholder: "••••••••",
      remember: "Recordarme",
      forgot: "¿Olvidaste la contraseña?",
      submit: "Acceder a la Plataforma",
      submitting: "Entrando...",
      redirecting: "Redirigiendo...",
      notClient: "¿Aún no eres cliente?",
      schedule: "Agenda un diagnóstico",
      plans: "Conoce nuestros planes",
      validation: {
        email: "E-mail inválido",
        password: "La contraseña debe tener al menos 6 caracteres"
      }
    }
  };

  const t = content[language];

  const loginSchema = z.object({
    email: z.string().email({ message: t.validation.email }),
    password: z.string().min(6, { message: t.validation.password }),
  });

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Se o usuário já está autenticado, redireciona para o dashboard apropriado
  useEffect(() => {
    if (!loading && isAuthenticated && user && !loginSuccess && !isRedirecting && !pendingRedirect) {
      console.log("[Login] User already authenticated, redirecting...", user);
      setIsRedirecting(true);
      const targetUrl = user.role === "admin" ? "/admin" : "/dashboard";
      // Usar um pequeno delay para evitar problemas de render
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 100);
    }
  }, [isAuthenticated, user, loading, loginSuccess, isRedirecting, pendingRedirect]);

  function onSubmit(data: LoginFormValues) {
    console.log("[Login] Submitting login form:", data.email);
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
  }

  // Mostra loading enquanto verifica autenticação ou está redirecionando
  if (loading || isRedirecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{isRedirecting ? t.redirecting : "Verificando..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Lado Esquerdo - Imagem/Branding (Desktop) */}
      <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-40">
           <img 
            src="/images/ImagemInicial.png" 
            alt="GLX Partners Office" 
            className="w-full h-full object-cover grayscale"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        
        <div className="relative z-10 p-12 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img src="/images/logo-white-on-black.jpg" alt="GLX Partners" className="h-40 mb-10 mix-blend-screen" style={{width: '180px', height: '180px'}} />
            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
              {t.title} <span className="text-primary">{t.titleHighlight}</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {t.subtitle}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-8 relative bg-background">
        {/* Mobile Header com Logo */}
        <div className="lg:hidden w-full flex flex-col items-center mb-8">
          <img src="/images/logo-white-on-black.jpg" alt="GLX Partners" className="h-24 mb-6 mix-blend-screen" />
        </div>
        <Button 
          variant="ghost" 
          className="absolute top-4 left-4 md:top-8 md:left-8 text-muted-foreground hover:text-white z-20"
          onClick={() => window.location.href = "/"}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> <span className="hidden md:inline">{t.back}</span><span className="md:hidden">{t.backMobile}</span>
        </Button>

        <div className="w-full max-w-md space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">{t.email}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder={t.emailPlaceholder} 
                          className="pl-10 bg-secondary/50 border-border/50 text-white placeholder:text-muted-foreground/50 focus:border-primary" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">{t.password}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder={t.passwordPlaceholder} 
                          className="pl-10 pr-10 bg-secondary/50 border-border/50 text-white placeholder:text-muted-foreground/50 focus:border-primary" 
                          {...field} 
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-white focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" className="border-white/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                  >
                    {t.remember}
                  </label>
                </div>
                <a href="#" className="text-primary hover:underline font-medium">{t.forgot}</a>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg"
                disabled={loginMutation.isPending || isRedirecting}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.submitting}
                  </>
                ) : isRedirecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.redirecting}
                  </>
                ) : (
                  t.submit
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm text-muted-foreground mt-8 space-y-2">
            <p>
              {t.notClient} <a href="http://www.calendly.com/glxpartners" target="_blank" rel="noopener noreferrer" className="text-white hover:underline font-medium">{t.schedule}</a>
            </p>
            <p>
              <a href="/planos" className="text-primary hover:underline font-medium">{t.plans}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
