import chalk from "chalk";
import { execa } from "execa";
import { loadConfig } from "../lib/config.js";

export async function backupCommand(cwd: string, opts: { out?: string }) {
  // This is a pragmatic helper that calls pg_dump inside docker compose.
  // For production-grade backup, prefer infra/scripts/backup-db.sh.
  const out = opts.out ?? `winmem_backup_${Date.now()}.sql`;
  const composeFile = "infra/docker/docker-compose.dev.yml";
  await execa("docker", ["compose", "-f", composeFile, "exec", "-T", "postgres", "pg_dump", "-U", "winmem", "winmem"], { cwd, stdio: ["ignore", "pipe", "inherit"] })
    .then(async (r) => {
      const fs = await import("node:fs/promises");
      await fs.writeFile(out, r.stdout, "utf8");
      console.log(chalk.green(`Backup written to ${out}`));
    });
}
