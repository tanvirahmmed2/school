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
  const [eventsOpen, setEventsOpen] = useState(pathname.startsWith('/admin/events'));

  const eventLinks = [
    { label: 'All Events', href: '/admin/events', icon: FiCalendar },
    { label: 'Create New Event', href: '/admin/events/new', icon: FiPlus },
    { label: 'Event Participants', href: '/admin/events/participants', icon: FiUsers },
  ];
  const [hostelsOpen, setHostelsOpen] = useState(pathname.startsWith('/admin/hostels'));
  const [staffOpen, setStaffOpen] = useState(pathname.startsWith('/admin/staff'));

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
    { label: 'Monthly Fee Rates', href: '/admin/students/fees/monthly-rates', icon: FiDollarSign },
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
    { label: 'Designations', href: '/admin/authorities/designations', icon: FiAward },
  ];

  const staffLinks = [
    { label: 'New Staff Member', href: '/admin/staff/new', icon: FiUserPlus },
    { label: 'Staff Registry', href: '/admin/staff/list', icon: FiUsers },
    { label: 'Attendance Registry', href: '/admin/staff/attendance', icon: FiCalendar },
    { label: 'Leave Approvals', href: '/admin/staff/leaves', icon: FiCalendar },
    { label: 'Salary Ledger', href: '/admin/staff/salary', icon: FiDollarSign },
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

  const groupHeaderStyle = "text-[10px] font-bold text-emerald-100 uppercase tracking-widest px-3 mb-2 flex items-center gap-1.5 opacity-90 mt-2";

  const CollapsibleGroup = ({ label, icon: CategoryIcon, isOpen, setIsOpen, prefix, links }) => (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
          pathname.startsWith(prefix)
            ? 'bg-emerald-600 text-white font-bold'
            : 'text-white/90 hover:bg-emerald-600 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <CategoryIcon className="text-base text-white" />
          <span>{label}</span>
        </div>
        {isOpen ? (
          <FiChevronDown className="text-white/80 text-sm" />
        ) : (
          <FiChevronRight className="text-white/80 text-sm" />
        )}
      </button>

      {isOpen && (
        <div className="flex flex-col gap-1 pl-4 border-l border-emerald-400/40 ml-5 transition-all duration-300">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setAdminSidebar(false)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'text-white font-bold bg-emerald-600'
                    : 'text-white/80 hover:text-white hover:bg-emerald-600/50'
                }`}
              >
                <Icon className="text-sm text-white" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );

  const NavLinkGroup = ({ links }) => (
    <nav className="flex flex-col gap-1 mb-1">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setAdminSidebar(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 relative ${
              isActive
                ? 'bg-emerald-600 text-white font-bold pl-2.5'
                : 'text-white/90 hover:bg-emerald-600 hover:text-white'
            }`}
          >
            <Icon className="text-base text-white" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );

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
        className={`fixed top-16 left-0 bottom-0 w-64 bg-emerald-500 text-white z-40 flex flex-col justify-between py-6 px-4 transition-transform duration-300 ease-in-out md:translate-x-0 overflow-y-auto ${
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
            <CollapsibleGroup label="Classes" icon={FiLayers} isOpen={classesOpen} setIsOpen={setClassesOpen} prefix="/admin/classes" links={classLinks} />
            <CollapsibleGroup label="Subjects" icon={FiBook} isOpen={subjectsOpen} setIsOpen={setSubjectsOpen} prefix="/admin/subjects" links={subjectLinks} />
            <CollapsibleGroup label="Exams" icon={FiCalendar} isOpen={examsOpen} setIsOpen={setExamsOpen} prefix="/admin/exams" links={examLinks} />
          </div>

          {/* Group 2: Directory Registry */}
          <div className="flex flex-col gap-3">
            <span className={groupHeaderStyle}>
              <FiUsers className="text-xs" /> Directory Registry
            </span>
            <CollapsibleGroup label="Students" icon={FiUsers} isOpen={studentsOpen} setIsOpen={setStudentsOpen} prefix="/admin/students" links={studentLinks} />
            <CollapsibleGroup label="Teachers" icon={FiUsers} isOpen={teachersOpen} setIsOpen={setTeachersOpen} prefix="/admin/teachers" links={teacherLinks} />
            <CollapsibleGroup label="Board Members" icon={FiShield} isOpen={authoritiesOpen} setIsOpen={setAuthoritiesOpen} prefix="/admin/authorities" links={authorityLinks} />
            <CollapsibleGroup label="Staff Members" icon={FiUsers} isOpen={staffOpen} setIsOpen={setStaffOpen} prefix="/admin/staff" links={staffLinks} />
          </div>

          {/* Group 3: Finance & Logistics */}
          <div className="flex flex-col gap-3">
            <span className={groupHeaderStyle}>
              <FiDollarSign className="text-xs" /> Finance & Logistics
            </span>
            <NavLinkGroup links={financeLogisticsLinks} />
            <CollapsibleGroup label="Hostels" icon={FiHome} isOpen={hostelsOpen} setIsOpen={setHostelsOpen} prefix="/admin/hostels" links={hostelLinks} />
          </div>

          {/* Group 4: Campus & Co-curricular */}
          <div className="flex flex-col gap-3">
            <span className={groupHeaderStyle}>
              <FiUsers className="text-xs" /> Campus & Co-curricular
            </span>
            <CollapsibleGroup label="Clubs" icon={FiUsers} isOpen={clubsOpen} setIsOpen={setClubsOpen} prefix="/admin/clubs" links={clubLinks} />
            <CollapsibleGroup label="Campus News" icon={FiFileText} isOpen={newsOpen} setIsOpen={setNewsOpen} prefix="/admin/news" links={newsLinks} />
            <CollapsibleGroup label="Achievements" icon={FiAward} isOpen={achievementsOpen} setIsOpen={setAchievementsOpen} prefix="/admin/acheivement" links={achievementLinks} />
            <CollapsibleGroup label="Recognitions" icon={FiAward} isOpen={recognitionsOpen} setIsOpen={setRecognitionsOpen} prefix="/admin/recognition" links={recognitionLinks} />
            <CollapsibleGroup label="Events & Seminars" icon={FiCalendar} isOpen={eventsOpen} setIsOpen={setEventsOpen} prefix="/admin/events" links={eventLinks} />
          </div>

          {/* Group 5: System Gateway */}
          <div className="flex flex-col gap-3">
            <span className={groupHeaderStyle}>
              <FiCpu className="text-xs" /> System Gateway
            </span>
            <NavLinkGroup links={systemLinks} />
          </div>

        </div>

        <div className="mt-8">
          <Link
            href="/"
            onClick={() => setAdminSidebar(false)}
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