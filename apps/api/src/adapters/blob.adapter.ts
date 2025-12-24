import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
export class BlobAdapter {
  private baseDir: string;
  constructor() { this.baseDir = process.env.WINMEM_BLOB_DIR ?? "./.winmem-blobs"; }
  async putObject(key: string, data: Buffer) {
    await fs.mkdir(this.baseDir, { recursive: true });
    const full = path.join(this.baseDir, key);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, data);
    const checksum = crypto.createHash("sha256").update(data).digest("hex");
    return { url: `file://${full}`, checksum };
  }
}
