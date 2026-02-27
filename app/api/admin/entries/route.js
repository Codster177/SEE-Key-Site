import { NextResponse } from "next/server";
import { getPrisma } from "@/app/lib/prisma";
import { getAdminFromCookie } from "@/app/lib/auth";

export async function GET() {
  const admin = await getAdminFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entries = await getPrisma().entry.findMany({
    orderBy: { ipIncrement: "asc" },
  });
  return NextResponse.json({ entries });
}

export async function POST(req) {
  const admin = await getAdminFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { publicKey, teamName, ipIncrement } = await req.json();
    const entry = await getPrisma().entry.create({
      data: { publicKey, teamName, ipIncrement: parseInt(ipIncrement) },
    });
    return NextResponse.json({ success: true, entry });
  } catch (err) {
    if (err.code === "P2002") {
      return NextResponse.json({ success: false, error: "Public key already exists" }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
