export type CursorPayload = { id: string; createdAt: string };
export function encodeCursor(payload: CursorPayload): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}
export function decodeCursor(cursor: string): CursorPayload | null {
  try {
    const raw = Buffer.from(cursor, "base64url").toString("utf8");
    const obj = JSON.parse(raw);
    if (!obj?.id || !obj?.createdAt) return null;
    return { id: String(obj.id), createdAt: String(obj.createdAt) };
  } catch { return null; }
}
