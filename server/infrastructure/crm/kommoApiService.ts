export interface KommoLeadDto {
  id: string;
  pipeline?: string;
  status?: string;
  channel?: string;
  responsible?: string;
  procedureName?: string;
  valueAmount?: number;
  createdAt?: string;
  updatedAt?: string;
  rawPayload?: unknown;
}

export async function fetchKommoLeads(_params: {
  accountDomain: string;
  accessToken: string;
  createdAtFrom?: string;
}): Promise<KommoLeadDto[]> {
  // Stub implementation for deterministic, non-breaking integration layer.
  return [];
}
