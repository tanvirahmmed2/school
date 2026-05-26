import { mockFees } from "@/lib/mockData";

let fees = [...mockFees];
let nextId = fees.length + 1;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const cls = searchParams.get("class");
  const studentId = searchParams.get("studentId");

  let result = fees;
  if (status) result = result.filter((f) => f.status === status);
  if (cls) result = result.filter((f) => f.class === cls);
  if (studentId) result = result.filter((f) => f.studentId === parseInt(studentId));

  const total = result.reduce((sum, f) => sum + f.amount, 0);
  const collected = result.filter((f) => f.status === "paid").reduce((sum, f) => sum + f.amount, 0);
  const pending = result.filter((f) => f.status !== "paid").reduce((sum, f) => sum + f.amount, 0);

  return Response.json({ fees: result, summary: { total, collected, pending } });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const receipt = `RCP-${new Date().getFullYear()}-${String(nextId).padStart(3, "0")}`;
    const fee = {
      id: nextId++, ...body,
      status: body.status || "pending",
      paidDate: body.status === "paid" ? new Date().toISOString().split("T")[0] : null,
      receipt: body.status === "paid" ? receipt : null,
    };
    fees.push(fee);
    return Response.json({ success: true, fee }, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid data" }, { status: 400 });
  }
}
