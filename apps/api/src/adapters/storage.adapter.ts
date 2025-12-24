import { PrismaClient } from "@prisma/client";
export class StorageAdapter {
  prisma = new PrismaClient();
  async health() { await this.prisma.$queryRaw`SELECT 1`; return { ok: true }; }
  async close() { await this.prisma.$disconnect(); }
}
