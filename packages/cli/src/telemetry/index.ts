/**
 * CLI telemetry is intentionally off by default.
 * Wire analytics in downstream forks if required.
 */
export function noopTelemetry() { return { enabled: false }; }
