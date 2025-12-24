import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";
import { z } from "zod";

export const WinmemConfigSchema = z.object({
  version: z.string().default("1"),
  api: z.object({
    url: z.string().url(),
    apiKey: z.string().optional()
  }),
  projects: z.array(z.object({
    name: z.string(),
    cluster: z.enum(["mainnet-beta","devnet","testnet"]),
    sources: z.array(z.object({ kind: z.enum(["ADDRESS","PROGRAM","ACCOUNT_SNAPSHOT"]), value: z.string() })).default([])
  })).default([])
});

export type WinmemConfig = z.infer<typeof WinmemConfigSchema>;

export function defaultConfig(apiUrl: string): WinmemConfig {
  return { version: "1", api: { url: apiUrl }, projects: [] };
}

export async function loadConfig(cwd: string): Promise<{ path: string; config: WinmemConfig }> {
  const p = path.join(cwd, "winmem.yaml");
  const raw = await fs.readFile(p, "utf8");
  const parsed = yaml.load(raw);
  const cfg = WinmemConfigSchema.parse(parsed);
  return { path: p, config: cfg };
}

export async function saveConfig(filePath: string, config: WinmemConfig) {
  const out = yaml.dump(config, { noRefs: true, lineWidth: 120 });
  await fs.writeFile(filePath, out, "utf8");
}
