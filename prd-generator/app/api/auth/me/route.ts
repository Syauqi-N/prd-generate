import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/permissions";

// GET /api/auth/me
export async function GET() {
  try {
    const user = await requireAuth();
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, credits: user.credits },
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// PATCH /api/auth/me - update name
export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { name } = await req.json();
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name },
    });
    return NextResponse.json({
      user: { id: updated.id, name: updated.name, email: updated.email, role: updated.role, credits: updated.credits },
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
