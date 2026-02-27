import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/app/generated/prisma/client";

let prisma;

export function getPrisma() {
  if (!prisma) {
    const adapter = new PrismaBetterSqlite3({ url: "file:./data/dev.db" });
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
}
