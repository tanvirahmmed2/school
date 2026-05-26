"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || null;

  const [form, setForm] = useState({ email: "", password: "", role: "admin" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roles = [
    { value: "admin",   label: "Admin",   icon: "🔐", redirect: "/dashboard" },
    { value: "teacher", label: "Teacher", icon: "👨‍🏫", redirect: "/portal/teacher" },
    { value: "student", label: "Student", icon: "🎓", redirect: "/portal/student" },
  ];

  const mockCreds = {
    admin:   { email: "admin@school.edu.bd",  password: "admin123" },
    teacher: { email: "rafiq@school.edu.bd",  password: "teacher123" },
    student: { email: "sakib@student.edu.bd", password: "student123" },
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); return; }
      const roleObj = roles.find((r) => r.value === data.user.role);
      router.push(redirectTo || roleObj?.redirect || "/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #312E81 100%)" }}
    >
      {/* Ambient orbs */}
      <div className="fixed top-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }} />
      <div className="fixed bottom-1/4 left-1/4 w-56 h-56 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, #F59E0B, transparent)" }} />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl" style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>G</div>
            <div className="text-left">
              <p className="text-white font-bold text-lg leading-tight">Govt. Primary School</p>
              <p className="text-indigo-300 text-sm">Management Portal</p>
            </div>
          </Link>
          <h1 className="text-3xl font-black text-white" style={{ fontFamily: "Poppins" }}>Welcome Back</h1>
          <p className="text-slate-400 mt-1 text-sm">Sign in to your portal</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8" style={{ background: "rgba(30,41,59,0.92)", border: "1px solid #334155", backdropFilter: "blur(20px)" }}>
          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2 mb-6 p-1 rounded-xl" style={{ background: "#0F172A" }}>
            {roles.map((r) => (
              <button
                key={r.value}
                onClick={() => { setForm((f) => ({ ...f, role: r.value, email: mockCreds[r.value].email, password: mockCreds[r.value].password })); setError(""); }}
                className="flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200"
                style={form.role === r.value ? { background: "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "#fff" } : { color: "#94A3B8" }}
              >
                <span className="text-lg">{r.icon}</span>{r.label}
              </button>
            ))}
          </div>

          {/* Hint */}
          <div className="flex items-center gap-2 p-3 rounded-xl mb-5 text-xs" style={{ background: "rgba(79,70,229,0.1)", border: "1px solid rgba(79,70,229,0.3)", color: "#818CF8" }}>
            💡 Demo credentials auto-filled. Just click Sign In.
          </div>

          {error && (
            <div className="p-3 rounded-xl mb-4 text-sm" style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)", color: "#F43F5E" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="your@email.com" required
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none" style={{ background: "#0F172A", border: "1px solid #334155" }} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="••••••••" required
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none" style={{ background: "#0F172A", border: "1px solid #334155" }} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60 mt-2"
              style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
              {loading ? "Signing in…" : `Sign In as ${roles.find((r) => r.value === form.role)?.label}`}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-5">
            <Link href="/" className="text-indigo-400 hover:text-indigo-300 transition-colors">← Back to Website</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#0F172A" }}><div className="text-white">Loading…</div></div>}>
      <LoginForm />
    </Suspense>
  );
}
