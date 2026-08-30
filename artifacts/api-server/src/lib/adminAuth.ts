import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

const cookieName = "mgps_admin_session";
const sessionLifetimeMs = 1000 * 60 * 60 * 12;

type SessionPayload = { email: string; expiresAt: number };

function configuration() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!email || !password || !secret) return null;
  return { email, password, secret };
}

function signature(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function secureEquals(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function readSession(request: Request): SessionPayload | null {
  const config = configuration();
  const token = request.cookies?.[cookieName];
  if (!config || typeof token !== "string") return null;
  const [payload, receivedSignature] = token.split(".");
  if (!payload || !receivedSignature || !secureEquals(signature(payload, config.secret), receivedSignature)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionPayload;
    return session.email === config.email && session.expiresAt > Date.now() ? session : null;
  } catch {
    return null;
  }
}

export function signInAdmin(request: Request, response: Response) {
  const config = configuration();
  const { email, password } = request.body as { email?: string; password?: string };
  if (!config || !email || !password || !secureEquals(email, config.email) || !secureEquals(password, config.password)) {
    return false;
  }
  const session: SessionPayload = { email: config.email, expiresAt: Date.now() + sessionLifetimeMs };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  response.cookie(cookieName, `${payload}.${signature(payload, config.secret)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: sessionLifetimeMs,
    path: "/",
  });
  return true;
}

export function signOutAdmin(response: Response) {
  response.clearCookie(cookieName, { httpOnly: true, sameSite: "lax", path: "/" });
}

export function adminSession(request: Request) {
  return readSession(request);
}

export function requireAdmin(request: Request, response: Response, next: NextFunction) {
  if (!readSession(request)) {
    response.status(401).json({ message: "Admin sign-in required." });
    return;
  }
  next();
}
