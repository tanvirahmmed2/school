export const metadata = { title: "Student Reports | Teacher Portal" };
const students = [
  { roll:"101", name:"Sakib Hasan",  class:"Class 5", attendance:"95%", lastResult:"A+", fee:"Paid",    status:"active" },
  { roll:"103", name:"Tanvir Ahmed", class:"Class 5", attendance:"92%", lastResult:"A+", fee:"Paid",    status:"active" },
  { roll:"107", name:"Limon Hasan",  class:"Class 5", attendance:"78%", lastResult:"B",  fee:"Pending", status:"active" },
  { roll:"102", name:"Rahima Akter", class:"Class 4", attendance:"88%", lastResult:"A",  fee:"Paid",    status:"active" },
];
export default function TeacherStudents() {
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-black text-slate-800" style={{ fontFamily:"Poppins" }}>My Students</h1>
        <p className="text-slate-500 text-sm">Performance overview for students in your classes</p></div>
      <div className="rounded-2xl overflow-hidden" style={{ background:"#fff", border:"1px solid #E2E8F0" }}>
        <table className="w-full">
          <thead><tr style={{ background:"#F8FAFC" }}>
            {["Roll","Student","Class","Attendance","Result","Fee","Status"].map(h=><th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-slate-400">{h}</th>)}
          </tr></thead>
          <tbody>
            {students.map((s,i)=>(
              <tr key={s.roll} className="hover:bg-slate-50 transition-colors" style={{ borderBottom:i<students.length-1?"1px solid #E2E8F0":"none" }}>
                <td className="px-5 py-4 text-slate-500 font-mono text-sm">{s.roll}</td>
                <td className="px-5 py-4"><div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background:"linear-gradient(135deg,#7C3AED,#4F46E5)" }}>{s.name.charAt(0)}</div>
                  <span className="font-medium text-slate-800 text-sm">{s.name}</span></div>
                </td>
                <td className="px-5 py-4 text-slate-500 text-sm">{s.class}</td>
                <td className="px-5 py-4 font-bold text-sm" style={{ color:parseInt(s.attendance)>=90?"#10B981":parseInt(s.attendance)>=80?"#F59E0B":"#F43F5E" }}>{s.attendance}</td>
                <td className="px-5 py-4 font-bold text-sm" style={{ color:s.lastResult==="A+"?"#10B981":"#4F46E5" }}>{s.lastResult}</td>
                <td className="px-5 py-4"><span className={`badge badge-${s.fee==="Paid"?"success":"warning"}`}>{s.fee}</span></td>
                <td className="px-5 py-4"><span className="badge badge-success">Active</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
