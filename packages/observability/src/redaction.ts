const DEFAULT_PATTERNS = [
  /([A-Fa-f0-9]{64})/g,            // signatures / hashes
  /(x-winmem-api-key:\s*)(\S+)/gi
];

export function redactText(input: string, extra?: RegExp[]): string {
  let out = input;
  for (const p of [...DEFAULT_PATTERNS, ...(extra ?? [])]) {
    out = out.replace(p, (m, p1, p2) => {
      if (typeof p2 === "string") return `${p1}REDACTED`;
      return "REDACTED";
    });
  }
  return out;
}
