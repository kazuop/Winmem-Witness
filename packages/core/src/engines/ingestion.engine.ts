import { SamplingPolicy } from "../policies/sampling.policy.js";

export type IngestionInput = { projectId: string; sources: Array<{ kind: string; value: string }> };
export type IngestionOutput = { signatures: Array<{ signature: string; slot: bigint; blockTime?: number | null; err?: string | null }> };

export interface SignatureSource {
  getSignaturesForAddress(address: string, limit: number): Promise<Array<{ signature: string; slot: bigint; blockTime?: number | null; err?: string | null }>>;
}

export async function ingestSignatures(input: IngestionInput, rpc: SignatureSource, sampling: SamplingPolicy): Promise<IngestionOutput> {
  const out: IngestionOutput = { signatures: [] };
  for (const s of input.sources) {
    if (s.kind !== "ADDRESS") continue;
    const sigs = await rpc.getSignaturesForAddress(s.value, sampling.maxSignaturesPerRun);
    out.signatures.push(...sigs);
  }
  return out;
}
