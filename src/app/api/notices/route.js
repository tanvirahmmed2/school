import { mockNotices } from "@/lib/mockData";

let notices = [...mockNotices];
let nextId = notices.length + 1;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const target = searchParams.get("target");
  const limit = searchParams.get("limit");

  let result = [...notices].sort((a, b) => new Date(b.date) - new Date(a.date));
  if (category) result = result.filter((n) => n.category === category);
  if (target) result = result.filter((n) => n.target === target || n.target === "all");
  if (limit) result = result.slice(0, parseInt(limit));

  return Response.json({ notices: result, total: result.length });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const notice = { id: nextId++, ...body, date: new Date().toISOString().split("T")[0] };
    notices.unshift(notice);
    return Response.json({ success: true, notice }, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid data" }, { status: 400 });
  }
}
