import { cookies } from "next/headers";
import crypto from "node:crypto";

// Reuses IP_HASH_SALT as the admin secret. Coupled on purpose per project choice;
// split into a dedicated ADMIN_SECRET if you ever rotate one without the other.
const COOKIE_NAME = "rpd_admin";
const COOKIE_MAX_AGE_SEC = 60 * 60 * 24;

function adminSecret() {
  const s = process.env.IP_HASH_SALT;
  if (!s || s.length < 16) {
    throw new Error(
      "IP_HASH_SALT must be set (16+ chars). Admin auth reuses this secret."
    );
  }
  return s;
}

function hmac(data: string) {
  return crypto.createHmac("sha256", adminSecret()).update(data).digest("hex");
}

function signToken(tsMs: number) {
  return `${tsMs}.${hmac(`admin:${tsMs}`)}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [tsStr, sig] = token.split(".");
  if (!tsStr || !sig) return false;
  const ts = Number(tsStr);
  if (!Number.isFinite(ts)) return false;
  if (Date.now() - ts > COOKIE_MAX_AGE_SEC * 1000) return false;
  const expected = hmac(`admin:${ts}`);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(sig, "hex"),
      Buffer.from(expected, "hex")
    );
  } catch {
    return false;
  }
}

export async function isAdminAuthed(): Promise<boolean> {
  const c = await cookies();
  return verifyToken(c.get(COOKIE_NAME)?.value);
}

export async function setAdminCookie() {
  const c = await cookies();
  c.set(COOKIE_NAME, signToken(Date.now()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SEC,
  });
}

export async function clearAdminCookie() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

export function verifyAdminSecret(provided: string): boolean {
  const expected = adminSecret();
  if (provided.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  } catch {
    return false;
  }
}
