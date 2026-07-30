'use client';

import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome, FiCalendar, FiClock, FiFileText, FiBook,
  FiAward, FiDollarSign, FiUsers, FiUser, FiCreditCard
} from 'react-icons/fi';
import { Context } from '@/component/helper/Context';
import Back from '@/component/button/Back';

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
    { label: 'Admit Cards', href: '/student/cards', icon: FiFileText },
    { label: 'My Student ID Card', href: '/student/id-card', icon: FiCreditCard },
    { label: 'My Testimonial', href: '/student/testimonial', icon: FiAward },
    { label: 'My Marks & Results', href: '/student/results', icon: FiAward },
    { label: 'Fees & Fines', href: '/student/fees', icon: FiDollarSign },
    { label: 'Hostel Accommodation', href: '/student/hostels', icon: FiHome },
    { label: 'Campus Events', href: '/student/events', icon: FiCalendar },
    ...(isClubMember ? [{ label: 'My Club Dashboard', href: '/student/clubs', icon: FiUsers }] : []),
    { label: 'My Profile', href: '/student/profile', icon: FiUser },
  ];

  return (
    <>
      {/* Mobile Sidebar backdrop */}
      {studentSidebar && (
        <div
          className="fixed inset-0 top-16 bg-slate-900/30 backdrop-blur-xs z-30 md:hidden transition-opacity duration-200"
          onClick={() => setStudentSidebar(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-200/80 z-40 flex flex-col justify-between py-5 px-3 transition-transform duration-200 ease-in-out md:translate-x-0 overflow-y-auto ${
          studentSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-4">
          <Back />
          {/* Sidebar Navigation */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 flex items-center gap-1.5 mb-1">
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
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all duration-150 group ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60 shadow-2xs'
                        : 'text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`text-base ${isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-slate-100">
          <Link
            href="/"
            onClick={() => setStudentSidebar(false)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
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