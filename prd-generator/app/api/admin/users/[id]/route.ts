import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/permissions";
import { logUsage } from "@/lib/usage";

// GET /api/admin/users/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: { select: { documents: true, invoices: true, usageLogs: true } },
        invoices: { orderBy: { createdAt: "desc" }, take: 5, include: { plan: true } },
        documents: { orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, status: true, createdAt: true } },
      },
    });

    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
