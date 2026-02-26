# Deploy multi-cloud / hospedagem

Compatibilidade adicionada para:

- Vercel (`vercel.json` + `api/index.ts`)
- AWS (Docker para ECS/Fargate, App Runner, Elastic Beanstalk)
- GCP (Cloud Run ou App Engine Flex)
- Azure (App Service Linux / Container Apps)
- Hostinger / WordPress (via VPS/reverse proxy; compartilhado tem limitações)

## Teste local (produção)

```bash
pnpm build
pnpm start
```

## Vercel

- Configure as variáveis de ambiente no painel.
- O arquivo `api/index.ts` inicializa o Express em modo serverless.

Exemplo:

```bash
pnpm add -D @vercel/node
vercel
```

## AWS / GCP / Azure (recomendado: Docker)

Use o `Dockerfile` incluído.

```bash
docker build -t glx-partners-landing .
docker run --rm -p 3000:3000 --env-file .env glx-partners-landing
```

## GCP App Engine Flex

- `app.yaml` incluído (usa runtime custom com Docker).

## Azure

- `azure.yaml` incluído como base para `azd` (ajuste subscription/resource group conforme seu ambiente).

## Hostinger

- VPS: suportado (Node/Docker + Nginx reverse proxy).
- Hospedagem compartilhada: normalmente nao suporta backend Node persistente.
- Se usar hospedagem compartilhada, publique apenas frontend estatico e mantenha a API em outro provedor.

## WordPress

WordPress nao executa este backend Node/Express diretamente.

Opcoes viaveis:

- Subdominio separado para este app (recomendado)
- Reverse proxy para um servidor Node externo
- Iframe (menos recomendado)

## Observacoes

- Este projeto nao e apenas estatico (usa Express + tRPC + rotas API).
- Em producao, o backend serve `dist/public` apos `pnpm build`.
