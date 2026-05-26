"use client";
import React, { useState } from "react";

const notices = [
  { id: 1, title: "Final Exam Schedule — Class 5", category: "Exam", priority: "urgent", date: "May 24, 2025", target: "all" },
  { id: 2, title: "New Admission Open for Session 2025-26", category: "Admission", priority: "normal", date: "May 22, 2025", target: "all" },
  { id: 3, title: "School Closed — Eid ul-Adha Holiday", category: "Holiday", priority: "normal", date: "May 20, 2025", target: "all" },
  { id: 4, title: "Annual Sports Day Registration Open", category: "Event", priority: "normal", date: "May 18, 2025", target: "students" },
  { id: 5, title: "Staff Meeting — June 1, 2025", category: "Meeting", priority: "normal", date: "May 15, 2025", target: "teachers" },
];
const catColors = { Exam:"#F43F5E", Admission:"#4F46E5", Holiday:"#F59E0B", Event:"#10B981", Meeting:"#7C3AED", Academic:"#0EA5E9" };

export default function NoticesPage() {
  const [list, setList] = useState(notices);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", category: "Academic", priority: "normal", target: "all" });

  function addNotice(e) {
    e.preventDefault();
    setList((prev) => [{ id: Date.now(), ...form, date: new Date().toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }) }, ...prev]);
    setShowForm(false);
    setForm({ title: "", content: "", category: "Academic", priority: "normal", target: "all" });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Poppins" }}>Notice Board</h1>
          <p className="text-slate-400 text-sm">{list.length} notices published</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="text-sm font-bold px-5 py-2.5 rounded-xl text-white"
          style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)" }}>+ New Notice</button>
      </div>

      {showForm && (
        <form onSubmit={addNotice} className="p-6 rounded-2xl space-y-4" style={{ background: "#1E293B", border: "1px solid #4F46E5" }}>
          <h3 className="font-bold text-white text-lg">Create New Notice</h3>
          <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Title *</label>
            <input required value={form.title} onChange={(e) => setForm((f)=>({...f,title:e.target.value}))} placeholder="Notice title"
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
              style={{ background: "#0F172A", border: "1px solid #334155" }} /></div>
          <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Content</label>
            <textarea rows={3} value={form.content} onChange={(e) => setForm((f)=>({...f,content:e.target.value}))} placeholder="Notice details..."
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none resize-none"
              style={{ background: "#0F172A", border: "1px solid #334155" }} /></div>
          <div className="grid grid-cols-3 gap-4">
            {[["category","Category",["Exam","Admission","Holiday","Event","Meeting","Academic"]],["priority","Priority",["normal","urgent"]],["target","Target",["all","students","teachers"]]].map(([key,label,opts])=>(
              <div key={key}><label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1.5">{label}</label>
                <select value={form[key]} onChange={(e) => setForm((f)=>({...f,[key]:e.target.value}))}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none capitalize"
                  style={{ background: "#0F172A", border: "1px solid #334155" }}>
                  {opts.map((o)=><option key={o} className="capitalize">{o}</option>)}
                </select></div>
            ))}
          </div>
          <div className="flex gap-3">
            <button type="submit" className="flex-1 py-3 rounded-xl text-white font-bold text-sm" style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)" }}>Publish Notice</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl text-sm font-semibold" style={{ background: "#334155", color: "#94A3B8" }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {list.map((n) => (
          <div key={n.id} className="flex items-start gap-4 p-5 rounded-2xl" style={{ background: "#1E293B", border: "1px solid #334155" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${catColors[n.category] || "#4F46E5"}15` }}>📢</div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {n.priority === "urgent" && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(244,63,94,0.15)", color: "#F43F5E" }}>🔴 Urgent</span>}
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: `${catColors[n.category]||"#4F46E5"}15`, color: catColors[n.category]||"#4F46E5" }}>{n.category}</span>
                <span className="text-xs text-slate-500">{n.date}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full capitalize" style={{ background: "#334155", color: "#94A3B8" }}>→ {n.target}</span>
              </div>
              <p className="font-semibold text-white">{n.title}</p>
            </div>
            <button onClick={() => setList((p) => p.filter((x) => x.id !== n.id))} className="text-slate-500 hover:text-red-400 transition-colors text-sm font-bold">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
