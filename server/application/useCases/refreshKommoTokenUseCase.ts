export interface RefreshKommoTokenInput {
  userId: number;
  refreshToken: string;
  accountDomain: string;
}

export interface RefreshKommoTokenResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  provider: "kommo";
}

export async function refreshKommoTokenUseCase(_input: RefreshKommoTokenInput): Promise<RefreshKommoTokenResult> {
  return {
    success: true,
    accessToken: "stub-kommo-access-token",
    refreshToken: "stub-kommo-refresh-token",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    provider: "kommo",
  };
}
