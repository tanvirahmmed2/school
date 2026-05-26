export const metadata = { title: "Class Schedule | Student Portal" };
const schedule = [
  { day:"Sunday",    periods:[{t:"8:00–8:45",s:"Bangla",teacher:"Nasrin Akter"},{t:"8:45–9:30",s:"Mathematics",teacher:"Rafiqul Islam"},{t:"9:30–10:15",s:"English",teacher:"Karim Hossain"},{t:"10:30–11:15",s:"Science",teacher:"Alam Hossain"},{t:"11:15–12:00",s:"Social Studies",teacher:"Karim Hossain"}] },
  { day:"Monday",    periods:[{t:"8:00–8:45",s:"Mathematics",teacher:"Rafiqul Islam"},{t:"8:45–9:30",s:"Science",teacher:"Alam Hossain"},{t:"9:30–10:15",s:"Bangla",teacher:"Nasrin Akter"},{t:"10:30–11:15",s:"English",teacher:"Karim Hossain"},{t:"11:15–12:00",s:"Religion",teacher:"Fatema Begum"}] },
  { day:"Tuesday",   periods:[{t:"8:00–8:45",s:"English",teacher:"Karim Hossain"},{t:"8:45–9:30",s:"Bangla",teacher:"Nasrin Akter"},{t:"9:30–10:15",s:"Mathematics",teacher:"Rafiqul Islam"},{t:"10:30–11:15",s:"Social Studies",teacher:"Karim Hossain"},{t:"11:15–12:00",s:"Arts",teacher:"Fatema Begum"}] },
];
const subColors = { Bangla:"#4F46E5", Mathematics:"#10B981", English:"#F59E0B", Science:"#7C3AED", "Social Studies":"#0EA5E9", Religion:"#F43F5E", Arts:"#EC4899" };
export default function StudentSchedule() {
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-black text-slate-800" style={{ fontFamily:"Poppins" }}>Class Schedule</h1>
        <p className="text-slate-500 text-sm">Weekly timetable for Class 5 · Section A</p></div>
      {schedule.map((d)=>(
        <div key={d.day} className="rounded-2xl overflow-hidden" style={{ background:"#fff", border:"1px solid #E2E8F0" }}>
          <div className="px-5 py-3.5 font-bold text-slate-800" style={{ background:"#F8FAFC", borderBottom:"1px solid #E2E8F0" }}>{d.day}</div>
          <div className="divide-y divide-slate-100">
            {d.periods.map((p,i)=>(
              <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <p className="text-xs text-slate-400 font-mono w-24 flex-shrink-0">{p.t}</p>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background:`${subColors[p.s]||"#4F46E5"}12`, color:subColors[p.s]||"#4F46E5" }}>{p.s}</span>
                <p className="text-sm text-slate-500 flex-1">{p.teacher}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
