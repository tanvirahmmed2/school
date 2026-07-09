'use client';

import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome, FiShield, FiLayers, FiGrid, FiBook,
  FiUserPlus, FiUsers, FiAward, FiCalendar, FiDollarSign, FiFileText,
  FiChevronDown, FiChevronRight, FiClock, FiLayers as FiModuleIcon, FiPlus
} from 'react-icons/fi';
import { Context } from '@/component/helper/Context';

const Sidebar = () => {
  const pathname = usePathname();
  const { adminSidebar, setAdminSidebar } = useContext(Context);
  const [classesOpen, setClassesOpen] = useState(pathname.startsWith('/admin/classes'));
  const [subjectsOpen, setSubjectsOpen] = useState(pathname.startsWith('/admin/subjects'));
  const [teachersOpen, setTeachersOpen] = useState(pathname.startsWith('/admin/teachers'));
  const [authoritiesOpen, setAuthoritiesOpen] = useState(pathname.startsWith('/admin/authorities'));
  const [examsOpen, setExamsOpen] = useState(pathname.startsWith('/admin/exams'));
  const [studentsOpen, setStudentsOpen] = useState(pathname.startsWith('/admin/students'));
  const [clubsOpen, setClubsOpen] = useState(pathname.startsWith('/admin/clubs'));

  const academicLinks = [
    { label: 'Dashboard Overview', href: '/admin', icon: FiHome },
    { label: 'Access Control', href: '/admin/access', icon: FiShield },
  ];

  const classLinks = [
    { label: 'Classes List', href: '/admin/classes/class', icon: FiLayers },
    { label: 'Sections List', href: '/admin/classes/sections', icon: FiGrid },
    { label: 'Class Routine', href: '/admin/classes/routine', icon: FiClock },
    { label: 'Syllabus', href: '/admin/classes/syllabus', icon: FiFileText },
  ];

  const subjectLinks = [
    { label: 'Subjects List', href: '/admin/subjects/new', icon: FiBook },
    { label: 'Subject Allocation', href: '/admin/subjects/allocation', icon: FiLayers },
  ];

  const studentLinks = [
    { label: 'Students List', href: '/admin/students/lists', icon: FiUsers },
    { label: 'Attendance Registry', href: '/admin/students/attendance', icon: FiCalendar },
    { label: 'Fees & Ledgers', href: '/admin/students/fees', icon: FiDollarSign },
    { label: 'Enter Marks', href: '/admin/students/marks', icon: FiBook },
    { label: 'Publish Results', href: '/admin/students/results', icon: FiAward },
    { label: 'Transcripts Card', href: '/admin/students/transcripts', icon: FiFileText },
  ];

  const clubLinks = [
    { label: 'Register Club', href: '/admin/clubs/new', icon: FiPlus },
    { label: 'Assign Roles', href: '/admin/clubs/assign', icon: FiUsers },
  ];

  const teacherLinks = [
    { label: 'New Teacher Account', href: '/admin/teachers/new', icon: FiUserPlus },
    { label: 'Teachers List', href: '/admin/teachers/list', icon: FiUsers },
    { label: 'Class Assignments', href: '/admin/teachers/assign-classes', icon: FiAward },
    { label: 'Attendance Registry', href: '/admin/teachers/attendences', icon: FiCalendar },
    { label: 'Salary Ledger', href: '/admin/teachers/salary', icon: FiDollarSign },
    { label: 'Applications Drawer', href: '/admin/teachers/applications', icon: FiFileText },
    { label: 'Manage Qualifications', href: '/admin/teachers/qualification', icon: FiAward },
  ];

  const authorityLinks = [
    { label: 'New Board Member', href: '/admin/authorities/new', icon: FiUserPlus },
    { label: 'Board Members List', href: '/admin/authorities/list', icon: FiUsers },
    { label: 'Board Qualifications', href: '/admin/authorities/qualification', icon: FiAward },
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

          {/* Section 1.8: Subject Management (Dropdown collapsible) */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 flex items-center gap-1.5 mb-0.5">
              <FiBook /> Subject Management
            </span>

            <button
              onClick={() => setSubjectsOpen(!subjectsOpen)}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${pathname.startsWith('/admin/subjects')
                  ? 'bg-slate-50 text-slate-850'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
            >
              <div className="flex items-center gap-3">
                <FiBook className={`text-base ${pathname.startsWith('/admin/subjects') ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>Subjects</span>
              </div>
              {subjectsOpen ? (
                <FiChevronDown className="text-slate-400 text-sm" />
              ) : (
                <FiChevronRight className="text-slate-400 text-sm" />
              )}
            </button>

            {/* Collapsible Sub-links Container */}
            {subjectsOpen && (
              <div className="flex flex-col gap-1 pl-4 border-l border-slate-100 ml-5 animate-fade-down duration-200">
                {subjectLinks.map((link) => {
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

          {/* Section 2.5: Board Authorities Management (Dropdown collapsible) */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 flex items-center gap-1.5 mb-0.5">
              <FiShield /> Board Management
            </span>

            <button
              onClick={() => setAuthoritiesOpen(!authoritiesOpen)}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${pathname.startsWith('/admin/authorities')
                  ? 'bg-slate-50 text-slate-850'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
            >
              <div className="flex items-center gap-3">
                <FiShield className={`text-base ${pathname.startsWith('/admin/authorities') ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>Board Members</span>
              </div>
              {authoritiesOpen ? (
                <FiChevronDown className="text-slate-400 text-sm" />
              ) : (
                <FiChevronRight className="text-slate-400 text-sm" />
              )}
            </button>

            {/* Collapsible Sub-links Container */}
            {authoritiesOpen && (
              <div className="flex flex-col gap-1 pl-4 border-l border-slate-100 ml-5 animate-fade-down duration-200">
                {authorityLinks.map((link) => {
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

          {/* Section 3.5: Student Management (Dropdown collapsible) */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 flex items-center gap-1.5 mb-0.5">
              <FiUsers /> Student Management
            </span>

            <button
              onClick={() => setStudentsOpen(!studentsOpen)}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${pathname.startsWith('/admin/students')
                  ? 'bg-slate-50 text-slate-850'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
            >
              <div className="flex items-center gap-3">
                <FiUsers className={`text-base ${pathname.startsWith('/admin/students') ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>Students</span>
              </div>
              {studentsOpen ? (
                <FiChevronDown className="text-slate-400 text-sm" />
              ) : (
                <FiChevronRight className="text-slate-400 text-sm" />
              )}
            </button>

            {/* Collapsible Sub-links Container */}
            {studentsOpen && (
              <div className="flex flex-col gap-1 pl-4 border-l border-slate-100 ml-5 animate-fade-down duration-200">
                {studentLinks.map((link) => {
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

          {/* Section 3.8: Club Management (Dropdown collapsible) */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 flex items-center gap-1.5 mb-0.5">
              <FiUsers /> Club Management
            </span>

            <button
              onClick={() => setClubsOpen(!clubsOpen)}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${pathname.startsWith('/admin/clubs')
                  ? 'bg-slate-50 text-slate-850'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
            >
              <div className="flex items-center gap-3">
                <FiUsers className={`text-base ${pathname.startsWith('/admin/clubs') ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>Clubs</span>
              </div>
              {clubsOpen ? (
                <FiChevronDown className="text-slate-400 text-sm" />
              ) : (
                <FiChevronRight className="text-slate-400 text-sm" />
              )}
            </button>

            {/* Collapsible Sub-links Container */}
            {clubsOpen && (
              <div className="flex flex-col gap-1 pl-4 border-l border-slate-100 ml-5 animate-fade-down duration-200">
                {clubLinks.map((link) => {
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