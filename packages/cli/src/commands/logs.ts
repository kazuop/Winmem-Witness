import { requireDocker, dockerCompose } from "../lib/docker.js";

export async function logsCommand(cwd: string, opts: { file?: string; service?: string; follow?: boolean; tail?: number }) {
  await requireDocker();
  const file = opts.file ?? "infra/docker/docker-compose.dev.yml";
  const args = ["-f", file, "logs"];
  if (opts.follow) args.push("-f");
  if (opts.tail) args.push("--tail", String(opts.tail));
  if (opts.service) args.push(opts.service);
  await dockerCompose(args, { cwd });
}
