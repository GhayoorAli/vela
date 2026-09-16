import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminToken } from "@/lib/admin-cookie";

export function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD || "vela-admin";
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isAdmin() {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value === adminToken();
}

export async function requireAdmin() {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }
}

export { ADMIN_COOKIE, adminToken } from "@/lib/admin-cookie";
