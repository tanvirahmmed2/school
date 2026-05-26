import { mockSmsLogs } from "@/lib/mockData";

let logs = [...mockSmsLogs];
let nextId = logs.length + 1;

export async function GET() {
  return Response.json({ logs, total: logs.length });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const log = {
      id: nextId++,
      recipient: body.recipient,
      message: body.message,
      count: body.count || 1,
      sentAt: new Date().toLocaleString("en-BD"),
      status: "sent",
    };
    logs.unshift(log);
    return Response.json({ success: true, log }, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid data" }, { status: 400 });
  }
}
