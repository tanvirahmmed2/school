import Link from "next/link";
import React from "react";

const notices = [
  {
    id: 1,
    badge: "Urgent",
    badgeColor: "#F43F5E",
    date: "May 24, 2025",
    title: "Final Exam Schedule — Class 5",
    desc: "The final examination for Class 5 will commence from June 10, 2025. Students must bring their admit cards.",
  },
  {
    id: 2,
    badge: "Admission",
    badgeColor: "#4F46E5",
    date: "May 22, 2025",
    title: "New Admission Open for Session 2025-26",
    desc: "Applications are now open for all classes. Last date to apply is June 30, 2025. Visit the office for forms.",
  },
  {
    id: 3,
    badge: "Holiday",
    badgeColor: "#F59E0B",
    date: "May 20, 2025",
    title: "School Closed — Eid ul-Adha",
    desc: "School will remain closed from June 6 to June 12, 2025 for Eid ul-Adha. Regular classes resume June 13.",
  },
  {
    id: 4,
    badge: "Event",
    badgeColor: "#10B981",
    date: "May 18, 2025",
    title: "Annual Sports Day — Registration Open",
    desc: "All students from Class 1 to Class 5 are encouraged to register for Annual Sports Day events. Forms available at office.",
  },
  {
    id: 5,
    badge: "Academic",
    badgeColor: "#7C3AED",
    date: "May 15, 2025",
    title: "Class Routine Updated for June",
    desc: "The updated class routine for June 2025 is now available. Please check the academic section for details.",
  },
];

const NoticeBoard = () => {
  return (
    <section
      className="section-padding"
      style={{ background: "linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Left heading */}
          <div className="lg:col-span-1">
            <span
              className="inline-block text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
              style={{ background: "#EEF2FF", color: "#4F46E5" }}
            >
              Notice Board
            </span>
            <h2
              className="text-4xl font-black text-slate-800 mb-5"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Latest{" "}
              <span className="gradient-text">Notices</span> &
              Announcements
            </h2>
            <p className="text-slate-500 leading-relaxed mb-8">
              Stay up-to-date with all school announcements, exam schedules, holidays, and events.
            </p>

            {/* Live indicator */}
            <div
              className="flex items-center gap-3 p-4 rounded-2xl mb-6"
              style={{ background: "#fff", border: "1px solid #E2E8F0" }}
            >
              <span
                className="w-3 h-3 rounded-full bg-emerald-400 flex-shrink-0"
                style={{
                  boxShadow: "0 0 0 4px rgba(16,185,129,0.2)",
                  animation: "pulse-ring 1.5s ease-out infinite",
                }}
              />
              <p className="text-sm font-medium text-slate-700">
                Notices are updated in real-time
              </p>
            </div>

            <Link
              href="/notice"
              className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl text-white"
              style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
            >
              View All Notices →
            </Link>
          </div>

          {/* Right — Notice List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {notices.map((n, i) => (
              <div
                key={n.id}
                className="card-hover flex items-start gap-4 p-5 rounded-2xl group cursor-pointer"
                style={{
                  background: "#fff",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                {/* Date column */}
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center text-center"
                  style={{ background: `${n.badgeColor}12` }}
                >
                  <p className="text-lg font-black leading-none" style={{ color: n.badgeColor }}>
                    {n.date.split(" ")[1].replace(",", "")}
                  </p>
                  <p className="text-[10px] font-medium uppercase" style={{ color: n.badgeColor }}>
                    {n.date.split(" ")[0]}
                  </p>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                      style={{
                        background: `${n.badgeColor}18`,
                        color: n.badgeColor,
                      }}
                    >
                      {n.badge}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-indigo-600 transition-colors">
                    {n.title}
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{n.desc}</p>
                </div>

                <span className="text-slate-300 group-hover:text-indigo-400 text-lg flex-shrink-0 transition-colors">
                  →
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoticeBoard;
