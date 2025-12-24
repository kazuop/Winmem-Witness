import { RedactionPolicy } from "../policies/redaction.policy.js";

const MEMO_PROGRAM = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";
const SPL_TOKEN_PROGRAM = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
const TOKEN_2022_PROGRAM = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";

export type RawTransaction = {
  signature: string;
  slot: number;
  blockTime?: number | null;
  message: { accountKeys: string[]; instructions: Array<{ programIdIndex: number; accountKeyIndexes: number[]; data: string }> };
  meta?: any;
};

export type NormalizedEvent = { type: string; signature: string; slot: number; blockTime?: number | null; data: any };

export function normalizeTx(tx: RawTransaction, policy: RedactionPolicy): NormalizedEvent[] {
  const keys = tx.message.accountKeys ?? [];
  let type = "tx";
  if (keys.includes(MEMO_PROGRAM)) type = "memo";
  if (keys.includes(SPL_TOKEN_PROGRAM)) type = "spl";
  if (keys.includes(TOKEN_2022_PROGRAM)) type = "token-2022";

  const data: any = {
    signature: tx.signature,
    slot: tx.slot,
    blockTime: tx.blockTime ?? null,
    meta: tx.meta ?? null,
    message: {
      accountKeys: policy.enabled && policy.redactAccountKeys ? [] : keys.slice(0, policy.maxAccountKeys),
      instructions: tx.message.instructions.map(ix => ({
        programIdIndex: ix.programIdIndex,
        accountKeyIndexes: ix.accountKeyIndexes,
        data: policy.enabled && policy.redactInstructionData ? "REDACTED" : ix.data
      }))
    }
  };

  return [{ type, signature: tx.signature, slot: tx.slot, blockTime: tx.blockTime ?? null, data }];
}
