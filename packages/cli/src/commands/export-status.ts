import chalk from "chalk";
import { ApiClient } from "../lib/api.js";
import { loadConfig } from "../lib/config.js";

export async function exportStatusCommand(cwd: string, opts: { apiKey?: string; exportId: string }) {
  const { config } = await loadConfig(cwd);
  const apiKey = opts.apiKey ?? config.api.apiKey ?? process.env.WINMEM_API_KEY;
  if (!apiKey) throw new Error("API key missing. Set WINMEM_API_KEY or config.api.apiKey.");
  const api = new ApiClient({ baseUrl: config.api.url, apiKey });

  const e = await api.get<any>(`/v1/exports/${opts.exportId}`);
  console.log(chalk.green(`Export ${e.id}`));
  console.log(`status: ${e.status}`);
  console.log(`url: ${e.url ?? "-"}`);
  console.log(`checksum: ${e.checksum ?? "-"}`);
}
