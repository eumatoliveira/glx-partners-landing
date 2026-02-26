# GLX Partners Landing Page - TODO

## Versão 6.2 - Sistema de Internacionalização (i18n)

- [x] Criar arquivos de tradução (pt.ts, en.ts, es.ts)
- [x] Criar LanguageContext para gerenciar idioma global
- [x] Adicionar LanguageProvider ao App.tsx
- [x] Traduzir Navbar.tsx
- [x] Traduzir Hero.tsx
- [x] Traduzir ImpactSection.tsx
- [x] Traduzir WhySection.tsx
- [x] Traduzir WhatSection.tsx
- [x] Traduzir HowSection.tsx
- [x] Traduzir FaqSection.tsx
- [x] Traduzir TestimonialsSection.tsx
- [x] Traduzir ResultsSection.tsx
- [x] Traduzir Footer.tsx
- [x] Traduzir ContactForm.tsx
- [x] Traduzir Login.tsx
- [x] Traduzir Dashboard.tsx

## Versão 6.1 - Simplificação do Login

- [x] Remover botão OAuth "Entrar com Manus"
- [x] Remover título/descrição da área de membros
- [x] Remover separador "ou entre com e-mail"

## Versão 6.0 - Full-Stack Upgrade

- [x] Upgrade para projeto Full-Stack com banco de dados
- [x] Integração com MySQL/TiDB
- [x] Sistema de autenticação OAuth
- [x] Página de Dashboard para usuários autenticados
- [x] Seletor de idiomas no menu

## Versão 5.0 - Otimização Mobile

- [x] Ajustes de responsividade na página de Login
- [x] Verificação de meta viewport
- [x] Ajustes de espaçamentos e fontes para mobile

## Versão 4.x - Funcionalidades de Login

- [x] Criar página de Login
- [x] Adicionar botão "Área de Membros" no menu
- [x] Implementar "Ver Senha" (ícone de olho)
- [x] Implementar checkbox "Lembrar-me"
- [x] Ajustar tamanho do logo na página de Login
- [x] Adicionar links para Calendly e Planos

## Ajustes Pendentes (Baixa Prioridade)

- [ ] Implementar autenticação real com backend
- [ ] Conectar formulário de contato a CRM
- [ ] Implementar recuperação de senha
- [ ] Adicionar analytics (Google Analytics)

## Versão 6.6 - Página de Planos

- [x] Criar página de Planos (Plans.tsx)
- [x] Seção GLX Partners (Diagnóstico, Setup Start, Setup Pro, Gestão Contínua)
- [x] Seção GLX Control Tower (Setup, Gestão Contínua)
- [x] Planos Control Tower (Essentials, Pro, Enterprise)
- [x] Espaço para vídeos explicativos em cada plano
- [x] Design em cards/slides com animações
- [x] Adicionar rota /planos no App.tsx
- [x] Vincular botão "Conheça nossos planos" à nova página
- [x] Adicionar traduções da página de Planos (PT, EN, ES)

## Versão 6.7 - Reorganização da Página de Planos

- [x] Reorganizar estrutura: 2 planos principais (GLX Partners e GLX Control Tower)
- [x] Plano 1 GLX Partners: card único com Diagnóstico 15D + Setup (Start 60D/Pro 90D) + Gestão Contínua 12-24M
- [x] Plano 2 GLX Control Tower: 3 tiers (Essentials, Pro, Enterprise)
- [x] 1 espaço para vídeo por plano
- [x] Botão único "Solicitar Proposta" para cada plano
- [x] Manter descrições e design/cores do site

## Versão 6.8 - Vídeo GLX Control Tower

- [x] Adicionar área de vídeo única para o plano GLX Control Tower
- [x] Remover vídeos individuais dos tiers (Essentials, Pro, Enterprise)

## Versão 7.0 - Dashboard Administrativo (Centro de Comando)

### Estrutura Base
- [x] Configurar schema do banco de dados para admin
- [x] Criar tabelas: audit_logs, system_metrics, feature_flags, subscriptions
- [x] Configurar autenticação admin (email via variáveis de ambiente)

### Painel Financeiro
- [x] Card MRR/ARR com gráfico de linha
- [x] Card Churn Rate com alerta visual
- [x] Card LTV comparativo com CAC
- [x] Lista de Inadimplência com ações

### Controle de Acessos & Segurança
- [x] User Impersonation (Logar como usuário)
- [x] Gestão de Roles (Admin, Editor, Viewer, Financeiro)
- [x] Audit Log (histórico de alterações)
- [x] MFA Status (visualização 2FA)

### Saúde do Sistema & Cloud
- [x] Status dos Serviços (API, DB, Workers, CDN)
- [x] Consumo de Recursos (CPU, Memória, Armazenamento)
- [x] Previsão de Gastos Cloud
- [x] Latência Média

### Identificação de Erros
- [x] Error Rate (gráfico 4xx/5xx)
- [x] Live Logs (feed em tempo real)
- [x] Alertas Inteligentes

### UI/UX
- [x] Sidebar com navegação (Dashboard, Usuários, Billing, Logs, Settings)
- [x] Top Bar com busca global e seletor de ambiente
- [x] Cards modulares com design dark mode
- [x] Feature Flags (God Mode)

## Versão 8.0 - Dashboard GLX Partners (Performance Analytics)

### Estrutura Base
- [x] Criar novo layout GLXDashboardLayout com sidebar e tema light/dark
- [x] Implementar toggle de tema (light/dark mode)
- [x] Criar utilitários de exportação PDF e CSV
- [x] Instalar dependências (Chart.js, jsPDF, etc.)

### Telas do Dashboard
- [x] Home CEO (Scorecard + Alertas + Ações + Forecast)
- [x] Receita/Margem/Caixa (Financials)
- [x] Operação (Agenda/Capacidade)
- [x] No-show (Waste Analysis)
- [x] Funil Comercial (Sales Funnel)
- [x] Marketing ROI (Growth Engine)
- [x] Protocolos/Forecast
- [x] Qualidade/NPS
- [x] Pessoas (HR Analytics)
- [x] Data Governance

### Componentes Visuais
- [x] Cards de KPI com indicadores de tendência
- [x] Gráficos de linha (tendências)
- [x] Gráficos de barra (comparativos)
- [x] Gráficos de pizza/donut (distribuição)
- [x] Heatmaps (frequência por dia/hora)
- [x] Funil visual (conversão)
- [x] Tabelas com ordenação e filtros

### Indicadores Lean Six Sigma
- [x] Sigma Level (σ)
- [x] DPMO (Defects Per Million Opportunities)
- [x] Cp/Cpk (Process Capability)
- [x] OEE (Overall Equipment Effectiveness)
- [x] Yield e First Pass Yield

### Funcionalidades
- [x] Exportar relatório PDF de cada tela
- [x] Exportar dados CSV de cada tela
- [x] Filtro de período (7d, 30d, 90d, 12m)
- [x] Alertas visuais para métricas críticas

## Versão 9.0 - Sistema de Controle de Acesso

### Estrutura de Autenticação
- [x] Criar tabela de usuários com email/senha hash
- [x] Criar tabela de sessões para controle de login
- [x] Definir roles (admin, user)
- [x] Configurar admin principal via variáveis de ambiente

### Sistema de Login
- [x] Criar página de login com email/senha
- [x] Implementar hash de senha (bcrypt)
- [x] Criar rotas de autenticação (login, logout, register)
- [x] Implementar sessões JWT

### Controle de Acesso
- [x] Proteger rotas do Dashboard GLX (apenas admin)
- [x] Proteger rotas do Dashboard Admin (apenas admin)
- [x] Criar middleware de verificação de role
- [x] Redirecionar usuários não autorizados

### Gestão de Usuários (Admin)
- [x] Listar todos os usuários
- [x] Criar/editar/excluir usuários
- [x] Alterar roles de usuários
- [x] Resetar senhas

## Versão 10.0 - Painel de Administração Completo

### Módulo de Finanças
- [x] Dashboard financeiro com MRR e ARR
- [x] Gráfico de evolução de receita
- [x] Taxa de Churn com alertas visuais
- [x] LTV (Lifetime Value) comparativo com CAC
- [x] Lista de inadimplência com ações
- [x] Exportação de relatórios PDF/CSV

### Módulo de Controle de Acesso
- [x] Gestão completa de usuários (CRUD)
- [x] Gestão de roles e permissões
- [x] Audit logs com filtros e busca
- [x] Status de MFA dos usuários
- [x] User impersonation para suporte

### Módulo de Saúde do Sistema
- [x] Status dos serviços (API, DB, CDN)
- [x] Consumo de recursos (CPU, Memória, Storage)
- [x] Latência média da aplicação
- [x] Monitoramento de erros (4xx, 5xx)
- [x] Live logs em tempo real
- [x] Alertas inteligentes

### UI/UX
- [x] Layout AdminLayout com sidebar
- [x] Design dark mode profissional
- [x] Cards modulares com métricas
- [x] Gráficos interativos (Chart.js)
- [x] Tabelas com ordenação e filtros

## Versão 10.1 - Ajuste do Fluxo de Login

- [x] Verificar botão "Área de Membros" no Navbar
- [x] Garantir que direciona para /login
- [x] Ajustar página de login para autenticação por email/senha
- [x] Após login, redirecionar para dashboard apropriado (admin ou user)

## Versão 10.2 - Correção do Redirecionamento após Login

- [x] Corrigir redirecionamento após login bem-sucedido
- [x] Garantir que o usuário seja redirecionado para /glx (admin) ou /dashboard (user)

## Versão 11.0 - Novo Painel de Administração (Centro de Comando SaaS)

### Estrutura Base
- [x] Excluir arquivos admin existentes
- [x] Criar novo AdminLayout com sidebar e top bar
- [x] Implementar busca global (usuários por email/ID)
- [x] Implementar seletor de ambiente (Production/Staging)
- [x] Cards modulares com bordas arredondadas e sombras

### 1. Painel Financeiro (Health Check)
- [x] MRR/ARR com gráfico de linha ascendente
- [x] Churn Rate com alerta visual (> 5%)
- [x] LTV comparativo com CAC
- [x] Lista de Inadimplência com ações necessárias

### 2. Controle de Acessos & Segurança (RBAC)
- [x] User Impersonation (Logar como usuário)
- [x] Gestão de Roles (Admin, Editor, Viewer, Financeiro)
- [x] Audit Log (histórico de alterações)
- [x] MFA Status (visualização 2FA)

### 3. Saúde do Sistema & Cloud (DevOps Lite)
- [x] Status dos Serviços (API, DB, Workers, CDN)
- [x] Consumo de Recursos (CPU, Memória, Armazenamento)
- [x] Previsão de Gastos Cloud
- [x] Latência Média global

### 4. Identificação de Erros (Observabilidade)
- [x] Error Rate (gráfico 4xx/5xx 24h)
- [x] Live Logs (feed em tempo real estilo terminal)
- [x] Alertas Inteligentes (tempestade de erros)

### Feature Flags (God Mode)
- [x] Ativar/desativar funcionalidades por cliente
- [x] Interface de gerenciamento de flags

## Versão 11.1 - Correção de Erro no Dashboard

- [x] Corrigir erro "Cannot update a component while rendering" no Dashboard
- [x] Mover chamada de navegação para useEffect

## Versão 11.2 - Redirecionamento para /admin

- [x] Alterar redirecionamento após login de /glx para /admin
- [x] Atualizar useEffect de autenticação para redirecionar para /admin

## Versão 12.0 - Correção de Login e Remoção de /glx

- [x] Analisar vídeo para identificar problema no login
- [x] Corrigir fluxo de login para abrir /admin após autenticação
- [x] Excluir todas as páginas /glx (GLXDashboardLayout, páginas glx-dashboard)
- [x] Remover rotas /glx do App.tsx
- [x] Testar fluxo completo de login

## Versão 12.1 - Correção do Sistema de Login

- [x] Criar usuário admin no banco de dados com credenciais corretas
- [x] Corrigir API de login para funcionar corretamente
- [x] Corrigir autenticação no sdk.ts para suportar tokens de email/senha
- [x] Garantir redirecionamento para /admin após login bem-sucedido
- [x] Testar fluxo completo de login

## Versão 13.0 - Dashboard Cliente GLX Performance

### Estrutura Base
- [x] Criar layout ClientDashboardLayout com sidebar dark mode
- [x] Implementar toggle de tema (dark/light mode)
- [x] Criar sistema de navegação com menu lateral
- [x] Configurar usuário de teste para clientes via variáveis de ambiente

### Tela 1: Home CEO (Control Tower)
- [x] Scorecard com 4 KPIs principais (Faturamento, EBITDA, NPS, Ocupação)
- [x] Mini sparklines para tendência 6 meses
- [x] Alertas Andon (exceções críticas)
- [x] Forecast: Realizado vs Meta vs Tendência

### Tela 2: Financials (Receita/Margem/Caixa)
- [x] Gráfico de Cascata (Waterfall Chart) para composição da margem
- [x] Margem de Contribuição por Hora Clínica
- [x] Indicadores financeiros com tendência

### Tela 3: Operations (Agenda/Capacidade)
- [x] OEE das Salas (Disponibilidade x Performance x Qualidade)
- [x] Takt Time vs Cycle Time
- [x] Gráfico de Gantt simplificado de ocupação

### Tela 4: No-show & Waste
- [x] Heatmap de frequência por dia/hora
- [x] Waste Breakdown (donut chart)
- [x] COPQ (Cost of Poor Quality)
- [x] Pareto de Motivos
- [x] Recovery Actions com status

### Tela 5: Growth & Marketing ROI
- [x] Funil Comercial com taxas de conversão
- [x] KPIs de Marketing (Spend, CPL, CAC, ROI)
- [x] ROI Forecast vs Actual
- [x] Channel Performance table
- [x] Insights card

### Tela 6: Qualidade/NPS
- [x] NPS com análise de sentimento
- [x] Taxa de Reclamações (DPMO adaptado)
- [x] Gráfico de Controle (Control Chart)

### Tela 7: Pessoas (RH)
- [x] Produtividade (Revenue per FTE)
- [x] Absenteísmo e Turnover
- [x] Gráficos comparativos

### Tela 8: Data Governance
- [x] Qualidade do Dado (% cadastros incompletos)
- [x] Log de Auditoria

### Exportação PDF
- [x] Relatórios com gráficos e tabelas
- [x] Linguagem LSS Master Black Belt
- [x] Logo GLX em todos os relatórios
- [x] Descrição de cada gráfico e aplicação prática

### Responsividade Mobile
- [x] Revisar todas as telas para formato mobile
- [x] Ajustar grids e cards para telas pequenas
- [x] Testar em diferentes resoluções

## Versão 14.0 - Sistema de Gestão de Dados do Dashboard

### Schema do Banco de Dados
- [x] Criar tabela dashboard_clients para clientes
- [x] Criar tabela ceo_metrics para métricas do CEO
- [x] Criar tabela financial_data para dados financeiros
- [x] Criar tabela operations_data para dados operacionais
- [x] Criar tabela waste_data para dados de desperdício
- [x] Criar tabela marketing_data para dados de marketing
- [x] Criar tabela quality_data para dados de qualidade
- [x] Criar tabela people_data para dados de RH
- [x] Criar tabela data_governance para governança de dados
- [x] Criar tabela andon_alerts para alertas
- [x] Criar tabela data_imports para histórico de importações

### Painel Admin - Gestão Manual
- [x] Criar página de gestão de métricas no admin (/admin/data-management)
- [x] Formulários para editar cada KPI (CEO Scorecard implementado)
- [x] Seletor de cliente
- [x] Criação de novos clientes

### Upload de Planilha
- [x] Implementar upload de arquivos Excel/CSV
- [x] Parser para diferentes formatos de planilha (xlsx)
- [x] Preview dos dados antes de importar
- [x] Seleção de categoria de dados

### Processamento com IA
- [x] Interface para colar texto livre
- [x] Extração automática de métricas via LLM
- [x] Exemplos de texto para facilitar uso
- [x] Endpoint processWithAI no servidor

### Integração com Dashboard
- [x] Endpoint clientDashboard.getMyDashboard para clientes
- [x] Estrutura de dados preparada para conexão

## Versão 14.1 - Correções de UI

### Página de Planos
- [x] Corrigir destaque do plano GLX Partners - apenas "Gestão Contínua" deve estar em laranja

### Responsividade Mobile
- [x] Revisar Home/Landing page
- [x] Revisar página de Login
- [x] Revisar Dashboard Admin
- [x] Revisar Dashboard Cliente (todas as 8 telas)
- [x] Revisar página de Gestão de Dados
- [x] Ajustar tamanhos de fonte, cards e quadros para mobile

## Versão 14.2 - Correção de SEO

- [x] Adicionar meta description à página inicial (50-160 caracteres)
- [x] Adicionar meta keywords à página inicial
- [x] Adicionar Open Graph tags para redes sociais
- [x] Adicionar Twitter Card tags
- [x] Adicionar canonical URL
- [x] Alterar lang para pt-BR
- [x] Testar e validar SEO

## Versão 15.0 - Refatoração do Painel Admin

### Remoções
- [x] Remover "Gestão de Dados" da sidebar
- [x] Remover rota /admin/data-management

### Dados Reais
- [x] Conectar lista de usuários ao banco de dados real
- [ ] Conectar métricas financeiras ao banco de dados real
- [x] Implementar CRUD de usuários funcional

### Entrada de Dados
- [x] Permitir adicionar usuários manualmente (via dialog)
- [x] Permitir editar usuários existentes (alterar role)
- [ ] Implementar importação via Excel (opcion### Redesign Visual
- [x] Aplicar novo design inspirado nos dashboards fornecidos
- [x] Sidebar escura com conteúdo light mode
- [x] Toggle dark/light mode funcional
- [x] Cores de destaque laranja/verdedestaques
- [ ] Toggle dark/light mode


## Versão 16.0 - Dashboard do Cliente Remodeladoal

- [x] Remodelar página /dashboard com novo design
- [x] Implementar sidebar navegável com múltiplas seções
- [x] Criar KPIs em destaque (Faturamento, Margem, Pacientes, Taxa de Retorno)
- [x] Adicionar seção "Acesso Rápido" com atalhos
- [x] Implementar toggle dark/light mode
- [x] Integrar com autenticação de cliente
- [x] Testar fluxo completo de login de cliente

## Versão 17.0 - Dashboard Completo (Código Fornecido pelo Cliente)

### Estrutura Base
- [x] Sidebar com navegação completa (12 seções)
- [x] Topbar com seletor de plano, Exportar PDF, toggle tema
- [x] CSS Variables completas (dark/light mode)
- [x] Google Fonts + background dots pattern
- [x] Animações fadeIn, slideUp, stagger delays

### Seções de Conteúdo
- [x] Dashboard (Visão Geral) com KPIs, Análise Guiada, Pareto, Enterprise
- [x] Tempo Real (gráfico de fluxo)
- [x] Agenda & Capacidade (KPIs + Mapa de Calor)
- [x] Equipe & Produtividade (tabela + modal)
- [x] Sprints & OKRs (tabela + modais)
- [x] Funil Comercial (doughnut chart)
- [x] Canais de Aquisição (KPIs)
- [x] Integrações/CRM (Google Sheets, IA GLX, GTM, Pixel, CRM)
- [x] Entrada de Dados Manual (Financeiro + Atendimento)
- [x] Relatórios PDF/CSV
- [x] Diagnóstico GLX
- [x] Configurações (Metas Ouro)

### Funcionalidades Globais
- [x] IA Router modal com logs animados
- [x] Toast notifications
- [x] Modais (Profissional, Sprint, OKR, Agenda CSV, IA Router)
- [x] Chart.js (Pareto, Enterprise, Live, Funil, Dashboard)
- [x] Toggle dark/light mode com re-render charts
- [x] Sistema de planos com lock/unlock (Essential/Pro/Enterprise)
- [ ] Drag-and-drop nos blocos do dashboard (placeholder - não implementado)
- [x] Audit Banner para dados incompletos

## Versão 17.1 - Ajustes Dashboard (Solicitação do Cliente)

- [x] Remover seletor de plano (Essential/Pro/Enterprise) da topbar do Dashboard
- [x] Plano deve ser determinado pelo role do usuário definido no admin
- [x] Remover card "Motor de IA (GLX)" da seção de Integrações
- [x] Corrigir fontes para usar Roboto + Google Sans via Google Fonts API
- [x] Aplicar font-family: 'Google Sans', 'Roboto', sans-serif corretamente

## Versão 17.2 - Ajustes Sidebar Dashboard

- [x] Criar botão de sair (logout) no dashboard
- [x] Trocar ícone "G" pela logo da GLX no sidebar
- [x] Renomear "GLX Workspace" para "GLX CONTROL TOWER"
- [x] Exibir foto, nome e email do cliente logado no sidebar (dados reais do usuário)

## Versão 17.3 - Verificação Export PDF

- [x] Verificar se o botão Exportar PDF está funcionando corretamente

## Versão 17.4 - Lógica Dashboard + Integrações + PDF

- [x] Implementar geração real de PDF (jspdf) no botão Exportar PDF
- [x] Zerar todos os dados do dashboard (valores iniciais em 0, prontos para API/manual)
- [x] Criar schema de integrações no banco (integrations table)
- [x] Criar procedures tRPC para CRUD de integrações
- [x] Expandir seção Integrações com lógica completa:
  - [x] Google Sheets API (URL da planilha, conectar/desconectar)
  - [x] Google Tag Manager (GTM-ID, salvar, status)
  - [x] Meta Pixel + Conversion API (CAPI) com destaque
  - [x] Google Ads (Enhanced Conversions com destaque)
  - [x] Excel / Microsoft Graph API
  - [x] Power BI (embed URL, DirectQuery)
  - [x] CRM HubSpot (Enterprise)
  - [x] Server-Side GTM → CAPI + Google Ads API (arquitetura destacada)
- [x] Salvar/carregar configurações de integrações do banco de dados
- [x] Verificar funcionamento completo do dashboard com dados zerados

## Versão 17.5 - Seletor de Idioma + Parser Inteligente de Planilhas

### Seletor de Idioma
- [x] Adicionar seletor de idiomas (PT/ES/EN) no sidebar do dashboard
- [x] Criar sistema de traduções i18n para todas as strings do dashboard
- [x] Posicionar seletor acima do perfil do usuário no sidebar

### Parser Inteligente de Planilhas (Código pasted_content_4.txt)
- [x] Integrar módulo de reconhecimento inteligente de planilhas na tela de Integrações
- [x] Implementar COLUMN_MAP com dicionário de colunas reconhecidas (PT/EN)
- [x] Implementar detectColumn, detectStatus, normalize
- [x] Implementar parseClinicFile com FileReader + xlsx
- [x] Implementar handleClinicFile com validação de tipos
- [x] Implementar buildRoutingLog para IA Router
- [x] Implementar buildWarnings para alertas de auditoria
- [x] Upload de arquivo (.xlsx, .xls, .csv) na seção de Integrações
- [x] IA Router modal com logs animados ao processar arquivo
- [x] Atualizar dados do dashboard automaticamente após importação
- [x] Instalar dependência xlsx (SheetJS) para parsing de planilhas

### Exclusão de Dados Manuais
- [x] Adicionar lista/tabela de registros inseridos na seção Entrada de Dados
- [x] Botão de excluir para cada registro (Financeiro e Atendimento)
- [x] Confirmação antes de excluir

### Revisão Geral
- [x] Revisar todas as funções do dashboard para garantir que nenhuma ficou pela metade

## Versão 17.6 - Remoção Diagnóstico + Verificação Backend Completa

- [x] Remover "Diagnóstico GLX" do sidebar e da navegação do dashboard
- [x] Verificar todas as procedures tRPC do dashboard (CRUD financeiro, atendimento, integrações)
- [x] Testar inserção de dados reais no banco (financeiro + atendimento)
- [x] Testar exibição dos dados nos gráficos/KPIs do dashboard
- [x] Testar exclusão de dados inseridos
- [x] Garantir que todos os endpoints estão funcionando corretamente

## Versão 17.7 - Legendas Explicativas no Dashboard

### Legendas por Seção
- [x] Dashboard (Visão Geral) — explicar KPIs: Faturamento, Margem, Pacientes, Taxa de Retorno, cálculos
- [x] Tempo Real — explicar gráfico de fluxo, como interpretar dados em tempo real
- [x] Agenda & Capacidade — explicar Mapa de Calor, taxa de ocupação, cálculo de capacidade
- [x] Equipe & Produtividade — explicar métricas de produtividade, score, cálculos
- [x] Sprints & OKRs — explicar metodologia OKR, Key Results, progresso
- [x] Funil Comercial — explicar etapas do funil, taxas de conversão, cálculos
- [x] Canais de Aquisição — explicar CAC, ROI, LTV, CPC, CTR e outras siglas
- [x] Integrações — explicar siglas (GTM, CAPI, API, CRM) e métodos de integração
- [x] Entrada de Dados — explicar tipos de lançamento e categorias
- [x] Relatórios PDF — explicar métricas incluídas no relatório
- [x] Configurações — explicar Metas Ouro e como são utilizadas

### Componente de Legenda
- [x] Criar componente reutilizável de legenda (ícone ℹ️ + tooltip/card expansível)
- [x] Estilizar legendas para dark/light mode
- [x] Integrar com sistema de tradução i18n (PT/ES/EN)

### Glossário de Siglas
- [x] ROI, CAC, LTV, EBITDA, CAPI, GTM, CRM, OKR, KPI, CPC, CTR, CPL, NPS, Churn

## Versão 17.8 - Tradução das Legendas do Dashboard

- [ ] Traduzir todas as legendas explicativas para Espanhol (ES)
- [ ] Traduzir todas as legendas explicativas para Inglês (EN)
- [ ] Integrar legendas com sistema i18n existente
- [ ] Testar troca de idioma nas legendas

## Versão 17.8 - Tradução Completa do Dashboard (PT/ES/EN)

- [ ] Auditar todas as strings hardcoded em português no Dashboard.tsx
- [ ] Traduzir legendas explicativas para ES e EN
- [ ] Traduzir labels de formulários, placeholders, botões para ES e EN
- [ ] Traduzir textos de modais (Sprint, OKR, Profissional, etc.) para ES e EN
- [ ] Traduzir mensagens de toast para ES e EN
- [ ] Traduzir textos de integrações (GTM, CAPI, Google Sheets, etc.) para ES e EN
- [ ] Traduzir textos de Entrada de Dados para ES e EN
- [ ] Traduzir textos de Relatórios e Configurações para ES e EN
- [ ] Garantir zero strings em português quando idioma EN ou ES selecionado
- [ ] Testar troca de idioma em todas as seções

## Versão 17.9 - Correção de Erro no Dashboard

- [x] Fix: "Cannot access '_' before initialization" error in Dashboard component
- [x] Remover aba/formulário de Atendimento/Paciente da seção Entrada de Dados do Dashboard

## Versão 18 - Sistema de Planos (Essencial, Pro, Enterprise)

- [x] Adicionar campo 'plan' ao schema do banco de dados (essencial, pro, enterprise)
- [x] Atualizar painel admin para gerenciar planos dos usuários
- [x] Implementar lógica de dashboard diferente por plano (Essencial, Pro, Enterprise)
- [x] Adicionar itens de menu no sidebar baseados no plano do usuário
- [x] Cada plano exibe gráficos e dashboards diferentes
- [x] Procedure updateUserPlan no admin router
- [x] AdminUsuarios.tsx com coluna de plano e dropdown para alterar
- [x] Cards de estatísticas por plano (Essencial, Pro, Enterprise) no admin
- [x] Filtro por plano na lista de usuários
- [x] Ler plano do usuário logado no Dashboard via useAuth()
- [x] PLAN_ACCESS com seções permitidas por plano
- [x] Sidebar: itens bloqueados com ícone de cadeado e opacity reduzida
- [x] Toast de upgrade ao clicar em item bloqueado
- [x] Badge do plano atual na sidebar
