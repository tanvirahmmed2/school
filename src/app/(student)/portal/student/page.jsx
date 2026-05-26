import Link from "next/link";
export const metadata = { title: "Student Dashboard | Govt. Primary School" };

const quickStats = [
  { label: "Attendance", value: "91%", icon: "✅", color: "#10B981", bg: "#ECFDF5", sub: "This Month" },
  { label: "Last Result", value: "A+", icon: "🏆", color: "#F59E0B", bg: "#FFFBEB", sub: "Half-Yearly 2025" },
  { label: "Fee Status", value: "Paid", icon: "💳", color: "#4F46E5", bg: "#EEF2FF", sub: "May 2025" },
  { label: "Rank", value: "3rd", icon: "🥉", color: "#7C3AED", bg: "#F5F3FF", sub: "In Class 5" },
];

const upcomingExams = [
  { subject: "Mathematics", date: "June 10", time: "9:00 AM", type: "Final" },
  { subject: "Science", date: "June 12", time: "9:00 AM", type: "Final" },
  { subject: "English", date: "June 14", time: "9:00 AM", type: "Final" },
];

const recentNotices = [
  { title: "Final Exam Schedule Published", date: "May 24", category: "Exam" },
  { title: "School Closed — Eid Holiday", date: "May 20", category: "Holiday" },
  { title: "Sports Day Registration Open", date: "May 18", category: "Event" },
];

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg,#1E1B4B,#312E81,#4C1D95)" }}>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(circle,#F59E0B,transparent)" }} />
        <div className="relative">
          <p className="text-indigo-300 text-sm mb-1">Welcome back 👋</p>
          <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "Poppins" }}>Sakib Hasan</h1>
          <p className="text-indigo-300 text-sm">Class 5 · Section A · Roll 101 · Batch 2025</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((s) => (
          <div key={s.label} className="p-5 rounded-2xl" style={{ background: "#fff", border: "1px solid #E2E8F0" }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3" style={{ background: s.bg }}>{s.icon}</div>
            <p className="text-2xl font-black mb-0.5" style={{ color: s.color, fontFamily: "Poppins" }}>{s.value}</p>
            <p className="text-slate-700 text-sm font-semibold">{s.label}</p>
            <p className="text-slate-400 text-xs mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Exams */}
        <div className="p-6 rounded-2xl" style={{ background: "#fff", border: "1px solid #E2E8F0" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Upcoming Exams</h3>
            <Link href="/portal/student/schedule" className="text-xs text-indigo-500 font-semibold">View All →</Link>
          </div>
          <div className="space-y-3">
            {upcomingExams.map((e) => (
              <div key={e.subject} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#F8FAFC" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: "#EEF2FF" }}>📝</div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 text-sm">{e.subject}</p>
                  <p className="text-slate-400 text-xs">{e.date} · {e.time}</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "#EEF2FF", color: "#4F46E5" }}>{e.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notices */}
        <div className="p-6 rounded-2xl" style={{ background: "#fff", border: "1px solid #E2E8F0" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Recent Notices</h3>
            <Link href="/portal/student/notices" className="text-xs text-indigo-500 font-semibold">View All →</Link>
          </div>
          <div className="space-y-3">
            {recentNotices.map((n) => (
              <div key={n.title} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                <span className="text-xl">📢</span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 text-sm">{n.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{n.date}</p>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#EEF2FF", color: "#4F46E5" }}>{n.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Result Summary */}
      <div className="p-6 rounded-2xl" style={{ background: "#fff", border: "1px solid #E2E8F0" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800">Latest Result — Half-Yearly 2025</h3>
          <Link href="/portal/student/results" className="text-xs text-indigo-500 font-semibold">Full Result →</Link>
        </div>
        <div className="grid grid-cols-5 gap-3 mb-4">
          {[["Bangla","85","#4F46E5"],["English","78","#7C3AED"],["Math","92","#10B981"],["Science","88","#F59E0B"],["Social","80","#0EA5E9"]].map(([sub,marks,color])=>(
            <div key={sub} className="text-center p-4 rounded-xl" style={{ background: "#F8FAFC" }}>
              <p className="text-xl font-black mb-1" style={{ color, fontFamily: "Poppins" }}>{marks}</p>
              <div className="h-1.5 rounded-full mb-2" style={{ background: "#E2E8F0" }}>
                <div className="h-1.5 rounded-full" style={{ width: `${marks}%`, background: color }} />
              </div>
              <p className="text-xs text-slate-500">{sub}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "#EEF2FF" }}>
          <span className="font-bold text-slate-700">Total: <strong className="text-indigo-600">423/500</strong></span>
          <span className="font-bold text-slate-700">84.6%</span>
          <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ background: "#fff", color: "#10B981" }}>GPA: A+</span>
        </div>
      </div>
    </div>
  );
}
