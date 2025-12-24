import chalk from "chalk";
import { requireDocker, dockerCompose } from "../lib/docker.js";

export async function statusCommand(cwd: string, opts: { file?: string }) {
  await requireDocker();
  const file = opts.file ?? "infra/docker/docker-compose.dev.yml";
  console.log(chalk.gray(`Using compose file: ${file}`));
  await dockerCompose(["-f", file, "ps"], { cwd });
  console.log(chalk.green("Done."));
}
