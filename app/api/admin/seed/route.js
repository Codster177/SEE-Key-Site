import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getPrisma } from "@/app/lib/prisma";

export async function POST(req) {
  try {
    const existing = await getPrisma().admin.count();
    if (existing > 0) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 403 });
    }

    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    await getPrisma().admin.create({ data: { username, password: hashed } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
