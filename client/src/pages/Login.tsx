import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLocation } from "wouter";
import { ArrowLeft, Lock, User } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    // Simulação de login
    setTimeout(() => {
      console.log(data);
      setIsLoading(false);
      alert("Login realizado com sucesso! (Simulação)");
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Lado Esquerdo - Imagem/Branding */}
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
            <img src="/images/logo-white-on-black.jpg" alt="GLX Partners" className="h-24 mb-8 mix-blend-screen" />
            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
              Acesso Exclusivo para <span className="text-primary">Parceiros</span>.
            </h1>
            <p className="text-muted-foreground text-lg">
              Acesse seus dashboards, relatórios de performance e materiais exclusivos da metodologia GLX.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative">
        <Button 
          variant="ghost" 
          className="absolute top-8 left-8 text-muted-foreground hover:text-white"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Home
        </Button>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white">Área de Membros</h2>
            <p className="text-muted-foreground mt-2">Entre com suas credenciais para continuar.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">E-mail Corporativo</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="seu@email.com" 
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
                    <FormLabel className="text-white">Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10 bg-secondary/50 border-border/50 text-white placeholder:text-muted-foreground/50 focus:border-primary" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between text-sm">
                <a href="#" className="text-primary hover:underline font-medium">Esqueceu a senha?</a>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Acessar Plataforma"}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm text-muted-foreground mt-8 space-y-2">
            <p>
              Ainda não é cliente? <a href="http://www.calendly.com/glxpartners" target="_blank" rel="noopener noreferrer" className="text-white hover:underline font-medium">Agende um diagnóstico</a>
            </p>
            <p>
              <a href="/#what" className="text-primary hover:underline font-medium">Conheça nossos planos</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
