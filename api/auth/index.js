import { createHmac, timingSafeEqual } from "node:crypto";

const cookieName = "mgps_admin_session";
const sessionLifetimeSeconds = 60 * 60 * 12;

function configuration() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!email || !password || !secret) return null;
  return { email, password, secret };
}

function secureEquals(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function signature(value, secret) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function readCookie(request) {
  const header = request.headers.cookie || "";
  const match = header.match(new RegExp(`(?:^|; )${cookieName}=([^;]+)`));
  return match?.[1] || null;
}

function readSession(request) {
  const config = configuration();
  const token = readCookie(request);
  if (!config || !token) return null;
  const [payload, receivedSignature] = token.split(".");
  if (!payload || !receivedSignature || !secureEquals(signature(payload, config.secret), receivedSignature)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return session.email === config.email && session.expiresAt > Date.now() ? session : null;
  } catch {
    return null;
  }
}

function sendJson(response, status, body) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(body));
}

export default function handler(request, response) {
  const path = new URL(request.url || "/", "https://mgps.local").pathname;
  if (path.endsWith("/session")) {
    sendJson(response, 200, { authenticated: Boolean(readSession(request)), email: readSession(request)?.email });
    return;
  }
  if (path.endsWith("/logout")) {
    response.statusCode = 204;
    response.setHeader("Set-Cookie", `${cookieName}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
    response.end();
    return;
  }
  if (!path.endsWith("/login") || request.method !== "POST") {
    sendJson(response, 405, { message: "Method not allowed." });
    return;
  }
  const config = configuration();
  if (!config) {
    sendJson(response, 500, { message: "Admin authentication is not configured. Add ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET to Vercel Production variables." });
    return;
  }
  const body = typeof request.body === "object" && request.body ? request.body : {};
  if (!body.email || !body.password || !secureEquals(String(body.email).trim(), config.email) || !secureEquals(String(body.password), config.password)) {
    sendJson(response, 401, { message: "Incorrect email or password." });
    return;
  }
  const payload = Buffer.from(JSON.stringify({ email: config.email, expiresAt: Date.now() + sessionLifetimeSeconds * 1000 })).toString("base64url");
  const secure = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
  const cookie = `${cookieName}=${payload}.${signature(payload, config.secret)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${sessionLifetimeSeconds}${secure ? "; Secure" : ""}`;
  response.statusCode = 200;
  response.setHeader("Set-Cookie", cookie);
  sendJson(response, 200, { authenticated: true });
}
