import { Router } from "express";
import { processKommoWebhookUseCase } from "../../application/useCases/processKommoWebhookUseCase";

function resolveWebhookEventId(payload: unknown): string {
  if (!payload || typeof payload !== "object") return `kommo-${Date.now()}`;
  const record = payload as Record<string, unknown>;
  const direct = record.event_id ?? record.id;
  if (typeof direct === "string" && direct.trim()) return direct;
  if (typeof direct === "number") return String(direct);

  const leads = record.leads;
  if (Array.isArray(leads) && leads.length > 0) {
    const first = leads[0];
    if (first && typeof first === "object") {
      const leadId = (first as Record<string, unknown>).id;
      if (typeof leadId === "string" || typeof leadId === "number") {
        return `lead-${leadId}`;
      }
    }
  }

  return `kommo-${Date.now()}`;
}

export const kommoWebhookRouter = Router();

kommoWebhookRouter.post("/webhook", async (req, res) => {
  try {
    const signature = req.header("x-signature") ?? req.header("x-kommo-signature") ?? undefined;
    const eventId = resolveWebhookEventId(req.body);
    const result = await processKommoWebhookUseCase({
      eventId,
      signature,
      payload: req.body,
    });

    res.status(200).json({
      ok: result.accepted,
      status: result.status,
      eventId,
      reason: result.reason,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: "failed",
      message: error instanceof Error ? error.message : "unknown_error",
    });
  }
});

export function registerKommoWebhookRouter(app: Router) {
  app.use("/crm/kommo", kommoWebhookRouter);
}
