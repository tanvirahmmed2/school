"use client";
import React, { useState } from "react";

const classes = ["Class 1","Class 2","Class 3","Class 4","Class 5"];
const students = {
  "Class 1": [{ id: 1, roll:"106", name:"Mitu Akter" }],
  "Class 2": [{ id: 2, roll:"104", name:"Sona Begum" }],
  "Class 3": [{ id: 3, roll:"105", name:"Raju Islam" },{ id: 4, roll:"108", name:"Popy Begum" }],
  "Class 4": [{ id: 5, roll:"102", name:"Rahima Akter" }],
  "Class 5": [{ id: 6, roll:"101", name:"Sakib Hasan" },{ id: 7, roll:"103", name:"Tanvir Ahmed" },{ id: 8, roll:"107", name:"Limon Hasan" }],
};

const statusColor = { present:"#10B981", absent:"#F43F5E", late:"#F59E0B" };

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState("Class 5");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const list = students[selectedClass] || [];
  const [records, setRecords] = useState(() => {
    const init = {};
    Object.values(students).flat().forEach((s) => { init[s.id] = "present"; });
    return init;
  });
  const [saved, setSaved] = useState(false);

  function setStatus(id, status) { setRecords((r) => ({ ...r, [id]: status })); setSaved(false); }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const present = list.filter((s) => records[s.id] === "present").length;
  const absent = list.filter((s) => records[s.id] === "absent").length;
  const late = list.filter((s) => records[s.id] === "late").length;

  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-black text-white" style={{ fontFamily:"Poppins" }}>Attendance Management</h1>
        <p className="text-slate-400 text-sm">Mark daily attendance for each class</p></div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 rounded-2xl" style={{ background:"#1E293B", border:"1px solid #334155" }}>
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm text-white outline-none"
          style={{ background:"#0F172A", border:"1px solid #334155" }}>
          {classes.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm text-white outline-none"
          style={{ background:"#0F172A", border:"1px solid #334155" }} />
        <div className="flex gap-3 ml-auto text-sm font-bold">
          <span style={{ color:"#10B981" }}>✓ {present} Present</span>
          <span style={{ color:"#F43F5E" }}>✗ {absent} Absent</span>
          <span style={{ color:"#F59E0B" }}>⏰ {late} Late</span>
        </div>
      </div>

      {saved && (
        <div className="p-3 rounded-xl text-sm font-medium" style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.3)", color:"#34D399" }}>
          ✅ Attendance saved for {selectedClass} — {date}
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ background:"#1E293B", border:"1px solid #334155" }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom:"1px solid #334155" }}>
          <p className="font-bold text-white">{selectedClass} Attendance — {date}</p>
          <button onClick={handleSave} className="text-sm font-bold px-5 py-2 rounded-xl text-white"
            style={{ background:"linear-gradient(135deg,#10B981,#059669)" }}>Save Attendance</button>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background:"#0F172A" }}>
              {["Roll","Student Name","Status"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest" style={{ color:"#475569" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: i < list.length - 1 ? "1px solid #334155" : "none" }}>
                <td className="px-5 py-4 text-slate-400 text-sm font-mono">{s.roll}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background:"linear-gradient(135deg,#4F46E5,#7C3AED)" }}>{s.name.charAt(0)}</div>
                    <span className="text-white text-sm font-medium">{s.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    {["present","absent","late"].map((st) => (
                      <button key={st} onClick={() => setStatus(s.id, st)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all"
                        style={records[s.id] === st
                          ? { background: statusColor[st], color:"#fff" }
                          : { background:"#334155", color:"#94A3B8" }}>
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
