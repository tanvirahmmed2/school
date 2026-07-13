'use client';

import React, { useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome, FiCalendar, FiClock, FiFileText, FiBook,
  FiAward, FiDollarSign, FiUsers, FiUser
} from 'react-icons/fi';
import { Context } from '@/component/helper/Context';
import Back from '@/component/button/Back';

const Sidebar = () => {
  const pathname = usePathname();
  const { TeacherSidebar, setTeacherSidebar } = useContext(Context);

  const teacherLinks = [
    { label: 'Dashboard', href: '/teacher', icon: FiHome },
    { label: 'Class Schedule', href: '/teacher/schedule', icon: FiClock },
    { label: 'Student Attendance', href: '/teacher/attendance', icon: FiCalendar },
    { label: 'My Subjects', href: '/teacher/subjects', icon: FiBook },
    { label: 'Student Marks', href: '/teacher/marks', icon: FiAward },
    { label: 'Leave Applications', href: '/teacher/leaves', icon: FiFileText },
    { label: 'Salary History', href: '/teacher/salary', icon: FiDollarSign },
    { label: 'My Profile', href: '/teacher/profile', icon: FiUser },
  ];

  return (
    <>
      {TeacherSidebar && (
        <div
          className="fixed inset-0 top-16 bg-slate-900/20 backdrop-blur-xs z-30 md:hidden transition-opacity duration-200"
          onClick={() => setTeacherSidebar(false)}
        />
      )}

      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-100 z-40 flex flex-col justify-between py-6 px-4 transition-transform duration-200 ease-in-out md:translate-x-0 overflow-y-auto ${TeacherSidebar ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Back/>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 flex items-center gap-1.5 mb-2">
              Teacher Navigation
            </span>
            <nav className="flex flex-col gap-1">
              {teacherLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setTeacherSidebar(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                  >
                    <Icon className={`text-base ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

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