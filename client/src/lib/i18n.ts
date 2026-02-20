export type Lang = "pt" | "es" | "en";

export const LANG_LABELS: Record<Lang, string> = { pt: "Português", es: "Español", en: "English" };
export const LANG_FLAGS: Record<Lang, string> = { pt: "🇧🇷", es: "🇪🇸", en: "🇺🇸" };

const T = {
  // Sidebar groups
  "nav.overview": { pt: "Visão Geral", es: "Visión General", en: "Overview" },
  "nav.operations": { pt: "Operação & Equipe", es: "Operación & Equipo", en: "Operations & Team" },
  "nav.commercial": { pt: "Comercial", es: "Comercial", en: "Commercial" },
  "nav.management": { pt: "Gestão e Integrações", es: "Gestión e Integraciones", en: "Management & Integrations" },

  // Sidebar items
  "nav.dashboard": { pt: "Dashboard", es: "Dashboard", en: "Dashboard" },
  "nav.realtime": { pt: "Tempo Real", es: "Tiempo Real", en: "Real Time" },
  "nav.agenda": { pt: "Agenda & Capacidade", es: "Agenda & Capacidad", en: "Schedule & Capacity" },
  "nav.equipe": { pt: "Equipe", es: "Equipo", en: "Team" },
  "nav.sprints": { pt: "Sprints & OKRs", es: "Sprints & OKRs", en: "Sprints & OKRs" },
  "nav.funil": { pt: "Funil de Vendas", es: "Embudo de Ventas", en: "Sales Funnel" },
  "nav.canais": { pt: "Canais", es: "Canales", en: "Channels" },
  "nav.integracoes": { pt: "Integrações / CRM", es: "Integraciones / CRM", en: "Integrations / CRM" },
  "nav.dados": { pt: "Entrada de Dados", es: "Entrada de Datos", en: "Data Entry" },
  "nav.relatorios": { pt: "Relatórios PDF", es: "Informes PDF", en: "PDF Reports" },
  "nav.diagnostico": { pt: "Diagnóstico GLX", es: "Diagnóstico GLX", en: "GLX Diagnostics" },
  "nav.configuracoes": { pt: "Configurações", es: "Configuraciones", en: "Settings" },

  // Topbar titles
  "title.dashboard": { pt: "Visão Geral", es: "Visión General", en: "Overview" },
  "title.realtime": { pt: "Tempo Real", es: "Tiempo Real", en: "Real Time" },
  "title.agenda": { pt: "Agenda & Capacidade", es: "Agenda & Capacidad", en: "Schedule & Capacity" },
  "title.equipe": { pt: "Equipe", es: "Equipo", en: "Team" },
  "title.sprints": { pt: "Sprints & OKRs", es: "Sprints & OKRs", en: "Sprints & OKRs" },
  "title.funil": { pt: "Funil Comercial", es: "Embudo Comercial", en: "Sales Funnel" },
  "title.canais": { pt: "Canais", es: "Canales", en: "Channels" },
  "title.integracoes": { pt: "Integrações", es: "Integraciones", en: "Integrations" },
  "title.dados": { pt: "Entrada Manual", es: "Entrada Manual", en: "Manual Entry" },
  "title.relatorios": { pt: "Exportações", es: "Exportaciones", en: "Exports" },
  "title.diagnostico": { pt: "Diagnóstico GLX", es: "Diagnóstico GLX", en: "GLX Diagnostics" },
  "title.configuracoes": { pt: "Configurações", es: "Configuraciones", en: "Settings" },

  // Buttons
  "btn.exportPdf": { pt: "Exportar PDF", es: "Exportar PDF", en: "Export PDF" },
  "btn.save": { pt: "Salvar", es: "Guardar", en: "Save" },
  "btn.cancel": { pt: "Cancelar", es: "Cancelar", en: "Cancel" },
  "btn.connect": { pt: "Conectar", es: "Conectar", en: "Connect" },
  "btn.disconnect": { pt: "Desconectar", es: "Desconectar", en: "Disconnect" },
  "btn.remove": { pt: "Remover", es: "Eliminar", en: "Remove" },
  "btn.logout": { pt: "Sair", es: "Salir", en: "Logout" },
  "btn.back": { pt: "Voltar", es: "Volver", en: "Back" },
  "btn.download": { pt: "Confirmar e Baixar PDF", es: "Confirmar y Descargar PDF", en: "Confirm & Download PDF" },
  "btn.register": { pt: "Registrar", es: "Registrar", en: "Register" },
  "btn.delete": { pt: "Excluir", es: "Eliminar", en: "Delete" },
  "btn.importCsv": { pt: "Importar Agenda (CSV)", es: "Importar Agenda (CSV)", en: "Import Schedule (CSV)" },
  "btn.addProfessional": { pt: "+ Adicionar Profissional", es: "+ Agregar Profesional", en: "+ Add Professional" },
  "btn.addSprint": { pt: "+ Add Sprint", es: "+ Agregar Sprint", en: "+ Add Sprint" },
  "btn.addOkr": { pt: "+ Add OKR", es: "+ Agregar OKR", en: "+ Add OKR" },
  "btn.uploadFile": { pt: "Importar Planilha", es: "Importar Hoja", en: "Import Spreadsheet" },
  "btn.iaRouter": { pt: "Importar via IA Router", es: "Importar vía IA Router", en: "Import via AI Router" },
  "btn.viewDashboard": { pt: "Ver Dashboard Atualizado", es: "Ver Dashboard Actualizado", en: "View Updated Dashboard" },
  "btn.updateGoals": { pt: "Atualizar Metas", es: "Actualizar Metas", en: "Update Goals" },
  "btn.previewPdf": { pt: "Pré-visualizar e Baixar PDF", es: "Previsualizar y Descargar PDF", en: "Preview & Download PDF" },
  "btn.downloadCsv": { pt: "Baixar CSV", es: "Descargar CSV", en: "Download CSV" },

  // Dashboard section
  "dash.overview": { pt: "Visão Geral", es: "Visión General", en: "Overview" },
  "dash.subtitle": { pt: "Acompanhamento estratégico. Os dados serão preenchidos via integrações ou entrada manual.", es: "Seguimiento estratégico. Los datos se completarán mediante integraciones o entrada manual.", en: "Strategic tracking. Data will be filled via integrations or manual entry." },
  "dash.guidedAnalysis": { pt: "Análise Guiada GLX", es: "Análisis Guiado GLX", en: "GLX Guided Analysis" },
  "dash.selectQuestion": { pt: "Selecione uma pergunta estratégica...", es: "Seleccione una pregunta estratégica...", en: "Select a strategic question..." },
  "dash.monthlyTrend": { pt: "Tendência Mensal", es: "Tendencia Mensual", en: "Monthly Trend" },
  "dash.proAnalytics": { pt: "Análises Pro (Avançado)", es: "Análisis Pro (Avanzado)", en: "Pro Analytics (Advanced)" },
  "dash.enterprise": { pt: "Governança Enterprise (Redes)", es: "Gobernanza Enterprise (Redes)", en: "Enterprise Governance (Networks)" },
  "dash.essentialMetrics": { pt: "Métricas Essenciais", es: "Métricas Esenciales", en: "Essential Metrics" },
  "dash.waitingData": { pt: "Aguardando dados", es: "Esperando datos", en: "Awaiting data" },

  // KPI labels
  "kpi.revenue": { pt: "Faturamento Mês", es: "Facturación Mes", en: "Monthly Revenue" },
  "kpi.appointments": { pt: "Total Agendamentos", es: "Total Citas", en: "Total Appointments" },
  "kpi.noshow": { pt: "Taxa de No-Show", es: "Tasa de No-Show", en: "No-Show Rate" },
  "kpi.conversion": { pt: "Conversão Geral", es: "Conversión General", en: "Overall Conversion" },
  "kpi.projRevenue": { pt: "Projeção Faturamento", es: "Proyección Facturación", en: "Revenue Projection" },
  "kpi.ltvProj": { pt: "LTV Projetado", es: "LTV Proyectado", en: "Projected LTV" },
  "kpi.cacAvg": { pt: "CAC Médio", es: "CAC Promedio", en: "Average CAC" },
  "kpi.adsInvestment": { pt: "Investimento (Ads)", es: "Inversión (Ads)", en: "Investment (Ads)" },
  "kpi.cpl": { pt: "Custo por Lead (CPL)", es: "Costo por Lead (CPL)", en: "Cost per Lead (CPL)" },
  "kpi.roas": { pt: "ROAS", es: "ROAS", en: "ROAS" },

  // Data entry
  "data.financialTab": { pt: "Lançamento Financeiro", es: "Registro Financiero", en: "Financial Entry" },
  "data.attendanceTab": { pt: "Atendimento / Paciente", es: "Atención / Paciente", en: "Attendance / Patient" },
  "data.type": { pt: "Tipo", es: "Tipo", en: "Type" },
  "data.value": { pt: "Valor (R$)", es: "Valor (R$)", en: "Value (R$)" },
  "data.revenue": { pt: "Receita (Faturamento)", es: "Ingreso (Facturación)", en: "Revenue" },
  "data.cost": { pt: "Custo Fixo", es: "Costo Fijo", en: "Fixed Cost" },
  "data.variableCost": { pt: "Custo Variável", es: "Costo Variable", en: "Variable Cost" },
  "data.registerFinancial": { pt: "Registrar Financeiro", es: "Registrar Financiero", en: "Register Financial" },
  "data.status": { pt: "Status", es: "Estado", en: "Status" },
  "data.attended": { pt: "Compareceu", es: "Asistió", en: "Attended" },
  "data.noshow": { pt: "No-Show", es: "No-Show", en: "No-Show" },
  "data.cancelled": { pt: "Cancelada", es: "Cancelada", en: "Cancelled" },
  "data.reason": { pt: "Motivo (se cancelou)", es: "Motivo (si canceló)", en: "Reason (if cancelled)" },
  "data.registerAttendance": { pt: "Registrar Atendimento", es: "Registrar Atención", en: "Register Attendance" },
  "data.recentRecords": { pt: "Registros Recentes", es: "Registros Recientes", en: "Recent Records" },
  "data.noRecords": { pt: "Nenhum registro ainda. Insira dados acima.", es: "Sin registros aún. Ingrese datos arriba.", en: "No records yet. Enter data above." },
  "data.confirmDelete": { pt: "Tem certeza que deseja excluir este registro?", es: "¿Está seguro de que desea eliminar este registro?", en: "Are you sure you want to delete this record?" },

  // Integrations
  "int.title": { pt: "Integrações de API e Token", es: "Integraciones de API y Token", en: "API & Token Integrations" },
  "int.subtitle": { pt: "Toda API e Token leva os dados para o sistema e distribui onde deve ser alocado.", es: "Toda API y Token lleva los datos al sistema y distribuye donde debe ser asignado.", en: "Every API and Token feeds data into the system and distributes it where needed." },
  "int.trackingTab": { pt: "Tracking & Ads", es: "Tracking & Ads", en: "Tracking & Ads" },
  "int.dataTab": { pt: "Dados & Planilhas", es: "Datos & Hojas", en: "Data & Sheets" },
  "int.crmTab": { pt: "CRM & Automação", es: "CRM & Automatización", en: "CRM & Automation" },
  "int.fileImportTab": { pt: "Importação Inteligente", es: "Importación Inteligente", en: "Smart Import" },
  "int.active": { pt: "Ativo", es: "Activo", en: "Active" },
  "int.inactive": { pt: "Inativo", es: "Inactivo", en: "Inactive" },
  "int.pending": { pt: "Pendente", es: "Pendiente", en: "Pending" },
  "int.error": { pt: "Erro", es: "Error", en: "Error" },

  // File import
  "file.title": { pt: "Importação Inteligente de Planilhas", es: "Importación Inteligente de Hojas", en: "Smart Spreadsheet Import" },
  "file.subtitle": { pt: "Faça upload de um arquivo .xlsx, .xls ou .csv e a IA GLX identificará automaticamente as colunas e distribuirá os dados nos módulos corretos do dashboard.", es: "Suba un archivo .xlsx, .xls o .csv y la IA GLX identificará automáticamente las columnas y distribuirá los datos en los módulos correctos del dashboard.", en: "Upload a .xlsx, .xls or .csv file and GLX AI will automatically identify columns and distribute data to the correct dashboard modules." },
  "file.dropzone": { pt: "Arraste seu arquivo aqui ou clique para selecionar", es: "Arrastre su archivo aquí o haga clic para seleccionar", en: "Drag your file here or click to select" },
  "file.supported": { pt: "Formatos suportados: .xlsx, .xls, .csv", es: "Formatos soportados: .xlsx, .xls, .csv", en: "Supported formats: .xlsx, .xls, .csv" },
  "file.analyzing": { pt: "Analisando arquivo...", es: "Analizando archivo...", en: "Analyzing file..." },
  "file.success": { pt: "Dashboard alimentado com sucesso!", es: "¡Dashboard alimentado con éxito!", en: "Dashboard fed successfully!" },

  // AI Router
  "ai.title": { pt: "🧠 IA GLX: Roteador de Dados", es: "🧠 IA GLX: Enrutador de Datos", en: "🧠 GLX AI: Data Router" },
  "ai.analyzing": { pt: "Analisando payload recebido e distribuindo informações pelos módulos estratégicos do Dashboard...", es: "Analizando payload recibido y distribuyendo información por los módulos estratégicos del Dashboard...", en: "Analyzing received payload and distributing information across strategic Dashboard modules..." },
  "ai.routingDone": { pt: "Roteamento Finalizado. O Dashboard foi alimentado.", es: "Enrutamiento Finalizado. El Dashboard fue alimentado.", en: "Routing Complete. Dashboard has been fed." },

  // Modals
  "modal.addProfessional": { pt: "Adicionar Profissional", es: "Agregar Profesional", en: "Add Professional" },
  "modal.newSprint": { pt: "Nova Iniciativa (Sprint)", es: "Nueva Iniciativa (Sprint)", en: "New Initiative (Sprint)" },
  "modal.newOkr": { pt: "Definir Novo OKR", es: "Definir Nuevo OKR", en: "Define New OKR" },
  "modal.importAgenda": { pt: "Importar Agenda (CSV)", es: "Importar Agenda (CSV)", en: "Import Schedule (CSV)" },

  // Toasts
  "toast.revenueAdded": { pt: "Receita computada com sucesso! Gráficos atualizados.", es: "¡Ingreso registrado con éxito! Gráficos actualizados.", en: "Revenue recorded successfully! Charts updated." },
  "toast.costAdded": { pt: "Custo registrado.", es: "Costo registrado.", en: "Cost recorded." },
  "toast.attendanceAdded": { pt: "Atendimento computado! Analisando impacto...", es: "¡Atención registrada! Analizando impacto...", en: "Attendance recorded! Analyzing impact..." },
  "toast.invalidValue": { pt: "Insira um valor válido.", es: "Ingrese un valor válido.", en: "Enter a valid value." },
  "toast.pdfGenerated": { pt: "PDF gerado e baixado com sucesso!", es: "¡PDF generado y descargado con éxito!", en: "PDF generated and downloaded successfully!" },
  "toast.settingsSaved": { pt: "Configurações salvas.", es: "Configuraciones guardadas.", en: "Settings saved." },
  "toast.recordDeleted": { pt: "Registro excluído com sucesso.", es: "Registro eliminado con éxito.", en: "Record deleted successfully." },
  "toast.integrationSaved": { pt: "configurado com sucesso!", es: "¡configurado con éxito!", en: "configured successfully!" },
  "toast.integrationRemoved": { pt: "Integração removida.", es: "Integración eliminada.", en: "Integration removed." },
  "toast.fillField": { pt: "Preencha pelo menos um campo.", es: "Complete al menos un campo.", en: "Fill in at least one field." },
  "toast.professionalAdded": { pt: "Profissional adicionado com sucesso!", es: "¡Profesional agregado con éxito!", en: "Professional added successfully!" },
  "toast.sprintCreated": { pt: "Sprint criado! Vamos à execução.", es: "¡Sprint creado! Vamos a la ejecución.", en: "Sprint created! Let's execute." },
  "toast.okrSaved": { pt: "OKR registrado para o trimestre.", es: "OKR registrado para el trimestre.", en: "OKR registered for the quarter." },

  // Misc
  "misc.loading": { pt: "Carregando...", es: "Cargando...", en: "Loading..." },
  "misc.language": { pt: "Idioma", es: "Idioma", en: "Language" },
  "misc.thisMonth": { pt: "Este Mês (Atual)", es: "Este Mes (Actual)", en: "This Month (Current)" },
  "misc.lastMonth": { pt: "Mês Passado", es: "Mes Pasado", en: "Last Month" },
  "misc.last90days": { pt: "Últimos 90 dias", es: "Últimos 90 días", en: "Last 90 days" },
  "misc.auditWarning": { pt: "Seus dados manuais possuem cancelamentos sem motivos preenchidos.", es: "Sus datos manuales tienen cancelaciones sin motivos completados.", en: "Your manual data has cancellations without filled reasons." },
} as const;

export type TKey = keyof typeof T;

export function t(key: TKey, lang: Lang): string {
  const entry = T[key];
  if (!entry) return key;
  return entry[lang] || entry["pt"];
}
