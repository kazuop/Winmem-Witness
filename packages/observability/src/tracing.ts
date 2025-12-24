/**
 * Tracing stub.
 * Provide OpenTelemetry wiring in deployments that need it.
 */
export type TraceContext = { traceId: string; spanId: string };

export function noopTrace(): TraceContext {
  return { traceId: "00000000000000000000000000000000", spanId: "0000000000000000" };
}
