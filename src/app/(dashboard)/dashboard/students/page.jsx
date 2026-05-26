"use client";
import Link from "next/link";
import React, { useState } from "react";

const initialStudents = [
  { id: 1, roll: "101", name: "Sakib Hasan", class: "Class 5", section: "A", guardian: "Karim Hasan", phone: "01900000001", status: "active", feeStatus: "paid", gender: "male" },
  { id: 2, roll: "102", name: "Rahima Akter", class: "Class 4", section: "A", guardian: "Rahim Uddin", phone: "01900000002", status: "active", feeStatus: "pending", gender: "female" },
  { id: 3, roll: "103", name: "Tanvir Ahmed", class: "Class 5", section: "B", guardian: "Ahmed Ali", phone: "01900000003", status: "active", feeStatus: "paid", gender: "male" },
  { id: 4, roll: "104", name: "Sona Begum", class: "Class 2", section: "A", guardian: "Mina Khatun", phone: "01900000004", status: "active", feeStatus: "overdue", gender: "female" },
  { id: 5, roll: "105", name: "Raju Islam", class: "Class 3", section: "A", guardian: "Islam Hossain", phone: "01900000005", status: "active", feeStatus: "paid", gender: "male" },
  { id: 6, roll: "106", name: "Mitu Akter", class: "Class 1", section: "A", guardian: "Akter Mia", phone: "01900000006", status: "active", feeStatus: "paid", gender: "female" },
  { id: 7, roll: "107", name: "Limon Hasan", class: "Class 5", section: "A", guardian: "Hasan Mia", phone: "01900000007", status: "inactive", feeStatus: "pending", gender: "male" },
  { id: 8, roll: "108", name: "Popy Begum", class: "Class 3", section: "B", guardian: "Begum Rashida", phone: "01900000008", status: "active", feeStatus: "paid", gender: "female" },
];

const feeColors = { paid: "#10B981", pending: "#F59E0B", overdue: "#F43F5E" };
const statusColors = { active: "#10B981", inactive: "#94A3B8" };

export default function StudentsPage() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [cls, setCls] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.includes(search);
    const matchClass = !cls || s.class === cls;
    const matchStatus = !statusFilter || s.status === statusFilter;
    return matchSearch && matchClass && matchStatus;
  });

  function handleDelete(id) {
    if (confirm("Delete this student?")) setStudents((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Poppins" }}>Students</h1>
          <p className="text-slate-400 text-sm">{filtered.length} students found</p>
        </div>
        <Link href="/dashboard/students/add"
          className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white"
          style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)" }}>
          + Add Student
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 p-4 rounded-2xl" style={{ background: "#1E293B", border: "1px solid #334155" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or roll..."
          className="flex-1 min-w-40 px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
          style={{ background: "#0F172A", border: "1px solid #334155" }} />
        <select value={cls} onChange={(e) => setCls(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm text-white outline-none"
          style={{ background: "#0F172A", border: "1px solid #334155" }}>
          <option value="">All Classes</option>
          {["Class 1","Class 2","Class 3","Class 4","Class 5"].map((c)=><option key={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm text-white outline-none"
          style={{ background: "#0F172A", border: "1px solid #334155" }}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#1E293B", border: "1px solid #334155" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "#0F172A" }}>
                {["Roll","Student Name","Class","Guardian","Phone","Fee","Status","Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest" style={{ color: "#475569" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} className="hover:bg-slate-700/20 transition-colors" style={{ borderBottom: i < filtered.length - 1 ? "1px solid #334155" : "none" }}>
                  <td className="px-5 py-4 text-slate-400 text-sm font-mono">{s.roll}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: s.gender === "female" ? "linear-gradient(135deg,#EC4899,#F43F5E)" : "linear-gradient(135deg,#4F46E5,#7C3AED)" }}>
                        {s.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-white">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-400">{s.class} · {s.section}</td>
                  <td className="px-5 py-4 text-sm text-slate-400">{s.guardian}</td>
                  <td className="px-5 py-4 text-sm text-slate-400">{s.phone}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize"
                      style={{ background: `${feeColors[s.feeStatus]}20`, color: feeColors[s.feeStatus] }}>
                      {s.feeStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize"
                      style={{ background: `${statusColors[s.status]}20`, color: statusColors[s.status] }}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:bg-indigo-500/20" style={{ color: "#818CF8" }}>Edit</button>
                      <button onClick={() => handleDelete(s.id)} className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:bg-red-500/20" style={{ color: "#F87171" }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <p className="text-4xl mb-2">🔍</p>
              <p className="font-medium">No students found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
