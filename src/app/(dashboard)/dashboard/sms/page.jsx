"use client";
import React, { useState } from "react";

const logs = [
  { id:1, recipient:"All Parents", message:"School closed tomorrow — Eid Holiday", sentAt:"2025-05-20 09:00", count:1200, status:"sent" },
  { id:2, recipient:"Class 5 Parents", message:"Exam starts June 10. Bring admit card.", sentAt:"2025-05-19 10:30", count:89, status:"sent" },
  { id:3, recipient:"Due Payers", message:"Your fee for April is overdue. Please pay.", sentAt:"2025-05-15 11:00", count:38, status:"sent" },
];

const templates = [
  { label:"Attendance Alert", message:"Dear Parent, your child was absent from school on [DATE]. Please contact us for details." },
  { label:"Fee Reminder", message:"Dear Parent, the monthly fee for [MONTH] is due. Please pay at the office or online." },
  { label:"Exam Notice", message:"Dear Parent, the [EXAM] exam for [CLASS] starts on [DATE]. Please ensure your child is prepared." },
  { label:"Holiday Notice", message:"Dear Parent, school will remain closed on [DATE] for [REASON]. Classes resume on [DATE]." },
];

export default function SMSPage() {
  const [smsList, setSmsList] = useState(logs);
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("All Parents");
  const [sent, setSent] = useState(false);

  function handleSend(e) {
    e.preventDefault();
    const newLog = { id: Date.now(), recipient, message, count: recipient === "All Parents" ? 1200 : 89, sentAt: new Date().toLocaleString(), status:"sent" };
    setSmsList((p) => [newLog, ...p]);
    setMessage("");
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  }

  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-black text-white" style={{ fontFamily:"Poppins" }}>SMS Management</h1>
        <p className="text-slate-400 text-sm">Send bulk SMS notifications to parents and staff</p></div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[["📱","Total Sent", smsList.reduce((s,l)=>s+l.count,0).toLocaleString(),"#4F46E5"],["✅","Delivered","100%","#10B981"],["📋","Campaigns",smsList.length,"#F59E0B"]].map(([icon,label,value,color])=>(
          <div key={label} className="p-5 rounded-2xl" style={{ background:"#1E293B", border:"1px solid #334155" }}>
            <p className="text-2xl mb-2">{icon}</p>
            <p className="text-2xl font-black mb-0.5" style={{ color, fontFamily:"Poppins" }}>{value}</p>
            <p className="text-slate-400 text-sm">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compose */}
        <div className="p-6 rounded-2xl" style={{ background:"#1E293B", border:"1px solid #334155" }}>
          <h3 className="font-bold text-white mb-4">Compose SMS</h3>
          {sent && <div className="mb-4 p-3 rounded-xl text-sm font-medium" style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.3)", color:"#34D399" }}>✅ SMS sent successfully!</div>}
          <form onSubmit={handleSend} className="space-y-4">
            <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Recipient Group</label>
              <select value={recipient} onChange={(e)=>setRecipient(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                style={{ background:"#0F172A", border:"1px solid #334155" }}>
                {["All Parents","Class 5 Parents","Class 4 Parents","Class 3 Parents","Due Payers","All Staff","Teachers Only"].map((r)=><option key={r}>{r}</option>)}
              </select></div>
            <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Message *</label>
              <textarea required rows={4} value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Type your SMS message here..."
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none resize-none"
                style={{ background:"#0F172A", border:"1px solid #334155" }} />
              <p className="text-xs text-slate-500 mt-1">{message.length}/160 characters</p></div>
            <button type="submit" className="w-full py-3 rounded-xl text-white font-bold text-sm" style={{ background:"linear-gradient(135deg,#4F46E5,#7C3AED)" }}>Send SMS 📱</button>
          </form>
        </div>

        {/* Templates */}
        <div className="p-6 rounded-2xl" style={{ background:"#1E293B", border:"1px solid #334155" }}>
          <h3 className="font-bold text-white mb-4">Quick Templates</h3>
          <div className="space-y-3">
            {templates.map((t) => (
              <button key={t.label} onClick={() => setMessage(t.message)}
                className="w-full text-left p-4 rounded-xl transition-all hover:border-indigo-500"
                style={{ background:"#0F172A", border:"1px solid #334155" }}>
                <p className="font-semibold text-white text-sm mb-1">{t.label}</p>
                <p className="text-slate-500 text-xs line-clamp-2">{t.message}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History */}
      <div className="rounded-2xl overflow-hidden" style={{ background:"#1E293B", border:"1px solid #334155" }}>
        <div className="px-5 py-4" style={{ borderBottom:"1px solid #334155" }}><p className="font-bold text-white">SMS History</p></div>
        <table className="w-full">
          <thead><tr style={{ background:"#0F172A" }}>
            {["Recipient","Message","Count","Sent At","Status"].map((h)=>(
              <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest" style={{ color:"#475569" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {smsList.map((l, i)=>(
              <tr key={l.id} className="hover:bg-slate-700/20" style={{ borderBottom: i<smsList.length-1?"1px solid #334155":"none" }}>
                <td className="px-5 py-4 text-sm text-white font-medium">{l.recipient}</td>
                <td className="px-5 py-4 text-sm text-slate-400 max-w-xs truncate">{l.message}</td>
                <td className="px-5 py-4 text-sm font-bold" style={{ color:"#818CF8" }}>{l.count.toLocaleString()}</td>
                <td className="px-5 py-4 text-sm text-slate-400">{l.sentAt}</td>
                <td className="px-5 py-4"><span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background:"rgba(16,185,129,0.15)", color:"#34D399" }}>✓ {l.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
