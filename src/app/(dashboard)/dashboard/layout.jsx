"use client";
import AdminNavbar from "@/components/dashboard/Navbar";
import AdminSidebar from "@/components/dashboard/Sidebar";
import React, { useState } from "react";

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: "var(--dash-bg)" }}>
      {/* Sidebar */}
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <AdminNavbar />

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto p-6"
          style={{ background: "var(--dash-bg)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
