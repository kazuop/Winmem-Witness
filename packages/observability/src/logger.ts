import pino from "pino";

export type Logger = pino.Logger;

export function createLogger(opts?: { level?: string; service?: string }) {
  return pino({
    level: opts?.level ?? "info",
    base: { service: opts?.service ?? "winmem" },
    redact: { paths: ["req.headers.authorization", "req.headers.x-winmem-api-key"], remove: true }
  });
}
