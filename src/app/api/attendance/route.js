import { mockAttendance } from "@/lib/mockData";

let attendance = [...mockAttendance];
let nextId = attendance.length + 1;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const cls = searchParams.get("class");
  const studentId = searchParams.get("studentId");

  let result = attendance;
  if (date) result = result.filter((a) => a.date === date);
  if (cls) result = result.filter((a) => a.class === cls);
  if (studentId) result = result.filter((a) => a.studentId === parseInt(studentId));

  const present = result.filter((a) => a.status === "present").length;
  const absent = result.filter((a) => a.status === "absent").length;
  const late = result.filter((a) => a.status === "late").length;

  return Response.json({ attendance: result, summary: { present, absent, late, total: result.length } });
}

export async function POST(request) {
  try {
    const body = await request.json();
    // body can be array of records or single record
    const records = Array.isArray(body) ? body : [body];
    const created = records.map((r) => {
      const rec = { id: nextId++, ...r, date: r.date || new Date().toISOString().split("T")[0] };
      attendance.push(rec);
      return rec;
    });
    return Response.json({ success: true, attendance: created }, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid data" }, { status: 400 });
  }
}
