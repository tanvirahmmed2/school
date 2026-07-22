'use client';

import React, { useContext, useEffect, useState } from 'react';
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
  const [isClubMember, setIsClubMember] = useState(false);

  useEffect(() => {
    async function checkClubMember() {
      try {
        const res = await fetch('/api/student/clubs');
        const data = await res.json();
        if (data?.success && data?.paylod?.isClubMember) {
          setIsClubMember(true);
        }
      } catch (err) {
        console.error('Error checking club membership status:', err);
      }
    }
    checkClubMember();
  }, []);

  const studentLinks = [
    { label: 'Dashboard', href: '/student', icon: FiHome },
    { label: 'My Class Routine', href: '/student/routine', icon: FiClock },
    { label: 'My Attendance', href: '/student/attendance', icon: FiCalendar },
    { label: 'Subjects & Syllabus', href: '/student/subjects', icon: FiBook },
    { label: 'Exam Routine', href: '/student/exams', icon: FiCalendar },
    { label: 'My Marks & Results', href: '/student/results', icon: FiAward },
    { label: 'Fees & Fines', href: '/student/fees', icon: FiDollarSign },
    ...(isClubMember ? [{ label: 'My Club Dashboard', href: '/student/clubs', icon: FiUsers }] : []),
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
                const isActive = link.href === '/student'
                  ? pathname === '/student'
                  : pathname.startsWith(link.href);

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

        <div className="mt-6">
          <Link
            href="/"
            onClick={() => setStudentSidebar(false)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5"
          >
            <FiHome className="text-sm" />
            <span>Go to Home Page</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;