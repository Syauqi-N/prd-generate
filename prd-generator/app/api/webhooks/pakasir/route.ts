import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPakasirTransaction, PakasirWebhookPayload } from "@/lib/payment/pakasir";
import { logUsage } from "@/lib/usage";

// POST /api/webhooks/pakasir
export async function POST(req: NextRequest) {
  let rawBody = "";
  try {
    rawBody = await req.text();
    const payload: PakasirWebhookPayload = JSON.parse(rawBody);

    const { order_id, amount, status, payment_method, completed_at } = payload;

    // Log webhook received
    const webhookLog = await prisma.paymentWebhookLog.create({
      data: {
        provider: "PAKASIR",
        orderId: order_id,
        payload: payload as any,
        status: "RECEIVED",
      },
    });

    if (!order_id) {
      await prisma.paymentWebhookLog.update({
        where: { id: webhookLog.id },
        data: { status: "MISSING_ORDER_ID", processedAt: new Date() },
      });
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    // Find invoice
    const invoice = await prisma.invoice.findUnique({ where: { orderId: order_id } });
    if (!invoice) {
      await prisma.paymentWebhookLog.update({
        where: { id: webhookLog.id },
        data: { status: "INVOICE_NOT_FOUND", processedAt: new Date() },
      });
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Idempotency: skip if already processed
    if (invoice.status === "PAID") {
      await prisma.paymentWebhookLog.update({
        where: { id: webhookLog.id },
        data: { status: "ALREADY_PROCESSED", processedAt: new Date() },
      });
      return NextResponse.json({ message: "Already processed" });
    }

    // Only process PENDING invoices
    if (invoice.status !== "PENDING") {
      await prisma.paymentWebhookLog.update({
        where: { id: webhookLog.id },
        data: { status: "SKIPPED_NOT_PENDING", processedAt: new Date() },
      });
      return NextResponse.json({ message: "Invoice not pending" });
    }

    // Pakasir uses "completed" as paid status
    const isPaid = status === "completed";

    if (isPaid) {
      // Verify via Pakasir Transaction Detail API for extra security
      const verification = await verifyPakasirTransaction(order_id, invoice.amount);

      if (!verification.valid) {
        await prisma.paymentWebhookLog.update({
          where: { id: webhookLog.id },
          data: { status: "VERIFICATION_FAILED", processedAt: new Date() },
        });
        return NextResponse.json({ error: "Transaction verification failed" }, { status: 400 });
      }

      // Get plan for credit amount
      const plan = await prisma.plan.findUnique({ where: { id: invoice.planId } });
      if (!plan) {
        return NextResponse.json({ error: "Plan not found" }, { status: 500 });
      }

      // Atomically mark invoice PAID and add credits
      await prisma.$transaction([
        prisma.invoice.update({
          where: { id: invoice.id },
          data: {
            status: "PAID",
            paymentMethod: payment_method || verification.paymentMethod,
            paidAt: completed_at ? new Date(completed_at) : new Date(),
          },
        }),
        prisma.user.update({
          where: { id: invoice.userId },
          data: { credits: { increment: plan.creditAmount } },
        }),
      ]);

      await logUsage({
        userId: invoice.userId,
        action: "PAYMENT_SUCCESS",
        metadata: { orderId: order_id, planId: plan.id, creditAdded: plan.creditAmount },
      });

      await prisma.paymentWebhookLog.update({
        where: { id: webhookLog.id },
        data: { status: "PROCESSED", processedAt: new Date() },
      });

      return NextResponse.json({ message: "Payment processed successfully" });
    }

    // Handle other statuses
    await prisma.paymentWebhookLog.update({
      where: { id: webhookLog.id },
      data: { status: "UNHANDLED_STATUS", processedAt: new Date() },
    });

    return NextResponse.json({ message: `Status ${status} not handled` });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
