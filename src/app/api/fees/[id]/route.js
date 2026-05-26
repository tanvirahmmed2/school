import { mockFees } from "@/lib/mockData";

let fees = [...mockFees];

export async function PUT(request, { params }) {
  const { id } = await params;
  const idx = fees.findIndex((f) => f.id === parseInt(id));
  if (idx === -1) return Response.json({ error: "Not found" }, { status: 404 });
  const body = await request.json();
  if (body.status === "paid") {
    body.paidDate = new Date().toISOString().split("T")[0];
    body.receipt = `RCP-${new Date().getFullYear()}-${String(id).padStart(3, "0")}`;
  }
  fees[idx] = { ...fees[idx], ...body };
  return Response.json({ success: true, fee: fees[idx] });
}
