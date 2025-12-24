import chalk from "chalk";
import { requireDocker, dockerCompose } from "../lib/docker.js";

export async function downCommand(cwd: string, opts: { file?: string; volumes?: boolean }) {
  await requireDocker();
  const file = opts.file ?? "infra/docker/docker-compose.dev.yml";
  const args = ["-f", file, "down"];
  if (opts.volumes) args.push("-v");
  await dockerCompose(args, { cwd });
  console.log(chalk.green("Winmem is stopped."));
}
