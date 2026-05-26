import Link from "next/link";
export const metadata = { title: "Teacher Dashboard | Govt. Primary School" };

const stats = [
  { label: "My Classes", value: "2", icon: "📚", color: "#7C3AED", bg: "#F5F3FF" },
  { label: "Total Students", value: "68", icon: "🎓", color: "#4F46E5", bg: "#EEF2FF" },
  { label: "Today Present", value: "62", icon: "✅", color: "#10B981", bg: "#ECFDF5" },
  { label: "May Salary", value: "Paid", icon: "💰", color: "#F59E0B", bg: "#FFFBEB" },
];

const schedule = [
  { time: "8:00–8:45 AM", class: "Class 4 – A", subject: "Mathematics" },
  { time: "8:45–9:30 AM", class: "Class 5 – A", subject: "Mathematics" },
  { time: "10:00–10:45 AM", class: "Class 4 – B", subject: "Science" },
  { time: "10:45–11:30 AM", class: "Class 5 – B", subject: "Science" },
];

const students = [
  { name: "Sakib Hasan", roll: "101", class: "Class 5", attendance: "95%", lastResult: "A+" },
  { name: "Rahima Akter", roll: "102", class: "Class 4", attendance: "88%", lastResult: "A" },
  { name: "Tanvir Ahmed", roll: "103", class: "Class 5", attendance: "92%", lastResult: "A+" },
];

export default function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg,#1E1B4B,#4C1D95,#7C3AED)" }}>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(circle,#F59E0B,transparent)" }} />
        <div className="relative">
          <p className="text-violet-300 text-sm mb-1">Good morning 👋</p>
          <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "Poppins" }}>Md. Rafiqul Islam</h1>
          <p className="text-violet-300 text-sm">Head Teacher · Math &amp; Science · T001</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="p-5 rounded-2xl" style={{ background: "#fff", border: "1px solid #E2E8F0" }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3" style={{ background: s.bg }}>{s.icon}</div>
            <p className="text-2xl font-black mb-0.5" style={{ color: s.color, fontFamily: "Poppins" }}>{s.value}</p>
            <p className="text-slate-700 text-sm font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="p-6 rounded-2xl" style={{ background: "#fff", border: "1px solid #E2E8F0" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Today's Schedule</h3>
            <Link href="/portal/teacher/schedule" className="text-xs text-violet-500 font-semibold">Full Schedule →</Link>
          </div>
          <div className="space-y-3">
            {schedule.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: i === 0 ? "#F5F3FF" : "#F8FAFC", border: i === 0 ? "1px solid #DDD6FE" : "none" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base" style={{ background: "#EEF2FF" }}>📚</div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 text-sm">{s.class} — {s.subject}</p>
                  <p className="text-slate-400 text-xs">{s.time}</p>
                </div>
                {i === 0 && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#7C3AED", color: "#fff" }}>Now</span>}
              </div>
            ))}
          </div>
        </div>

        {/* My Students */}
        <div className="p-6 rounded-2xl" style={{ background: "#fff", border: "1px solid #E2E8F0" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">My Students</h3>
            <Link href="/portal/teacher/students" className="text-xs text-violet-500 font-semibold">View All →</Link>
          </div>
          <div className="space-y-3">
            {students.map((s) => (
              <div key={s.roll} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}>{s.name.charAt(0)}</div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 text-sm">{s.name}</p>
                  <p className="text-slate-400 text-xs">Roll {s.roll} · {s.class}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-500">{s.attendance}</p>
                  <p className="text-xs text-slate-400">GPA: {s.lastResult}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 rounded-2xl" style={{ background: "#fff", border: "1px solid #E2E8F0" }}>
        <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[["✅","Mark Attendance","/portal/teacher/attendance","#10B981"],["📝","Enter Results","/portal/teacher/students","#4F46E5"],["📢","Post Notice","/portal/teacher/notices","#F59E0B"],["📊","View Reports","/portal/teacher/students","#7C3AED"]].map(([icon,label,href,color])=>(
            <Link key={label} href={href} className="flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all hover:scale-105"
              style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-semibold text-slate-700">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
