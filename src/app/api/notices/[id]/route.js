import { mockNotices } from "@/lib/mockData";

let notices = [...mockNotices];

export async function PUT(request, { params }) {
  const { id } = await params;
  const idx = notices.findIndex((n) => n.id === parseInt(id));
  if (idx === -1) return Response.json({ error: "Not found" }, { status: 404 });
  const body = await request.json();
  notices[idx] = { ...notices[idx], ...body };
  return Response.json({ success: true, notice: notices[idx] });
}

export async function DELETE(_, { params }) {
  const { id } = await params;
  const idx = notices.findIndex((n) => n.id === parseInt(id));
  if (idx === -1) return Response.json({ error: "Not found" }, { status: 404 });
  notices.splice(idx, 1);
  return Response.json({ success: true });
}
