import { z } from "zod";

export type ApiClientOpts = { baseUrl: string; apiKey?: string };

export class ApiClient {
  constructor(private opts: ApiClientOpts) {}

  private headers(): HeadersInit {
    const h: Record<string,string> = { "content-type": "application/json" };
    if (this.opts.apiKey) h["x-winmem-api-key"] = this.opts.apiKey;
    return h;
  }

  async get<T>(path: string, schema?: z.ZodSchema<T>): Promise<T> {
    const res = await fetch(this.opts.baseUrl.replace(/\/$/,"") + path, { headers: this.headers() });
    const json = await res.json();
    if (!res.ok) throw new Error(`${res.status}: ${JSON.stringify(json)}`);
    return schema ? schema.parse(json) : (json as T);
  }

  async post<T>(path: string, body: any, schema?: z.ZodSchema<T>): Promise<T> {
    const res = await fetch(this.opts.baseUrl.replace(/\/$/,"") + path, { method: "POST", headers: this.headers(), body: JSON.stringify(body) });
    const json = await res.json();
    if (!res.ok) throw new Error(`${res.status}: ${JSON.stringify(json)}`);
    return schema ? schema.parse(json) : (json as T);
  }

  async del<T>(path: string, schema?: z.ZodSchema<T>): Promise<T> {
    const res = await fetch(this.opts.baseUrl.replace(/\/$/,"") + path, { method: "DELETE", headers: this.headers() });
    const json = await res.json();
    if (!res.ok) throw new Error(`${res.status}: ${JSON.stringify(json)}`);
    return schema ? schema.parse(json) : (json as T);
  }

  async patch<T>(path: string, body: any, schema?: z.ZodSchema<T>): Promise<T> {
    const res = await fetch(this.opts.baseUrl.replace(/\/$/,"") + path, { method: "PATCH", headers: this.headers(), body: JSON.stringify(body) });
    const json = await res.json();
    if (!res.ok) throw new Error(`${res.status}: ${JSON.stringify(json)}`);
    return schema ? schema.parse(json) : (json as T);
  }
}
