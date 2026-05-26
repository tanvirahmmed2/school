"use client";
import React, { useState } from "react";

const feeData = [
  { id: 1, name: "Sakib Hasan", class: "Class 5", month: "May 2025", amount: 1500, status: "paid", date: "2025-05-05", receipt: "RCP-2025-001" },
  { id: 2, name: "Rahima Akter", class: "Class 4", month: "May 2025", amount: 1200, status: "pending", date: null, receipt: null },
  { id: 3, name: "Tanvir Ahmed", class: "Class 5", month: "May 2025", amount: 1500, status: "paid", date: "2025-05-08", receipt: "RCP-2025-002" },
  { id: 4, name: "Sona Begum", class: "Class 2", month: "April 2025", amount: 800, status: "overdue", date: null, receipt: null },
  { id: 5, name: "Raju Islam", class: "Class 3", month: "May 2025", amount: 1000, status: "paid", date: "2025-05-12", receipt: "RCP-2025-003" },
];

const statusColor = { paid: "#10B981", pending: "#F59E0B", overdue: "#F43F5E" };

export default function FeesPage() {
  const [fees, setFees] = useState(feeData);
  const [filter, setFilter] = useState("");

  const filtered = filter ? fees.filter((f) => f.status === filter) : fees;
  const collected = fees.filter((f) => f.status === "paid").reduce((s, f) => s + f.amount, 0);
  const pending = fees.filter((f) => f.status !== "paid").reduce((s, f) => s + f.amount, 0);

  function markPaid(id) {
    setFees((prev) => prev.map((f) => f.id === id ? { ...f, status: "paid", date: new Date().toISOString().split("T")[0], receipt: `RCP-2025-00${id}` } : f));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Poppins" }}>Fee Management</h1>
          <p className="text-slate-400 text-sm">Track and manage student fee payments</p>
        </div>
        <button className="text-sm font-bold px-5 py-2.5 rounded-xl text-white" style={{ background: "linear-gradient(135deg,#F59E0B,#EF4444)" }}>+ Collect Fee</button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[["💰","Total Collected",`৳ ${collected.toLocaleString()}`,"#10B981","#ECFDF5"],["⏳","Total Pending",`৳ ${pending.toLocaleString()}`,"#F59E0B","#FFFBEB"],["📋","Total Records",fees.length,"#4F46E5","#EEF2FF"]].map(([icon,label,value,color,bg])=>(
          <div key={label} className="p-5 rounded-2xl" style={{ background: "#1E293B", border: "1px solid #334155" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl">{icon}</div>
            </div>
            <p className="text-2xl font-black mb-1" style={{ color, fontFamily: "Poppins" }}>{value}</p>
            <p className="text-slate-400 text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 p-4 rounded-2xl flex-wrap" style={{ background: "#1E293B", border: "1px solid #334155" }}>
        {["","paid","pending","overdue"].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className="px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all"
            style={filter === s ? { background: "#4F46E5", color: "#fff" } : { background: "#334155", color: "#94A3B8" }}>
            {s || "All"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#1E293B", border: "1px solid #334155" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "#0F172A" }}>
                {["Student","Class","Month","Amount","Status","Date","Receipt","Action"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest" style={{ color: "#475569" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => (
                <tr key={f.id} className="hover:bg-slate-700/20 transition-colors" style={{ borderBottom: i < filtered.length - 1 ? "1px solid #334155" : "none" }}>
                  <td className="px-5 py-4 text-sm font-medium text-white">{f.name}</td>
                  <td className="px-5 py-4 text-sm text-slate-400">{f.class}</td>
                  <td className="px-5 py-4 text-sm text-slate-400">{f.month}</td>
                  <td className="px-5 py-4 text-sm font-bold text-white">৳ {f.amount.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize"
                      style={{ background: `${statusColor[f.status]}20`, color: statusColor[f.status] }}>{f.status}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-400">{f.date || "—"}</td>
                  <td className="px-5 py-4 text-sm text-slate-400 font-mono">{f.receipt || "—"}</td>
                  <td className="px-5 py-4">
                    {f.status !== "paid" && (
                      <button onClick={() => markPaid(f.id)} className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                        style={{ background: "rgba(16,185,129,0.15)", color: "#34D399" }}>Mark Paid</button>
                    )}
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
