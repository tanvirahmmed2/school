import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "school_jwt_secret_2025";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request) {
  const cookie = request.cookies?.get?.("token")?.value;
  if (cookie) return cookie;
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export function createResponse(data, status = 200) {
  return Response.json(data, { status });
}

export function errorResponse(message, status = 400) {
  return Response.json({ error: message }, { status });
}
