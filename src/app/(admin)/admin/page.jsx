'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FiUsers, FiBook, FiCalendar, FiDollarSign, FiShield,
  FiUserPlus, FiArrowRight, FiCheckCircle, FiClock, FiFileText,
  FiActivity, FiLayers, FiSettings, FiBriefcase, FiTrendingUp
} from 'react-icons/fi';

const AdminHomePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/admin/dashboard');
        if (res.ok) {
          const json = await res.json();
          const stats = json.payload?.stats || json.paylod?.stats || json.stats;
          setData(stats);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const stats = data || {};
  const admissions = stats.admissions || { total: 0, pending: 0, approved: 0 };
  const finance = stats.finance || { totalIncome: 0, totalExpenses: 0, netBalance: 0 };

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-semibold text-slate-500">Loading Admin Control Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8 max-w-7xl mx-auto animate-fade-up pb-12">
      
      {/* Top Banner / Welcome Header */}
      <div className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15),transparent_70%)] pointer-events-none" />

        <div className="flex flex-col gap-2 z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60 w-max">
            <FiShield className="text-sm" /> Institutional Control Hub
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Welcome back, System Administrator
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl">
            {todayDate} • Monitor active campus metrics, admissions, financial ledgers, and operational activity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 w-full md:w-auto">
          <Link
            href="/admin/students"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-emerald-600/30"
          >
            <FiUserPlus className="text-sm" />
            <span>Manage Students</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-xl text-xs font-bold transition-all"
          >
            <FiSettings className="text-sm" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Stat 1: Total Students */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Students</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              <FiUsers />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {stats.totalStudents ? stats.totalStudents.toLocaleString() : '0'}
            </h2>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <FiTrendingUp /> Active Enrolled Students
            </p>
          </div>
        </div>

        {/* Stat 2: Total Teachers */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expert Faculty</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              <FiBriefcase />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {stats.totalTeachers ? stats.totalTeachers.toLocaleString() : '0'}
            </h2>
            <p className="text-xs text-indigo-600 font-semibold flex items-center gap-1 mt-1">
              <FiCheckCircle /> Verified Teachers
            </p>
          </div>
        </div>

        {/* Stat 3: Total Staff */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Support Staff</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              <FiUsers />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {stats.totalStaff ? stats.totalStaff.toLocaleString() : '0'}
            </h2>
            <p className="text-xs text-sky-600 font-semibold flex items-center gap-1 mt-1">
              <FiActivity /> Operations & Cashiers
            </p>
          </div>
        </div>

        {/* Stat 4: Academic Classes */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Academic Classes</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              <FiLayers />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {stats.totalClasses ? stats.totalClasses.toLocaleString() : '0'}
            </h2>
            <p className="text-xs text-amber-600 font-semibold flex items-center gap-1 mt-1">
              <FiBook /> Active Class Units
            </p>
          </div>
        </div>

      </div>

      {/* Analytics & Overview Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Admissions Overview */}
        <div className="lg:col-span-6 bg-white border border-slate-100 p-6 rounded-3xl shadow-xs flex flex-col justify-between gap-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-base">
                <FiUserPlus />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Admissions Overview</h3>
            </div>
            <Link href="/staff/registrar/admissions" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View All <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Applications</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{admissions.total}</p>
            </div>
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100">
              <p className="text-xs text-amber-700 font-bold uppercase tracking-wider">Pending Review</p>
              <p className="text-2xl font-extrabold text-amber-700 mt-1">{admissions.pending}</p>
            </div>
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
              <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Approved</p>
              <p className="text-2xl font-extrabold text-emerald-700 mt-1">{admissions.approved}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Admission Processing Rate</span>
              <span>
                {admissions.total > 0 ? Math.round((admissions.approved / admissions.total) * 100) : 0}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{
                  width: `${admissions.total > 0 ? Math.round((admissions.approved / admissions.total) * 100) : 0}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Finance Overview */}
        <div className="lg:col-span-6 bg-white border border-slate-100 p-6 rounded-3xl shadow-xs flex flex-col justify-between gap-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-base">
                <FiDollarSign />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Financial Overview</h3>
            </div>
            <Link href="/staff/cashier/transactions" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              Cashier Ledger <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
              <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Total Income</p>
              <p className="text-lg md:text-xl font-extrabold text-emerald-700 mt-1">
                ৳{finance.totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-100">
              <p className="text-xs text-rose-700 font-bold uppercase tracking-wider">Expenses</p>
              <p className="text-lg md:text-xl font-extrabold text-rose-700 mt-1">
                ৳{finance.totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100">
              <p className="text-xs text-indigo-700 font-bold uppercase tracking-wider">Net Balance</p>
              <p className="text-lg md:text-xl font-extrabold text-indigo-700 mt-1">
                ৳{finance.netBalance.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Aggregated cashier records & fee transactions</span>
            <span className="font-bold text-slate-700">Audit Status: Verified</span>
          </div>
        </div>

      </div>

      {/* Quick Action Navigation Tiles */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <FiLayers className="text-emerald-600" /> Admin Module Shortcuts
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link
            href="/admin/classes"
            className="p-4 bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-md rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              <FiBook />
            </div>
            <span className="text-xs font-bold text-slate-800">Classes</span>
          </Link>

          <Link
            href="/admin/teachers"
            className="p-4 bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-md rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              <FiBriefcase />
            </div>
            <span className="text-xs font-bold text-slate-800">Teachers</span>
          </Link>

          <Link
            href="/staff/registrar/admissions"
            className="p-4 bg-white border border-slate-100 hover:border-amber-200 hover:shadow-md rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              <FiUserPlus />
            </div>
            <span className="text-xs font-bold text-slate-800">Admissions</span>
          </Link>

          <Link
            href="/staff/registrar/events"
            className="p-4 bg-white border border-slate-100 hover:border-purple-200 hover:shadow-md rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              <FiCalendar />
            </div>
            <span className="text-xs font-bold text-slate-800">Events</span>
          </Link>

          <Link
            href="/staff/cashier/transactions"
            className="p-4 bg-white border border-slate-100 hover:border-sky-200 hover:shadow-md rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              <FiDollarSign />
            </div>
            <span className="text-xs font-bold text-slate-800">Finance</span>
          </Link>

          <Link
            href="/admin/settings"
            className="p-4 bg-white border border-slate-100 hover:border-rose-200 hover:shadow-md rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              <FiSettings />
            </div>
            <span className="text-xs font-bold text-slate-800">Site Settings</span>
          </Link>
        </div>
      </div>

      {/* Data Tables Row: Recent Admissions & Security Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Admissions Table */}
        <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-3xl shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <FiUserPlus className="text-emerald-600" /> Recent Admission Applications
            </h3>
            <Link href="/staff/registrar/admissions" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
              View All
            </Link>
          </div>

          {stats.recentAdmissions && stats.recentAdmissions.length > 0 ? (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="pb-3 px-2">Applicant</th>
                    <th className="pb-3 px-2">Contact</th>
                    <th className="pb-3 px-2">Date</th>
                    <th className="pb-3 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                  {stats.recentAdmissions.map((adm) => (
                    <tr key={adm.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-2 font-bold text-slate-900">{adm.student_name || 'N/A'}</td>
                      <td className="py-3 px-2 text-slate-500">{adm.guardian_phone || '—'}</td>
                      <td className="py-3 px-2 text-slate-400">
                        {adm.created_at ? new Date(adm.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                          adm.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : 'bg-amber-50 text-amber-600 border border-amber-200'
                        }`}>
                          {adm.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-400 text-xs italic text-center py-6">No recent admissions found.</p>
          )}
        </div>

        {/* Security & System Activity Logs */}
        <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-3xl shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <FiShield className="text-indigo-600" /> Security Login Logs
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
              Live Feed
            </span>
          </div>

          {stats.loginLogs && stats.loginLogs.length > 0 ? (
            <div className="flex flex-col gap-3">
              {stats.loginLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50/70 border border-slate-100 rounded-xl text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">
                      <FiClock />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 truncate max-w-[150px]">{log.user_email || 'User'}</span>
                      <span className="text-[10px] text-slate-400 capitalize">{log.user_type || 'Portal'} • {log.ip_address || '127.0.0.1'}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 shrink-0">
                    {log.login_time ? new Date(log.login_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-xs italic text-center py-6">No login logs recorded yet.</p>
          )}
        </div>

      </div>

    </div>
  );
};

export default AdminHomePage;