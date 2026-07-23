'use client';

import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome, FiCalendar, FiClock, FiFileText, FiBook,
  FiAward, FiDollarSign, FiUsers, FiUser, FiChevronDown, FiChevronRight,
  FiGrid, FiInfo
} from 'react-icons/fi';
import { Context } from '@/component/helper/Context';
import Back from '@/component/button/Back';

const Sidebar = () => {
  const pathname = usePathname();
  const { TeacherSidebar, setTeacherSidebar } = useContext(Context);
  const [isClubAdmin, setIsClubAdmin] = useState(false);
  const [clubDropdownOpen, setClubDropdownOpen] = useState(false);

  useEffect(() => {
    async function checkClubAdmin() {
      try {
        const res = await fetch('/api/teacher/clubs');
        const data = await res.json();
        if (data?.success && data?.paylod?.isClubAdmin) {
          setIsClubAdmin(true);
        }
      } catch (err) {
        console.error('Error checking club admin status:', err);
      }
    }
    checkClubAdmin();
  }, []);

  useEffect(() => {
    if (pathname.startsWith('/teacher/clubs')) {
      setClubDropdownOpen(true);
    }
  }, [pathname]);

  const teacherLinks = [
    { label: 'Dashboard', href: '/teacher', icon: FiHome },
    { label: 'Class Schedule', href: '/teacher/schedule', icon: FiClock },
    { label: 'Attendance Records', href: '/teacher/attendance', icon: FiCalendar },
    { label: 'Record Attendance', href: '/teacher/attendance/record', icon: FiFileText },
    { label: 'My Subjects', href: '/teacher/subjects', icon: FiBook },
    { label: 'Student Marks', href: '/teacher/marks', icon: FiAward },
  ];

  const clubSubLinks = [
    { label: 'Overview', href: '/teacher/clubs', icon: FiGrid },
    { label: 'Notice Info', href: '/teacher/clubs/notice', icon: FiInfo },
    { label: 'Members & Roles', href: '/teacher/clubs/members', icon: FiUsers },
    { label: 'Club News', href: '/teacher/clubs/news', icon: FiFileText },
  ];

  const remainingLinks = [
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
        className={`fixed top-16 left-0 bottom-0 w-64 bg-emerald-500 text-white z-40 flex flex-col justify-between py-6 px-4 transition-transform duration-200 ease-in-out md:translate-x-0 overflow-y-auto ${
          TeacherSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Back />
            <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest px-3 flex items-center gap-1.5 mb-2 opacity-90">
              Teacher Navigation
            </span>
            <nav className="flex flex-col gap-1">
              {teacherLinks.map((link) => {
                const Icon = link.icon;
                const isActive = link.href === '/teacher' 
                  ? pathname === '/teacher' 
                  : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setTeacherSidebar(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-white/90 hover:bg-emerald-600 hover:text-white'
                    }`}
                  >
                    <Icon className="text-base text-white" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Club Admin Dropdown Menu */}
              {isClubAdmin && (
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setClubDropdownOpen(!clubDropdownOpen)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                      pathname.startsWith('/teacher/clubs')
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-white/90 hover:bg-emerald-600 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FiUsers className="text-base text-white" />
                      <span>Club Admin</span>
                    </div>
                    {clubDropdownOpen ? <FiChevronDown className="text-sm text-white/80" /> : <FiChevronRight className="text-sm text-white/80" />}
                  </button>

                  {/* Sub Links */}
                  {clubDropdownOpen && (
                    <div className="flex flex-col gap-1 pl-6 border-l-2 border-emerald-400/40 ml-5 my-1">
                      {clubSubLinks.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = sub.href === '/teacher/clubs'
                          ? pathname === '/teacher/clubs'
                          : pathname === sub.href;

                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setTeacherSidebar(false)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                              isSubActive
                                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                : 'text-white/80 hover:bg-emerald-600/50 hover:text-white'
                            }`}
                          >
                            <SubIcon className="text-sm text-white" />
                            <span>{sub.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {remainingLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setTeacherSidebar(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-white/90 hover:bg-emerald-600 hover:text-white'
                    }`}
                  >
                    <Icon className="text-base text-white" />
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
            onClick={() => setTeacherSidebar(false)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5"
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