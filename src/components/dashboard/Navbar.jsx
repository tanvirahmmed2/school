"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

const NOTIFICATIONS = [
  { icon: "💳", text: "New fee payment received from Sakib Hasan", time: "2 min ago",  color: "#10B981" },
  { icon: "🎓", text: "New admission application submitted",         time: "15 min ago", color: "#4F46E5" },
  { icon: "📢", text: "Notice published: Exam Schedule June 2025",   time: "1 hr ago",   color: "#F59E0B" },
  { icon: "✅", text: "Attendance marked for all classes",            time: "2 hrs ago",  color: "#7C3AED" },
];

export default function AdminNavbar() {
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e) {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className="w-full flex items-center justify-between px-5 h-16 flex-shrink-0"
      style={{ background: "var(--dash-surface)", borderBottom: "1px solid var(--dash-border)" }}
    >
      {/* Search */}
      <div
        className="hidden md:flex items-center gap-2.5 px-4 py-2 rounded-xl"
        style={{ background: "var(--dash-bg)", border: "1px solid var(--dash-border)", width: "280px" }}
      >
        <span className="text-slate-500 text-sm select-none">🔍</span>
        <input
          type="text"
          placeholder="Search students, teachers…"
          className="bg-transparent text-sm placeholder-slate-500 outline-none w-full"
          style={{ color: "var(--dash-text)" }}
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 ml-auto">

        {/* Notification */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            aria-label="Notifications"
          >
            🔔
            <span
              className="absolute top-1.5 right-1.5 w-3.5 h-3.5 flex items-center justify-center text-white font-black rounded-full"
              style={{ background: "#F43F5E", fontSize: "8px" }}
            >
              {NOTIFICATIONS.length}
            </span>
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 top-11 w-80 rounded-2xl shadow-xl overflow-hidden z-50 animate-slide-down"
              style={{ background: "var(--dash-surface)", border: "1px solid var(--dash-border)" }}
            >
              <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid var(--dash-border)" }}>
                <p className="text-white font-bold text-sm">Notifications</p>
                <span className="badge badge-danger">{NOTIFICATIONS.length} New</span>
              </div>
              <ul>
                {NOTIFICATIONS.map((n, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 px-4 py-3.5 hover:bg-slate-700/40 cursor-pointer transition-colors"
                    style={{ borderBottom: i < NOTIFICATIONS.length - 1 ? "1px solid var(--dash-border)" : "none" }}
                  >
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                      style={{ background: `${n.color}18` }}
                    >
                      {n.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-200 text-xs leading-snug">{n.text}</p>
                      <p className="text-slate-500 text-xs mt-1">{n.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-5 py-3 text-center" style={{ borderTop: "1px solid var(--dash-border)" }}>
                <button className="text-indigo-400 text-xs font-semibold hover:text-indigo-300 transition-colors">
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-700 transition-all"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
            >
              A
            </div>
            <div className="hidden md:block text-left">
              <p className="text-white text-xs font-semibold leading-none">Admin User</p>
              <p className="text-slate-400 text-[10px] mt-0.5">Head Teacher</p>
            </div>
            <span className="text-slate-400 text-[10px] hidden md:block">▼</span>
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 top-11 w-52 rounded-2xl shadow-xl overflow-hidden z-50 animate-slide-down"
              style={{ background: "var(--dash-surface)", border: "1px solid var(--dash-border)" }}
            >
              <div className="px-4 py-3.5" style={{ borderBottom: "1px solid var(--dash-border)" }}>
                <p className="text-white text-sm font-semibold">Admin User</p>
                <p className="text-slate-400 text-xs">admin@school.edu.bd</p>
              </div>
              {[
                { icon: "👤", label: "My Profile",       href: "/dashboard/settings" },
                { icon: "⚙️", label: "Settings",         href: "/dashboard/settings" },
                { icon: "🔒", label: "Change Password",  href: "/dashboard/settings" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all"
                  style={{ borderBottom: "1px solid var(--dash-border)" }}
                  onClick={() => setProfileOpen(false)}
                >
                  <span>{item.icon}</span>{item.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold hover:bg-slate-700/50 transition-all"
                style={{ color: "#F87171" }}
              >
                <span>🚪</span> Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
