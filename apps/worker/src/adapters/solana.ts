import { Connection, PublicKey } from "@solana/web3.js";
export class SolanaClient {
  conn: Connection;
  constructor(rpcUrl: string, timeoutMs: number){
    this.conn = new Connection(rpcUrl, { commitment: "confirmed", confirmTransactionInitialTimeout: timeoutMs });
  }
  async getSignaturesForAddress(addr: string, limit: number){
    const pk = new PublicKey(addr);
    const sigs = await this.conn.getSignaturesForAddress(pk, { limit });
    return sigs.map(s => ({ signature: s.signature, slot: BigInt(s.slot), blockTime: s.blockTime ?? null, err: s.err ? JSON.stringify(s.err) : null }));
  }
  async getTransaction(signature: string){
    return await this.conn.getTransaction(signature, { commitment: "confirmed", maxSupportedTransactionVersion: 0 });
  }
}
