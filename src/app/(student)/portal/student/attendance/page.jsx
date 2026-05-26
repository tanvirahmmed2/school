export const metadata = { title: "Attendance | Student Portal" };
const records = [
  { date:"May 24, 2025", day:"Friday",    status:"present" },
  { date:"May 23, 2025", day:"Thursday",  status:"present" },
  { date:"May 22, 2025", day:"Wednesday", status:"late" },
  { date:"May 21, 2025", day:"Tuesday",   status:"present" },
  { date:"May 20, 2025", day:"Monday",    status:"absent" },
  { date:"May 18, 2025", day:"Saturday",  status:"present" },
  { date:"May 17, 2025", day:"Friday",    status:"present" },
  { date:"May 16, 2025", day:"Thursday",  status:"present" },
];
const present = records.filter(r=>r.status==="present").length;
const absent  = records.filter(r=>r.status==="absent").length;
const late    = records.filter(r=>r.status==="late").length;
const statusColor = { present:"#10B981", absent:"#F43F5E", late:"#F59E0B" };

export default function StudentAttendance() {
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-black text-slate-800" style={{ fontFamily:"Poppins" }}>My Attendance</h1>
        <p className="text-slate-500 text-sm">Attendance record — May 2025</p></div>
      <div className="grid grid-cols-3 gap-4">
        {[["✅","Present",present,"#10B981"],["❌","Absent",absent,"#F43F5E"],["⏰","Late",late,"#F59E0B"]].map(([icon,label,value,color])=>(
          <div key={label} className="p-5 rounded-2xl text-center" style={{ background:"#fff", border:"1px solid #E2E8F0" }}>
            <p className="text-3xl mb-2">{icon}</p>
            <p className="text-3xl font-black mb-0.5" style={{ color, fontFamily:"Poppins" }}>{value}</p>
            <p className="text-slate-500 text-sm">{label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background:"#fff", border:"1px solid #E2E8F0" }}>
        <table className="w-full">
          <thead><tr style={{ background:"#F8FAFC" }}>
            {["Date","Day","Status"].map(h=><th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-slate-400">{h}</th>)}
          </tr></thead>
          <tbody>
            {records.map((r,i)=>(
              <tr key={i} style={{ borderBottom:i<records.length-1?"1px solid #E2E8F0":"none" }}>
                <td className="px-5 py-4 text-sm font-medium text-slate-800">{r.date}</td>
                <td className="px-5 py-4 text-sm text-slate-500">{r.day}</td>
                <td className="px-5 py-4"><span className="badge capitalize" style={{ background:`${statusColor[r.status]}12`, color:statusColor[r.status] }}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
