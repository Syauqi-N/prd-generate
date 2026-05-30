import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/permissions";
import { exportPDF } from "@/lib/export/pdf";
import { logUsage } from "@/lib/usage";
import { Role } from "@prisma/client";

// GET /api/prd/[id]/export/pdf
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const document = await prisma.pRDDocument.findFirst({
      where: { id, userId: user.id },
    });

    if (!document) {
      return NextResponse.json({ error: "Dokumen tidak ditemukan" }, { status: 404 });
    }

    // Only paid users (credits > 0 or admin) can export PDF
    const isPaid = user.role === Role.ADMIN || user.credits > 0;
    if (!isPaid) {
      return NextResponse.json(
        { error: "Export PDF hanya tersedia untuk paid user. Silakan beli credit." },
        { status: 403 }
      );
    }

    const pdfBuffer = await exportPDF(document.content, document.title);

    await logUsage({ userId: user.id, documentId: id, action: "EXPORT_PDF" });

    const filename = document.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + ".pdf";

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Silakan login terlebih dahulu" }, { status: 401 });
    }
    return NextResponse.json({ error: "Gagal export PDF" }, { status: 500 });
  }
}
