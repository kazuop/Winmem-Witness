export type Health = { ok: boolean; details?: Record<string, unknown> };

export async function basicHealth(checks: Array<() => Promise<void>>): Promise<Health> {
  try {
    for (const c of checks) await c();
    return { ok: true };
  } catch (err: any) {
    return { ok: false, details: { error: err?.message ?? String(err) } };
  }
}
