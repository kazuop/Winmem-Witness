import { Registry, collectDefaultMetrics, Counter, Histogram } from "prom-client";

export const registry = new Registry();
collectDefaultMetrics({ register: registry });

export const httpRequestsTotal = new Counter({
  name: "winmem_http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"] as const
});

export const httpRequestDuration = new Histogram({
  name: "winmem_http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status"] as const,
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5]
});

registry.registerMetric(httpRequestsTotal);
registry.registerMetric(httpRequestDuration);
