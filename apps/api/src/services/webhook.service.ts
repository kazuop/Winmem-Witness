import { StorageAdapter } from "../adapters/storage.adapter.js";
import { ApiError } from "../utils/errors.js";
import crypto from "node:crypto";
export class WebhookService {
  constructor(private storage: StorageAdapter) {}
  list(projectId: string) { return this.storage.prisma.webhookSubscription.findMany({ where: { projectId }, orderBy: { createdAt: "desc" } }); }
  create(projectId: string, input: { url: string; events: string[] }) {
    const secret = crypto.randomBytes(32).toString("hex");
    return this.storage.prisma.webhookSubscription.create({ data: { projectId, url: input.url, secret, events: input.events.join(","), enabled: true } });
  }
  async toggle(projectId: string, id: string, enabled: boolean) {
    const s = await this.storage.prisma.webhookSubscription.findFirst({ where: { id, projectId } });
    if (!s) throw new ApiError(404, "NOT_FOUND", "Subscription not found");
    return this.storage.prisma.webhookSubscription.update({ where: { id }, data: { enabled } });
  }
}
