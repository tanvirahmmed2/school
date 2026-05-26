"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

/**
 * Reusable PortalSidebar for Student and Teacher portals.
 *
 * Props:
 *   navItems  – array of { name, path, icon }
 *   user      – { name, subtitle, initial, gradientFrom, gradientTo }
 *   brand     – { label, color } — e.g. { label:"Student Portal", color:"#4F46E5" }
 *   accent    – active item style: "indigo" | "violet"
 */
export default function PortalSidebar({ navItems = [], user = {}, brand = {}, accent = "indigo" }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeStyle =
    accent === "violet"
      ? { background: "#F5F3FF", color: "#7C3AED", fontWeight: 700 }
      : { background: "#EEF2FF", color: "#4F46E5", fontWeight: 700 };

  const gradientFrom = user.gradientFrom || "#4F46E5";
  const gradientTo   = user.gradientTo   || "#7C3AED";
  const accentBg     = accent === "violet" ? "#F5F3FF" : "#EEF2FF";

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center rounded-xl shadow-md"
        style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <span className="text-white text-sm">{mobileOpen ? "✕" : "☰"}</span>
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className="fixed lg:static inset-y-0 left-0 z-40 flex flex-col w-64 flex-shrink-0 transition-transform duration-300 lg:translate-x-0"
        style={{
          background: "#fff",
          borderRight: "1px solid var(--portal-border)",
          transform: mobileOpen ? "translateX(0)" : undefined,
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: "1px solid var(--portal-border)" }}>
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-sm"
              style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
            >
              G
            </div>
            <div>
              <p className="text-slate-800 font-bold text-sm leading-tight">{brand.label || "Portal"}</p>
              <p className="text-slate-400 text-xs">Govt. Primary School</p>
            </div>
          </Link>
        </div>

        {/* User card */}
        {user.name && (
          <div className="mx-4 mt-4 mb-1 flex items-center gap-3 px-3 py-3 rounded-xl" style={{ background: accentBg }}>
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
            >
              {user.initial || user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-slate-800 font-semibold text-sm leading-tight truncate">{user.name}</p>
              <p className="text-slate-500 text-xs truncate">{user.subtitle}</p>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileOpen(false)}
                className="portal-nav-item"
                style={active ? activeStyle : {}}
              >
                <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4 pt-2 space-y-1" style={{ borderTop: "1px solid var(--portal-border)" }}>
          <Link href="/" className="portal-nav-item text-slate-500">
            <span className="text-base w-5 text-center">🌐</span>
            <span>School Website</span>
          </Link>
          <Link href="/login" className="portal-nav-item" style={{ color: "#F43F5E" }}>
            <span className="text-base w-5 text-center">🚪</span>
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
