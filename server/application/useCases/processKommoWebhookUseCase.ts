export interface ProcessKommoWebhookInput {
  eventId: string;
  signature?: string;
  payload: unknown;
}

export interface ProcessKommoWebhookResult {
  accepted: boolean;
  status: "processed" | "ignored";
  reason?: string;
}

export async function processKommoWebhookUseCase(input: ProcessKommoWebhookInput): Promise<ProcessKommoWebhookResult> {
  if (!input.eventId) {
    return { accepted: false, status: "ignored", reason: "missing_event_id" };
  }

  // Deterministic delegation only: webhook parsing/normalization happens in infrastructure,
  // mathematical rules remain in domain/alert engine.
  return {
    accepted: true,
    status: "processed",
  };
}
