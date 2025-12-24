import chalk from "chalk";
import { ApiClient } from "../lib/api.js";
import { loadConfig } from "../lib/config.js";

export async function auditCommand(cwd: string, opts: { apiKey?: string; projectId?: string }) {
  const { config } = await loadConfig(cwd);
  const apiKey = opts.apiKey ?? config.api.apiKey ?? process.env.WINMEM_API_KEY;
  if (!apiKey) throw new Error("API key missing. Set WINMEM_API_KEY or config.api.apiKey.");
  const api = new ApiClient({ baseUrl: config.api.url, apiKey });

  if (!opts.projectId) {
    const list = await api.get<any>("/v1/projects?limit=50");
    console.log(chalk.gray("Projects:"));
    for (const p of list.items) console.log(`- ${p.id}  ${p.name}  (${p.status})`);
    console.log(chalk.yellow("Provide --project-id to inspect audit batches."));
    return;
  }

  const batches = await api.get<any>(`/v1/projects/${opts.projectId}/audits/batches?limit=50`);
  console.log(chalk.green(`Audit batches for ${opts.projectId}:`));
  for (const b of batches.items) console.log(`- ${b.id}  ${b.count} leaves  root=${b.root}`);
}
