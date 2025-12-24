import chalk from "chalk";
import { requireKubectl, kubectl } from "../lib/k8s.js";
import { requireHelm, helm } from "../lib/helm.js";

export async function deployCommand(cwd: string, opts: { namespace?: string; values?: string; release?: string }) {
  const ns = opts.namespace ?? "winmem";
  const rel = opts.release ?? "winmem";
  await requireKubectl();
  await requireHelm();

  console.log(chalk.gray(`Ensuring namespace: ${ns}`));
  await kubectl(["create", "namespace", ns], { cwd }).catch(() => {});

  const values = opts.values ? ["-f", opts.values] : [];
  console.log(chalk.gray("Installing/upgrading Helm release..."));
  await helm(["upgrade", "--install", rel, "infra/helm/winmem", "-n", ns, ...values], { cwd });

  console.log(chalk.green("Deployment submitted."));
}
