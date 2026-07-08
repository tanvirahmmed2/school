'use client';

import React, { useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome, FiCalendar, FiClock, FiFileText, FiBook,
  FiAward, FiDollarSign, FiUsers, FiUser
} from 'react-icons/fi';
import { Context } from '@/component/helper/Context';

const Sidebar = () => {
  const pathname = usePathname();
  const { studentSidebar, setStudentSidebar } = useContext(Context);

  const studentLinks = [
    { label: 'Dashboard', href: '/student', icon: FiHome },
    { label: 'My Class Routine', href: '/student/routine', icon: FiClock },
    { label: 'My Attendance', href: '/student/attendance', icon: FiCalendar },
    { label: 'Subjects & Syllabus', href: '/student/subjects', icon: FiBook },
    { label: 'Exam Routine', href: '/student/exams', icon: FiCalendar },
    { label: 'My Marks & Results', href: '/student/results', icon: FiAward },
    { label: 'Fees & Fines', href: '/student/fees', icon: FiDollarSign },
    { label: 'Clubs & Activities', href: '/student/clubs', icon: FiUsers },
    { label: 'My Profile', href: '/student/profile', icon: FiUser },
  ];

  return (
    <>
      {/* Mobile Sidebar backdrop */}
      {studentSidebar && (
        <div
          className="fixed inset-0 top-16 bg-slate-900/20 backdrop-blur-xs z-30 md:hidden transition-opacity duration-200"
          onClick={() => setStudentSidebar(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-100 z-40 flex flex-col justify-between py-6 px-4 transition-transform duration-200 ease-in-out md:translate-x-0 overflow-y-auto ${
          studentSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* Sidebar Navigation */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 flex items-center gap-1.5 mb-2">
              Student Navigation
            </span>
            <nav className="flex flex-col gap-1">
              {studentLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setStudentSidebar(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <Icon className={`text-base ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Info label at the bottom */}
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-center mt-6">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Portal Status
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Online
          </span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;