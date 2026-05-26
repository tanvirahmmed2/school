"use client";
import React, { useState } from "react";

const results = [
  { id:1, roll:"101", name:"Sakib Hasan", class:"Class 5", exam:"Half-Yearly 2025", bangla:85, english:78, math:92, science:88, social:80, total:423, gpa:"A+", percentage:84.6, status:"passed" },
  { id:2, roll:"102", name:"Rahima Akter", class:"Class 4", exam:"Half-Yearly 2025", bangla:72, english:65, math:80, science:75, social:70, total:362, gpa:"A", percentage:72.4, status:"passed" },
  { id:3, roll:"103", name:"Tanvir Ahmed", class:"Class 5", exam:"Half-Yearly 2025", bangla:90, english:88, math:95, science:91, social:87, total:451, gpa:"A+", percentage:90.2, status:"passed" },
  { id:4, roll:"105", name:"Raju Islam", class:"Class 3", exam:"Half-Yearly 2025", bangla:60, english:55, math:70, science:65, social:58, total:308, gpa:"B", percentage:61.6, status:"passed" },
];

const gpaColors = { "A+":"#10B981","A":"#4F46E5","A-":"#7C3AED","B":"#F59E0B","C":"#F97316","F":"#F43F5E" };

export default function ExamsPage() {
  const [filter, setFilter] = useState("");
  const filtered = filter ? results.filter((r) => r.class === filter) : results;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-black text-white" style={{ fontFamily:"Poppins" }}>Exam &amp; Results</h1>
          <p className="text-slate-400 text-sm">Half-Yearly 2025 results</p></div>
        <button className="text-sm font-bold px-5 py-2.5 rounded-xl text-white" style={{ background:"linear-gradient(135deg,#4F46E5,#7C3AED)" }}>+ Enter Marks</button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[["📊","Total Students",results.length,"#4F46E5"],["✅","Passed",results.filter((r)=>r.status==="passed").length,"#10B981"],["📈","Avg Score",`${(results.reduce((s,r)=>s+r.percentage,0)/results.length).toFixed(1)}%`,"#F59E0B"],["🏆","Top GPA","A+","#7C3AED"]].map(([icon,label,value,color])=>(
          <div key={label} className="p-5 rounded-2xl" style={{ background:"#1E293B", border:"1px solid #334155" }}>
            <p className="text-2xl mb-1">{icon}</p>
            <p className="text-2xl font-black mb-0.5" style={{ color, fontFamily:"Poppins" }}>{value}</p>
            <p className="text-slate-400 text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 p-3 rounded-2xl flex-wrap" style={{ background:"#1E293B", border:"1px solid #334155" }}>
        {["","Class 3","Class 4","Class 5"].map((c)=>(
          <button key={c} onClick={()=>setFilter(c)} className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
            style={filter===c?{background:"#4F46E5",color:"#fff"}:{background:"#334155",color:"#94A3B8"}}>
            {c||"All Classes"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background:"#1E293B", border:"1px solid #334155" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background:"#0F172A" }}>
                {["Roll","Name","Class","Bangla","English","Math","Science","Social","Total","GPA","Status"].map((h)=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest" style={{ color:"#475569" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} className="hover:bg-slate-700/20 transition-colors" style={{ borderBottom: i < filtered.length - 1 ? "1px solid #334155" : "none" }}>
                  <td className="px-4 py-4 text-slate-400 text-sm font-mono">{r.roll}</td>
                  <td className="px-4 py-4 text-white text-sm font-medium">{r.name}</td>
                  <td className="px-4 py-4 text-slate-400 text-sm">{r.class}</td>
                  {[r.bangla,r.english,r.math,r.science,r.social].map((mark, mi) => (
                    <td key={mi} className="px-4 py-4 text-sm font-semibold" style={{ color: mark >= 80?"#34D399":mark>=60?"#FBBF24":"#F87171" }}>{mark}</td>
                  ))}
                  <td className="px-4 py-4 text-white font-bold text-sm">{r.total}/500</td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-black px-2.5 py-1 rounded-full"
                      style={{ background:`${gpaColors[r.gpa]||"#4F46E5"}20`, color:gpaColors[r.gpa]||"#4F46E5" }}>{r.gpa}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background:"rgba(16,185,129,0.15)", color:"#34D399" }}>✓ Passed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
