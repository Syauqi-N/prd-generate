import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/permissions";

// GET /api/admin/stats
export async function GET() {
  try {
    await requireAdmin();

    const [totalUsers, totalDocuments, totalInvoices, paidInvoices, usageLogs] = await Promise.all([
      prisma.user.count(),
      prisma.pRDDocument.count(),
      prisma.invoice.count(),
      prisma.invoice.count({ where: { status: "PAID" } }),
      prisma.usageLog.count(),
    ]);

    const totalRevenue = await prisma.invoice.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    });

    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, credits: true, role: true, createdAt: true },
    });

    return NextResponse.json({
      totalUsers,
      totalDocuments,
      totalInvoices,
      paidInvoices,
      totalUsageLogs: usageLogs,
      totalRevenue: totalRevenue._sum.amount || 0,
      recentUsers,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
