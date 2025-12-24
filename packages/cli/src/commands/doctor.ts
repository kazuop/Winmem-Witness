import chalk from "chalk";
import { requireDocker } from "../lib/docker.js";
import { loadConfig } from "../lib/config.js";

export async function doctorCommand(cwd: string) {
  console.log(chalk.gray("Winmem Doctor Report"));
  await requireDocker();
  const { config } = await loadConfig(cwd);
  console.log(chalk.green("Config OK"));
  console.log(`API: ${config.api.url}`);
  console.log(`Projects: ${config.projects.length}`);
  console.log(chalk.green("Docker OK"));
  console.log(chalk.gray("If API calls fail, verify your API key and CORS settings."));
}
