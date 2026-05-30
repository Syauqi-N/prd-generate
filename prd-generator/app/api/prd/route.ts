import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/permissions";

// GET /api/prd - list user's documents
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [documents, total] = await Promise.all([
      prisma.pRDDocument.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          productName: true,
          productType: true,
          outputStyle: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.pRDDocument.count({ where: { userId: user.id } }),
    ]);

    return NextResponse.json({ documents, total, page, limit });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Silakan login terlebih dahulu" }, { status: 401 });
    }
    console.error("GET /api/prd error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// POST /api/prd - create new document
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { title, productName, productType, outputStyle, templateId } = body;

    if (!title) {
      return NextResponse.json({ error: "Judul dokumen wajib diisi" }, { status: 400 });
    }

    const document = await prisma.pRDDocument.create({
      data: {
        userId: user.id,
        title,
        productName,
        productType,
        outputStyle,
        templateId,
        content: "",
        status: "DRAFT",
      },
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Silakan login terlebih dahulu" }, { status: 401 });
    }
    console.error("POST /api/prd error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
