import { FastifyReply } from "fastify";
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) { super(message); }
}
export function sendError(reply: FastifyReply, requestId: string, err: ApiError) {
  reply.status(err.statusCode).send({ requestId, code: err.code, message: err.message, details: err.details ?? undefined });
}
