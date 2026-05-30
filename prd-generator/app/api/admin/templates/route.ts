import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/permissions";

// GET /api/admin/templates
export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const templates = await prisma.template.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json({ templates });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// POST /api/admin/templates
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { name, slug, description, structure, isPremium } = body;

    if (!name || !slug || !structure) {
      return NextResponse.json({ error: "name, slug, dan structure wajib diisi" }, { status: 400 });
    }

    const template = await prisma.template.create({
      data: { name, slug, description, structure, isPremium: isPremium ?? false },
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
