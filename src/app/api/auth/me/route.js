import { getTokenFromRequest, verifyToken, errorResponse } from "@/lib/auth";
import { mockUsers } from "@/lib/mockData";

export async function GET(request) {
  const token = getTokenFromRequest(request);
  if (!token) return errorResponse("Unauthorized", 401);

  const decoded = verifyToken(token);
  if (!decoded) return errorResponse("Invalid token", 401);

  const user = mockUsers.find((u) => u.id === decoded.id);
  if (!user) return errorResponse("User not found", 404);

  const { password: _pw, ...safeUser } = user;
  return Response.json({ user: safeUser });
}
