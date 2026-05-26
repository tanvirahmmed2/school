import Link from "next/link";
import React from "react";

const statCards = [
  {
    label: "Total Students",
    value: "1,247",
    change: "+23 this month",
    trend: "up",
    icon: "🎓",
    gradient: "linear-gradient(135deg, #4F46E5, #7C3AED)",
    lightBg: "rgba(79,70,229,0.15)",
  },
  {
    label: "Total Teachers",
    value: "62",
    change: "+2 this month",
    trend: "up",
    icon: "👨‍🏫",
    gradient: "linear-gradient(135deg, #10B981, #059669)",
    lightBg: "rgba(16,185,129,0.15)",
  },
  {
    label: "Monthly Income",
    value: "৳ 2,84,500",
    change: "+12% vs last month",
    trend: "up",
    icon: "💰",
    gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
    lightBg: "rgba(245,158,11,0.15)",
  },
  {
    label: "Pending Fees",
    value: "৳ 42,300",
    change: "38 students due",
    trend: "down",
    icon: "⚠️",
    gradient: "linear-gradient(135deg, #F43F5E, #E11D48)",
    lightBg: "rgba(244,63,94,0.15)",
  },
];

const recentActivities = [
  { icon: "💳", text: "Fee paid by Rahima Akter (Class 4)", time: "5 min ago", color: "#10B981" },
  { icon: "🎓", text: "New student admitted: Sakib Hasan, Class 1", time: "12 min ago", color: "#4F46E5" },
  { icon: "✅", text: "Attendance marked for Class 3 — 28/30 present", time: "30 min ago", color: "#7C3AED" },
  { icon: "📝", text: "Exam result uploaded for Class 5 — Science", time: "1 hr ago", color: "#F59E0B" },
  { icon: "📢", text: "Notice published: Exam Schedule June 2025", time: "2 hrs ago", color: "#0EA5E9" },
  { icon: "💰", text: "Salary disbursed for May 2025 — 62 teachers", time: "3 hrs ago", color: "#10B981" },
  { icon: "📱", text: "Bulk SMS sent: 1,200 parents notified", time: "5 hrs ago", color: "#F43F5E" },
];

const recentPayments = [
  { name: "Rahima Akter", class: "Class 4", amount: "৳ 1,200", date: "May 24", status: "Paid", color: "#10B981" },
  { name: "Sakib Hasan", class: "Class 1", amount: "৳ 800", date: "May 24", status: "Paid", color: "#10B981" },
  { name: "Mitu Begum", class: "Class 3", amount: "৳ 1,200", date: "May 23", status: "Pending", color: "#F59E0B" },
  { name: "Rahim Mia", class: "Class 5", amount: "৳ 1,500", date: "May 22", status: "Paid", color: "#10B981" },
  { name: "Sona Akter", class: "Class 2", amount: "৳ 800", date: "May 21", status: "Overdue", color: "#F43F5E" },
];

const attendanceBars = [
  { class: "Class 1", present: 42, total: 45 },
  { class: "Class 2", present: 38, total: 42 },
  { class: "Class 3", present: 28, total: 30 },
  { class: "Class 4", present: 35, total: 40 },
  { class: "Class 5", present: 32, total: 36 },
];

const quickActions = [
  { icon: "👤", label: "Add Student", path: "/dashboard/students/add", color: "#4F46E5" },
  { icon: "👨‍🏫", label: "Add Teacher", path: "/dashboard/teachers/add", color: "#7C3AED" },
  { icon: "💳", label: "Collect Fee", path: "/dashboard/fees", color: "#F59E0B" },
  { icon: "📢", label: "New Notice", path: "/dashboard/notices/add", color: "#10B981" },
  { icon: "📱", label: "Send SMS", path: "/dashboard/sms", color: "#0EA5E9" },
  { icon: "📊", label: "View Reports", path: "/dashboard/reports", color: "#F43F5E" },
];

const DashBoardPage = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1E1B4B, #312E81, #4C1D95)" }}
      >
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #F59E0B, transparent)" }}
        />
        <div className="relative">
          <p className="text-indigo-300 text-sm font-medium mb-1">Good morning 👋</p>
          <h2 className="text-white text-2xl font-black" style={{ fontFamily: "Poppins" }}>
            Welcome back, Admin
          </h2>
          <p className="text-indigo-300 text-sm mt-1">
            Govt. Primary School — Academic Year 2025
          </p>
        </div>
        <div className="flex gap-3 relative">
          <Link
            href="/dashboard/admissions"
            className="text-sm font-bold text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)" }}
          >
            + New Admission
          </Link>
          <Link
            href="/dashboard/reports"
            className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-all"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            View Reports
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="stat-card"
            style={{ background: "#1E293B", border: "1px solid #334155" }}
          >
            <div
              className="absolute inset-0 rounded-[1rem] opacity-10"
              style={{ background: card.gradient }}
            />
            <div className="relative flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: card.lightBg }}
              >
                {card.icon}
              </div>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-lg ${
                  card.trend === "up"
                    ? "text-emerald-400 bg-emerald-400/10"
                    : "text-rose-400 bg-rose-400/10"
                }`}
              >
                {card.trend === "up" ? "↑" : "↓"} {card.change.split(" ")[0]}
              </span>
            </div>
            <div className="relative">
              <p
                className="text-3xl font-black text-white mb-1"
                style={{ fontFamily: "Poppins" }}
              >
                {card.value}
              </p>
              <p className="text-slate-400 text-sm">{card.label}</p>
              <p className="text-xs mt-1" style={{ color: card.trend === "up" ? "#34D399" : "#FB7185" }}>
                {card.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "#1E293B", border: "1px solid #334155" }}
      >
        <h3 className="text-white font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.path}
              className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:scale-105 group"
              style={{ background: `${action.color}15`, border: `1px solid ${action.color}30` }}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                {action.icon}
              </span>
              <span className="text-xs font-semibold text-slate-300 text-center">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Attendance Summary */}
        <div
          className="xl:col-span-1 rounded-2xl p-5"
          style={{ background: "#1E293B", border: "1px solid #334155" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-bold">Today's Attendance</h3>
            <span className="text-xs text-slate-400">
              {new Date().toLocaleDateString("en-BD")}
            </span>
          </div>
          <div className="space-y-4">
            {attendanceBars.map((item) => {
              const pct = Math.round((item.present / item.total) * 100);
              const color = pct >= 90 ? "#10B981" : pct >= 75 ? "#F59E0B" : "#F43F5E";
              return (
                <div key={item.class}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">{item.class}</span>
                    <span className="font-bold" style={{ color }}>
                      {item.present}/{item.total} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "#334155" }}>
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 pt-4" style={{ borderTop: "1px solid #334155" }}>
            {[
              { label: "Present", value: "175", color: "#10B981" },
              { label: "Absent", value: "18", color: "#F43F5E" },
              { label: "Rate", value: "91%", color: "#4F46E5" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-black text-xl" style={{ color: s.color, fontFamily: "Poppins" }}>
                  {s.value}
                </p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div
          className="xl:col-span-2 rounded-2xl p-5"
          style={{ background: "#1E293B", border: "1px solid #334155" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-bold">Recent Activity</h3>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              View All →
            </button>
          </div>
          <div className="space-y-1">
            {recentActivities.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-700/30 transition-colors cursor-default"
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 mt-0.5"
                  style={{ background: `${a.color}20` }}
                >
                  {a.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-xs font-medium">{a.text}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Payments Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "#1E293B", border: "1px solid #334155" }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #334155" }}
        >
          <h3 className="text-white font-bold">Recent Fee Payments</h3>
          <Link
            href="/dashboard/fees"
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Manage Fees →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "#0F172A" }}>
                {["Student Name", "Class", "Amount", "Date", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest"
                    style={{ color: "#475569" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((p, i) => (
                <tr
                  key={i}
                  className="hover:bg-slate-700/30 transition-colors"
                  style={{ borderBottom: i < recentPayments.length - 1 ? "1px solid #334155" : "none" }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
                      >
                        {p.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-200">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{p.class}</td>
                  <td className="px-6 py-4 text-sm font-bold text-white">{p.amount}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{p.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className="text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{
                        background: `${p.color}20`,
                        color: p.color,
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Notice + Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Latest Notices */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "#1E293B", border: "1px solid #334155" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">Latest Notices</h3>
            <Link href="/dashboard/notices" className="text-xs text-indigo-400 font-semibold hover:text-indigo-300">
              Manage →
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { title: "Exam Schedule — Class 5", badge: "Urgent", color: "#F43F5E" },
              { title: "Annual Sports Day Registration", badge: "Event", color: "#10B981" },
              { title: "School Closed — Eid ul-Adha", badge: "Holiday", color: "#F59E0B" },
            ].map((n, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700/30 transition-colors cursor-pointer"
              >
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{ background: `${n.color}20`, color: n.color }}
                >
                  {n.badge}
                </span>
                <p className="text-sm text-slate-300 truncate">{n.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* System Summary */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "#1E293B", border: "1px solid #334155" }}
        >
          <h3 className="text-white font-bold mb-4">System Summary</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "📋", label: "Admission Pending", value: "12", color: "#F59E0B" },
              { icon: "💳", label: "Fee Dues", value: "38", color: "#F43F5E" },
              { icon: "📝", label: "Results Pending", value: "5", color: "#7C3AED" },
              { icon: "📱", label: "SMS Sent Today", value: "142", color: "#0EA5E9" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{ background: "#0F172A", border: "1px solid #334155" }}
              >
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${s.color}15` }}
                >
                  {s.icon}
                </span>
                <div>
                  <p className="font-black text-xl text-white" style={{ fontFamily: "Poppins" }}>
                    {s.value}
                  </p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoardPage;
