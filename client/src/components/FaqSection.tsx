import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FaqSection() {
  const { language } = useLanguage();

  const content = {
    pt: {
      title: "Perguntas Frequentes",
      subtitle: "Entenda como podemos transformar sua operação de saúde.",
      faqs: [
        {
          question: "Para quem é a consultoria da GLX Partners?",
          answer: "Nossa consultoria é especializada em clínicas, healthtechs e empresas médicas que buscam crescimento acelerado e eficiência operacional. Atendemos negócios que já possuem tração e desejam escalar com previsibilidade e lucro."
        },
        {
          question: "Como funciona o diagnóstico inicial?",
          answer: "Realizamos uma análise profunda de 30 minutos dos seus dados, processos e estrutura atual. Identificamos gargalos de crescimento e oportunidades imediatas de eficiência, entregando um plano de ação claro."
        },
        {
          question: "Qual a diferença entre a GLX e uma agência de marketing?",
          answer: "Não vendemos apenas leads. Construímos sistemas completos de crescimento (Growth System) que integram aquisição, vendas, operação e retenção. Nosso foco é no Lucro Líquido Previsível, não apenas em métricas de vaidade."
        },
        {
          question: "Quanto tempo leva para ver os primeiros resultados?",
          answer: "Nossa metodologia é desenhada para gerar impacto rápido. Geralmente, identificamos e corrigimos ineficiências críticas nas primeiras 4 semanas (Sprints de Execução), com resultados financeiros mensuráveis já no primeiro trimestre."
        },
        {
          question: "A GLX implementa as soluções ou apenas recomenda?",
          answer: "Somos parceiros de execução. Não entregamos apenas um PDF com recomendações. Trabalhamos lado a lado com sua equipe para implementar processos, configurar ferramentas, treinar times e garantir que a estratégia se torne realidade."
        }
      ]
    },
    en: {
      title: "Frequently Asked Questions",
      subtitle: "Understand how we can transform your healthcare operation.",
      faqs: [
        {
          question: "Who is GLX Partners consulting for?",
          answer: "Our consulting specializes in clinics, healthtechs, and medical companies seeking accelerated growth and operational efficiency. We serve businesses that already have traction and want to scale with predictability and profit."
        },
        {
          question: "How does the initial diagnosis work?",
          answer: "We conduct a 30-minute deep analysis of your data, processes, and current structure. We identify growth bottlenecks and immediate efficiency opportunities, delivering a clear action plan."
        },
        {
          question: "What's the difference between GLX and a marketing agency?",
          answer: "We don't just sell leads. We build complete growth systems (Growth System) that integrate acquisition, sales, operations, and retention. Our focus is on Predictable Net Profit, not just vanity metrics."
        },
        {
          question: "How long does it take to see the first results?",
          answer: "Our methodology is designed for quick impact. We typically identify and fix critical inefficiencies in the first 4 weeks (Execution Sprints), with measurable financial results in the first quarter."
        },
        {
          question: "Does GLX implement solutions or just recommend them?",
          answer: "We are execution partners. We don't just deliver a PDF with recommendations. We work side by side with your team to implement processes, configure tools, train teams, and ensure strategy becomes reality."
        }
      ]
    },
    es: {
      title: "Preguntas Frecuentes",
      subtitle: "Entiende cómo podemos transformar tu operación de salud.",
      faqs: [
        {
          question: "¿Para quién es la consultoría de GLX Partners?",
          answer: "Nuestra consultoría está especializada en clínicas, healthtechs y empresas médicas que buscan crecimiento acelerado y eficiencia operacional. Atendemos negocios que ya tienen tracción y desean escalar con previsibilidad y beneficio."
        },
        {
          question: "¿Cómo funciona el diagnóstico inicial?",
          answer: "Realizamos un análisis profundo de 30 minutos de tus datos, procesos y estructura actual. Identificamos cuellos de botella de crecimiento y oportunidades inmediatas de eficiencia, entregando un plan de acción claro."
        },
        {
          question: "¿Cuál es la diferencia entre GLX y una agencia de marketing?",
          answer: "No vendemos solo leads. Construimos sistemas completos de crecimiento (Growth System) que integran adquisición, ventas, operación y retención. Nuestro enfoque está en el Beneficio Neto Predecible, no solo en métricas de vanidad."
        },
        {
          question: "¿Cuánto tiempo tarda en ver los primeros resultados?",
          answer: "Nuestra metodología está diseñada para generar impacto rápido. Generalmente, identificamos y corregimos ineficiencias críticas en las primeras 4 semanas (Sprints de Ejecución), con resultados financieros medibles ya en el primer trimestre."
        },
        {
          question: "¿GLX implementa las soluciones o solo recomienda?",
          answer: "Somos socios de ejecución. No entregamos solo un PDF con recomendaciones. Trabajamos codo a codo con tu equipo para implementar procesos, configurar herramientas, entrenar equipos y garantizar que la estrategia se convierta en realidad."
        }
      ]
    }
  };

  const t = content[language];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            {t.title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {t.faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-white/10 bg-white/5 px-6 rounded-lg">
              <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
