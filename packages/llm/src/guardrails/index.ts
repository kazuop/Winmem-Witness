export function enforceMaxLen(text: string, max = 8000): string {
  return text.length > max ? text.slice(0, max) : text;
}
