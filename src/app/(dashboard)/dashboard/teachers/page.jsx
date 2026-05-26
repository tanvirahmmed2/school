"use client";
import Link from "next/link";
import React, { useState } from "react";

const initialTeachers = [
  { id: 1, empId: "T001", name: "Md. Rafiqul Islam", role: "Head Teacher", subject: "Math & Science", phone: "01711000001", salary: 25000, status: "active", exp: "18 years", gender: "male" },
  { id: 2, empId: "T002", name: "Nasrin Akter", role: "Senior Teacher", subject: "Bangla & Literature", phone: "01811000002", salary: 20000, status: "active", exp: "14 years", gender: "female" },
  { id: 3, empId: "T003", name: "Karim Hossain", role: "Assistant Teacher", subject: "English & Social Studies", phone: "01911000003", salary: 18000, status: "active", exp: "10 years", gender: "male" },
  { id: 4, empId: "T004", name: "Fatema Begum", role: "Senior Teacher", subject: "Religion & Arts", phone: "01611000004", salary: 20000, status: "active", exp: "12 years", gender: "female" },
  { id: 5, empId: "T005", name: "Alam Hossain", role: "Assistant Teacher", subject: "Science", phone: "01511000005", salary: 16000, status: "active", exp: "7 years", gender: "male" },
];

export default function TeachersPage() {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [search, setSearch] = useState("");

  const filtered = teachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Poppins" }}>Teachers</h1>
          <p className="text-slate-400 text-sm">{filtered.length} teachers</p>
        </div>
        <Link href="/dashboard/teachers/add" className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white"
          style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}>+ Add Teacher</Link>
      </div>

      <div className="p-4 rounded-2xl" style={{ background: "#1E293B", border: "1px solid #334155" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or subject..."
          className="w-full max-w-md px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
          style={{ background: "#0F172A", border: "1px solid #334155" }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <div key={t.id} className="p-6 rounded-2xl" style={{ background: "#1E293B", border: "1px solid #334155" }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                  style={{ background: t.gender === "female" ? "linear-gradient(135deg,#EC4899,#7C3AED)" : "linear-gradient(135deg,#4F46E5,#7C3AED)" }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{t.name}</p>
                  <p className="text-slate-400 text-xs">{t.empId}</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(16,185,129,0.15)", color: "#34D399" }}>Active</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm"><span className="text-slate-500">Role:</span><span className="text-slate-300">{t.role}</span></div>
              <div className="flex items-center gap-2 text-sm"><span className="text-slate-500">Subject:</span><span className="text-slate-300">{t.subject}</span></div>
              <div className="flex items-center gap-2 text-sm"><span className="text-slate-500">Phone:</span><span className="text-slate-300">{t.phone}</span></div>
              <div className="flex items-center gap-2 text-sm"><span className="text-slate-500">Salary:</span><span className="font-bold text-emerald-400">৳ {t.salary.toLocaleString()}</span></div>
              <div className="flex items-center gap-2 text-sm"><span className="text-slate-500">Experience:</span><span className="text-slate-300">{t.exp}</span></div>
            </div>
            <div className="flex gap-2 mt-5">
              <button className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all" style={{ background: "rgba(79,70,229,0.15)", color: "#818CF8" }}>Edit</button>
              <button onClick={() => setTeachers((p) => p.filter((x) => x.id !== t.id))} className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all" style={{ background: "rgba(244,63,94,0.1)", color: "#F87171" }}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
