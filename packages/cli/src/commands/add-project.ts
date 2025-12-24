import chalk from "chalk";
import { loadConfig, saveConfig } from "../lib/config.js";
import { prompt } from "../lib/prompts.js";

export async function addProjectCommand(cwd: string, opts: { name?: string; cluster?: string; kind?: string; value?: string }) {
  const { path, config } = await loadConfig(cwd);

  const name = opts.name ?? await prompt("Project name: ");
  const cluster = (opts.cluster ?? await prompt("Cluster (mainnet-beta/devnet/testnet): ")).trim();
  const kind = (opts.kind ?? await prompt("Source kind (ADDRESS/PROGRAM/ACCOUNT_SNAPSHOT): ")).trim();
  const value = opts.value ?? await prompt("Source value: ");

  const project = { name, cluster: cluster as any, sources: [{ kind: kind as any, value }] };
  config.projects.push(project as any);

  await saveConfig(path, config);
  console.log(chalk.green(`Added project '${name}' to winmem.yaml`));
}
