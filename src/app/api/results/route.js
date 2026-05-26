import { mockResults } from "@/lib/mockData";

let results = [...mockResults];
let nextId = results.length + 1;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cls = searchParams.get("class");
  const exam = searchParams.get("exam");
  const studentId = searchParams.get("studentId");
  const roll = searchParams.get("roll");

  let result = results;
  if (cls) result = result.filter((r) => r.class === cls);
  if (exam) result = result.filter((r) => r.exam === exam);
  if (studentId) result = result.filter((r) => r.studentId === parseInt(studentId));
  if (roll) {
    // public lookup by roll
    result = result.filter((r) => String(r.studentId) === roll);
  }

  return Response.json({ results: result, total: result.length });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { bangla = 0, english = 0, math = 0, science = 0, social = 0 } = body;
    const total = bangla + english + math + science + social;
    const percentage = ((total / 500) * 100).toFixed(1);
    const gpa = percentage >= 80 ? "A+" : percentage >= 70 ? "A" : percentage >= 60 ? "A-" : percentage >= 50 ? "B" : percentage >= 40 ? "C" : "F";
    const status = percentage >= 33 ? "passed" : "failed";

    const result = { id: nextId++, ...body, total, percentage: parseFloat(percentage), gpa, status };
    results.push(result);
    return Response.json({ success: true, result }, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid data" }, { status: 400 });
  }
}
