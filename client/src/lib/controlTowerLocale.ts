import type { Language } from "@/i18n";

type ModuleMenuKey =
  | "ingestion"
  | "warRoom"
  | "ceo"
  | "financial"
  | "operations"
  | "growth"
  | "quality"
  | "team";

export interface ControlTowerLocale {
  dashboardTitle: string;
  dashboardSubtitle: string;
  headerMeta: {
    plan: string;
    user: string;
  };
  shell: {
    searchPlaceholder: string;
    lastUpdateNow: string;
    statusLive: string;
    environmentProduction: string;
    notificationsTitle: string;
    noNotifications: string;
    backToSite: string;
    openSiteDashboard: string;
    settings: string;
    legendTitle: string;
    legendDescription: string;
    legendKpi: string;
    legendAlerts: string;
    legendActions: string;
  };
  moduleMenu: Record<ModuleMenuKey, string>;
  actions: {
    exportPdf: string;
    exportCsv: string;
    refreshing: string;
    refresh: string;
    clearFilters: string;
    removeChip: string;
    logout: string;
  };
  filters: {
    title: string;
    period: string;
    channel: string;
    professional: string;
    procedure: string;
    status: string;
    severity: string;
    customDateFrom: string;
    customDateTo: string;
    periodOptions: Record<"7d" | "30d" | "90d" | "12m" | "custom", string>;
    all: string;
    chipsTitle: string;
  };
  status: {
    agendado: string;
    realizado: string;
    cancelado: string;
    noshow: string;
    open: string;
    inProgress: string;
    done: string;
  };
  planGate: {
    lockedTitle: string;
    lockedDescription: string;
    requiredPlan: string;
  };
  parser: {
    title: string;
    subtitle: string;
    dropTitle: string;
    dropSubtitle: string;
    parsing: string;
    parsedRows: string;
    commit: string;
    commitSuccess: string;
    commitError: string;
    noRows: string;
    columns: {
      timestamp: string;
      channel: string;
      professional: string;
      procedure: string;
      status: string;
      entries: string;
      exits: string;
      slotsAvailable: string;
      slotsEmpty: string;
      ticketMedio: string;
    };
  };
  warRoom: {
    title: string;
    subtitle: string;
    noAlerts: string;
    registerRca: string;
    impact: string;
    modalTitle: string;
    rootCause: string;
    actionPlan: string;
    owner: string;
    dueDate: string;
    save: string;
    saved: string;
    saveError: string;
  };
  ceo: {
    title: string;
    liquidRevenue: string;
    ebitdaNorm: string;
    revpas: string;
    leakMap: string;
    breakEven: string;
    noShow: string;
    idle: string;
    cac: string;
  };
  financial: {
    title: string;
    dreWaterfall: string;
    ccc: string;
    cgn: string;
    bcg: string;
    aging: string;
  };
  operations: {
    title: string;
    opportunityCost: string;
    marginMinute: string;
    occupancyHeatmap: string;
    oee: string;
    shrinkage: string;
  };
  growth: {
    title: string;
    funnel: string;
    payback: string;
    ltv: string;
    nrr: string;
    attribution: string;
  };
  quality: {
    title: string;
    nps: string;
    wordCloud: string;
    scatter: string;
  };
  team: {
    title: string;
    multifactor: string;
    idleByProfessional: string;
  };
  welcome: {
    title: string;
    subtitle: string;
    close: string;
    highestSeverity: string;
  };
  common: {
    metric: string;
    formula: string;
    legend: string;
    empty: string;
    generatedAt: string;
  };
  labels: {
    grossRevenue: string;
    deductions: string;
    variableCosts: string;
    fixedCosts: string;
    ebitda: string;
    procedure: string;
    volume: string;
    marginPercent: string;
    impressions: string;
    leads: string;
    scheduled: string;
    completed: string;
    channel: string;
    investment: string;
    revenue: string;
    roi: string;
    professional: string;
    returnRate: string;
    attendance: string;
    nps: string;
    minutes: string;
  };
}

const pt: ControlTowerLocale = {
  dashboardTitle: "Control Tower Enterprise BI",
  dashboardSubtitle: "Visao executiva modular para clinica com regras matematicas estritas",
  headerMeta: {
    plan: "Plano",
    user: "Usuario",
  },
  shell: {
    searchPlaceholder: "Buscar indicador, profissional ou canal...",
    lastUpdateNow: "Ultima atualizacao: agora",
    statusLive: "Dados ao vivo",
    environmentProduction: "Producao",
    notificationsTitle: "Notificacoes",
    noNotifications: "Sem notificacoes no momento",
    backToSite: "Voltar ao Site",
    openSiteDashboard: "Dashboard GLX",
    settings: "Configuracoes",
    legendTitle: "Legenda - Centro de Comando",
    legendDescription: "Visao executiva modular da operacao da clinica.",
    legendKpi: "KPIs: receita liquida, margem, revpas e NPS.",
    legendAlerts: "Alertas: desvios P1/P2/P3 com impacto financeiro.",
    legendActions: "Acoes: ingestao, exportacao e RCA com filtros globais.",
  },
  moduleMenu: {
    ingestion: "Ingestao",
    warRoom: "War Room",
    ceo: "Visao CEO",
    financial: "Financeiro",
    operations: "Operacoes",
    growth: "Growth",
    quality: "Qualidade e CX",
    team: "Equipe",
  },
  actions: {
    exportPdf: "Exportar PDF",
    exportCsv: "Exportar CSV",
    refreshing: "Atualizando...",
    refresh: "Atualizar dados",
    clearFilters: "Limpar filtros",
    removeChip: "Remover filtro",
    logout: "Sair",
  },
  filters: {
    title: "Filtros globais",
    period: "Periodo",
    channel: "Canal",
    professional: "Profissional",
    procedure: "Procedimento",
    status: "Status",
    severity: "Severidade",
    customDateFrom: "Data inicial",
    customDateTo: "Data final",
    periodOptions: {
      "7d": "7 dias",
      "30d": "30 dias",
      "90d": "90 dias",
      "12m": "12 meses",
      custom: "Personalizado",
    },
    all: "Todos",
    chipsTitle: "Filtros ativos",
  },
  status: {
    agendado: "Agendado",
    realizado: "Realizado",
    cancelado: "Cancelado",
    noshow: "No-show",
    open: "Aberto",
    inProgress: "Em andamento",
    done: "Concluido",
  },
  planGate: {
    lockedTitle: "Modulo bloqueado pelo plano",
    lockedDescription: "Este modulo exige upgrade do plano para liberar acesso.",
    requiredPlan: "Plano minimo",
  },
  parser: {
    title: "Modulo de Ingestao de Dados",
    subtitle: "Upload deterministico de PDF textual e CSV",
    dropTitle: "Arraste arquivos ou clique para selecionar",
    dropSubtitle: "Aceita .pdf, .csv",
    parsing: "Processando arquivo...",
    parsedRows: "Linhas validadas",
    commit: "Commitar para banco",
    commitSuccess: "Lote commitado com sucesso",
    commitError: "Falha ao commitar lote",
    noRows: "Nenhuma linha valida encontrada.",
    columns: {
      timestamp: "Timestamp",
      channel: "Canal",
      professional: "Profissional",
      procedure: "Procedimento",
      status: "Status",
      entries: "Entradas",
      exits: "Saidas",
      slotsAvailable: "Slots disp.",
      slotsEmpty: "Slots vazios",
      ticketMedio: "Ticket medio",
    },
  },
  warRoom: {
    title: "War Room",
    subtitle: "Alertas P1 com impacto financeiro em tempo real",
    noAlerts: "Sem alertas P1 ativos no momento.",
    registerRca: "Registrar RCA",
    impact: "Rombo calculado",
    modalTitle: "Registrar Causa Raiz",
    rootCause: "Causa raiz",
    actionPlan: "Plano de acao",
    owner: "Responsavel",
    dueDate: "Prazo",
    save: "Salvar RCA",
    saved: "RCA salvo",
    saveError: "Falha ao salvar RCA",
  },
  ceo: {
    title: "Scorecard Executivo",
    liquidRevenue: "Faturamento Liquido",
    ebitdaNorm: "Margem EBITDA Normalizada",
    revpas: "RevPAS",
    leakMap: "Mapa de Vazamentos",
    breakEven: "Termometro Break-even",
    noShow: "No-show",
    idle: "Ociosidade",
    cac: "CAC",
  },
  financial: {
    title: "Painel Financeiro",
    dreWaterfall: "DRE Gerencial",
    ccc: "Ciclo de Conversao de Caixa",
    cgn: "Capital de Giro Necessario",
    bcg: "Matriz BCG de Procedimentos",
    aging: "Aging de Inadimplencia",
  },
  operations: {
    title: "Painel de Operacoes",
    opportunityCost: "Custo de Oportunidade",
    marginMinute: "Margem por Minuto",
    occupancyHeatmap: "Heatmap de Ocupacao",
    oee: "OEE de Insumos",
    shrinkage: "Shrinkage",
  },
  growth: {
    title: "Painel Growth",
    funnel: "Funil Matematico",
    payback: "Payback CAC",
    ltv: "LTV Liquido",
    nrr: "NRR",
    attribution: "Atribuicao Investimento x Receita",
  },
  quality: {
    title: "Painel Qualidade e CX",
    nps: "NPS Exato",
    wordCloud: "Nuvem de Palavras",
    scatter: "Espera x Satisfacao",
  },
  team: {
    title: "Painel Equipe",
    multifactor: "Tabela Multifatorial",
    idleByProfessional: "Ociosidade por Profissional",
  },
  welcome: {
    title: "Resumo de desvios ativos",
    subtitle: "Desvios detectados no carregamento do dashboard",
    close: "Fechar",
    highestSeverity: "Maior severidade ativa",
  },
  common: {
    metric: "Metrica",
    formula: "Formula",
    legend: "Legenda",
    empty: "Sem dados para os filtros atuais",
    generatedAt: "Gerado em",
  },
  labels: {
    grossRevenue: "Receita Bruta",
    deductions: "Deducoes",
    variableCosts: "Custos Variaveis",
    fixedCosts: "Custos Fixos",
    ebitda: "EBITDA",
    procedure: "Procedimento",
    volume: "Volume",
    marginPercent: "Margem %",
    impressions: "Impressoes",
    leads: "Leads",
    scheduled: "Agendados",
    completed: "Realizados",
    channel: "Canal",
    investment: "Investimento",
    revenue: "Receita",
    roi: "ROI",
    professional: "Profissional",
    returnRate: "Retorno",
    attendance: "Assiduidade",
    nps: "NPS",
    minutes: "min",
  },
};

const en: ControlTowerLocale = {
  dashboardTitle: "Control Tower Enterprise BI",
  dashboardSubtitle: "Modular executive clinic view with strict math rules",
  headerMeta: {
    plan: "Plan",
    user: "User",
  },
  shell: {
    searchPlaceholder: "Search KPI, professional or channel...",
    lastUpdateNow: "Last update: now",
    statusLive: "Live data",
    environmentProduction: "Production",
    notificationsTitle: "Notifications",
    noNotifications: "No notifications for now",
    backToSite: "Back to Site",
    openSiteDashboard: "GLX Dashboard",
    settings: "Settings",
    legendTitle: "Legend - Command Center",
    legendDescription: "Modular executive view of clinic operations.",
    legendKpi: "KPIs: net revenue, margin, revpas and NPS.",
    legendAlerts: "Alerts: P1/P2/P3 deviations with financial impact.",
    legendActions: "Actions: ingestion, export and RCA with global filters.",
  },
  moduleMenu: {
    ingestion: "Ingestion",
    warRoom: "War Room",
    ceo: "CEO View",
    financial: "Financial",
    operations: "Operations",
    growth: "Growth",
    quality: "Quality & CX",
    team: "Team",
  },
  actions: {
    exportPdf: "Export PDF",
    exportCsv: "Export CSV",
    refreshing: "Refreshing...",
    refresh: "Refresh data",
    clearFilters: "Clear filters",
    removeChip: "Remove filter",
    logout: "Logout",
  },
  filters: {
    title: "Global filters",
    period: "Period",
    channel: "Channel",
    professional: "Professional",
    procedure: "Procedure",
    status: "Status",
    severity: "Severity",
    customDateFrom: "From date",
    customDateTo: "To date",
    periodOptions: {
      "7d": "7 days",
      "30d": "30 days",
      "90d": "90 days",
      "12m": "12 months",
      custom: "Custom",
    },
    all: "All",
    chipsTitle: "Active filters",
  },
  status: {
    agendado: "Scheduled",
    realizado: "Completed",
    cancelado: "Cancelled",
    noshow: "No-show",
    open: "Open",
    inProgress: "In progress",
    done: "Done",
  },
  planGate: {
    lockedTitle: "Module locked by plan",
    lockedDescription: "This module requires a higher plan.",
    requiredPlan: "Minimum plan",
  },
  parser: {
    title: "Data Ingestion Module",
    subtitle: "Deterministic upload for text PDF and CSV",
    dropTitle: "Drop files or click to select",
    dropSubtitle: "Accepts .pdf, .csv",
    parsing: "Parsing file...",
    parsedRows: "Validated rows",
    commit: "Commit to database",
    commitSuccess: "Batch committed successfully",
    commitError: "Failed to commit batch",
    noRows: "No valid rows found.",
    columns: {
      timestamp: "Timestamp",
      channel: "Channel",
      professional: "Professional",
      procedure: "Procedure",
      status: "Status",
      entries: "Entries",
      exits: "Exits",
      slotsAvailable: "Available slots",
      slotsEmpty: "Empty slots",
      ticketMedio: "Average ticket",
    },
  },
  warRoom: {
    title: "War Room",
    subtitle: "P1 alerts with real-time financial impact",
    noAlerts: "No active P1 alerts at the moment.",
    registerRca: "Register RCA",
    impact: "Calculated gap",
    modalTitle: "Register Root Cause",
    rootCause: "Root cause",
    actionPlan: "Action plan",
    owner: "Owner",
    dueDate: "Due date",
    save: "Save RCA",
    saved: "RCA saved",
    saveError: "Failed to save RCA",
  },
  ceo: {
    title: "Executive Scorecard",
    liquidRevenue: "Net Revenue",
    ebitdaNorm: "Normalized EBITDA Margin",
    revpas: "RevPAS",
    leakMap: "Leak Map",
    breakEven: "Break-even Gauge",
    noShow: "No-show",
    idle: "Idle",
    cac: "CAC",
  },
  financial: {
    title: "Financial Panel",
    dreWaterfall: "Management P&L",
    ccc: "Cash Conversion Cycle",
    cgn: "Working Capital Need",
    bcg: "Procedure BCG Matrix",
    aging: "Delinquency Aging",
  },
  operations: {
    title: "Operations Panel",
    opportunityCost: "Opportunity Cost",
    marginMinute: "Margin per Minute",
    occupancyHeatmap: "Occupancy Heatmap",
    oee: "OEE Inputs",
    shrinkage: "Shrinkage",
  },
  growth: {
    title: "Growth Panel",
    funnel: "Math Funnel",
    payback: "CAC Payback",
    ltv: "Net LTV",
    nrr: "NRR",
    attribution: "Spend vs Revenue Attribution",
  },
  quality: {
    title: "Quality & CX Panel",
    nps: "Exact NPS",
    wordCloud: "Word Cloud",
    scatter: "Wait vs Satisfaction",
  },
  team: {
    title: "Team Panel",
    multifactor: "Multifactor Table",
    idleByProfessional: "Idle by Professional",
  },
  welcome: {
    title: "Active deviation summary",
    subtitle: "Detected when dashboard loaded",
    close: "Close",
    highestSeverity: "Highest active severity",
  },
  common: {
    metric: "Metric",
    formula: "Formula",
    legend: "Legend",
    empty: "No data for current filters",
    generatedAt: "Generated at",
  },
  labels: {
    grossRevenue: "Gross Revenue",
    deductions: "Deductions",
    variableCosts: "Variable Costs",
    fixedCosts: "Fixed Costs",
    ebitda: "EBITDA",
    procedure: "Procedure",
    volume: "Volume",
    marginPercent: "Margin %",
    impressions: "Impressions",
    leads: "Leads",
    scheduled: "Scheduled",
    completed: "Completed",
    channel: "Channel",
    investment: "Investment",
    revenue: "Revenue",
    roi: "ROI",
    professional: "Professional",
    returnRate: "Return",
    attendance: "Attendance",
    nps: "NPS",
    minutes: "min",
  },
};

const es: ControlTowerLocale = {
  dashboardTitle: "Control Tower Enterprise BI",
  dashboardSubtitle: "Vision ejecutiva modular de clinica con reglas matematicas estrictas",
  headerMeta: {
    plan: "Plan",
    user: "Usuario",
  },
  shell: {
    searchPlaceholder: "Buscar KPI, profesional o canal...",
    lastUpdateNow: "Ultima actualizacion: ahora",
    statusLive: "Datos en vivo",
    environmentProduction: "Produccion",
    notificationsTitle: "Notificaciones",
    noNotifications: "Sin notificaciones por ahora",
    backToSite: "Volver al Sitio",
    openSiteDashboard: "Dashboard GLX",
    settings: "Configuraciones",
    legendTitle: "Leyenda - Centro de Comando",
    legendDescription: "Vision ejecutiva modular de la operacion de la clinica.",
    legendKpi: "KPIs: ingreso neto, margen, revpas y NPS.",
    legendAlerts: "Alertas: desvio P1/P2/P3 con impacto financiero.",
    legendActions: "Acciones: ingesta, exportacion y RCA con filtros globales.",
  },
  moduleMenu: {
    ingestion: "Ingestion",
    warRoom: "War Room",
    ceo: "Vision CEO",
    financial: "Finanzas",
    operations: "Operaciones",
    growth: "Growth",
    quality: "Calidad y CX",
    team: "Equipo",
  },
  actions: {
    exportPdf: "Exportar PDF",
    exportCsv: "Exportar CSV",
    refreshing: "Actualizando...",
    refresh: "Actualizar datos",
    clearFilters: "Limpiar filtros",
    removeChip: "Quitar filtro",
    logout: "Salir",
  },
  filters: {
    title: "Filtros globales",
    period: "Periodo",
    channel: "Canal",
    professional: "Profesional",
    procedure: "Procedimiento",
    status: "Estado",
    severity: "Severidad",
    customDateFrom: "Fecha inicial",
    customDateTo: "Fecha final",
    periodOptions: {
      "7d": "7 dias",
      "30d": "30 dias",
      "90d": "90 dias",
      "12m": "12 meses",
      custom: "Personalizado",
    },
    all: "Todos",
    chipsTitle: "Filtros activos",
  },
  status: {
    agendado: "Agendado",
    realizado: "Realizado",
    cancelado: "Cancelado",
    noshow: "No-show",
    open: "Abierto",
    inProgress: "En progreso",
    done: "Concluido",
  },
  planGate: {
    lockedTitle: "Modulo bloqueado por plan",
    lockedDescription: "Este modulo requiere un plan superior.",
    requiredPlan: "Plan minimo",
  },
  parser: {
    title: "Modulo de Ingestion de Datos",
    subtitle: "Carga deterministica para PDF textual y CSV",
    dropTitle: "Arrastre archivos o haga clic para seleccionar",
    dropSubtitle: "Acepta .pdf, .csv",
    parsing: "Procesando archivo...",
    parsedRows: "Filas validadas",
    commit: "Comitar en base",
    commitSuccess: "Lote comitado con exito",
    commitError: "Error al comitar lote",
    noRows: "No se encontraron filas validas.",
    columns: {
      timestamp: "Timestamp",
      channel: "Canal",
      professional: "Profesional",
      procedure: "Procedimiento",
      status: "Estado",
      entries: "Entradas",
      exits: "Salidas",
      slotsAvailable: "Slots disp.",
      slotsEmpty: "Slots vacios",
      ticketMedio: "Ticket medio",
    },
  },
  warRoom: {
    title: "War Room",
    subtitle: "Alertas P1 con impacto financiero en tiempo real",
    noAlerts: "Sin alertas P1 activas.",
    registerRca: "Registrar RCA",
    impact: "Brecha calculada",
    modalTitle: "Registrar Causa Raiz",
    rootCause: "Causa raiz",
    actionPlan: "Plan de accion",
    owner: "Responsable",
    dueDate: "Fecha limite",
    save: "Guardar RCA",
    saved: "RCA guardado",
    saveError: "Error al guardar RCA",
  },
  ceo: {
    title: "Scorecard Ejecutivo",
    liquidRevenue: "Facturacion Neta",
    ebitdaNorm: "Margen EBITDA Normalizada",
    revpas: "RevPAS",
    leakMap: "Mapa de Fugas",
    breakEven: "Termometro Break-even",
    noShow: "No-show",
    idle: "Ociosidad",
    cac: "CAC",
  },
  financial: {
    title: "Panel Financiero",
    dreWaterfall: "DRE Gerencial",
    ccc: "Ciclo de Conversion de Caja",
    cgn: "Capital de Giro Necesario",
    bcg: "Matriz BCG de Procedimientos",
    aging: "Aging de Mora",
  },
  operations: {
    title: "Panel de Operaciones",
    opportunityCost: "Costo de Oportunidad",
    marginMinute: "Margen por Minuto",
    occupancyHeatmap: "Heatmap de Ocupacion",
    oee: "OEE de Insumos",
    shrinkage: "Shrinkage",
  },
  growth: {
    title: "Panel Growth",
    funnel: "Funnel Matematico",
    payback: "Payback CAC",
    ltv: "LTV Neto",
    nrr: "NRR",
    attribution: "Atribucion Inversion x Ingresos",
  },
  quality: {
    title: "Panel Calidad y CX",
    nps: "NPS Exacto",
    wordCloud: "Nube de Palabras",
    scatter: "Espera x Satisfaccion",
  },
  team: {
    title: "Panel Equipo",
    multifactor: "Tabla Multifactorial",
    idleByProfessional: "Ociosidad por Profesional",
  },
  welcome: {
    title: "Resumen de desvios activos",
    subtitle: "Detectado al cargar el dashboard",
    close: "Cerrar",
    highestSeverity: "Mayor severidad activa",
  },
  common: {
    metric: "Metrica",
    formula: "Formula",
    legend: "Leyenda",
    empty: "Sin datos para los filtros actuales",
    generatedAt: "Generado en",
  },
  labels: {
    grossRevenue: "Ingreso Bruto",
    deductions: "Deducciones",
    variableCosts: "Costos Variables",
    fixedCosts: "Costos Fijos",
    ebitda: "EBITDA",
    procedure: "Procedimiento",
    volume: "Volumen",
    marginPercent: "Margen %",
    impressions: "Impresiones",
    leads: "Leads",
    scheduled: "Agendados",
    completed: "Realizados",
    channel: "Canal",
    investment: "Inversion",
    revenue: "Ingresos",
    roi: "ROI",
    professional: "Profesional",
    returnRate: "Retorno",
    attendance: "Asistencia",
    nps: "NPS",
    minutes: "min",
  },
};

const localeByLang: Record<Language, ControlTowerLocale> = {
  pt,
  en,
  es,
};

export function getControlTowerLocale(language: Language): ControlTowerLocale {
  return localeByLang[language];
}
