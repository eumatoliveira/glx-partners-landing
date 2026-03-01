import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, m } from "framer-motion";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type ForgotPasswordFormValues = {
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const forgotPasswordSchema = z
  .object({
    email: z.string().email("Informe um e-mail válido"),
    oldPassword: z.string().min(6, "A senha antiga deve ter no mínimo 6 caracteres"),
    newPassword: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme a nova senha"),
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "A nova senha deve ser diferente da senha antiga",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "A confirmação da senha não confere",
    path: ["confirmPassword"],
  });

export default function ForgotPassword() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(2);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const recoverPasswordMutation = trpc.emailAuth.recoverPassword.useMutation({
    onSuccess: () => {
      toast.success("Senha atualizada com sucesso");
      setIsSuccess(true);
      setRedirectCountdown(2);
    },
    onError: (error) => {
      toast.error(error.message || "Não foi possível atualizar a senha");
    },
  });

  useEffect(() => {
    if (!isSuccess) return;

    const countdownInterval = window.setInterval(() => {
      setRedirectCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(countdownInterval);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    const redirectTimeout = window.setTimeout(() => {
      form.reset();
      window.location.assign("/login");
    }, 2000);

    return () => {
      window.clearInterval(countdownInterval);
      window.clearTimeout(redirectTimeout);
    };
  }, [form, isSuccess]);

  function onSubmit(data: ForgotPasswordFormValues) {
    recoverPasswordMutation.mutate({
      email: data.email,
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <m.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-black/70 p-6 shadow-[0_0_60px_rgba(0,0,0,0.35)] backdrop-blur"
      >
        <Button
          variant="ghost"
          className="mb-4 px-0 text-white hover:bg-transparent hover:text-primary"
          onClick={() => window.location.assign("/login")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para login
        </Button>

        <div className="mb-6">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-white">Esqueceu a senha?</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Como ainda não existe reset por e-mail, esta página atualiza sua senha usando e-mail e senha antiga.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <m.div
              key="success"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -8 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="rounded-3xl border border-primary/20 bg-primary/10 p-6 text-center"
            >
              <m.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.08, duration: 0.3, ease: "easeOut" }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary"
              >
                <CheckCircle2 className="h-8 w-8" />
              </m.div>
              <h2 className="text-xl font-semibold text-white">Senha alterada</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Redirecionando para o login em {redirectCountdown}s.
              </p>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <m.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 2, ease: "linear" }}
                />
              </div>
            </m.div>
          ) : (
            <m.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04, duration: 0.22 }}>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">E-mail</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input {...field} type="email" placeholder="seu@email.com" className="pl-10 text-white" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </m.div>

                  <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.22 }}>
                    <FormField
                      control={form.control}
                      name="oldPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Senha antiga</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input {...field} type={showOldPassword ? "text" : "password"} placeholder="Senha antiga" className="pl-10 pr-10 text-white" />
                              <button type="button" onClick={() => setShowOldPassword((value) => !value)} className="absolute right-3 top-3 text-muted-foreground hover:text-white">
                                {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </m.div>

                  <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.22 }}>
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Nova senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input {...field} type={showNewPassword ? "text" : "password"} placeholder="Nova senha" className="pl-10 pr-10 text-white" />
                              <button type="button" onClick={() => setShowNewPassword((value) => !value)} className="absolute right-3 top-3 text-muted-foreground hover:text-white">
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </m.div>

                  <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.22 }}>
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Confirmar nova senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input {...field} type={showConfirmPassword ? "text" : "password"} placeholder="Repita a nova senha" className="pl-10 pr-10 text-white" />
                              <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} className="absolute right-3 top-3 text-muted-foreground hover:text-white">
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </m.div>

                  <m.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.22 }}
                    className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-muted-foreground"
                  >
                    Regras atuais:
                    <div>E-mail deve existir</div>
                    <div>Senha antiga deve estar correta</div>
                    <div>Nova senha deve ter no mínimo 6 caracteres</div>
                    <div>Nova senha deve ser diferente da antiga</div>
                  </m.div>

                  <m.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.24, duration: 0.22 }}
                    className="space-y-3"
                  >
                    {recoverPasswordMutation.isPending && (
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <m.div
                          className="h-full w-1/2 rounded-full bg-primary"
                          initial={{ x: "-100%" }}
                          animate={{ x: "220%" }}
                          transition={{ duration: 1, ease: "easeInOut", repeat: Infinity }}
                        />
                      </div>
                    )}

                    <Button type="submit" className="w-full py-6 text-base font-semibold" disabled={recoverPasswordMutation.isPending}>
                      {recoverPasswordMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Atualizando senha...
                        </>
                      ) : (
                        "Atualizar senha"
                      )}
                    </Button>
                  </m.div>
                </form>
              </Form>
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    </div>
  );
}
