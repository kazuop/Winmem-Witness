import { z } from "zod";
export const LifecycleStateSchema = z.enum(["ACTIVE","LEGACY","ARCHIVED"]);
export type LifecycleState = z.infer<typeof LifecycleStateSchema>;
export type LifecycleDecision = { state: LifecycleState; reason: string; evaluatedAt: number; lastActivityAt?: number };
