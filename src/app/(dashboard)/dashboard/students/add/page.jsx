"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function AddStudentPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", roll: "", class: "", section: "A", gender: "male", dob: "", guardian: "", phone: "", address: "", status: "active" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push("/dashboard/students"), 1200);
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Poppins" }}>Add New Student</h1>
        <p className="text-slate-400 text-sm">Fill in the student details below</p>
      </div>

      {success && (
        <div className="flex items-center gap-3 p-4 rounded-xl text-sm font-medium" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#34D399" }}>
          ✅ Student added successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl space-y-5" style={{ background: "#1E293B", border: "1px solid #334155" }}>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Full Name *</label>
            <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Student full name"
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
              style={{ background: "#0F172A", border: "1px solid #334155" }} /></div>
          <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Roll Number *</label>
            <input required value={form.roll} onChange={(e) => set("roll", e.target.value)} placeholder="e.g. 109"
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
              style={{ background: "#0F172A", border: "1px solid #334155" }} /></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Class *</label>
            <select required value={form.class} onChange={(e) => set("class", e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
              style={{ background: "#0F172A", border: "1px solid #334155" }}>
              <option value="">Select</option>
              {["Pre-School","Class 1","Class 2","Class 3","Class 4","Class 5"].map((c)=><option key={c}>{c}</option>)}
            </select></div>
          <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Section</label>
            <select value={form.section} onChange={(e) => set("section", e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
              style={{ background: "#0F172A", border: "1px solid #334155" }}>
              <option>A</option><option>B</option><option>C</option>
            </select></div>
          <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Gender</label>
            <select value={form.gender} onChange={(e) => set("gender", e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
              style={{ background: "#0F172A", border: "1px solid #334155" }}>
              <option value="male">Male</option><option value="female">Female</option>
            </select></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Date of Birth</label>
            <input type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
              style={{ background: "#0F172A", border: "1px solid #334155" }} /></div>
          <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Phone Number</label>
            <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="01XXXXXXXXX"
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
              style={{ background: "#0F172A", border: "1px solid #334155" }} /></div>
        </div>
        <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Guardian Name *</label>
          <input required value={form.guardian} onChange={(e) => set("guardian", e.target.value)} placeholder="Father/Mother name"
            className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
            style={{ background: "#0F172A", border: "1px solid #334155" }} /></div>
        <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Address</label>
          <textarea rows={2} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Full address"
            className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none resize-none"
            style={{ background: "#0F172A", border: "1px solid #334155" }} /></div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)" }}>
            {loading ? "Saving..." : "Add Student →"}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-6 py-3.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "#334155", color: "#94A3B8" }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
