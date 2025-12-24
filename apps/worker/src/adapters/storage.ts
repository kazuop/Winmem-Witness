import { PrismaClient } from "@prisma/client";
export class Storage { prisma = new PrismaClient(); async close(){ await this.prisma.$disconnect(); } }
