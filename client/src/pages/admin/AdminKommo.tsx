import { useState } from "react";
import { Server, ExternalLink } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { MotionPageShell } from "@/animation/components/MotionPageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminKommo() {
  const [config, setConfig] = useState({
    clientId: "",
    clientSecret: "",
    redirectUrl: `${window.location.origin}/api/oauth/callback`,
    subdomain: "",
    authorizationCode: "",
    accessToken: "",
    refreshToken: "",
    webhookSecret: "",
    webhookUrl: `${window.location.origin}/crm/kommo/webhook`,
    revokedWebhookUrl: `${window.location.origin}/crm/kommo/webhook/revoked`,
  });

  const updateField = (field: keyof typeof config, value: string) => {
    setConfig((current) => ({ ...current, [field]: value }));
  };

  return (
    <AdminLayout>
      <MotionPageShell className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Kommo OAuth + Webhook</h1>
            <p className="text-muted-foreground">Campos oficiais para conectar dados em tempo real com OAuth 2.0 e webhook.</p>
          </div>
          <a href="https://developers.kommo.com/reference/kommo-api-reference" target="_blank" rel="noreferrer">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Documentação oficial
            </Button>
          </a>
        </div>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Configuração
            </CardTitle>
            <CardDescription>Preencha estes campos com os valores cadastrados no app da Kommo.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="kommo-client-id">Client ID</Label>
              <Input id="kommo-client-id" value={config.clientId} onChange={(e) => updateField("clientId", e.target.value)} placeholder="OAuth client_id" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kommo-client-secret">Client Secret</Label>
              <Input id="kommo-client-secret" value={config.clientSecret} onChange={(e) => updateField("clientSecret", e.target.value)} placeholder="OAuth client_secret" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kommo-redirect-url">Redirect URL</Label>
              <Input id="kommo-redirect-url" value={config.redirectUrl} onChange={(e) => updateField("redirectUrl", e.target.value)} placeholder="Callback URL" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kommo-subdomain">Subdomain / Referer</Label>
              <Input id="kommo-subdomain" value={config.subdomain} onChange={(e) => updateField("subdomain", e.target.value)} placeholder="empresa.kommo.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kommo-code">Authorization Code</Label>
              <Input id="kommo-code" value={config.authorizationCode} onChange={(e) => updateField("authorizationCode", e.target.value)} placeholder="code do callback" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kommo-webhook-secret">Webhook Secret</Label>
              <Input id="kommo-webhook-secret" value={config.webhookSecret} onChange={(e) => updateField("webhookSecret", e.target.value)} placeholder="Segredo para validar webhook" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kommo-access-token">Access Token</Label>
              <Input id="kommo-access-token" value={config.accessToken} onChange={(e) => updateField("accessToken", e.target.value)} placeholder="access_token" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kommo-refresh-token">Refresh Token</Label>
              <Input id="kommo-refresh-token" value={config.refreshToken} onChange={(e) => updateField("refreshToken", e.target.value)} placeholder="refresh_token" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kommo-webhook-url">Webhook URL</Label>
              <Input id="kommo-webhook-url" value={config.webhookUrl} onChange={(e) => updateField("webhookUrl", e.target.value)} placeholder="Endpoint de eventos" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kommo-revoked-url">Revoked Access URL</Label>
              <Input id="kommo-revoked-url" value={config.revokedWebhookUrl} onChange={(e) => updateField("revokedWebhookUrl", e.target.value)} placeholder="Endpoint de revogação" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="text-base">Token endpoint</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">https://`subdomain`/oauth2/access_token</CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="text-base">Leads endpoint</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">GET /api/v4/leads</CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="text-base">Modelo recomendado</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">OAuth 2.0 + refresh token + webhook + sincronização REST periódica</CardContent>
          </Card>
        </div>
      </MotionPageShell>
    </AdminLayout>
  );
}
