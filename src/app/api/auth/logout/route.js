export async function POST() {
  const res = Response.json({ success: true, message: "Logged out" });
  res.headers.set("Set-Cookie", "token=; Path=/; HttpOnly; Max-Age=0");
  return res;
}
