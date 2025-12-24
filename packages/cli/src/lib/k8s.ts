import { execa } from "execa";

export async function kubectl(args: string[], opts?: { cwd?: string }) {
  return await execa("kubectl", args, { stdio: "inherit", cwd: opts?.cwd });
}

export async function requireKubectl() {
  try { await execa("kubectl", ["version", "--client"], { stdio: "ignore" }); }
  catch { throw new Error("kubectl is required for this command."); }
}
