import { Queue, Worker } from "bullmq";
export type QueueNames = "ingest"|"fetch"|"normalize"|"lifecycle"|"witness"|"audit"|"archive"|"exports";
export function createQueue(redisUrl: string, prefix: string, name: QueueNames){
  return new Queue(`${prefix}:${name}`, { connection: { url: redisUrl } });
}
export function createWorker(redisUrl: string, prefix: string, name: QueueNames, processor: any, concurrency: number){
  return new Worker(`${prefix}:${name}`, processor, { connection: { url: redisUrl }, concurrency });
}
