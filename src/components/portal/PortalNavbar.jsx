"use client";
import Link from "next/link";
import React from "react";

/**
 * Reusable PortalNavbar for Student and Teacher portals.
 *
 * Props:
 *   title       – page/portal title string
 *   userColor   – accent gradient color for avatar
 *   userInitial – avatar letter
 *   userName    – display name
 *   userSub     – subtitle (role, class, etc.)
 */
export default function PortalNavbar({
  title = "Portal",
  userColor = "#4F46E5",
  userInitial = "U",
  userName = "User",
  userSub = "",
}) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header
      className="flex items-center justify-between px-6 h-14 flex-shrink-0"
      style={{
        background: "#fff",
        borderBottom: "1px solid var(--portal-border)",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Left */}
      <div>
        <p className="font-bold text-slate-800 text-sm">{title}</p>
        <p className="text-slate-400 text-xs hidden sm:block">{today}</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notification bell (static) */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
          🔔
        </button>

        {/* User chip */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 transition-all cursor-default">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: `linear-gradient(135deg, ${userColor}, #7C3AED)` }}
          >
            {userInitial}
          </div>
          <div className="hidden sm:block">
            <p className="text-slate-800 text-xs font-semibold leading-none">{userName}</p>
            {userSub && <p className="text-slate-400 text-[10px] mt-0.5">{userSub}</p>}
          </div>
        </div>

        {/* Sign out */}
        <Link
          href="/login"
          className="hidden sm:inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
        >
          Sign Out
        </Link>
      </div>
    </header>
  );
}
