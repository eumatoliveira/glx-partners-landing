import { m } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollWordHighlight } from "@/animation/components/ScrollWordHighlight";
import SplitText from "@/animation/components/SplitText";
import BlurText from "@/animation/components/BlurText";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";

export default function FaqSection() {
  const { language } = useLanguage();
  const motionCaps = useMotionCapabilities();
  const reducedMotion = motionCaps.prefersReducedMotion || motionCaps.motionLevel === "off";

  const content = {
    pt: {
      title: "Perguntas Frequentes",
      subtitle: "Entenda como podemos transformar sua operação de saúde.",
      faqs: [
        {
          question: "Para quem é a GLX Partners?",
          answer:
            "Atendemos clínicas e healthtechs que já têm tração e precisam de governança para escalar. Entramos quando o desafio é crescer sem caos: aumentar capacidade, reduzir vazamentos de margem e transformar performance em rotina. Se você busca previsibilidade, lucro e execução disciplinada, a GLX é a parceira de implementação.",
        },
        {
          question: "Como funciona o diagnóstico inicial?",
          answer:
            "O GLX Control Tower é sua camada de governança executiva: um painel único que consolida demanda, capacidade, conversão, margem e caixa com alertas e prioridades acionáveis — para você identificar desvios cedo, corrigir a rota com cadência e escalar com previsibilidade, sem vazamento de margem e sem operar no escuro.",
        },
        {
          question: "Qual a diferença entre a GLX e uma agência de marketing?",
          answer:
            "Não somos agência de mídia — não entregamos “leads” como fim. Implementamos um sistema de crescimento que conecta aquisição, conversão, capacidade operacional e retenção. O KPI não é vaidade: é lucro, margem e previsibilidade com governança e execução semanal.",
        },
        {
          question: "Quanto tempo leva para ver os primeiros resultados?",
          answer:
            "A maioria dos clientes enxerga ganhos operacionais nas primeiras 2–4 semanas (agenda, SLA e conversão). Impactos financeiros consistentes aparecem ao longo do primeiro trimestre, com margem e capacidade sob governança. Tudo acompanhado por métricas, cadência semanal e plano de execução claro.",
        },
        {
          question: "A GLX implementa as soluções ou apenas recomenda?",
          answer:
            "Implementamos. A GLX é parceiro de execução — não entregamos um relatório e desaparecemos. Trabalhamos lado a lado com seu time para instalar processos, dashboards, automações e governança. Treinamos, acompanhamos e ajustamos em sprint até o resultado virar rotina — com métricas e accountability.",
        },
        {
          question: "O que é o Control Tower e por qué preciso dele?",
          answer:
            "O GLX Control Tower é sua camada de governança executiva: um painel único que consolida demanda, capacidade, conversão, margem e caixa com alertas e prioridades acionáveis — para você identificar desvios cedo, corrigir a rota com cadência e escalar com previsibilidade, sem vazamento de margem e sem operar no escuro.",
        },
      ],
    },
    en: {
      title: "Frequently Asked Questions",
      subtitle: "Understand how we can transform your healthcare operation.",
      faqs: [
        {
          question: "Who is GLX Partners consulting for?",
          answer:
            "Our consulting is specialized in clinics, healthtechs, and medical companies seeking accelerated growth and operational efficiency. We serve businesses that already have traction and want to scale with predictability and profit.",
        },
        {
          question: "How does the initial diagnosis work?",
          answer:
            "We conduct a 30-minute deep analysis of your data, processes, and current structure. We identify growth bottlenecks and immediate efficiency opportunities, delivering a clear action plan.",
        },
        {
          question: "What is the difference between GLX and a marketing agency?",
          answer:
            "We do not just sell leads. We build complete growth systems that integrate acquisition, sales, operations, and retention. Our focus is on Predictable Net Profit, not vanity metrics.",
        },
        {
          question: "How long does it take to see the first results?",
          answer:
            "Our methodology is designed for fast impact. In general, we identify and fix critical inefficiencies in the first 4 weeks, with measurable financial results in the first quarter.",
        },
        {
          question: "Does GLX implement solutions or only recommend them?",
          answer:
            "We are execution partners. We do not just deliver a PDF with recommendations. We work side by side with your team to implement processes, configure tools, train teams, and ensure strategy becomes reality.",
        },
      ],
    },
    es: {
      title: "Preguntas Frecuentes",
      subtitle: "Entiende cómo podemos transformar tu operación de salud.",
      faqs: [
        {
          question: "¿Para quién es la consultoría de GLX Partners?",
          answer:
            "Nuestra consultoría está especializada en clínicas, healthtechs y empresas médicas que buscan crecimiento acelerado y eficiencia operacional. Atendemos negocios que ya tienen tracción y desean escalar con previsibilidad y beneficio.",
        },
        {
          question: "¿Cómo funciona el diagnóstico inicial?",
          answer:
            "Realizamos un análisis profundo de 30 minutos de tus datos, procesos y estructura actual. Identificamos cuellos de botella de crecimiento y oportunidades inmediatas de eficiencia, entregando un plan de acción claro.",
        },
        {
          question: "¿Cuál es la diferencia entre GLX y una agencia de marketing?",
          answer:
            "No vendemos solo leads. Construimos sistemas completos de crecimiento que integran adquisición, ventas, operación y retención. Nuestro enfoque está en el Beneficio Neto Predecible, no solo en métricas de vanidad.",
        },
        {
          question: "¿Cuánto tiempo tarda en ver los primeros resultados?",
          answer:
            "Nuestra metodología está diseñada para generar impacto rápido. Generalmente, identificamos y corregimos ineficiencias críticas en las primeras 4 semanas, con resultados financieros medibles ya en el primer trimestre.",
        },
        {
          question: "¿GLX implementa las soluciones o solo recomienda?",
          answer:
            "Somos socios de ejecución. No entregamos solo un PDF con recomendaciones. Trabajamos codo a codo con tu equipo para implementar procesos, configurar herramientas, entrenar equipos y garantizar que la estrategia se convierta en realidad.",
        },
      ],
    },
  };

  const t = content[language];

  return (
    <section className="py-32 bg-[#0A0A0B] relative overflow-hidden">
      <m.div
        aria-hidden="true"
        className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none"
        animate={reducedMotion ? undefined : { x: [0, 30, 0], y: [0, -18, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={reducedMotion ? undefined : { duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <m.div
        aria-hidden="true"
        className="absolute right-[-6%] top-[12%] h-72 w-72 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none"
        animate={reducedMotion ? undefined : { x: [0, -20, 0], y: [0, 14, 0] }}
        transition={reducedMotion ? undefined : { duration: 9.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/25 to-transparent"
        animate={reducedMotion ? undefined : { opacity: [0.2, 0.8, 0.2], scaleX: [0.8, 1, 0.8] }}
        transition={reducedMotion ? undefined : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <m.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white"
          >
            <SplitText
              text={t.title}
              tag="span"
              splitType="chars"
              className="block text-center"
              textAlign="center"
              delay={12}
              duration={0.36}
              threshold={0.14}
              rootMargin="-80px"
              from={{ opacity: 0, transform: "translateY(10px)" }}
              to={{ opacity: 1, transform: "translateY(0px)" }}
            />
          </m.h2>
          <div className="text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            <ScrollWordHighlight text={t.subtitle} wordClassName="text-gray-500" activeWordClassName="text-gray-300" />
          </div>
        </div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
        <Accordion type="single" collapsible className="w-full space-y-4">
          {t.faqs.map((faq, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.06, type: "spring", stiffness: 120, damping: 18 }}
              whileHover={reducedMotion ? undefined : { y: -2 }}
            >
              <AccordionItem value={`item-${index}`} className="group relative overflow-hidden border border-white/5 bg-[#111113]/80 backdrop-blur-sm px-6 rounded-xl hover:border-orange-500/30 transition-all duration-300">
                <m.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 group-hover:opacity-100"
                  animate={reducedMotion ? undefined : { x: ["-140%", "520%"] }}
                  transition={reducedMotion ? undefined : { duration: 2.4, repeat: Infinity, repeatDelay: 1.2, ease: "linear" }}
                />
                <AccordionTrigger className="text-lg lg:text-xl font-bold hover:text-orange-500 transition-colors py-6 hover:no-underline text-left text-white">
                  <SplitText
                    text={faq.question}
                    tag="span"
                    splitType="words"
                    className="block pr-4"
                    delay={14}
                    duration={0.32}
                    threshold={0.18}
                    rootMargin="-40px"
                    from={{ opacity: 0, transform: "translateY(6px)" }}
                    to={{ opacity: 1, transform: "translateY(0px)" }}
                  />
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 text-base md:text-lg pb-6 leading-relaxed font-light">
                  <BlurText
                    as="p"
                    text={faq.answer}
                    className="text-gray-400 text-base md:text-lg leading-relaxed font-light"
                    animateBy="words"
                    direction="bottom"
                    delay={10}
                    threshold={0.15}
                    rootMargin="-30px"
                    stepDuration={0.16}
                  />
                </AccordionContent>
              </AccordionItem>
            </m.div>
          ))}
        </Accordion>
        </m.div>
      </div>
    </section>
  );
}
