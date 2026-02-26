import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactForm() {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const content = {
    pt: {
      badge: "Contato",
      title: "Vamos escalar sua operação?",
      subtitle: "Preencha o formulário abaixo para agendar um diagnóstico gratuito com nossos especialistas.",
      name: "Nome Completo",
      namePlaceholder: "Seu nome",
      email: "E-mail Corporativo",
      emailPlaceholder: "seu@email.com",
      phone: "Telefone / WhatsApp",
      phonePlaceholder: "(11) 99999-9999",
      company: "Nome da Empresa",
      companyPlaceholder: "Sua empresa",
      employees: "Número de Funcionários",
      employeesPlaceholder: "Selecione uma opção",
      employeesOptions: ["1 - 10 funcionários", "11 - 50 funcionários", "51 - 200 funcionários", "Mais de 200 funcionários"],
      message: "Mensagem (Opcional)",
      messagePlaceholder: "Conte um pouco sobre seus desafios atuais...",
      submit: "Solicitar Diagnóstico",
      submitting: "Enviando...",
      successMessage: "Mensagem enviada com sucesso! Entraremos em contato em breve.",
      validation: {
        name: "Nome deve ter pelo menos 2 caracteres.",
        email: "E-mail inválido.",
        phone: "Telefone inválido.",
        company: "Nome da empresa é obrigatório.",
        employees: "Selecione o número de funcionários."
      }
    },
    en: {
      badge: "Contact",
      title: "Ready to scale your operation?",
      subtitle: "Fill out the form below to schedule a free diagnosis with our specialists.",
      name: "Full Name",
      namePlaceholder: "Your name",
      email: "Corporate Email",
      emailPlaceholder: "your@email.com",
      phone: "Phone / WhatsApp",
      phonePlaceholder: "+1 (555) 000-0000",
      company: "Company Name",
      companyPlaceholder: "Your company",
      employees: "Number of Employees",
      employeesPlaceholder: "Select an option",
      employeesOptions: ["1 - 10 employees", "11 - 50 employees", "51 - 200 employees", "More than 200 employees"],
      message: "Message (Optional)",
      messagePlaceholder: "Tell us about your current challenges...",
      submit: "Request Diagnosis",
      submitting: "Sending...",
      successMessage: "Message sent successfully! We'll contact you soon.",
      validation: {
        name: "Name must have at least 2 characters.",
        email: "Invalid email.",
        phone: "Invalid phone.",
        company: "Company name is required.",
        employees: "Select the number of employees."
      }
    },
    es: {
      badge: "Contacto",
      title: "¿Listo para escalar tu operación?",
      subtitle: "Completa el formulario para agendar un diagnóstico gratuito con nuestros especialistas.",
      name: "Nombre Completo",
      namePlaceholder: "Tu nombre",
      email: "E-mail Corporativo",
      emailPlaceholder: "tu@email.com",
      phone: "Teléfono / WhatsApp",
      phonePlaceholder: "+52 (55) 0000-0000",
      company: "Nombre de la Empresa",
      companyPlaceholder: "Tu empresa",
      employees: "Número de Empleados",
      employeesPlaceholder: "Selecciona una opción",
      employeesOptions: ["1 - 10 empleados", "11 - 50 empleados", "51 - 200 empleados", "Más de 200 empleados"],
      message: "Mensaje (Opcional)",
      messagePlaceholder: "Cuéntanos sobre tus desafíos actuales...",
      submit: "Solicitar Diagnóstico",
      submitting: "Enviando...",
      successMessage: "¡Mensaje enviado con éxito! Te contactaremos pronto.",
      validation: {
        name: "El nombre debe tener al menos 2 caracteres.",
        email: "E-mail inválido.",
        phone: "Teléfono inválido.",
        company: "El nombre de la empresa es obligatorio.",
        employees: "Selecciona el número de empleados."
      }
    }
  };

  const t = content[language];
  const submitErrorMessageByLanguage = {
    pt: "Nao foi possivel enviar. Tente novamente em instantes.",
    en: "Could not send your message. Please try again shortly.",
    es: "No se pudo enviar. Intentalo nuevamente en unos minutos.",
  } as const;

  const formSchema = z.object({
    name: z.string().min(2, { message: t.validation.name }),
    email: z.string().email({ message: t.validation.email }),
    phone: z.string().min(10, { message: t.validation.phone }),
    company: z.string().min(2, { message: t.validation.company }),
    employees: z.string().min(1, { message: t.validation.employees }),
    message: z.string().optional(),
  });

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

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        let serverMessage = "";

        try {
          const data = await response.json();
          if (typeof data?.message === "string") {
            serverMessage = data.message;
          }
        } catch {
          // Ignore malformed responses and use localized fallback
        }

        throw new Error(serverMessage || "contact_request_failed");
      }

      toast.success(t.successMessage);
      form.reset();
    } catch (error) {
      console.error("Contact form submit failed:", error);
      toast.error(submitErrorMessageByLanguage[language]);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-24 bg-background border-t border-white/5 relative overflow-hidden">
      <div className="container max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">{t.badge}</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t.title}
          </h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.subtitle}
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
                      <FormLabel className="text-white">{t.name}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.namePlaceholder} {...field} className="bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-primary" />
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
                      <FormLabel className="text-white">{t.email}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.emailPlaceholder} {...field} className="bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-primary" />
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
                      <FormLabel className="text-white">{t.phone}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.phonePlaceholder} {...field} className="bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-primary" />
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
                      <FormLabel className="text-white">{t.company}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.companyPlaceholder} {...field} className="bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50 focus:border-primary" />
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
                    <FormLabel className="text-white">{t.employees}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50 border-white/10 text-white focus:border-primary">
                          <SelectValue placeholder={t.employeesPlaceholder} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-10">{t.employeesOptions[0]}</SelectItem>
                        <SelectItem value="11-50">{t.employeesOptions[1]}</SelectItem>
                        <SelectItem value="51-200">{t.employeesOptions[2]}</SelectItem>
                        <SelectItem value="200+">{t.employeesOptions[3]}</SelectItem>
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
                    <FormLabel className="text-white">{t.message}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t.messagePlaceholder} 
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
                    {t.submitting}
                  </>
                ) : (
                  <>
                    {t.submit}
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
