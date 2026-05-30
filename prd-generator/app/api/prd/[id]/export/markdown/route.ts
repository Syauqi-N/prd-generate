import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/permissions";
import { getMarkdownFilename } from "@/lib/export/markdown";
import { logUsage } from "@/lib/usage";

// GET /api/prd/[id]/export/markdown
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

    await logUsage({ userId: user.id, documentId: id, action: "EXPORT_MARKDOWN" });

    const filename = getMarkdownFilename(document.title);

    return new NextResponse(document.content, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Silakan login terlebih dahulu" }, { status: 401 });
    }
    return NextResponse.json({ error: "Gagal export Markdown" }, { status: 500 });
  }
}
