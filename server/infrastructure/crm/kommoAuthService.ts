import { refreshKommoTokenUseCase } from "../../application/useCases/refreshKommoTokenUseCase";

export interface KommoTokenSet {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export async function refreshKommoAccessToken(params: {
  userId: number;
  refreshToken: string;
  accountDomain: string;
}): Promise<KommoTokenSet> {
  const result = await refreshKommoTokenUseCase(params);
  if (!result.success || !result.accessToken || !result.refreshToken || !result.expiresAt) {
    throw new Error("Failed to refresh Kommo token");
  }
  return {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    expiresAt: result.expiresAt,
  };
}
