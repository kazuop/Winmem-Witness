import fs from "node:fs/promises";
import path from "node:path";

export async function pathExists(p: string): Promise<boolean> {
  try { await fs.access(p); return true; } catch { return false; }
}

export async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true });
}

export async function writeFileSafe(p: string, content: string, overwrite = false) {
  const dir = path.dirname(p);
  await ensureDir(dir);
  if (!overwrite && await pathExists(p)) throw new Error(`File already exists: ${p}`);
  await fs.writeFile(p, content, "utf8");
}

export async function readText(p: string): Promise<string> {
  return await fs.readFile(p, "utf8");
}

export async function copyDir(src: string, dest: string) {
  await ensureDir(dest);
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const e of entries) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) await copyDir(s, d);
    else await fs.copyFile(s, d);
  }
}
