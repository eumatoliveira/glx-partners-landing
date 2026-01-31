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

## Versão 9.0 - Sistema de Controle de Acesso

### Estrutura de Autenticação
- [x] Criar tabela de usuários com email/senha hash
- [x] Criar tabela de sessões para controle de login
- [x] Definir roles (admin, user)
- [x] Configurar admin principal: dev.glxpartners@gmail.com

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
- [x] Configurar usuário de teste para clientes (cliente.teste@glxpartners.com / Cliente123!)

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
