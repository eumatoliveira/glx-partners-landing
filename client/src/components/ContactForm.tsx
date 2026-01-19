import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "E-mail inválido." }),
  phone: z.string().min(10, { message: "Telefone inválido." }),
  company: z.string().min(2, { message: "Nome da empresa é obrigatório." }),
  employees: z.string().min(1, { message: "Selecione o número de funcionários." }),
  message: z.string().optional(),
});

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simulação de envio (aqui entraria a integração com API ou Formspree)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log(values);
    toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    form.reset();
    setIsSubmitting(false);
  }

  return (
    <section id="contact" className="py-24 bg-background border-t border-white/5 relative overflow-hidden">
      <div className="container max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">Contato</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Vamos escalar sua operação?
          </h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Preencha o formulário abaixo para agendar um diagnóstico gratuito com nossos especialistas.
          </p>
        </div>

        <div className="bg-card border border-white/5 p-8 md:p-10 rounded-lg shadow-2xl backdrop-blur-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} className="bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">E-mail Corporativo</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" {...field} className="bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Telefone / WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 99999-9999" {...field} className="bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Nome da Empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="Sua empresa" {...field} className="bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="employees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Número de Funcionários</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50 border-white/10 text-white focus:border-primary">
                          <SelectValue placeholder="Selecione uma opção" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-10">1 - 10 funcionários</SelectItem>
                        <SelectItem value="11-50">11 - 50 funcionários</SelectItem>
                        <SelectItem value="51-200">51 - 200 funcionários</SelectItem>
                        <SelectItem value="200+">Mais de 200 funcionários</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Mensagem (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Conte um pouco sobre seus desafios atuais..." 
                        className="resize-none bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-primary min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full md:w-auto md:min-w-[200px] bg-primary hover:bg-primary/90 text-white font-bold py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    Solicitar Diagnóstico
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
