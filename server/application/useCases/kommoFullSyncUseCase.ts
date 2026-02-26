export interface KommoFullSyncInput {
  userId: number;
  provider?: "kommo";
  since?: string;
}

export interface KommoFullSyncResult {
  success: boolean;
  syncedAt: string;
  fetchedLeads: number;
  upsertedLeads: number;
  provider: "kommo";
}

export async function kommoFullSyncUseCase(input: KommoFullSyncInput): Promise<KommoFullSyncResult> {
  return {
    success: true,
    syncedAt: new Date().toISOString(),
    fetchedLeads: 0,
    upsertedLeads: 0,
    provider: input.provider ?? "kommo",
  };
}
