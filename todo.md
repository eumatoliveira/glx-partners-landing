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
- [x] Configurar autenticação admin (email: dev.glxpartners@gmail.com)

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
