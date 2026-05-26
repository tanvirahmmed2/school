import { mockTeachers } from "@/lib/mockData";

let teachers = [...mockTeachers];
let nextId = teachers.length + 1;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase();
  const status = searchParams.get("status");

  let result = teachers;
  if (search) result = result.filter((t) => t.name.toLowerCase().includes(search) || t.subject.toLowerCase().includes(search));
  if (status) result = result.filter((t) => t.status === status);

  return Response.json({ teachers: result, total: result.length });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const empId = `T${String(nextId).padStart(3, "0")}`;
    const teacher = { id: nextId++, empId, ...body, joinDate: new Date().toISOString().split("T")[0] };
    teachers.push(teacher);
    return Response.json({ success: true, teacher }, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid data" }, { status: 400 });
  }
}
