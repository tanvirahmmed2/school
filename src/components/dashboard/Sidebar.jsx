"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard",  path: "/dashboard",            icon: "🏠" },
      { name: "Analytics",  path: "/dashboard/analytics",  icon: "📊" },
    ],
  },
  {
    title: "Academic",
    items: [
      { name: "Students",        path: "/dashboard/students",   icon: "🎓" },
      { name: "Teachers",        path: "/dashboard/teachers",   icon: "👨‍🏫" },
      { name: "Classes & Routine", path: "/dashboard/routine",  icon: "📅" },
      { name: "Exam & Results",  path: "/dashboard/exams",      icon: "📝" },
      { name: "Attendance",      path: "/dashboard/attendance", icon: "✅" },
    ],
  },
  {
    title: "Finance",
    items: [
      { name: "Fee Collection",     path: "/dashboard/fees",    icon: "💳" },
      { name: "Salary & Payroll",   path: "/dashboard/salary",  icon: "💰" },
      { name: "Financial Reports",  path: "/dashboard/finance", icon: "📈" },
    ],
  },
  {
    title: "Communications",
    items: [
      { name: "Notice Board",    path: "/dashboard/notices", icon: "📢" },
      { name: "SMS Management",  path: "/dashboard/sms",     icon: "📱" },
    ],
  },
  {
    title: "System",
    items: [
      { name: "Admissions", path: "/dashboard/admissions", icon: "📋" },
      { name: "Reports",    path: "/dashboard/reports",    icon: "📄" },
      { name: "Settings",   path: "/dashboard/settings",   icon: "⚙️" },
    ],
  },
];

export default function AdminSidebar({ collapsed, setCollapsed }) {
  const pathname = usePathname();

  return (
    <aside
      className="h-screen flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden"
      style={{
        width: collapsed ? "68px" : "256px",
        background: "var(--dash-surface)",
        borderRight: "1px solid var(--dash-border)",
      }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-3 px-4 py-4 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--dash-border)", minHeight: "64px" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-md"
          style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
        >
          G
        </div>
        {!collapsed && (
          <div className="flex-1 overflow-hidden">
            <p className="text-white font-bold text-sm leading-tight truncate">Govt. Primary School</p>
            <p className="text-slate-400 text-xs">Admin Panel</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all flex-shrink-0 text-xs"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-1.5 px-2"
                style={{ color: "var(--dash-subtle)" }}
              >
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path));
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      title={collapsed ? item.name : undefined}
                      className={`dash-nav-item ${isActive ? "active" : ""}`}
                      style={collapsed ? { justifyContent: "center", padding: "0.6rem 0" } : {}}
                    >
                      <span className="text-base flex-shrink-0 w-5 text-center">{item.icon}</span>
                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 flex-shrink-0" style={{ borderTop: "1px solid var(--dash-border)" }}>
        <Link
          href="/"
          title={collapsed ? "View Website" : undefined}
          className="dash-nav-item"
          style={collapsed ? { justifyContent: "center", padding: "0.6rem 0" } : {}}
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🌐</span>
          {!collapsed && <span className="truncate">View Website</span>}
        </Link>
        <Link
          href="/login"
          title={collapsed ? "Sign Out" : undefined}
          className="dash-nav-item mt-0.5"
          style={{
            color: "#F87171",
            ...(collapsed ? { justifyContent: "center", padding: "0.6rem 0" } : {}),
          }}
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🚪</span>
          {!collapsed && <span className="truncate">Sign Out</span>}
        </Link>
      </div>
    </aside>
  );
}
