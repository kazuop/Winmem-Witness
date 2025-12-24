import { z } from "zod";

export const MemoryKindSchema = z.enum(["WITNESS_LOG", "SNAPSHOT", "LIFECYCLE", "NOTE"]);
export type MemoryKind = z.infer<typeof MemoryKindSchema>;

export const MemorySchema = z.object({
  id: z.string(),
  projectId: z.string(),
  windowStart: z.number(),
  windowEnd: z.number(),
  kind: MemoryKindSchema,
  content: z.unknown(),
  leafHash: z.string().nullable().optional(),
  batchId: z.string().nullable().optional(),
  createdAt: z.string().datetime()
});
export type Memory = z.infer<typeof MemorySchema>;
