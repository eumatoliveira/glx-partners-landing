import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
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
];

export default function FaqSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Entenda como podemos transformar sua operação de saúde.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
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
