import { z } from "zod";

export const SourceKindSchema = z.enum(["ADDRESS", "PROGRAM", "ACCOUNT_SNAPSHOT"]);
export type SourceKind = z.infer<typeof SourceKindSchema>;

export const SourceSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  kind: SourceKindSchema,
  value: z.string().min(10).max(128),
  createdAt: z.string().datetime()
});
export type Source = z.infer<typeof SourceSchema>;
