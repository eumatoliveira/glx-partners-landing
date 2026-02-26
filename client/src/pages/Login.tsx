import { useState, useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { m } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { GlowPulse } from "@/animation/components/GlowPulse";
import { TypingText } from "@/animation/components/TypingText";
import { ScrollWordHighlight } from "@/animation/components/ScrollWordHighlight";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";
import { useParallaxScene } from "@/animation/hooks/useParallaxScene";
import { hoverLift, tapPress } from "@/animation/config/motionPresets";
import { cn } from "@/lib/utils";
import {
  shouldEnableGlowPulse,
  shouldEnableHoverMotion,
  shouldEnableParallax,
  shouldEnableTypingText,
} from "@/animation/utils/perfGuards";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function Login() {
  const { language, setLanguage } = useLanguage();
  const capabilities = useMotionCapabilities();
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Função de redirecionamento separada para evitar problemas de render
  const redirectToAdmin = useCallback(() => {
    console.log("[Login] Redirecting to /admin...");
    window.location.replace("/admin");
  }, []);

  const redirectToDashboard = useCallback(() => {
    console.log("[Login] Redirecting to /dashboard...");
    window.location.replace("/dashboard");
  }, []);

  const loginMutation = trpc.emailAuth.login.useMutation({
    onSuccess: (data) => {
      console.log("[Login] Login successful:", data);
      toast.success("Login realizado com sucesso!");
      setLoginSuccess(true);
      setIsRedirecting(true);
      
      // Armazenar a role para o redirecionamento
      const targetUrl = data.user.role === "admin" ? "/admin" : "/dashboard";
      console.log("[Login] Target URL:", targetUrl);
      
      // Usar setTimeout para garantir que o cookie foi setado
      setTimeout(() => {
        console.log("[Login] Executing redirect to:", targetUrl);
        window.location.replace(targetUrl);
      }, 500);
    },
    onError: (error) => {
      console.error("[Login] Login error:", error);
      toast.error(error.message || "Erro ao fazer login");
      setIsRedirecting(false);
      setLoginSuccess(false);
    },
  });

  const content = {
    pt: {
      brand: "GLX Partners",
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
      brand: "GLX Partners",
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
      brand: "GLX Partners",
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

  const emailInput = form.watch("email") ?? "";
  const passwordInput = form.watch("password") ?? "";
  const hasInputActivity = emailInput.trim().length > 0 || passwordInput.length > 0;
  const typingProgressRaw = Math.min(1, (emailInput.trim().length / 24) * 0.55 + (passwordInput.length / 12) * 0.45);
  const typingProgress = prefersReducedMotion ? (hasInputActivity ? 1 : 0) : typingProgressRaw;
  const videoRevealProgress = hasInputActivity ? typingProgress : 0;
  const videoLayerOpacity = videoFailed ? 0 : videoRevealProgress;
  const videoBlurPx = Math.max(0, 16 - videoRevealProgress * 16);
  const videoFilter = `brightness(${(0.35 + videoRevealProgress * 0.85).toFixed(2)}) saturate(${(0.45 + videoRevealProgress * 0.75).toFixed(2)}) contrast(${(0.8 + videoRevealProgress * 0.35).toFixed(2)}) blur(${videoBlurPx.toFixed(1)}px)`;
  const imageFilter = `brightness(${(0.3 + (1 - videoRevealProgress) * 0.12).toFixed(2)}) saturate(0.55) contrast(0.9) blur(${(2 + (1 - videoRevealProgress) * 2).toFixed(1)}px)`;
  const blackOverlayOpacity = Math.max(0.06, 0.72 - videoRevealProgress * 0.62);
  const gradientOverlayOpacity = Math.max(0.14, 0.82 - videoRevealProgress * 0.68);
  const mediaTransitionClass = prefersReducedMotion
    ? "transition-none"
    : "transition-[opacity,filter,transform] duration-700 ease-out";
  const parallaxEnabled = shouldEnableParallax(capabilities);
  const { xSoft, ySoft } = useParallaxScene({
    target: leftPanelRef,
    offset: ["start start", "end start"],
    motionLevel: capabilities.motionLevel,
    enabled: parallaxEnabled,
  });
  const hoverEnabled = shouldEnableHoverMotion(capabilities);
  const glowEnabled = shouldEnableGlowPulse(capabilities);
  const typingEnabled = shouldEnableTypingText(capabilities);
  const ctaHover = hoverEnabled ? hoverLift(capabilities.motionLevel) : undefined;
  const ctaTap = tapPress(capabilities.motionLevel);

  // Se o usuário já está autenticado, redireciona para o dashboard apropriado
  useEffect(() => {
    if (!loading && isAuthenticated && user && !loginSuccess) {
      console.log("[Login] User already authenticated, redirecting...", user);
      setIsRedirecting(true);
      // Usa setTimeout para evitar problemas de render
      const timer = setTimeout(() => {
        if (user.role === "admin") {
          redirectToAdmin();
        } else {
          redirectToDashboard();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, loading, loginSuccess, redirectToAdmin, redirectToDashboard]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(mediaQuery.matches);
    onChange();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    }

    mediaQuery.addListener(onChange);
    return () => mediaQuery.removeListener(onChange);
  }, []);

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
      <div ref={leftPanelRef} className="hidden lg:flex w-1/2 bg-black relative overflow-hidden items-center justify-center">
        <m.div className="absolute inset-0 pointer-events-none" style={{ x: xSoft, y: ySoft }}>
          <img
            src="/ImagemInicial.png"
            alt="GLX Partners Office"
            className={cn("w-full h-full object-cover", mediaTransitionClass)}
            style={{
              filter: imageFilter,
              transform: `scale(${1.03 - videoRevealProgress * 0.02})`,
            }}
          />

          {!videoFailed ? (
            <video
              className={cn("absolute inset-0 w-full h-full object-cover", mediaTransitionClass)}
              style={{
                opacity: videoLayerOpacity,
                filter: videoFilter,
                transform: `scale(${1 + videoRevealProgress * 0.04})`,
              }}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/ImagemInicial.png"
              onError={() => setVideoFailed(true)}
            >
              <source src="/videos/login-typing-background.mp4" type="video/mp4" />
            </video>
          ) : null}
        </m.div>
        <div className="absolute inset-0 bg-black transition-opacity duration-500" style={{ opacity: blackOverlayOpacity }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent transition-opacity duration-500" style={{ opacity: gradientOverlayOpacity }} />
        <div className="absolute inset-x-10 top-10 h-[1px] bg-gradient-to-r from-transparent via-orange-400/45 to-transparent pointer-events-none" />
        <div className="absolute inset-x-10 bottom-10 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent pointer-events-none" />
        
        <div className="relative z-10 p-12 max-w-lg">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img src="/images/logo-transparent.png" alt="GLX Partners" className="h-32 mb-8 object-contain" />
            <p className="text-white/90 text-lg font-semibold mb-2">{t.brand}</p>
            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
              {typingEnabled ? (
                <>
                  <TypingText text={t.title} stepMs={22} className="text-white" />
                  {" "}
                  <TypingText text={t.titleHighlight} stepMs={22} startDelayMs={160} className="text-primary" />
                </>
              ) : (
                <>
                  {t.title} <span className="text-primary">{t.titleHighlight}</span>
                </>
              )}
            </h1>
            <ScrollWordHighlight
              text={t.subtitle}
              className="text-lg"
              wordClassName="text-zinc-600"
              activeWordClassName="text-zinc-500"
            />
          </m.div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-8 relative bg-background">
        {/* Mobile Header com Logo */}
        <div className="lg:hidden w-full flex flex-col items-center mb-8">
          <img src="/images/logo-transparent.png" alt="GLX Partners" className="h-20 mb-4 object-contain" />
          <p className="text-white/90 text-base font-semibold">GLX Partners</p>
        </div>
        <Button 
          variant="ghost" 
          className="absolute top-4 left-4 md:top-8 md:left-8 z-20 rounded-xl border border-orange-400/35 bg-black/80 text-white shadow-[0_0_0_1px_rgba(249,115,22,0.14),0_0_18px_rgba(249,115,22,0.18)] backdrop-blur-sm transition-all duration-200 hover:border-orange-300/60 hover:bg-black/90 hover:text-white hover:shadow-[0_0_0_1px_rgba(251,146,60,0.24),0_0_28px_rgba(249,115,22,0.35)] focus-visible:ring-2 focus-visible:ring-orange-300/40"
          onClick={() => window.location.href = "/"}
        >
          <ArrowLeft className="mr-2 h-4 w-4 text-orange-200" /> <span className="hidden md:inline">{t.back}</span><span className="md:hidden">{t.backMobile}</span>
        </Button>

        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20">
          <div className="inline-flex items-center rounded-xl border border-orange-400/25 bg-black/80 p-1 shadow-[0_0_0_1px_rgba(249,115,22,0.10),0_0_16px_rgba(249,115,22,0.12)] backdrop-blur-sm">
            {([
              { code: "pt", label: "Português" },
              { code: "es", label: "Español" },
              { code: "en", label: "English" },
            ] as const).map((option) => (
              <button
                key={option.code}
                type="button"
                onClick={() => setLanguage(option.code)}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all md:px-3 md:text-sm",
                  language === option.code
                    ? "bg-[#e67e22] text-white shadow-[0_0_18px_rgba(230,126,34,0.35)]"
                    : "text-slate-300 hover:bg-white/10 hover:text-white",
                )}
                aria-pressed={language === option.code}
                title={option.label}
              >
                <span className="hidden sm:inline">{option.label}</span>
                <span className="sm:hidden uppercase">{option.code}</span>
              </button>
            ))}
          </div>
        </div>

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
                      <m.div whileTap={ctaTap} className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        {/*
                          react-hook-form injects onBlur in `field`; keep it and append focus reset
                          to avoid duplicate onBlur props.
                        */}
                        {(() => {
                          const { onBlur, ...fieldProps } = field;
                          return (
                            <Input
                              placeholder={t.emailPlaceholder}
                              className={cn(
                                "pl-10 bg-secondary/50 text-white placeholder:text-muted-foreground/50 transition-all duration-200",
                                focusedField === "email"
                                  ? "border-primary shadow-[0_0_0_1px_rgba(249,115,22,0.35),0_0_18px_rgba(249,115,22,0.25)]"
                                  : "border-border/50 focus:border-primary",
                              )}
                              onFocus={() => setFocusedField("email")}
                              onBlur={() => {
                                onBlur();
                                setFocusedField(null);
                              }}
                              {...fieldProps}
                            />
                          );
                        })()}
                      </m.div>
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
                      <m.div whileTap={ctaTap} className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        {(() => {
                          const { onBlur, ...fieldProps } = field;
                          return (
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder={t.passwordPlaceholder}
                              className={cn(
                                "pl-10 pr-10 bg-secondary/50 text-white placeholder:text-muted-foreground/50 transition-all duration-200",
                                focusedField === "password"
                                  ? "border-primary shadow-[0_0_0_1px_rgba(249,115,22,0.35),0_0_18px_rgba(249,115,22,0.25)]"
                                  : "border-border/50 focus:border-primary",
                              )}
                              onFocus={() => setFocusedField("password")}
                              onBlur={() => {
                                onBlur();
                                setFocusedField(null);
                              }}
                              {...fieldProps}
                            />
                          );
                        })()}
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
                      </m.div>
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

              <m.div whileHover={ctaHover} whileTap={ctaTap}>
                <GlowPulse intensity="strong" disabled={!glowEnabled}>
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
                </GlowPulse>
              </m.div>
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


