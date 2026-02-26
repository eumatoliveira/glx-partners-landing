import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/i18n";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";
import { shouldEnableDragMotion } from "@/animation/utils/perfGuards";
import { TypingText } from "@/animation/components/TypingText";
import { ScrollWordHighlight } from "@/animation/components/ScrollWordHighlight";
import BlurText from "@/animation/components/BlurText";
import SplitText from "@/animation/components/SplitText";

type ArticleBlock = {
  id: string;
  title: string;
  content: string;
  bullets?: string[];
};

type ArticleMetric = {
  label: string;
  value: string;
};

type Article = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  sourceLabel: string;
  sourceUrl: string;
  cover: string;
  loop: string;
  metrics: ArticleMetric[];
  blocks: ArticleBlock[];
};

const articlesByLanguage: Record<Language, Article[]> = {
  pt: [
    {
      id: "kaizen-weekly",
      category: "LEAN SIX SIGMA",
      title: "Kaizen semanal para reduzir espera e retrabalho",
      excerpt:
        "Aplicacao pratica de DMAIC com ritos curtos para acelerar ganho operacional sem perder qualidade.",
      sourceLabel: "LEARN LEAN.ORG",
      sourceUrl: "https://www.lean.org/",
      cover: "/images/consulting-meeting.jpg",
      loop: "/images/management-loop.gif",
      metrics: [
        { label: "Lead Time", value: "-18% em 6 semanas" },
        { label: "Retrabalho", value: "-24% por celula" },
        { label: "No-show", value: "-11 p.p." },
      ],
      blocks: [
        {
          id: "diagnostico",
          title: "1. Diagnostico visual em 1 pagina",
          content:
            "Comece pelo fluxo ponta a ponta e marque gargalos por etapa: recepcao, triagem, atendimento e follow-up. O mapa precisa mostrar tempo de fila, transferencia de responsabilidade e taxa de retorno por erro.",
          bullets: [
            "Mapeie gargalos de espera acima de 15 minutos",
            "Capture causas de retrabalho por categoria",
            "Defina baseline com 2 semanas de dados",
          ],
        },
        {
          id: "dmaic",
          title: "2. Sprint DMAIC de 7 dias",
          content:
            "Rode DMAIC em ciclos semanais: segunda define hipotese, terca mede impacto, quarta testa contra-medida, quinta padroniza, sexta revisa com lideranca. O foco e testar pouco, aprender rapido e escalar so o que provou resultado.",
          bullets: [
            "Meta curta por sprint: 1 problema e 1 causa raiz",
            "Teste A/B de processo com janela fixa",
            "Checklist de padrao no fechamento da semana",
          ],
        },
        {
          id: "rituais",
          title: "3. Ritos de governanca",
          content:
            "Uma daily de 12 minutos no inicio do turno e suficiente para orientar o time. A reuniao de sexta deve fechar plano da semana seguinte com dono, prazo e risco principal.",
          bullets: [
            "Daily operacional com semaforo de risco",
            "RCA curto para desvios repetidos",
            "Plano da semana com responsavel unico",
          ],
        },
        {
          id: "kpis",
          title: "4. KPI de sucesso operacional",
          content:
            "O ganho de Kaizen nao pode ficar subjetivo. Controle quatro indicadores: tempo de espera medio, taxa de retrabalho, no-show e throughput diario. Se 3 de 4 melhorarem por 3 semanas, o novo padrao vira regra.",
          bullets: [
            "Espera media < 12 min",
            "Retrabalho < 5%",
            "No-show dentro da meta de plano",
          ],
        },
      ],
    },
    {
      id: "squads-integradas",
      category: "GESTAO DE PERFORMANCE",
      title: "Squads com metricas integradas de funil e atendimento",
      excerpt:
        "Times de operacao e growth compartilhando metas para reduzir no-show e elevar conversao de agenda.",
      sourceLabel: "ASQ SIX SIGMA",
      sourceUrl: "https://asq.org/",
      cover: "/images/strategy-meeting.jpg",
      loop: "/videos/login-hero-loop.mp4",
      metrics: [
        { label: "Conversao Agenda", value: "+22% em 45 dias" },
        { label: "Capacidade Util", value: "+14% por equipe" },
        { label: "Receita por Agenda", value: "+17%" },
      ],
      blocks: [
        {
          id: "modelo",
          title: "1. Modelo de squad por resultado",
          content:
            "Cada squad combina marketing, atendimento e operacao clinica com meta unica. Em vez de metas separadas por area, todo mundo responde por conversao validada e receita realizada.",
          bullets: [
            "Owner de squad com autonomia semanal",
            "Backlog unico de aquisicao e operacao",
            "Meta comum: agenda validada e comparecimento",
          ],
        },
        {
          id: "mapa",
          title: "2. Mapeamento do funil conectado a agenda",
          content:
            "A medicao deixa de parar no lead. O funil precisa ir ate consulta concluida: lead, contato, agendamento, comparecimento e conversao final. Cada quebra vira um experimento de melhoria.",
          bullets: [
            "SLA por etapa do funil",
            "Taxa de passagem entre etapas",
            "Motivo de perda padronizado",
          ],
        },
        {
          id: "cadencia",
          title: "3. Cadencia de decisao de 30 minutos",
          content:
            "A reuniao semanal de performance nao deve ser longa. Em 30 minutos o squad revisa 3 pontos: variacao contra meta, causa raiz e acao da semana com dono claro.",
          bullets: [
            "Sem relatorio longo, so painel vivo",
            "1 experimento por gargalo",
            "Retrospectiva quinzenal para eliminar ruído",
          ],
        },
        {
          id: "escala",
          title: "4. Escala com padrao replicavel",
          content:
            "Quando o squad bate consistencia, documente playbook e replique para outras unidades. A chave e manter o mesmo dicionario de dados para comparar performance entre times.",
          bullets: [
            "Playbook versionado por sprint",
            "Biblioteca de testes bem-sucedidos",
            "Benchmark cruzado entre unidades",
          ],
        },
      ],
    },
    {
      id: "ops-loop",
      category: "OPS INTELLIGENCE",
      title: "Painel animado para decisao em tempo real",
      excerpt:
        "Uso de monitoramento visual continuo para alertas de operacao, capacidade e prioridades do dia.",
      sourceLabel: "GLX OPS STACK",
      sourceUrl: "https://glxpartners.com",
      cover: "/images/healthcare-dashboard.webp",
      loop: "/images/management-loop.gif",
      metrics: [
        { label: "Tempo de Resposta", value: "-35% em alertas P1" },
        { label: "Aderencia de Agenda", value: "+19%" },
        { label: "Decisao no Turno", value: "100% com dono definido" },
      ],
      blocks: [
        {
          id: "painel",
          title: "1. Painel vivo com prioridade P1 P2 P3",
          content:
            "O painel central mostra so o que exige acao agora. Alertas P1 ficam no topo com dono e prazo curto. P2 entra em fila de sprint. P3 vira melhoria continua.",
          bullets: [
            "P1: risco imediato de receita ou atendimento",
            "P2: variacao recorrente acima da meta",
            "P3: oportunidade de eficiencia",
          ],
        },
        {
          id: "logica",
          title: "2. Logica de alocacao automatica",
          content:
            "Cada evento recebe regra de roteamento: qual time atua, em quanto tempo e com qual protocolo. Isso reduz ruido e evita disputa entre areas sobre quem deve agir.",
          bullets: [
            "Roteamento por tipo de desvio",
            "SLA por nivel de prioridade",
            "Historico para auditoria e aprendizado",
          ],
        },
        {
          id: "warroom",
          title: "3. War room de 2 janelas",
          content:
            "A primeira janela monitora operacao em tempo real. A segunda acompanha tendencia semanal. O cruzamento das duas visoes impede decisao reativa sem contexto.",
          bullets: [
            "Tempo real para agir",
            "Semanal para corrigir causa raiz",
            "Mensal para revisar capacidade",
          ],
        },
        {
          id: "resultado",
          title: "4. Resultado: menos ruído e mais previsibilidade",
          content:
            "Com painel animado e ownership claro, a equipe decide com menos friccao. O resultado aparece na reducao de fila, melhor uso da agenda e maior confianca no forecast.",
          bullets: [
            "Fila sob controle por turno",
            "Escalonamento automatico de risco",
            "Forecast com erro menor que 10%",
          ],
        },
      ],
    },
  ],
  en: [],
  es: [],
};

articlesByLanguage.en = articlesByLanguage.pt;
articlesByLanguage.es = articlesByLanguage.pt;

const uiByLanguage: Record<
  Language,
  {
    badge: string;
    title: string;
    subtitle: string;
    articleLabel: string;
    stepLabel: string;
    prev: string;
    next: string;
    source: string;
    readGuide: string;
    readGuideDescription: string;
  }
> = {
  pt: {
    badge: "Insights Aplicados",
    title: "3 artigos completos, no proprio site, com leitura interativa",
    subtitle:
      "Escolha um tema, navegue por blocos de conteudo e acompanhe o resumo visual em loop.",
    articleLabel: "Artigo em foco",
    stepLabel: "Blocos do artigo",
    prev: "Bloco anterior",
    next: "Proximo bloco",
    source: "Referencia",
    readGuide: "Como ler este artigo",
    readGuideDescription:
      "Use os blocos para navegar por contexto, metodo e indicadores. O painel lateral mostra um loop visual ligado ao tema.",
  },
  en: {
    badge: "Applied Insights",
    title: "3 complete in-site articles with interactive reading",
    subtitle:
      "Choose a topic, move across content blocks, and follow the visual loop summary.",
    articleLabel: "Focused article",
    stepLabel: "Article blocks",
    prev: "Previous block",
    next: "Next block",
    source: "Source",
    readGuide: "How to read this article",
    readGuideDescription:
      "Use blocks to navigate context, method and KPIs. The side panel shows a visual loop tied to the topic.",
  },
  es: {
    badge: "Insights Aplicados",
    title: "3 articulos completos en el sitio con lectura interactiva",
    subtitle:
      "Elige un tema, recorre bloques de contenido y sigue el resumen visual en loop.",
    articleLabel: "Articulo en foco",
    stepLabel: "Bloques del articulo",
    prev: "Bloque anterior",
    next: "Siguiente bloque",
    source: "Referencia",
    readGuide: "Como leer este articulo",
    readGuideDescription:
      "Usa los bloques para navegar contexto, metodo e indicadores. El panel lateral muestra un loop visual del tema.",
  },
};

export default function InsightsSection() {
  const { language } = useLanguage();
  const motionCaps = useMotionCapabilities();
  const dragEnabled = shouldEnableDragMotion(motionCaps);
  const dragContainerRef = useRef<HTMLDivElement>(null);
  const articles = useMemo(() => articlesByLanguage[language], [language]);
  const ui = uiByLanguage[language];

  const [activeArticleId, setActiveArticleId] = useState(articles[0]?.id ?? "");
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);

  useEffect(() => {
    if (!articles.some((article) => article.id === activeArticleId)) {
      setActiveArticleId(articles[0]?.id ?? "");
      setActiveBlockIndex(0);
    }
  }, [activeArticleId, articles]);

  useEffect(() => {
    setActiveBlockIndex(0);
  }, [activeArticleId]);

  const activeArticle =
    articles.find((article) => article.id === activeArticleId) ?? articles[0];

  const activeBlock = activeArticle.blocks[activeBlockIndex];
  const lastBlockIndex = activeArticle.blocks.length - 1;

  const goToPreviousBlock = () =>
    setActiveBlockIndex((prev) => (prev === 0 ? 0 : prev - 1));
  const goToNextBlock = () =>
    setActiveBlockIndex((prev) => (prev >= lastBlockIndex ? prev : prev + 1));

  return (
    <section id="insights" className="relative overflow-hidden py-24 bg-[#040507]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
      >
        <div className="absolute left-[-8%] top-[10%] h-[26rem] w-[26rem] rounded-full bg-orange-500/14 blur-[140px]" />
        <div className="absolute right-[-6%] top-[35%] h-[24rem] w-[24rem] rounded-full bg-cyan-500/12 blur-[130px]" />
      </div>

      <div className="container relative z-10 space-y-10">
        <div className="max-w-3xl">
          <m.div
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-300"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {ui.badge}
          </m.div>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            {motionCaps.motionLevel === "full" ? (
              <SplitText
                text={ui.title}
                tag="span"
                splitType="words"
                delay={28}
                duration={0.52}
                threshold={0.14}
                rootMargin="-80px"
                className="block"
                from={{ opacity: 0, transform: "translateY(14px)" }}
                to={{ opacity: 1, transform: "translateY(0px)" }}
              />
            ) : (
              <TypingText text={ui.title} mode="scroll" stepMs={22} />
            )}
          </h2>
          <div className="mt-4 max-w-2xl text-base leading-relaxed md:text-lg">
            {motionCaps.motionLevel === "full" ? (
              <BlurText
                as="p"
                text={ui.subtitle}
                className="text-zinc-300"
                animateBy="words"
                direction="bottom"
                delay={18}
                threshold={0.12}
                rootMargin="-70px"
                stepDuration={0.22}
              />
            ) : (
              <ScrollWordHighlight
                text={ui.subtitle}
                wordClassName="text-zinc-500"
                activeWordClassName="text-zinc-300"
              />
            )}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {articles.map((article, index) => {
            const isActive = article.id === activeArticle.id;
            return (
              <m.button
                key={article.id}
                type="button"
                onClick={() => setActiveArticleId(article.id)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className={cn(
                  "group relative overflow-hidden rounded-[22px] border text-left transition-all duration-300",
                  "bg-zinc-950/80 hover:border-orange-400/60",
                  isActive
                    ? "border-orange-400/70 shadow-[0_0_40px_rgba(249,115,22,0.18)]"
                    : "border-white/10",
                )}
              >
                <div className="absolute inset-0">
                  <img
                    src={article.cover}
                    alt={article.title}
                    className="h-full w-full object-cover opacity-34 transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/85 to-[#050507]/35" />
                </div>
                <div className="relative z-10 flex min-h-[290px] flex-col p-6">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-200">
                    <Sparkles className="h-3 w-3 text-orange-300" />
                    {article.category}
                  </span>
                  <m.h3
                    className="mt-4 text-[28px] font-semibold leading-tight text-white"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: 0.08 + index * 0.05, duration: 0.35 }}
                  >
                    {article.title}
                  </m.h3>
                  <m.p
                    className="mt-4 text-sm leading-relaxed text-zinc-300"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: 0.14 + index * 0.05, duration: 0.35 }}
                  >
                    {article.excerpt}
                  </m.p>
                  <div className="mt-auto flex items-center justify-between pt-6 text-xs uppercase tracking-[0.2em]">
                    <span className="text-orange-300">{article.sourceLabel}</span>
                    <span className="inline-flex items-center gap-2 text-white/90">
                      READ
                      <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </m.button>
            );
          })}
        </div>

        <div ref={dragContainerRef} className="grid gap-6 lg:grid-cols-[1.25fr_0.95fr]">
          <div className="rounded-[24px] border border-white/10 bg-zinc-950/85 p-6 md:p-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
                  {ui.articleLabel}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
                  {activeArticle.title}
                </h3>
              </div>
              <a
                href={activeArticle.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-200 transition hover:border-orange-400/60 hover:text-orange-200"
              >
                {ui.source}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                {ui.stepLabel}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {activeArticle.blocks.map((block, index) => (
                <button
                  key={block.id}
                  type="button"
                  onClick={() => setActiveBlockIndex(index)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition",
                    index === activeBlockIndex
                      ? "border-orange-400/70 bg-orange-500/20 text-orange-100"
                      : "border-white/15 bg-white/5 text-zinc-300 hover:border-orange-400/50 hover:text-orange-100",
                  )}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <m.article
                key={`${activeArticle.id}-${activeBlock.id}`}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
                transition={{ duration: 0.32 }}
                drag={dragEnabled}
                dragConstraints={dragContainerRef}
                dragElastic={0.12}
                dragMomentum={false}
                whileDrag={{ scale: 0.995, cursor: "grabbing" }}
                className="space-y-4 rounded-2xl border border-white/8 bg-black/20 p-5 md:p-6"
              >
                <h4 className="text-xl font-semibold text-white">{activeBlock.title}</h4>
                <p className="text-sm leading-relaxed text-zinc-300 md:text-base">
                  {activeBlock.content}
                </p>
                {activeBlock.bullets && activeBlock.bullets.length > 0 ? (
                  <ul className="space-y-2 pt-1">
                    {activeBlock.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2 text-sm text-zinc-200"
                      >
                        <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-orange-400" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </m.article>
            </AnimatePresence>

            <div className="mt-6 flex flex-wrap gap-2">
              {activeArticle.metrics.map((metric) => (
                <m.div
                  key={metric.label}
                  whileHover={{ y: -2 }}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                    {metric.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-orange-200">
                    {metric.value}
                  </p>
                </m.div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={goToPreviousBlock}
                disabled={activeBlockIndex === 0}
                className="border-white/15 bg-white/5 text-zinc-100 hover:border-orange-400/60 hover:text-orange-100 disabled:opacity-40"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {ui.prev}
              </Button>
              <Button
                type="button"
                onClick={goToNextBlock}
                disabled={activeBlockIndex >= lastBlockIndex}
                className="bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-40"
              >
                {ui.next}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <m.div
            key={activeArticle.id}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden rounded-[24px] border border-white/10 bg-zinc-950"
          >
            <div className="relative h-[290px] overflow-hidden">
              {activeArticle.loop.endsWith(".mp4") ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={activeArticle.cover}
                  className="h-full w-full object-cover"
                >
                  <source
                    src={activeArticle.loop.replace(".mp4", ".webm")}
                    type="video/webm"
                  />
                  <source src={activeArticle.loop} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={activeArticle.loop}
                  alt={`${activeArticle.title} loop`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
              <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-200">
                visual loop
              </div>
            </div>
            <div className="space-y-3 p-6">
              <h4 className="text-base font-semibold text-white">{ui.readGuide}</h4>
              <p className="text-sm leading-relaxed text-zinc-300">
                {ui.readGuideDescription}
              </p>
              <div className="rounded-xl border border-orange-500/25 bg-orange-500/10 p-3 text-xs leading-relaxed text-orange-100">
                {activeBlock.title}
              </div>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}

