export const metadata = { title: "Classes & Routine | Admin Dashboard" };

const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday"];
const routine = {
  "Class 1": [{ t:"8:00-8:45",s:"Bangla" },{t:"8:45-9:30",s:"Math"},{t:"9:30-10:15",s:"English"},{t:"10:30-11:15",s:"Religion"},{t:"11:15-12:00",s:"Arts"}],
  "Class 2": [{ t:"8:00-8:45",s:"Math" },{t:"8:45-9:30",s:"Bangla"},{t:"9:30-10:15",s:"English"},{t:"10:30-11:15",s:"Science"},{t:"11:15-12:00",s:"Religion"}],
  "Class 3": [{ t:"8:00-8:45",s:"English" },{t:"8:45-9:30",s:"Math"},{t:"9:30-10:15",s:"Bangla"},{t:"10:30-11:15",s:"Social"},{t:"11:15-12:00",s:"Science"}],
  "Class 4": [{ t:"8:00-8:45",s:"Science" },{t:"8:45-9:30",s:"Math"},{t:"9:30-10:15",s:"Bangla"},{t:"10:30-11:15",s:"English"},{t:"11:15-12:00",s:"Social"}],
  "Class 5": [{ t:"8:00-8:45",s:"Math" },{t:"8:45-9:30",s:"Science"},{t:"9:30-10:15",s:"English"},{t:"10:30-11:15",s:"Bangla"},{t:"11:15-12:00",s:"Social"}],
};
const subjectColors = { Math:"#4F46E5",Bangla:"#10B981",English:"#F59E0B",Science:"#7C3AED",Social:"#0EA5E9",Religion:"#F43F5E",Arts:"#EC4899" };

export default function RoutinePage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily:"Poppins" }}>Classes & Routine</h1>
        <p className="text-slate-400 text-sm">Weekly class schedule for academic year 2025</p>
      </div>
      {Object.entries(routine).map(([cls, periods])=>(
        <div key={cls} className="rounded-2xl overflow-hidden" style={{ background:"#1E293B", border:"1px solid #334155" }}>
          <div className="px-5 py-3.5 flex items-center gap-3" style={{ borderBottom:"1px solid #334155" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background:"linear-gradient(135deg,#4F46E5,#7C3AED)" }}>{cls.split(" ")[1]}</div>
            <p className="font-bold text-white">{cls}</p>
            <span className="badge badge-primary ml-auto">5 periods</span>
          </div>
          <div className="grid grid-cols-5 gap-0">
            {periods.map((p, i)=>(
              <div key={i} className="p-4" style={{ borderRight: i<4?"1px solid #334155":"none" }}>
                <p className="text-[10px] text-slate-500 mb-1">{p.t}</p>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background:`${subjectColors[p.s]||"#475569"}18`, color:subjectColors[p.s]||"#94A3B8" }}>{p.s}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
