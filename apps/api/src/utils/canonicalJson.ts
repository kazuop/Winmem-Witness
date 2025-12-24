export function canonicalize(value: unknown): string {
  return JSON.stringify(sortKeys(value));
}
function sortKeys(value: any): any {
  if (value === null) return null;
  if (Array.isArray(value)) return value.map(sortKeys);
  if (typeof value === "object") {
    const keys = Object.keys(value).sort();
    const out: Record<string, any> = {};
    for (const k of keys) {
      const v = (value as any)[k];
      if (typeof v === "undefined") continue;
      out[k] = sortKeys(v);
    }
    return out;
  }
  return value;
}
