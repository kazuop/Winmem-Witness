import { execa } from "execa";

export async function helm(args: string[], opts?: { cwd?: string }) {
  return await execa("helm", args, { stdio: "inherit", cwd: opts?.cwd });
}

export async function requireHelm() {
  try { await execa("helm", ["version"], { stdio: "ignore" }); }
  catch { throw new Error("helm is required for this command."); }
}
