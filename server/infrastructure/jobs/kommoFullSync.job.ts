import { kommoFullSyncUseCase } from "../../application/useCases/kommoFullSyncUseCase";

export interface KommoFullSyncJobResult {
  startedAt: string;
  provider: "kommo";
  runs: number;
}

export async function runKommoFullSyncJob(): Promise<KommoFullSyncJobResult> {
  // Placeholder scheduler execution. Actual user/account iteration can be added without changing the contract.
  await kommoFullSyncUseCase({
    userId: 0,
    provider: "kommo",
  });

  return {
    startedAt: new Date().toISOString(),
    provider: "kommo",
    runs: 1,
  };
}
