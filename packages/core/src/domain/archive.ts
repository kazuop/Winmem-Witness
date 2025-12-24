import { z } from "zod";
export const ArchiveStatusSchema = z.enum(["PENDING","READY","FAILED"]);
export type ArchiveStatus = z.infer<typeof ArchiveStatusSchema>;
export const ArchiveSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  status: ArchiveStatusSchema,
  manifestHash: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  createdAt: z.string().datetime()
});
export type Archive = z.infer<typeof ArchiveSchema>;
