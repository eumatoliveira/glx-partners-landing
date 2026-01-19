import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Agendamento Confirmado!
          </h1>
          <p className="text-muted-foreground text-lg">
            Obrigado por agendar seu diagnóstico com a GLX Partners. Enviamos os detalhes da reunião para o seu e-mail.
          </p>
        </div>

        <div className="bg-card border border-white/5 p-6 rounded-lg text-left space-y-4">
          <h3 className="text-white font-bold uppercase tracking-wider text-sm border-b border-white/5 pb-2">
            Próximos Passos
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary font-bold">01.</span>
              Verifique seu e-mail para confirmar o convite.
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">02.</span>
              Se possível, tenha em mãos os principais KPIs da sua operação.
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">03.</span>
              A reunião será realizada via Google Meet ou Zoom.
            </li>
          </ul>
        </div>

        <div className="pt-4">
          <Link href="/">
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white py-6">
              Voltar para a Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
