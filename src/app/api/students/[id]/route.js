import { mockStudents } from "@/lib/mockData";

let students = [...mockStudents];

export async function GET(_, { params }) {
  const { id } = await params;
  const student = students.find((s) => s.id === parseInt(id));
  if (!student) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ student });
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const idx = students.findIndex((s) => s.id === parseInt(id));
  if (idx === -1) return Response.json({ error: "Not found" }, { status: 404 });
  const body = await request.json();
  students[idx] = { ...students[idx], ...body };
  return Response.json({ success: true, student: students[idx] });
}

export async function DELETE(_, { params }) {
  const { id } = await params;
  const idx = students.findIndex((s) => s.id === parseInt(id));
  if (idx === -1) return Response.json({ error: "Not found" }, { status: 404 });
  students.splice(idx, 1);
  return Response.json({ success: true });
}
