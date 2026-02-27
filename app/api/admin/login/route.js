import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getPrisma } from "@/app/lib/prisma";
import { signToken } from "@/app/lib/auth";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const admin = await getPrisma().admin.findUnique({ where: { username } });
    if (!admin) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({ username });

    const res = NextResponse.json({ success: true });
    res.cookies.set("admin_token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
