import { execa } from "execa";

export async function dockerCompose(args: string[], opts?: { cwd?: string; env?: Record<string,string> }) {
  const res = await execa("docker", ["compose", ...args], { stdio: "inherit", cwd: opts?.cwd, env: { ...process.env, ...(opts?.env ?? {}) } });
  return res.exitCode;
}

export async function requireDocker() {
  try {
    await execa("docker", ["version"], { stdio: "ignore" });
  } catch {
    throw new Error("Docker is required. Install Docker Desktop or the docker engine.");
  }
}
