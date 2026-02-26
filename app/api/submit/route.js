import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

let prisma;

function getPrisma() {
  if (!prisma) {
    const libsql = createClient({ url: process.env.DATABASE_URL });
    const adapter = new PrismaLibSql(libsql);
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
}

export async function POST(req) {
  try {
    const { publicKey, teamName } = await req.json();

    await getPrisma().entry.create({
      data: {
        publicKey,
        teamName,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
