export interface KommoTokenRefreshJobResult {
  startedAt: string;
  provider: "kommo";
  refreshedAccounts: number;
}

export async function runKommoTokenRefreshJob(): Promise<KommoTokenRefreshJobResult> {
  return {
    startedAt: new Date().toISOString(),
    provider: "kommo",
    refreshedAccounts: 0,
  };
}
