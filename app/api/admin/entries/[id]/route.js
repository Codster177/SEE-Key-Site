import { NextResponse } from "next/server";
import { getPrisma } from "@/app/lib/prisma";
import { getAdminFromCookie } from "@/app/lib/auth";

export async function PUT(req, { params }) {
  const admin = await getAdminFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { publicKey, teamName, ipIncrement } = await req.json();

  try {
    const entry = await getPrisma().entry.update({
      where: { id: parseInt(id) },
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

export async function DELETE(req, { params }) {
  const admin = await getAdminFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await getPrisma().entry.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
