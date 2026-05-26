import Link from "next/link";

export const metadata = { title: "Notice Board | Govt. Primary School" };

const notices = [
  { id: 1, title: "Final Exam Schedule — Class 5", content: "The final examination for Class 5 will commence from June 10, 2025. Students must bring their admit cards.", category: "Exam", priority: "urgent", date: "May 24, 2025", color: "#F43F5E" },
  { id: 2, title: "New Admission Open for Session 2025-26", content: "Applications are now open for all classes. Last date to apply is June 30, 2025.", category: "Admission", priority: "normal", date: "May 22, 2025", color: "#4F46E5" },
  { id: 3, title: "School Closed — Eid ul-Adha Holiday", content: "School will remain closed from June 6 to June 12, 2025 for Eid ul-Adha. Regular classes resume June 13.", category: "Holiday", priority: "normal", date: "May 20, 2025", color: "#F59E0B" },
  { id: 4, title: "Annual Sports Day Registration Open", content: "All students from Class 1 to Class 5 are encouraged to register for Annual Sports Day events.", category: "Event", priority: "normal", date: "May 18, 2025", color: "#10B981" },
  { id: 5, title: "Staff Meeting — June 1, 2025", content: "All teaching and non-teaching staff are requested to attend the monthly staff meeting on June 1, 2025 at 3:00 PM.", category: "Meeting", priority: "normal", date: "May 15, 2025", color: "#7C3AED" },
  { id: 6, title: "Class Routine Updated for June 2025", content: "The updated class routine for June 2025 is now available. Please check the academic section.", category: "Academic", priority: "normal", date: "May 12, 2025", color: "#0EA5E9" },
  { id: 7, title: "Result Published — April Monthly Test", content: "Results for the April Monthly Test are now published. Students can check online via the student portal.", category: "Result", priority: "normal", date: "May 10, 2025", color: "#10B981" },
  { id: 8, title: "Parent-Teacher Meeting — May 30", content: "Parents are cordially invited to attend the Parent-Teacher Meeting on May 30, 2025 from 9 AM to 1 PM.", category: "Meeting", priority: "normal", date: "May 8, 2025", color: "#4F46E5" },
];

const categories = ["All", "Exam", "Admission", "Holiday", "Event", "Meeting", "Academic", "Result"];

export default function NoticePage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <div className="py-20 text-center text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0F172A,#1E1B4B,#312E81)" }}>
        <div className="relative max-w-2xl mx-auto px-4">
          <span className="inline-block text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>Notice Board</span>
          <h1 className="text-5xl font-black mb-3" style={{ fontFamily: "Poppins" }}>Latest Notices</h1>
          <p className="text-indigo-300 text-lg">Stay updated with all school announcements, schedules &amp; events</p>
        </div>
        <div className="absolute bottom-0 left-0 w-full"><svg viewBox="0 0 1440 60" fill="#F8FAFC"><path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z"/></svg></div>
      </div>

      <section className="section-padding" style={{ background: "#F8FAFC" }}>
        <div className="max-w-5xl mx-auto">
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <span key={cat} className="px-4 py-1.5 rounded-full text-sm font-semibold cursor-pointer transition-all"
                style={cat === "All" ? { background: "#4F46E5", color: "#fff" } : { background: "#fff", color: "#64748B", border: "1px solid #E2E8F0" }}>
                {cat}
              </span>
            ))}
          </div>

          <div className="space-y-4">
            {notices.map((n) => (
              <div key={n.id} className="card-hover flex items-start gap-5 p-6 rounded-2xl group cursor-pointer"
                style={{ background: "#fff", border: "1px solid #E2E8F0" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${n.color}12` }}>
                  {n.category === "Exam" ? "📝" : n.category === "Holiday" ? "🎉" : n.category === "Event" ? "⭐" : n.category === "Meeting" ? "👥" : n.category === "Result" ? "🏆" : n.category === "Admission" ? "📋" : "📢"}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {n.priority === "urgent" && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#FFF1F2", color: "#F43F5E" }}>🔴 Urgent</span>
                    )}
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: `${n.color}12`, color: n.color }}>{n.category}</span>
                    <span className="text-xs text-slate-400">{n.date}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-indigo-600 transition-colors">{n.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{n.content}</p>
                </div>
                <span className="text-slate-300 group-hover:text-indigo-500 text-xl transition-colors flex-shrink-0">→</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
