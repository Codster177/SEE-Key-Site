import { NextResponse } from "next/server";
import { getPrisma } from "@/app/lib/prisma";
import { getAdminFromCookie } from "@/app/lib/auth";

export async function POST(req) {
  const admin = await getAdminFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { nextIncrement } = await req.json();

  await getPrisma().config.upsert({
    where: { key: "nextIpOverride" },
    update: { value: String(parseInt(nextIncrement)) },
    create: { key: "nextIpOverride", value: String(parseInt(nextIncrement)) },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const admin = await getAdminFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await getPrisma().config.deleteMany({ where: { key: "nextIpOverride" } });

  return NextResponse.json({ success: true });
}
