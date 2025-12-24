#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";

import { initCommand } from "./commands/init.js";
import { upCommand } from "./commands/up.js";
import { downCommand } from "./commands/down.js";
import { statusCommand } from "./commands/status.js";
import { logsCommand } from "./commands/logs.js";
import { addProjectCommand } from "./commands/add-project.js";
import { removeProjectCommand } from "./commands/remove-project.js";
import { auditCommand } from "./commands/audit.js";
import { exportCommand } from "./commands/export.js";
import { exportStatusCommand } from "./commands/export-status.js";
import { backupCommand } from "./commands/backup.js";
import { doctorCommand } from "./commands/doctor.js";
import { deployCommand } from "./commands/deploy.js";

const program = new Command();

program
  .name("winmem")
  .description("Winmem CLI - deployable legacy runtime for preserving Solana projects")
  .version("0.1.0");

program.command("init")
  .description("Initialize winmem.yaml in the current directory")
  .option("--api-url <url>", "Winmem API base URL", "http://localhost:8787")
  .action(async (opts) => {
    try { await initCommand(process.cwd(), { apiUrl: opts.apiUrl }); }
    catch (e: any) { console.error(chalk.red(e.message ?? String(e))); process.exit(1); }
  });

program.command("up")
  .description("Start local services using docker compose")
  .option("-f, --file <path>", "Compose file path", "infra/docker/docker-compose.dev.yml")
  .action(async (opts) => {
    try { await upCommand(process.cwd(), { file: opts.file }); }
    catch (e: any) { console.error(chalk.red(e.message ?? String(e))); process.exit(1); }
  });

program.command("down")
  .description("Stop local services using docker compose")
  .option("-f, --file <path>", "Compose file path", "infra/docker/docker-compose.dev.yml")
  .option("-v, --volumes", "Remove volumes", false)
  .action(async (opts) => {
    try { await downCommand(process.cwd(), { file: opts.file, volumes: opts.volumes }); }
    catch (e: any) { console.error(chalk.red(e.message ?? String(e))); process.exit(1); }
  });

program.command("status")
  .description("Show docker compose status")
  .option("-f, --file <path>", "Compose file path", "infra/docker/docker-compose.dev.yml")
  .action(async (opts) => {
    try { await statusCommand(process.cwd(), { file: opts.file }); }
    catch (e: any) { console.error(chalk.red(e.message ?? String(e))); process.exit(1); }
  });

program.command("logs")
  .description("Tail docker compose logs")
  .option("-f, --file <path>", "Compose file path", "infra/docker/docker-compose.dev.yml")
  .option("-s, --service <name>", "Service name")
  .option("--follow", "Follow logs", true)
  .option("--tail <n>", "Tail lines", (v) => Number(v), 200)
  .action(async (opts) => {
    try { await logsCommand(process.cwd(), { file: opts.file, service: opts.service, follow: opts.follow, tail: opts.tail }); }
    catch (e: any) { console.error(chalk.red(e.message ?? String(e))); process.exit(1); }
  });

program.command("add-project")
  .description("Add a project entry to winmem.yaml")
  .option("--name <name>")
  .option("--cluster <cluster>")
  .option("--kind <kind>")
  .option("--value <value>")
  .action(async (opts) => {
    try { await addProjectCommand(process.cwd(), opts); }
    catch (e: any) { console.error(chalk.red(e.message ?? String(e))); process.exit(1); }
  });

program.command("remove-project")
  .description("Remove a project entry from winmem.yaml")
  .option("--name <name>")
  .action(async (opts) => {
    try { await removeProjectCommand(process.cwd(), opts); }
    catch (e: any) { console.error(chalk.red(e.message ?? String(e))); process.exit(1); }
  });

program.command("audit")
  .description("List audit batches for a project")
  .option("--api-key <key>")
  .option("--project-id <id>")
  .action(async (opts) => {
    try { await auditCommand(process.cwd(), opts); }
    catch (e: any) { console.error(chalk.red(e.message ?? String(e))); process.exit(1); }
  });

program.command("export")
  .description("Request an export snapshot for a project")
  .requiredOption("--project-id <id>")
  .option("--api-key <key>")
  .action(async (opts) => {
    try { await exportCommand(process.cwd(), opts); }
    catch (e: any) { console.error(chalk.red(e.message ?? String(e))); process.exit(1); }
  });

program.command("export-status")
  .description("Poll an export by exportId")
  .requiredOption("--export-id <id>")
  .option("--api-key <key>")
  .action(async (opts) => {
    try { await exportStatusCommand(process.cwd(), opts); }
    catch (e: any) { console.error(chalk.red(e.message ?? String(e))); process.exit(1); }
  });

program.command("backup")
  .description("Create a local SQL backup (dev helper)")
  .option("--out <file>")
  .action(async (opts) => {
    try { await backupCommand(process.cwd(), { out: opts.out }); }
    catch (e: any) { console.error(chalk.red(e.message ?? String(e))); process.exit(1); }
  });

program.command("doctor")
  .description("Run diagnostics for your environment")
  .action(async () => {
    try { await doctorCommand(process.cwd()); }
    catch (e: any) { console.error(chalk.red(e.message ?? String(e))); process.exit(1); }
  });

program.command("deploy")
  .description("Deploy using Kubernetes + Helm (optional)")
  .option("-n, --namespace <ns>", "Kubernetes namespace", "winmem")
  .option("-r, --release <name>", "Helm release name", "winmem")
  .option("-f, --values <file>", "Helm values file")
  .action(async (opts) => {
    try { await deployCommand(process.cwd(), { namespace: opts.namespace, release: opts.release, values: opts.values }); }
    catch (e: any) { console.error(chalk.red(e.message ?? String(e))); process.exit(1); }
  });

program.parse(process.argv);
