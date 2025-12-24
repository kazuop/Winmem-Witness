import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export async function prompt(question: string, opts?: { mask?: boolean }): Promise<string> {
  const rl = readline.createInterface({ input, output });
  try {
    if (!opts?.mask) return (await rl.question(question)).trim();
    // Basic masking: do not echo input (TTY only).
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    let buf = "";
    output.write(question);
    while (true) {
      const chunk = await new Promise<Buffer>((resolve) => input.once("data", resolve));
      const s = chunk.toString("utf8");
      if (s === "\r" || s === "\n" || s === "\r\n") break;
      if (s === "\u0003") throw new Error("Interrupted");
      if (s === "\u007f") { buf = buf.slice(0, -1); continue; }
      buf += s;
    }
    output.write("\n");
    return buf.trim();
  } finally {
    try { if (process.stdin.isTTY) process.stdin.setRawMode(false); } catch {}
    rl.close();
  }
}
