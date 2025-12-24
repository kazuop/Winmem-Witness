import { z } from "zod";

export const AuditBatchSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  windowStart: z.number(),
  windowEnd: z.number(),
  hashAlg: z.string(),
  root: z.string(),
  count: z.number(),
  manifest: z.unknown(),
  createdAt: z.string().datetime()
});
export type AuditBatch = z.infer<typeof AuditBatchSchema>;

export const AuditProofSchema = z.object({
  leaf: z.string(),
  root: z.string(),
  path: z.array(z.object({ hash: z.string(), position: z.enum(["left","right"]) }))
});
export type AuditProof = z.infer<typeof AuditProofSchema>;
