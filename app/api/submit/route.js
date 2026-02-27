import { NextResponse } from "next/server";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/app/generated/prisma/client";

let prisma;

function getPrisma() {
  if (!prisma) {
    const adapter = new PrismaBetterSqlite3({url: "file:./data/dev.db"});
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
}

export async function POST(req) {
  try {
    const { publicKey, teamName } = await req.json();

    const existing = await getPrisma().entry.findUnique({
      where: { publicKey },
    });

    if (existing) {
      return NextResponse.json({ success: false, duplicate: true }, { status: 409 });
    }

    const config = await getPrisma().config.findUnique({ where: { key: "nextIpOverride" } });
    let ipIncrement;
    if (config) {
      ipIncrement = parseInt(config.value);
      await getPrisma().config.update({
        where: { key: "nextIpOverride" },
        data: { value: String(ipIncrement + 1) },
      });
    } else {
      const lastEntry = await getPrisma().entry.findFirst({
        orderBy: { ipIncrement: "desc" },
        select: { ipIncrement: true },
      });
      ipIncrement = Math.max(lastEntry?.ipIncrement ?? 26, 26) + 1;
    }

    await getPrisma().entry.create({
      data: {
        publicKey,
        teamName,
        ipIncrement,
      },
    });

    return NextResponse.json({ success: true, ipIncrement });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
