'use client';

import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome, FiShield, FiLayers, FiGrid, FiBook,
  FiUserPlus, FiUsers, FiAward, FiCalendar, FiDollarSign, FiFileText,
  FiChevronDown, FiChevronRight, FiClock, FiLayers as FiModuleIcon
} from 'react-icons/fi';
import { Context } from '@/component/helper/Context';

const Sidebar = () => {
  const pathname = usePathname();
  const { adminSidebar, setAdminSidebar } = useContext(Context);
  const [classesOpen, setClassesOpen] = useState(pathname.startsWith('/admin/classes'));
  const [teachersOpen, setTeachersOpen] = useState(pathname.startsWith('/admin/teachers'));
  const [staffOpen, setStaffOpen] = useState(pathname.startsWith('/admin/staff'));
  const [examsOpen, setExamsOpen] = useState(pathname.startsWith('/admin/exams'));

  const academicLinks = [
    { label: 'Dashboard Overview', href: '/admin', icon: FiHome },
    { label: 'Access Control', href: '/admin/access', icon: FiShield },
    { label: 'Subject Management', href: '/admin/subjects', icon: FiBook },
  ];

  const classLinks = [
    { label: 'Classes List', href: '/admin/classes/class', icon: FiLayers },
    { label: 'Sections List', href: '/admin/classes/section', icon: FiGrid },
    { label: 'Class Routine', href: '/admin/classes/routine', icon: FiClock },
    { label: 'Syllabus', href: '/admin/classes/syllabus', icon: FiFileText },
  ];

  const teacherLinks = [
    { label: 'New Teacher Account', href: '/admin/teachers/new', icon: FiUserPlus },
    { label: 'Teachers List', href: '/admin/teachers/list', icon: FiUsers },
    { label: 'Class Assignments', href: '/admin/teachers/assign-classes', icon: FiAward },
    { label: 'Attendance Registry', href: '/admin/teachers/attendences', icon: FiCalendar },
    { label: 'Salary Ledger', href: '/admin/teachers/salary', icon: FiDollarSign },
    { label: 'Applications Drawer', href: '/admin/teachers/applications', icon: FiFileText },
  ];

  const staffLinks = [
    { label: 'New Staff Account', href: '/admin/staff/new', icon: FiUserPlus },
    { label: 'Staff List', href: '/admin/staff/list', icon: FiUsers },
    { label: 'Salary Ledger', href: '/admin/staff/salary', icon: FiDollarSign },
    { label: 'Applications Drawer', href: '/admin/staff/applications', icon: FiFileText },
  ];

  const examLinks = [
    { label: 'New Exam Routine', href: '/admin/exams/new', icon: FiUserPlus },
    { label: 'Current Exams', href: '/admin/exams/current', icon: FiCalendar },
    { label: 'Upcoming Exams', href: '/admin/exams/upcoming', icon: FiCalendar },
    { label: 'Previous Exams', href: '/admin/exams/previous', icon: FiFileText },
  ];

  return (
    <>
      {/* Mobile Sidebar backdrop */}
      {adminSidebar && (
        <div
          className="fixed inset-0 top-16 bg-slate-900/20 backdrop-blur-xs z-30 md:hidden transition-opacity duration-200"
          onClick={() => setAdminSidebar(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-100 z-40 flex flex-col justify-between py-6 px-4 transition-transform duration-200 ease-in-out md:translate-x-0 overflow-y-auto ${adminSidebar ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col gap-6">

          {/* Section 1: Academic Setup */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 flex items-center gap-1.5">
              <FiModuleIcon /> Academic Setup
            </span>
            <nav className="flex flex-col gap-1">
              {academicLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setAdminSidebar(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive
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

          {/* Section 1.5: Class Management (Dropdown collapsible) */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 flex items-center gap-1.5 mb-0.5">
              <FiLayers /> Class Management
            </span>

            <button
              onClick={() => setClassesOpen(!classesOpen)}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${pathname.startsWith('/admin/classes')
                  ? 'bg-slate-50 text-slate-850'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
            >
              <div className="flex items-center gap-3">
                <FiLayers className={`text-base ${pathname.startsWith('/admin/classes') ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>Classes</span>
              </div>
              {classesOpen ? (
                <FiChevronDown className="text-slate-400 text-sm" />
              ) : (
                <FiChevronRight className="text-slate-400 text-sm" />
              )}
            </button>

            {/* Collapsible Sub-links Container */}
            {classesOpen && (
              <div className="flex flex-col gap-1 pl-4 border-l border-slate-100 ml-5 animate-fade-down duration-200">
                {classLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setAdminSidebar(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-155 ${isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                    >
                      <Icon className={`text-sm ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Teacher Management (Dropdown collapsible) */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 flex items-center gap-1.5 mb-0.5">
              <FiUsers /> Teacher Management
            </span>

            <button
              onClick={() => setTeachersOpen(!teachersOpen)}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${pathname.startsWith('/admin/teachers')
                  ? 'bg-slate-50 text-slate-850'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
            >
              <div className="flex items-center gap-3">
                <FiUsers className={`text-base ${pathname.startsWith('/admin/teachers') ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>Teachers</span>
              </div>
              {teachersOpen ? (
                <FiChevronDown className="text-slate-400 text-sm" />
              ) : (
                <FiChevronRight className="text-slate-400 text-sm" />
              )}
            </button>

            {/* Collapsible Sub-links Container */}
            {teachersOpen && (
              <div className="flex flex-col gap-1 pl-4 border-l border-slate-100 ml-5 animate-fade-down duration-200">
                {teacherLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setAdminSidebar(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-155 ${isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                    >
                      <Icon className={`text-sm ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 3: Staff Management (Dropdown collapsible) */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 flex items-center gap-1.5 mb-0.5">
              <FiUsers /> Staff Management
            </span>

            <button
              onClick={() => setStaffOpen(!staffOpen)}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${pathname.startsWith('/admin/staff')
                  ? 'bg-slate-50 text-slate-850'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
            >
              <div className="flex items-center gap-3">
                <FiUsers className={`text-base ${pathname.startsWith('/admin/staff') ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>Staff</span>
              </div>
              {staffOpen ? (
                <FiChevronDown className="text-slate-400 text-sm" />
              ) : (
                <FiChevronRight className="text-slate-400 text-sm" />
              )}
            </button>

            {/* Collapsible Sub-links Container */}
            {staffOpen && (
              <div className="flex flex-col gap-1 pl-4 border-l border-slate-100 ml-5 animate-fade-down duration-200">
                {staffLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setAdminSidebar(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-155 ${isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                    >
                      <Icon className={`text-sm ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 4: Exams Management (Dropdown collapsible) */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 flex items-center gap-1.5 mb-0.5">
              <FiCalendar /> Exams Management
            </span>

            <button
              onClick={() => setExamsOpen(!examsOpen)}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${pathname.startsWith('/admin/exams')
                  ? 'bg-slate-50 text-slate-850'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
            >
              <div className="flex items-center gap-3">
                <FiCalendar className={`text-base ${pathname.startsWith('/admin/exams') ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>Exams</span>
              </div>
              {examsOpen ? (
                <FiChevronDown className="text-slate-400 text-sm" />
              ) : (
                <FiChevronRight className="text-slate-400 text-sm" />
              )}
            </button>

            {/* Collapsible Sub-links Container */}
            {examsOpen && (
              <div className="flex flex-col gap-1 pl-4 border-l border-slate-100 ml-5 animate-fade-down duration-200">
                {examLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setAdminSidebar(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-155 ${isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                    >
                      <Icon className={`text-sm ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Info label at the bottom */}
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-center mt-6">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            System Status
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Online
          </span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;