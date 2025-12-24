import path from "node:path";
import chalk from "chalk";
import { ensureDir, writeFileSafe, pathExists } from "../lib/fs.js";
import { defaultConfig, saveConfig } from "../lib/config.js";

export async function initCommand(cwd: string, opts: { apiUrl?: string }) {
  const apiUrl = opts.apiUrl ?? "http://localhost:8787";
  const cfgPath = path.join(cwd, "winmem.yaml");
  if (await pathExists(cfgPath)) {
    console.log(chalk.yellow(`winmem.yaml already exists at ${cfgPath}`));
    return;
  }
  await ensureDir(cwd);
  await saveConfig(cfgPath, defaultConfig(apiUrl));
  console.log(chalk.green(`Created ${cfgPath}`));
  console.log(chalk.gray("Next: run `winmem up` to start local services."));
}
