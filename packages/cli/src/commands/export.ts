import chalk from "chalk";
import { ApiClient } from "../lib/api.js";
import { loadConfig } from "../lib/config.js";

export async function exportCommand(cwd: string, opts: { apiKey?: string; projectId: string }) {
  const { config } = await loadConfig(cwd);
  const apiKey = opts.apiKey ?? config.api.apiKey ?? process.env.WINMEM_API_KEY;
  if (!apiKey) throw new Error("API key missing. Set WINMEM_API_KEY or config.api.apiKey.");
  const api = new ApiClient({ baseUrl: config.api.url, apiKey });

  const created = await api.post<any>(`/v1/projects/${opts.projectId}/exports`, {});
  console.log(chalk.gray(`Export created: ${created.id} (status=${created.status})`));
  console.log(chalk.gray("Worker will produce the export file. Poll with:"));
  console.log(chalk.cyan(`winmem export-status --export-id ${created.id}`));
}
