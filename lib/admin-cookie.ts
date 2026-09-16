export const ADMIN_COOKIE = "vela_admin";

export function adminToken() {
  return process.env.ADMIN_SECRET || "vela-local-admin-secret";
}
