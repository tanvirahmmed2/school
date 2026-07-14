'use client';

import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome, FiShield, FiLayers, FiGrid, FiBook,
  FiUserPlus, FiUsers, FiAward, FiCalendar, FiDollarSign, FiFileText,
  FiChevronDown, FiChevronRight, FiClock, FiPlus, FiCpu, FiBell,
  FiSettings, FiShoppingBag
} from 'react-icons/fi';
import { Context } from '@/component/helper/Context';
import Back from '@/component/button/Back';

const Sidebar = () => {
  const pathname = usePathname();
  const { adminSidebar, setAdminSidebar } = useContext(Context);

  // Dynamic collapsible state
  const [classesOpen, setClassesOpen] = useState(pathname.startsWith('/admin/classes'));
  const [subjectsOpen, setSubjectsOpen] = useState(pathname.startsWith('/admin/subjects'));
  const [teachersOpen, setTeachersOpen] = useState(pathname.startsWith('/admin/teachers'));
  const [authoritiesOpen, setAuthoritiesOpen] = useState(pathname.startsWith('/admin/authorities'));
  const [examsOpen, setExamsOpen] = useState(pathname.startsWith('/admin/exams'));
  const [studentsOpen, setStudentsOpen] = useState(pathname.startsWith('/admin/students'));
  const [clubsOpen, setClubsOpen] = useState(pathname.startsWith('/admin/clubs'));
  const [newsOpen, setNewsOpen] = useState(pathname.startsWith('/admin/news'));
  const [achievementsOpen, setAchievementsOpen] = useState(pathname.startsWith('/admin/acheivement'));
  const [recognitionsOpen, setRecognitionsOpen] = useState(pathname.startsWith('/admin/recognition'));
  const [collaborationsOpen, setCollaborationsOpen] = useState(pathname.startsWith('/admin/collaborations'));
  const [hostelsOpen, setHostelsOpen] = useState(pathname.startsWith('/admin/hostels'));

  const systemLinks = [
    { label: 'Dashboard Overview', href: '/admin', icon: FiHome },
    { label: 'Website Settings', href: '/admin/settings', icon: FiSettings },
    { label: 'Access Control', href: '/admin/access', icon: FiShield },
    { label: 'Security Audit', href: '/admin/security', icon: FiShield },
    { label: 'Website Announcement', href: '/admin/announcements', icon: FiBell },
  ];

  const financeLogisticsLinks = [
    { label: 'General Finance', href: '/admin/finance', icon: FiDollarSign },
    { label: 'Inventory Assets', href: '/admin/inventory', icon: FiShoppingBag },
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
    { label: 'Intake Applications', href: '/admin/students/admissions', icon: FiUserPlus },
    { label: 'Admission Circulars', href: '/admin/students/admissions/circulars', icon: FiLayers },
    { label: 'Student Leaves', href: '/admin/students/leaves', icon: FiCalendar },
    { label: 'Attendance Registry', href: '/admin/students/attendance', icon: FiCalendar },
    { label: 'Fees & Ledgers', href: '/admin/students/fees', icon: FiDollarSign },
    { label: 'Enter Marks', href: '/admin/students/marks', icon: FiBook },
    { label: 'Publish Results', href: '/admin/students/results', icon: FiAward },
    { label: 'Transcripts Card', href: '/admin/students/transcripts', icon: FiFileText },
  ];

  const clubLinks = [
    { label: 'Register Club', href: '/admin/clubs/new', icon: FiPlus },
    { label: 'Assign Roles', href: '/admin/clubs/assign', icon: FiUsers },
    { label: 'Club Announcements', href: '/admin/club-news/list', icon: FiFileText },
    { label: 'Publish Club News', href: '/admin/club-news/new', icon: FiPlus },
  ];

  const newsLinks = [
    { label: 'News Articles', href: '/admin/news/list', icon: FiFileText },
    { label: 'Publish News', href: '/admin/news/new', icon: FiPlus },
  ];

  const achievementLinks = [
    { label: 'Recorded Achievements', href: '/admin/acheivement/list', icon: FiAward },
    { label: 'Add Achievement', href: '/admin/acheivement/new', icon: FiPlus },
  ];

  const recognitionLinks = [
    { label: 'All Recognitions', href: '/admin/recognition/list', icon: FiAward },
    { label: 'Add Recognition', href: '/admin/recognition/new', icon: FiPlus },
  ];

  const collaborationLinks = [
    { label: 'All Collaborations', href: '/admin/collaborations/list', icon: FiUsers },
    { label: 'Add Collaboration', href: '/admin/collaborations/new', icon: FiPlus },
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
    { label: 'New Exam Routine', href: '/admin/exams/new', icon: FiPlus },
    { label: 'Current Exams', href: '/admin/exams/current', icon: FiCalendar },
    { label: 'Upcoming Exams', href: '/admin/exams/upcoming', icon: FiCalendar },
    { label: 'Previous Exams', href: '/admin/exams/previous', icon: FiFileText },
    { label: 'Grade Scale Setup', href: '/admin/exams/grades', icon: FiAward },
  ];

  const hostelLinks = [
    { label: 'Hostels & Provosts', href: '/admin/hostels', icon: FiHome },
    { label: 'Room Directory', href: '/admin/hostels/rooms', icon: FiGrid },
    { label: 'Student Allocations', href: '/admin/hostels/allocations', icon: FiUsers },
    { label: 'Hostel Fees', href: '/admin/hostels/fees', icon: FiDollarSign },
  ];

  const groupHeaderStyle = "text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2 flex items-center gap-1.5 opacity-80 mt-2";

  return (
    <>
      {/* Backdrop for mobile view */}
      {adminSidebar && (
        <div
          className="fixed inset-0 top-16 bg-slate-950/20 backdrop-blur-xs z-30 md:hidden transition-opacity duration-200"
          onClick={() => setAdminSidebar(false)}
        />
      )}

      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-100 z-40 flex flex-col justify-between py-6 px-4 transition-transform duration-300 ease-in-out md:translate-x-0 overflow-y-auto ${
          adminSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-4">
          <Back/>

          {/* Group 1: Academics Setup */}
          <div className="flex flex-col gap-3">
            <span className={groupHeaderStyle}>
              <FiLayers className="text-xs" /> Academics Setup
            </span>

            {/* Collapsible: Classes */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setClassesOpen(!classesOpen)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  pathname.startsWith('/admin/classes')
                    ? 'bg-slate-50/80 text-slate-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiLayers className={`text-base ${pathname.startsWith('/admin/classes') ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>Classes</span>
                </div>
                {classesOpen ? (
                  <FiChevronDown className="text-slate-400 text-sm" />
                ) : (
                  <FiChevronRight className="text-slate-400 text-sm" />
                )}
              </button>

              {classesOpen && (
                <div className="flex flex-col gap-1 pl-4 border-l border-slate-100 ml-5 transition-all duration-300">
                  {classLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setAdminSidebar(false)}
                        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? 'text-sky-600 font-bold bg-sky-50/50'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/60'
                        }`}
                      >
                        <Icon className={`text-sm ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Collapsible: Subjects */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setSubjectsOpen(!subjectsOpen)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  pathname.startsWith('/admin/subjects')
                    ? 'bg-slate-50/80 text-slate-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiBook className={`text-base ${pathname.startsWith('/admin/subjects') ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>Subjects</span>
                </div>
                {subjectsOpen ? (
                  <FiChevronDown className="text-slate-400 text-sm" />
                ) : (
                  <FiChevronRight className="text-slate-400 text-sm" />
                )}
              </button>

              {subjectsOpen && (
                <div className="flex flex-col gap-1 pl-4 border-l border-slate-100 ml-5 transition-all duration-300">
                  {subjectLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setAdminSidebar(false)}
                        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? 'text-sky-600 font-bold bg-sky-50/50'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/60'
                        }`}
                      >
                        <Icon className={`text-sm ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Collapsible: Exams */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setExamsOpen(!examsOpen)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  pathname.startsWith('/admin/exams')
                    ? 'bg-slate-50/80 text-slate-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiCalendar className={`text-base ${pathname.startsWith('/admin/exams') ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>Exams</span>
                </div>
                {examsOpen ? (
                  <FiChevronDown className="text-slate-400 text-sm" />
                ) : (
                  <FiChevronRight className="text-slate-400 text-sm" />
                )}
              </button>

              {examsOpen && (
                <div className="flex flex-col gap-1 pl-4 border-l border-slate-100 ml-5 transition-all duration-300">
                  {examLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setAdminSidebar(false)}
                        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? 'text-sky-600 font-bold bg-sky-50/50'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/60'
                        }`}
                      >
                        <Icon className={`text-sm ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Group 2: Directory Registry */}
          <div className="flex flex-col gap-3">
            <span className={groupHeaderStyle}>
              <FiUsers className="text-xs" /> Directory Registry
            </span>

            {/* Collapsible: Students */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setStudentsOpen(!studentsOpen)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  pathname.startsWith('/admin/students')
                    ? 'bg-slate-50/80 text-slate-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiUsers className={`text-base ${pathname.startsWith('/admin/students') ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>Students</span>
                </div>
                {studentsOpen ? (
                  <FiChevronDown className="text-slate-400 text-sm" />
                ) : (
                  <FiChevronRight className="text-slate-400 text-sm" />
                )}
              </button>

              {studentsOpen && (
                <div className="flex flex-col gap-1 pl-4 border-l border-slate-100 ml-5 transition-all duration-300">
                  {studentLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setAdminSidebar(false)}
                        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? 'text-sky-600 font-bold bg-sky-50/50'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/60'
                        }`}
                      >
                        <Icon className={`text-sm ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Collapsible: Teachers */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setTeachersOpen(!teachersOpen)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  pathname.startsWith('/admin/teachers')
                    ? 'bg-slate-50/80 text-slate-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiUsers className={`text-base ${pathname.startsWith('/admin/teachers') ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>Teachers</span>
                </div>
                {teachersOpen ? (
                  <FiChevronDown className="text-slate-400 text-sm" />
                ) : (
                  <FiChevronRight className="text-slate-400 text-sm" />
                )}
              </button>

              {teachersOpen && (
                <div className="flex flex-col gap-1 pl-4 border-l border-slate-100 ml-5 transition-all duration-300">
                  {teacherLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setAdminSidebar(false)}
                        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? 'text-sky-600 font-bold bg-sky-50/50'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/60'
                        }`}
                      >
                        <Icon className={`text-sm ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Collapsible: Board Members */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setAuthoritiesOpen(!authoritiesOpen)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  pathname.startsWith('/admin/authorities')
                    ? 'bg-slate-50/80 text-slate-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiShield className={`text-base ${pathname.startsWith('/admin/authorities') ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>Board Members</span>
                </div>
                {authoritiesOpen ? (
                  <FiChevronDown className="text-slate-400 text-sm" />
                ) : (
                  <FiChevronRight className="text-slate-400 text-sm" />
                )}
              </button>

              {authoritiesOpen && (
                <div className="flex flex-col gap-1 pl-4 border-l border-slate-100 ml-5 transition-all duration-300">
                  {authorityLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setAdminSidebar(false)}
                        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? 'text-sky-600 font-bold bg-sky-50/50'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/60'
                        }`}
                      >
                        <Icon className={`text-sm ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Group 3: Finance & Logistics */}
          <div className="flex flex-col gap-3">
            <span className={groupHeaderStyle}>
              <FiDollarSign className="text-xs" /> Finance & Logistics
            </span>
            <nav className="flex flex-col gap-1 mb-1">
              {financeLogisticsLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setAdminSidebar(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 relative ${
                      isActive
                        ? 'bg-sky-50/80 text-sky-650 shadow-xs border-l-2 border-sky-600 pl-2.5'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <Icon className={`text-base ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Collapsible: Hostels */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setHostelsOpen(!hostelsOpen)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  pathname.startsWith('/admin/hostels')
                    ? 'bg-slate-50/80 text-slate-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiHome className={`text-base ${pathname.startsWith('/admin/hostels') ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>Hostels</span>
                </div>
                {hostelsOpen ? (
                  <FiChevronDown className="text-slate-400 text-sm" />
                ) : (
                  <FiChevronRight className="text-slate-400 text-sm" />
                )}
              </button>

              {hostelsOpen && (
                <div className="flex flex-col gap-1 pl-4 border-l border-slate-100 ml-5 transition-all duration-300">
                  {hostelLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setAdminSidebar(false)}
                        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? 'text-sky-600 font-bold bg-sky-50/50'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/60'
                        }`}
                      >
                        <Icon className={`text-sm ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Group 4: Campus & Co-curricular */}
          <div className="flex flex-col gap-3">
            <span className={groupHeaderStyle}>
              <FiUsers className="text-xs" /> Campus & Co-curricular
            </span>

            {/* Collapsible: Clubs */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setClubsOpen(!clubsOpen)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  pathname.startsWith('/admin/clubs')
                    ? 'bg-slate-50/80 text-slate-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiUsers className={`text-base ${pathname.startsWith('/admin/clubs') ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>Clubs</span>
                </div>
                {clubsOpen ? (
                  <FiChevronDown className="text-slate-400 text-sm" />
                ) : (
                  <FiChevronRight className="text-slate-400 text-sm" />
                )}
              </button>

              {clubsOpen && (
                <div className="flex flex-col gap-1 pl-4 border-l border-slate-100 ml-5 transition-all duration-300">
                  {clubLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setAdminSidebar(false)}
                        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? 'text-sky-600 font-bold bg-sky-50/50'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/60'
                        }`}
                      >
                        <Icon className={`text-sm ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Collapsible: News */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setNewsOpen(!newsOpen)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  pathname.startsWith('/admin/news')
                    ? 'bg-slate-50/80 text-slate-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiFileText className={`text-base ${pathname.startsWith('/admin/news') ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>Campus News</span>
                </div>
                {newsOpen ? (
                  <FiChevronDown className="text-slate-400 text-sm" />
                ) : (
                  <FiChevronRight className="text-slate-400 text-sm" />
                )}
              </button>

              {newsOpen && (
                <div className="flex flex-col gap-1 pl-4 border-l border-slate-100 ml-5 transition-all duration-300">
                  {newsLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setAdminSidebar(false)}
                        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? 'text-sky-600 font-bold bg-sky-50/50'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-sky-50/60'
                        }`}
                      >
                        <Icon className={`text-sm ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Collapsible: Achievements */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setAchievementsOpen(!achievementsOpen)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  pathname.startsWith('/admin/acheivement')
                    ? 'bg-slate-50/80 text-slate-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiAward className={`text-base ${pathname.startsWith('/admin/acheivement') ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>Achievements</span>
                </div>
                {achievementsOpen ? (
                  <FiChevronDown className="text-slate-400 text-sm" />
                ) : (
                  <FiChevronRight className="text-slate-400 text-sm" />
                )}
              </button>

              {achievementsOpen && (
                <div className="flex flex-col gap-1 pl-4 border-l border-slate-100 ml-5 transition-all duration-300">
                  {achievementLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setAdminSidebar(false)}
                        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? 'text-sky-600 font-bold bg-sky-50/50'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/60'
                        }`}
                      >
                        <Icon className={`text-sm ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Collapsible: Recognitions */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setRecognitionsOpen(!recognitionsOpen)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  pathname.startsWith('/admin/recognition')
                    ? 'bg-slate-50/80 text-slate-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiAward className={`text-base ${pathname.startsWith('/admin/recognition') ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>Recognitions</span>
                </div>
                {recognitionsOpen ? (
                  <FiChevronDown className="text-slate-400 text-sm" />
                ) : (
                  <FiChevronRight className="text-slate-400 text-sm" />
                )}
              </button>

              {recognitionsOpen && (
                <div className="flex flex-col gap-1 pl-4 border-l border-slate-100 ml-5 transition-all duration-300">
                  {recognitionLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setAdminSidebar(false)}
                        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? 'text-sky-600 font-bold bg-sky-50/50'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/60'
                        }`}
                      >
                        <Icon className={`text-sm ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Collapsible: Collaborations */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setCollaborationsOpen(!collaborationsOpen)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  pathname.startsWith('/admin/collaborations')
                    ? 'bg-slate-50/80 text-slate-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiUsers className={`text-base ${pathname.startsWith('/admin/collaborations') ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>Collaborations</span>
                </div>
                {collaborationsOpen ? (
                  <FiChevronDown className="text-slate-400 text-sm" />
                ) : (
                  <FiChevronRight className="text-slate-400 text-sm" />
                )}
              </button>

              {collaborationsOpen && (
                <div className="flex flex-col gap-1 pl-4 border-l border-slate-100 ml-5 transition-all duration-300">
                  {collaborationLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setAdminSidebar(false)}
                        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? 'text-sky-600 font-bold bg-sky-50/50'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-sky-50/60'
                        }`}
                      >
                        <Icon className={`text-sm ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Group 5: System Gateway (placed at the bottom!) */}
          <div className="flex flex-col gap-3">
            <span className={groupHeaderStyle}>
              <FiCpu className="text-xs" /> System Gateway
            </span>
            <nav className="flex flex-col gap-1 mb-2">
              {systemLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setAdminSidebar(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 relative ${
                      isActive
                        ? 'bg-sky-50/80 text-sky-650 shadow-xs border-l-2 border-sky-600 pl-2.5'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <Icon className={`text-base ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

        </div>

        <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-2xl text-center mt-8">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
            System Status
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Online
          </span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;