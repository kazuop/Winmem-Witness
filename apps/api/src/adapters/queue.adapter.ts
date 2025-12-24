import { Queue } from "bullmq";
export class QueueAdapter {
  constructor(private opts: { redisUrl?: string; prefix?: string }) {}
  enabled() { return !!this.opts.redisUrl; }
  queue(name: string): Queue {
    if (!this.opts.redisUrl) throw new Error("Queue disabled: REDIS_URL not set");
    const prefix = this.opts.prefix ?? "winmem";
    return new Queue(`${prefix}:${name}`, { connection: { url: this.opts.redisUrl } });
  }
}
