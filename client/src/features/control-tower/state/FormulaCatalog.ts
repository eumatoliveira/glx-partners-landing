import type { Language } from "@/i18n";

export type FormulaMetricKey =
  | "faturamento_liquido"
  | "margem_ebitda_normalizada"
  | "revpas"
  | "break_even"
  | "ccc"
  | "cgn"
  | "custo_oportunidade"
  | "margem_por_minuto"
  | "payback_cac"
  | "ltv_liquido"
  | "nrr"
  | "nps_exato"
  | "impacto_financeiro"
  | "mapa_vazamentos_noshow"
  | "mapa_vazamentos_ociosidade"
  | "mapa_vazamentos_cac"
  | "dre_waterfall"
  | "aging_inadimplencia"
  | "heatmap_ocupacao"
  | "funnel_matematico"
  | "wordcloud_frequencia"
  | "espera_satisfacao"
  | "multifatorial_equipe"
  | "ociosidade_profissional";

type LocalizedText = Record<Language, string>;

export interface FormulaDefinition {
  metricKey: FormulaMetricKey;
  formula: string;
  metricName: LocalizedText;
  legend: LocalizedText;
}

export const FORMULA_CATALOG: Record<FormulaMetricKey, FormulaDefinition> = {
  faturamento_liquido: {
    metricKey: "faturamento_liquido",
    formula: "Receita Bruta - Cancelamentos - Inadimplencia",
    metricName: {
      pt: "Faturamento Liquido",
      en: "Net Revenue",
      es: "Facturacion Neta",
    },
    legend: {
      pt: "Mostra a receita efetiva apos perdas comerciais.",
      en: "Shows effective revenue after commercial losses.",
      es: "Muestra el ingreso efectivo luego de perdidas comerciales.",
    },
  },
  margem_ebitda_normalizada: {
    metricKey: "margem_ebitda_normalizada",
    formula: "Lucro Operacional + Depreciacao + Ajustes de Pro-labore",
    metricName: {
      pt: "Margem EBITDA Normalizada",
      en: "Normalized EBITDA Margin",
      es: "Margen EBITDA Normalizada",
    },
    legend: {
      pt: "Ajusta resultado operacional para comparacao gerencial.",
      en: "Adjusts operating result for management comparability.",
      es: "Ajusta resultado operativo para comparacion gerencial.",
    },
  },
  revpas: {
    metricKey: "revpas",
    formula: "Receita Total / Total de Slots Disponiveis",
    metricName: { pt: "RevPAS", en: "RevPAS", es: "RevPAS" },
    legend: {
      pt: "Receita por slot de agenda disponivel.",
      en: "Revenue per available schedule slot.",
      es: "Ingreso por slot de agenda disponible.",
    },
  },
  break_even: {
    metricKey: "break_even",
    formula: "Custos Fixos / Ticket Medio",
    metricName: { pt: "Break-even", en: "Break-even", es: "Break-even" },
    legend: {
      pt: "Quantidade minima para cobrir custos fixos.",
      en: "Minimum volume required to cover fixed costs.",
      es: "Cantidad minima para cubrir costos fijos.",
    },
  },
  ccc: {
    metricKey: "ccc",
    formula: "Prazo Recebimento + Prazo Estoque - Prazo Pagamento",
    metricName: {
      pt: "Ciclo de Conversao de Caixa",
      en: "Cash Conversion Cycle",
      es: "Ciclo de Conversion de Caja",
    },
    legend: {
      pt: "Dias necessarios para converter operacao em caixa.",
      en: "Days needed to convert operations into cash.",
      es: "Dias necesarios para convertir operacion en caja.",
    },
  },
  cgn: {
    metricKey: "cgn",
    formula: "Contas a Receber + Estoque - Contas a Pagar",
    metricName: {
      pt: "Capital de Giro Necessario",
      en: "Working Capital Need",
      es: "Capital de Giro Necesario",
    },
    legend: {
      pt: "Volume de recursos exigido para operar sem ruptura.",
      en: "Resources required to operate without disruption.",
      es: "Recursos requeridos para operar sin ruptura.",
    },
  },
  custo_oportunidade: {
    metricKey: "custo_oportunidade",
    formula: "Total de Slots Vazios * Ticket Medio Historico",
    metricName: {
      pt: "Custo de Oportunidade",
      en: "Opportunity Cost",
      es: "Costo de Oportunidad",
    },
    legend: {
      pt: "Receita potencial perdida pela ociosidade.",
      en: "Potential revenue lost due to idle capacity.",
      es: "Ingreso potencial perdido por ociosidad.",
    },
  },
  margem_por_minuto: {
    metricKey: "margem_por_minuto",
    formula: "(Preco - Custo Variavel) / Duracao em Minutos",
    metricName: {
      pt: "Margem por Minuto",
      en: "Margin per Minute",
      es: "Margen por Minuto",
    },
    legend: {
      pt: "Rentabilidade operacional por minuto de sala.",
      en: "Operational profitability per room minute.",
      es: "Rentabilidad operativa por minuto de sala.",
    },
  },
  payback_cac: {
    metricKey: "payback_cac",
    formula: "CAC / Margem de Contribuicao Media",
    metricName: {
      pt: "Payback CAC",
      en: "CAC Payback",
      es: "Payback CAC",
    },
    legend: {
      pt: "Tempo medio para recuperar investimento de aquisicao.",
      en: "Average time to recover acquisition investment.",
      es: "Tiempo medio para recuperar inversion de adquisicion.",
    },
  },
  ltv_liquido: {
    metricKey: "ltv_liquido",
    formula: "(Ticket Medio * Frequencia * Retencao) - (Custos Variaveis + CAC)",
    metricName: {
      pt: "LTV Liquido",
      en: "Net LTV",
      es: "LTV Neto",
    },
    legend: {
      pt: "Valor economico liquido por paciente.",
      en: "Net economic value per patient.",
      es: "Valor economico neto por paciente.",
    },
  },
  nrr: {
    metricKey: "nrr",
    formula: "(Receita mes atual da base antiga / Receita mes passado da base antiga) * 100",
    metricName: { pt: "NRR", en: "NRR", es: "NRR" },
    legend: {
      pt: "Retencao de receita da base existente.",
      en: "Revenue retention from existing base.",
      es: "Retencion de ingresos de la base existente.",
    },
  },
  nps_exato: {
    metricKey: "nps_exato",
    formula: "((Promotores - Detratores) / Total) * 100",
    metricName: { pt: "NPS Exato", en: "Exact NPS", es: "NPS Exacto" },
    legend: {
      pt: "Indice liquido de recomendacao dos pacientes.",
      en: "Net recommendation index from patients.",
      es: "Indice neto de recomendacion de pacientes.",
    },
  },
  impacto_financeiro: {
    metricKey: "impacto_financeiro",
    formula: "Slots Vazios * Ticket Medio",
    metricName: {
      pt: "Impacto Financeiro",
      en: "Financial Impact",
      es: "Impacto Financiero",
    },
    legend: {
      pt: "Rombo projetado da ociosidade atual.",
      en: "Projected gap from current idle capacity.",
      es: "Brecha proyectada por ociosidad actual.",
    },
  },
  mapa_vazamentos_noshow: {
    metricKey: "mapa_vazamentos_noshow",
    formula: "(No-shows / Total Agendado) * 100",
    metricName: {
      pt: "Vazamento No-show",
      en: "No-show Leak",
      es: "Fuga por No-show",
    },
    legend: {
      pt: "Percentual de agenda perdida por faltas.",
      en: "Share of schedule lost to no-shows.",
      es: "Porcentaje de agenda perdido por ausencias.",
    },
  },
  mapa_vazamentos_ociosidade: {
    metricKey: "mapa_vazamentos_ociosidade",
    formula: "(Slots Vazios / Slots Disponiveis) * 100",
    metricName: { pt: "Vazamento Ociosidade", en: "Idle Leak", es: "Fuga por Ociosidad" },
    legend: {
      pt: "Percentual de capacidade sem ocupacao.",
      en: "Share of capacity left idle.",
      es: "Porcentaje de capacidad sin ocupacion.",
    },
  },
  mapa_vazamentos_cac: {
    metricKey: "mapa_vazamentos_cac",
    formula: "Investimento em Aquisicao / Novos Pacientes",
    metricName: { pt: "Vazamento CAC", en: "CAC Leak", es: "Fuga CAC" },
    legend: {
      pt: "Custo medio de aquisicao por paciente.",
      en: "Average acquisition cost per patient.",
      es: "Costo medio de adquisicion por paciente.",
    },
  },
  dre_waterfall: {
    metricKey: "dre_waterfall",
    formula: "Receita Bruta - Deducoes - Custos Variaveis - Custos Fixos = EBITDA",
    metricName: { pt: "DRE Waterfall", en: "P&L Waterfall", es: "DRE Waterfall" },
    legend: {
      pt: "Evidencia a formacao do EBITDA em cascata.",
      en: "Shows EBITDA composition step by step.",
      es: "Muestra la formacion del EBITDA en cascada.",
    },
  },
  aging_inadimplencia: {
    metricKey: "aging_inadimplencia",
    formula: "Soma das pendencias por faixa de dias",
    metricName: { pt: "Aging de Inadimplencia", en: "Delinquency Aging", es: "Aging de Mora" },
    legend: {
      pt: "Distribui valores em atraso por maturidade.",
      en: "Distributes overdue balances by age bucket.",
      es: "Distribuye mora por tramos de antiguedad.",
    },
  },
  heatmap_ocupacao: {
    metricKey: "heatmap_ocupacao",
    formula: "(Atendimentos / Slots Disponiveis) por faixa horaria",
    metricName: { pt: "Heatmap de Ocupacao", en: "Occupancy Heatmap", es: "Heatmap de Ocupacion" },
    legend: {
      pt: "Mostra concentracao de demanda por horario.",
      en: "Shows demand concentration by hour.",
      es: "Muestra concentracion de demanda por horario.",
    },
  },
  funnel_matematico: {
    metricKey: "funnel_matematico",
    formula: "Impressoes -> Leads -> Agendados -> Realizados",
    metricName: { pt: "Funil Matematico", en: "Math Funnel", es: "Funnel Matematico" },
    legend: {
      pt: "Rastreia conversao exata entre etapas comerciais.",
      en: "Tracks exact conversion across funnel steps.",
      es: "Rastrea conversion exacta entre etapas comerciales.",
    },
  },
  wordcloud_frequencia: {
    metricKey: "wordcloud_frequencia",
    formula: "Frequencia absoluta de termos em feedbacks",
    metricName: { pt: "Nuvem de Palavras", en: "Word Cloud", es: "Nube de Palabras" },
    legend: {
      pt: "Termos mais recorrentes nos relatos de pacientes.",
      en: "Most recurrent terms in patient feedback.",
      es: "Terminos mas frecuentes en feedback de pacientes.",
    },
  },
  espera_satisfacao: {
    metricKey: "espera_satisfacao",
    formula: "Dispersao: X=Minutos de Espera, Y=Nota do Paciente",
    metricName: { pt: "Espera x Satisfacao", en: "Wait vs Satisfaction", es: "Espera x Satisfaccion" },
    legend: {
      pt: "Correlacao entre espera real e experiencia.",
      en: "Correlation between waiting time and experience.",
      es: "Correlacion entre espera real y experiencia.",
    },
  },
  multifatorial_equipe: {
    metricKey: "multifatorial_equipe",
    formula: "Faturamento + Taxa Retorno + Assiduidade + NPS Individual",
    metricName: { pt: "Tabela Multifatorial", en: "Multifactor Table", es: "Tabla Multifactorial" },
    legend: {
      pt: "Consolida performance individual em quatro eixos.",
      en: "Consolidates individual performance in four axes.",
      es: "Consolida desempeno individual en cuatro ejes.",
    },
  },
  ociosidade_profissional: {
    metricKey: "ociosidade_profissional",
    formula: "Tempo em Atendimento / Cadeira Vazia / Atrasado",
    metricName: { pt: "Ociosidade por Profissional", en: "Idle by Professional", es: "Ociosidad por Profesional" },
    legend: {
      pt: "Distribui tempo produtivo e improdutivo por pessoa.",
      en: "Breaks productive and idle time per person.",
      es: "Distribuye tiempo productivo e improductivo por persona.",
    },
  },
};

export function getFormula(metricKey: FormulaMetricKey) {
  return FORMULA_CATALOG[metricKey];
}
