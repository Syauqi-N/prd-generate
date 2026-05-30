import { NextRequest, NextResponse } from "next/server";
import { getSession, deleteSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("session")?.value;
    if (token) {
      await deleteSession(token);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("session", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
