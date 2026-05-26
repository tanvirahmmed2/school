export const metadata = { title: "Class Schedule | Teacher Portal" };
const schedule = [
  { day:"Sunday",    periods:[{t:"8:00–8:45",cls:"Class 4–A",s:"Mathematics"},{t:"8:45–9:30",cls:"Class 5–A",s:"Mathematics"},{t:"10:00–10:45",cls:"Class 4–B",s:"Science"},{t:"10:45–11:30",cls:"Class 5–B",s:"Science"}] },
  { day:"Monday",    periods:[{t:"8:00–8:45",cls:"Class 5–A",s:"Science"},{t:"9:30–10:15",cls:"Class 4–A",s:"Science"},{t:"10:30–11:15",cls:"Class 5–B",s:"Mathematics"}] },
  { day:"Tuesday",   periods:[{t:"8:45–9:30",cls:"Class 4–B",s:"Mathematics"},{t:"10:00–10:45",cls:"Class 5–A",s:"Mathematics"},{t:"11:15–12:00",cls:"Class 4–A",s:"Science"}] },
];
const subColors = { Mathematics:"#10B981", Science:"#7C3AED" };
export default function TeacherSchedule() {
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-black text-slate-800" style={{ fontFamily:"Poppins" }}>My Class Schedule</h1>
        <p className="text-slate-500 text-sm">Weekly teaching schedule — Md. Rafiqul Islam</p></div>
      {schedule.map((d)=>(
        <div key={d.day} className="rounded-2xl overflow-hidden" style={{ background:"#fff", border:"1px solid #E2E8F0" }}>
          <div className="px-5 py-3.5 font-bold text-slate-800" style={{ background:"#F8FAFC", borderBottom:"1px solid #E2E8F0" }}>{d.day}</div>
          <div className="divide-y divide-slate-100">
            {d.periods.map((p,i)=>(
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <p className="text-xs text-slate-400 font-mono w-28 flex-shrink-0">{p.t}</p>
                <p className="text-sm font-semibold text-slate-800 flex-1">{p.cls}</p>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background:`${subColors[p.s]||"#4F46E5"}12`, color:subColors[p.s]||"#4F46E5" }}>{p.s}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
