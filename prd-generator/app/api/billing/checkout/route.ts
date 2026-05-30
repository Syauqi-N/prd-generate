import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/permissions";
import { createPakasirPaymentUrl } from "@/lib/payment/pakasir";
import { generateOrderId } from "@/lib/utils";

// POST /api/billing/checkout
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { planId } = await req.json();

    if (!planId) {
      return NextResponse.json({ error: "Plan wajib dipilih" }, { status: 400 });
    }

    const plan = await prisma.plan.findUnique({ where: { id: planId, isActive: true } });
    if (!plan) {
      return NextResponse.json({ error: "Plan tidak ditemukan" }, { status: 404 });
    }

    const orderId = generateOrderId();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";

    const paymentUrl = createPakasirPaymentUrl({
      orderId,
      amount: plan.price,
      returnUrl: `${appUrl}/dashboard/billing?order=${orderId}`,
    });

    const invoice = await prisma.invoice.create({
      data: {
        userId: user.id,
        planId: plan.id,
        orderId,
        amount: plan.price,
        status: "PENDING",
        paymentUrl,
      },
    });

    return NextResponse.json({ invoice, paymentUrl });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Silakan login terlebih dahulu" }, { status: 401 });
    }
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Gagal membuat invoice. Silakan coba lagi." }, { status: 500 });
  }
}
