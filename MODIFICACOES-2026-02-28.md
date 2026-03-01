# Modificacoes do Dia - 2026-02-28

Este documento resume as alteracoes implementadas hoje no projeto `glx-partners-landing`.

## Resumo

Hoje foram feitas mudancas em cinco frentes principais:

1. Experiencia e autenticacao do cliente
2. Correcao de textos corrompidos e padronizacao UTF-8
3. Hardening de seguranca no backend
4. Integracao administrativa com Kommo
5. Redesign visual do dashboard do cliente

## 1. Autenticacao e experiencia do cliente

### Login local

- Ajuste do bootstrap de usuarios locais para ambiente de desenvolvimento
- Revisao do comportamento de autenticacao local
- Ajuste do rate limit de login em desenvolvimento para evitar falsos bloqueios

Arquivos relacionados:

- `server/authRouter.ts`
- `server/_core/app.ts`

### Pagina "Esqueceu a senha?"

- Criada a pagina de atualizacao de senha com formulario proprio
- Adicionadas animacoes de entrada, loading e sucesso
- Redirecionamento automatico para `/login` apos sucesso visual

Arquivos relacionados:

- `client/src/pages/ForgotPassword.tsx`
- `client/src/pages/Login.tsx`
- `client/src/App.tsx`

### Estado atual de seguranca

- O endpoint publico de `recoverPassword` foi posteriormente bloqueado no backend
- O frontend da pagina ainda existe, mas o fluxo publico foi desativado ate migrar para reset seguro com token

Arquivos relacionados:

- `server/authRouter.ts`
- `server/_core/app.ts`

## 2. Correcao de textos quebrados e UTF-8

### Correcoes visuais de mojibake

Foram corrigidos diversos textos quebrados no dashboard e em componentes relacionados, incluindo exemplos como:

- `Visao do CEO`
- `War Room | Enterprise`
- `Plano de Acao Enterprise`
- `Ocupacao por Dia`
- `Demanda - Profissional - Dia`
- `Funil de Conversao`
- `Distribuicao NPS`
- `Governanca`
- `Conforme`
- `Sincronizado`
- `ATENCAO`
- `CRITICO`

Arquivos relacionados:

- `client/src/features/plan-dashboard-replacement/PlanDashboardApp.tsx`
- `client/src/components/client/AlertSlider.tsx`
- `client/src/lib/dashboardLocale.ts`

### Saneamento global no frontend

- Criado utilitario para normalizacao de mojibake no app
- Aplicada correcao global para textos dinamicos e conteudos renderizados

Arquivos relacionados:

- `client/src/utils/mojibake.ts`
- `client/src/App.tsx`

### Padronizacao do ambiente

- Ajustado o VS Code para priorizar `utf8`
- Habilitado `autoGuessEncoding`

Arquivos relacionados:

- `.vscode/settings.json`

### Banco de dados e collation

- Preparada configuracao para `utf8mb4`
- Criada migration para `utf8mb4_unicode_ci`

Arquivos relacionados:

- `server/db.ts`
- `drizzle/0009_utf8mb4_collation.sql`

## 3. Seguranca e hardening

### Superficies corrigidas

- Remocao de exposicao indevida de dados sensiveis em `auth.me`
- Mitigacao de CSRF em mutacoes autenticadas por cookie
- Restricao conservadora de acesso ao dashboard por `clientSlug`
- Bloqueio de SSRF em `voiceTranscription.ts`
- Validacao de assinatura no webhook Kommo
- Endpoint de webhook de revogacao preparado
- Desativacao de `register` publico
- Bloqueio do `recoverPassword` publico
- Garantia de que usuarios bootstrap existam apenas em `development`

Arquivos relacionados:

- `server/routers.ts`
- `server/_core/app.ts`
- `server/_core/voiceTranscription.ts`
- `server/application/useCases/processKommoWebhookUseCase.ts`
- `server/infrastructure/webhooks/kommoRouter.ts`
- `server/authRouter.ts`
- `server/_core/env.ts`

### Observacao

O fluxo correto de recuperacao de senha por token ainda nao foi implementado. Hoje foi feito o bloqueio do fluxo publico anterior para reduzir risco.

## 4. Kommo

### Camada administrativa

- Criada tela administrativa para configuracao manual de OAuth e webhook da Kommo
- Adicionados campos para:
  - `Client ID`
  - `Client Secret`
  - `Redirect URL`
  - `Subdomain / Referer`
  - `Authorization Code`
  - `Access Token`
  - `Refresh Token`
  - `Webhook Secret`
  - `Webhook URL`
  - `Revoked Access URL`

Arquivos relacionados:

- `client/src/pages/admin/AdminKommo.tsx`
- `client/src/components/AdminLayout.tsx`
- `client/src/pages/admin/AdminDashboard.tsx`
- `client/src/App.tsx`

### Backend

- Inclusao de variaveis de ambiente para Kommo
- Preparacao da validacao de webhook e endpoint de revogacao

Arquivos relacionados:

- `server/_core/env.ts`
- `server/infrastructure/webhooks/kommoRouter.ts`
- `server/application/useCases/processKommoWebhookUseCase.ts`

## 5. Landing page e carrossel de logos

- A antiga secao de logos foi substituida por um carrossel horizontal
- Adicionado loop automatico para a esquerda
- Adicionado suporte a drag por mouse e touch
- Ajustado o fade lateral para o tema escuro da secao

Arquivos relacionados:

- `client/src/components/ImpactSection.tsx`

## 6. Dashboard do cliente: redesign visual

### Escopo

O redesign foi aplicado apenas no dashboard do cliente, sem alterar logica, dados, botoes, filtros, graficos ou fluxo funcional.

### Mudancas visuais

- Novo shell com linguagem premium alinhada a pagina de planos
- Fundo com profundidade, grade sutil e glows laranja/ciano
- Sidebar em glassmorphism com destaque de navegacao
- Topbar mais moderna, sticky e com acoes em pills
- Cards, secoes, tabelas e overlays com visual mais sofisticado
- Melhor responsividade mobile
- Melhor leitura de dashboards extensos

Arquivos relacionados:

- `client/src/features/plan-dashboard-replacement/PlanDashboardApp.tsx`
- `client/src/features/plan-dashboard-replacement/scoped.css`

## 7. Validacao executada hoje

Build validado com sucesso:

```bash
npm.cmd run build
```

Resultado:

- build do frontend concluido
- bundle do backend concluido
- permaneceram apenas warnings antigos de chunk grande e `manualChunks`

## 8. Arquivos principais alterados hoje

### Frontend

- `client/src/App.tsx`
- `client/src/components/AdminLayout.tsx`
- `client/src/components/ImpactSection.tsx`
- `client/src/components/client/AlertSlider.tsx`
- `client/src/features/plan-dashboard-replacement/PlanDashboardApp.tsx`
- `client/src/features/plan-dashboard-replacement/scoped.css`
- `client/src/lib/dashboardLocale.ts`
- `client/src/pages/ForgotPassword.tsx`
- `client/src/pages/Login.tsx`
- `client/src/pages/admin/AdminDashboard.tsx`
- `client/src/pages/admin/AdminKommo.tsx`
- `client/src/utils/mojibake.ts`

### Backend

- `server/_core/app.ts`
- `server/_core/env.ts`
- `server/_core/voiceTranscription.ts`
- `server/application/useCases/processKommoWebhookUseCase.ts`
- `server/authRouter.ts`
- `server/db.ts`
- `server/infrastructure/webhooks/kommoRouter.ts`
- `server/routers.ts`

### Banco / infraestrutura

- `drizzle/0009_utf8mb4_collation.sql`

## 9. Pendencias naturais apos as mudancas

1. Implementar reset de senha seguro com token por e-mail
2. Persistir de forma segura as credenciais da Kommo em backend/admin
3. Aplicar a migration de `utf8mb4_unicode_ci` no banco
4. Fazer refinamento visual final do dashboard com base em prints reais do uso
