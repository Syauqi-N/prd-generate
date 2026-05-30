import { getCurrentUser } from "./auth";
import { Role } from "@prisma/client";

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  if (user.role !== Role.ADMIN) {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export function isAdmin(role: Role) {
  return role === Role.ADMIN;
}

export function canExportPDF(credits: number, role: Role) {
  return role === Role.ADMIN || credits > 0;
}
