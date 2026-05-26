import { mockTeachers } from "@/lib/mockData";

let teachers = [...mockTeachers];

export async function GET(_, { params }) {
  const { id } = await params;
  const teacher = teachers.find((t) => t.id === parseInt(id));
  if (!teacher) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ teacher });
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const idx = teachers.findIndex((t) => t.id === parseInt(id));
  if (idx === -1) return Response.json({ error: "Not found" }, { status: 404 });
  const body = await request.json();
  teachers[idx] = { ...teachers[idx], ...body };
  return Response.json({ success: true, teacher: teachers[idx] });
}

export async function DELETE(_, { params }) {
  const { id } = await params;
  const idx = teachers.findIndex((t) => t.id === parseInt(id));
  if (idx === -1) return Response.json({ error: "Not found" }, { status: 404 });
  teachers.splice(idx, 1);
  return Response.json({ success: true });
}
