import { scryptSync, randomBytes, timingSafeEqual, createHmac } from "node:crypto";

export const SESSION_COOKIE = "nupwb_admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return secret;
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

type SessionPayload = { adminId: string; email: string; issuedAt: number };

/** Builds a signed, cookie-safe session token: base64url(payload).hex(hmac). */
export function createSessionToken(payload: Omit<SessionPayload, "issuedAt">): string {
  const full: SessionPayload = { ...payload, issuedAt: Date.now() };
  const body = Buffer.from(JSON.stringify(full)).toString("base64url");
  const signature = createHmac("sha256", sessionSecret()).update(body).digest("hex");
  return `${body}.${signature}`;
}

/** Verifies a session token's signature and freshness; returns the payload or null. */
export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = createHmac("sha256", sessionSecret()).update(body).digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");
  const actualBuf = Buffer.from(signature, "hex");
  if (expectedBuf.length !== actualBuf.length || !timingSafeEqual(expectedBuf, actualBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload;
    const age = (Date.now() - payload.issuedAt) / 1000;
    if (age > SESSION_MAX_AGE_SECONDS) return null;
    return payload;
  } catch {
    return null;
  }
}
