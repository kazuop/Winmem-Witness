import { Connection, PublicKey } from "@solana/web3.js";
export class SolanaAdapter {
  private conn: Connection;
  constructor(opts: { rpcUrl: string; timeoutMs: number }) {
    this.conn = new Connection(opts.rpcUrl, { commitment: "confirmed", confirmTransactionInitialTimeout: opts.timeoutMs });
  }
  async getCurrentSlot() { return await this.conn.getSlot("confirmed"); }
  async getSignaturesForAddress(address: string, limit: number) {
    const pk = new PublicKey(address);
    const sigs = await this.conn.getSignaturesForAddress(pk, { limit });
    return sigs.map(s => s.signature);
  }
}
