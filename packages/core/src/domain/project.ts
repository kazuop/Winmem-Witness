import { z } from "zod";

export const ProjectStatusSchema = z.enum(["ACTIVE", "LEGACY", "ARCHIVED"]);
export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;

export const ProjectSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string().min(2).max(64),
  description: z.string().max(500).optional(),
  cluster: z.enum(["mainnet-beta", "testnet", "devnet"]),
  status: ProjectStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
export type Project = z.infer<typeof ProjectSchema>;
