import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/permissions";
import { logUsage } from "@/lib/usage";

// POST /api/admin/users/[id]/reduce-credit
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const { amount, reason } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Jumlah credit harus lebih dari 0" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    if (user.credits < amount) {
      return NextResponse.json({ error: "Credit user tidak mencukupi" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { credits: { decrement: amount } },
    });

    await logUsage({
      userId: id,
      action: "CREDIT_REDUCED",
      creditUsed: amount,
      metadata: { reducedBy: admin.id, reason, newBalance: updated.credits },
    });

    return NextResponse.json({ user: updated, message: `${amount} credit berhasil dikurangi` });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
