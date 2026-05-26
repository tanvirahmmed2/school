export const metadata = { title: "Notices | Student Portal" };
const notices = [
  { title:"Final Exam Schedule — Class 5", content:"Exams start June 10. Bring admit card.", category:"Exam",     date:"May 24, 2025", priority:"urgent" },
  { title:"School Closed — Eid Holiday",   content:"Closed June 6–12. Classes resume June 13.", category:"Holiday",  date:"May 20, 2025", priority:"normal" },
  { title:"Sports Day Registration",       content:"Register at the office before May 31.", category:"Event",     date:"May 18, 2025", priority:"normal" },
  { title:"Class Routine Updated",          content:"Updated routine available on the board.", category:"Academic",  date:"May 12, 2025", priority:"normal" },
  { title:"Result Published — April Test",  content:"Check your April monthly test results.", category:"Result",    date:"May 10, 2025", priority:"normal" },
];
const catColor = { Exam:"#F43F5E", Holiday:"#F59E0B", Event:"#10B981", Academic:"#4F46E5", Result:"#7C3AED" };
export default function StudentNotices() {
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-black text-slate-800" style={{ fontFamily:"Poppins" }}>Notices</h1>
        <p className="text-slate-500 text-sm">Latest school announcements for students</p></div>
      <div className="space-y-3">
        {notices.map((n,i)=>(
          <div key={i} className="flex items-start gap-4 p-5 rounded-2xl hover:shadow-md transition-all" style={{ background:"#fff", border:"1px solid #E2E8F0" }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background:`${catColor[n.category]||"#4F46E5"}10` }}>📢</div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {n.priority==="urgent" && <span className="badge badge-danger">🔴 Urgent</span>}
                <span className="badge" style={{ background:`${catColor[n.category]||"#4F46E5"}12`, color:catColor[n.category]||"#4F46E5" }}>{n.category}</span>
                <span className="text-xs text-slate-400">{n.date}</span>
              </div>
              <h3 className="font-bold text-slate-800 mb-0.5">{n.title}</h3>
              <p className="text-sm text-slate-500">{n.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
