"use client";
import React, { useState } from "react";

const students = [
  { id:1, roll:"101", name:"Sakib Hasan",  class:"Class 5", attendance:"95%", lastResult:"A+" },
  { id:2, roll:"103", name:"Tanvir Ahmed", class:"Class 5", attendance:"92%", lastResult:"A+" },
  { id:3, roll:"107", name:"Limon Hasan",  class:"Class 5", attendance:"78%", lastResult:"B"  },
  { id:4, roll:"102", name:"Rahima Akter", class:"Class 4", attendance:"88%", lastResult:"A"  },
];
const classes = [
  { time:"8:00–8:45",  cls:"Class 4–A", date:"May 24, 2025" },
  { time:"8:45–9:30",  cls:"Class 5–A", date:"May 24, 2025" },
  { time:"10:00–10:45",cls:"Class 4–B", date:"May 24, 2025" },
];
const statusColor = { present:"#10B981", absent:"#F43F5E", late:"#F59E0B" };

export default function TeacherAttendancePage() {
  const [selectedClass, setSelectedClass] = useState(classes[0].cls);
  const filtered = students.filter(s=>s.class.startsWith(selectedClass.split("–")[0].trim()));
  const [records, setRecords] = useState(()=>{
    const init={};
    students.forEach(s=>{ init[s.id]="present"; });
    return init;
  });
  const [saved, setSaved] = useState(false);
  function save(){setSaved(true);setTimeout(()=>setSaved(false),2000);}
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-black text-slate-800" style={{ fontFamily:"Poppins" }}>Mark Attendance</h1>
        <p className="text-slate-500 text-sm">Mark today's attendance for your classes</p></div>
      {saved && <div className="p-3 rounded-xl text-sm font-medium" style={{ background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)", color:"#10B981" }}>✅ Attendance saved!</div>}
      <div className="flex gap-2 flex-wrap">
        {classes.map(c=>(
          <button key={c.cls} onClick={()=>setSelectedClass(c.cls)}
            className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
            style={selectedClass===c.cls?{background:"#EEF2FF",color:"#4F46E5",border:"1px solid #4F46E5"}:{background:"#fff",color:"#64748B",border:"1px solid #E2E8F0"}}>
            {c.cls}
          </button>
        ))}
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background:"#fff", border:"1px solid #E2E8F0" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom:"1px solid #E2E8F0" }}>
          <p className="font-bold text-slate-800">Attendance — {selectedClass}</p>
          <button onClick={save} className="text-sm font-bold px-5 py-2 rounded-xl text-white" style={{ background:"linear-gradient(135deg,#10B981,#059669)" }}>Save</button>
        </div>
        <table className="w-full">
          <thead><tr style={{ background:"#F8FAFC" }}>
            {["Roll","Student","Status"].map(h=><th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-slate-400">{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map((s,i)=>(
              <tr key={s.id} style={{ borderBottom:i<filtered.length-1?"1px solid #E2E8F0":"none" }}>
                <td className="px-5 py-4 text-slate-500 font-mono text-sm">{s.roll}</td>
                <td className="px-5 py-4 font-medium text-slate-800 text-sm">{s.name}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    {["present","absent","late"].map(st=>(
                      <button key={st} onClick={()=>setRecords(r=>({...r,[s.id]:st}))}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all"
                        style={records[s.id]===st?{background:statusColor[st],color:"#fff"}:{background:"#F1F5F9",color:"#64748B"}}>
                        {st}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
