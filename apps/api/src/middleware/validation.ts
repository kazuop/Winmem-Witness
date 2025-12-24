import { z } from "zod";
import { ApiError } from "../utils/errors.js";
export function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): T {
  const parsed = schema.safeParse(body);
  if (!parsed.success) throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", { issues: parsed.error.issues });
  return parsed.data;
}
export function validateQuery<T>(schema: z.ZodSchema<T>, query: unknown): T {
  const parsed = schema.safeParse(query);
  if (!parsed.success) throw new ApiError(400, "VALIDATION_ERROR", "Invalid query", { issues: parsed.error.issues });
  return parsed.data;
}
