export type LifecyclePolicy = { legacyAfterDays: number; archiveAfterDays: number };
export const DefaultLifecyclePolicy: LifecyclePolicy = { legacyAfterDays: 30, archiveAfterDays: 180 };

export function decideLifecycle(nowSec: number, lastActivitySec: number | null, p: LifecyclePolicy): { state: "ACTIVE"|"LEGACY"|"ARCHIVED"; reason: string } {
  if (!lastActivitySec) return { state: "LEGACY", reason: "no-activity" };
  const legacyThreshold = nowSec - p.legacyAfterDays * 86400;
  const archiveThreshold = nowSec - p.archiveAfterDays * 86400;
  if (lastActivitySec < archiveThreshold) return { state: "ARCHIVED", reason: "inactive-too-long" };
  if (lastActivitySec < legacyThreshold) return { state: "LEGACY", reason: "inactive" };
  return { state: "ACTIVE", reason: "active" };
}
