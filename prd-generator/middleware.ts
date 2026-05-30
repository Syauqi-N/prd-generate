import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "fallback-secret-change-in-production"
);

const AUTH_PATHS = ["/login", "/register"];
const PROTECTED_PREFIXES = ["/dashboard", "/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("session")?.value;

  const isAuthPath = AUTH_PATHS.includes(pathname);
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  // Verify token using jose (Edge-compatible, no DB call)
  let validPayload: { userId: string } | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET);
      validPayload = payload as { userId: string };
    } catch {
      validPayload = null;
    }
  }

  // Protected route without valid session → redirect to login
  if (isProtected && !validPayload) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(url);
    if (token) {
      response.cookies.set("session", "", { expires: new Date(0), path: "/" });
    }
    return response;
  }

  // Logged-in user accessing login/register → redirect to dashboard
  if (validPayload && isAuthPath) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)",
  ],
};
