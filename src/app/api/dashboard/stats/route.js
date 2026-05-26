import { mockStudents, mockTeachers, mockFees, mockNotices, mockAttendance } from "@/lib/mockData";

export async function GET() {
  const totalStudents = mockStudents.length;
  const totalTeachers = mockTeachers.length;
  const activeStudents = mockStudents.filter((s) => s.status === "active").length;

  const totalIncome = mockFees.filter((f) => f.status === "paid").reduce((s, f) => s + f.amount, 0);
  const pendingFees = mockFees.filter((f) => f.status !== "paid").reduce((s, f) => s + f.amount, 0);
  const pendingCount = mockFees.filter((f) => f.status !== "paid").length;

  const today = new Date().toISOString().split("T")[0];
  const todayAtt = mockAttendance.filter((a) => a.date === today);
  const presentToday = todayAtt.filter((a) => a.status === "present").length;
  const absentToday = todayAtt.filter((a) => a.status === "absent").length;

  const classStats = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"].map((cls) => ({
    class: cls,
    students: mockStudents.filter((s) => s.class === cls).length,
  }));

  const recentNotices = [...mockNotices]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  return Response.json({
    stats: { totalStudents, totalTeachers, activeStudents, totalIncome, pendingFees, pendingCount, presentToday, absentToday },
    classStats,
    recentNotices,
  });
}
