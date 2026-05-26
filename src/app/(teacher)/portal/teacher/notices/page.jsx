export const metadata = { title: "Notices | Teacher Portal" };
const notices = [
  { title:"Staff Meeting — June 1, 2025",    content:"Monthly staff meeting at 3 PM in conference room.", category:"Meeting",  date:"May 15, 2025" },
  { title:"Final Exam Schedule Published",   content:"Exam schedule for all classes is now published.",    category:"Exam",     date:"May 24, 2025" },
  { title:"Salary Disbursed — May 2025",     content:"May salary has been credited to all accounts.",     category:"Finance",  date:"May 30, 2025" },
  { title:"Class Routine Updated June 2025", content:"Updated routine is available in the dashboard.",    category:"Academic", date:"May 12, 2025" },
];
const catColor = { Meeting:"#7C3AED", Exam:"#F43F5E", Finance:"#10B981", Academic:"#4F46E5" };
export default function TeacherNotices() {
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-black text-slate-800" style={{ fontFamily:"Poppins" }}>Notices</h1>
        <p className="text-slate-500 text-sm">Announcements for teaching staff</p></div>
      <div className="space-y-3">
        {notices.map((n,i)=>(
          <div key={i} className="flex items-start gap-4 p-5 rounded-2xl" style={{ background:"#fff", border:"1px solid #E2E8F0" }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background:`${catColor[n.category]||"#4F46E5"}10` }}>📢</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
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
