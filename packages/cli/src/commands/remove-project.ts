import chalk from "chalk";
import { loadConfig, saveConfig } from "../lib/config.js";
import { prompt } from "../lib/prompts.js";

export async function removeProjectCommand(cwd: string, opts: { name?: string }) {
  const { path, config } = await loadConfig(cwd);
  const name = opts.name ?? await prompt("Project name to remove: ");
  const before = config.projects.length;
  config.projects = config.projects.filter(p => p.name !== name);
  await saveConfig(path, config);
  const removed = before - config.projects.length;
  console.log(removed ? chalk.green(`Removed '${name}'`) : chalk.yellow(`No project named '${name}' found`));
}
