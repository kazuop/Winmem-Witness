import { z } from "zod";

export const EventSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  signature: z.string(),
  slot: z.union([z.number(), z.bigint()]),
  blockTime: z.number().nullable().optional(),
  type: z.string(),
  data: z.unknown(),
  createdAt: z.string().datetime()
});
export type Event = z.infer<typeof EventSchema>;
