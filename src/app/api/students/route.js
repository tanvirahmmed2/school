import { mockStudents } from "@/lib/mockData";

let students = [...mockStudents];
let nextId = students.length + 1;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase();
  const cls = searchParams.get("class");
  const status = searchParams.get("status");

  let result = students;
  if (search) result = result.filter((s) => s.name.toLowerCase().includes(search) || s.roll.includes(search));
  if (cls) result = result.filter((s) => s.class === cls);
  if (status) result = result.filter((s) => s.status === status);

  return Response.json({ students: result, total: result.length });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const student = { id: nextId++, ...body, joinDate: new Date().toISOString().split("T")[0] };
    students.push(student);
    return Response.json({ success: true, student }, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid data" }, { status: 400 });
  }
}
