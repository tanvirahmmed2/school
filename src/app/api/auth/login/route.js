import { mockUsers } from "@/lib/mockData";
import { signToken, errorResponse } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password, role } = await request.json();

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password && (!role || u.role === role)
    );

    if (!user) {
      return errorResponse("Invalid email or password", 401);
    }

    const token = signToken({ id: user.id, name: user.name, email: user.email, role: user.role });

    const { password: _pw, ...safeUser } = user;

    const res = Response.json({ success: true, user: safeUser, token });
    res.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 3600}`
    );
    return res;
  } catch {
    return errorResponse("Server error", 500);
  }
}
