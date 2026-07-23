'use client';

import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Context } from '../helper/Context';
import { FiX, FiChevronDown, FiHome, FiInfo, FiBookOpen, FiGrid, FiMail, FiLogIn, FiArrowRight, FiCalendar } from 'react-icons/fi';
import { MdOutlineAnnouncement } from 'react-icons/md';
import { SCHOOL_NAME } from '@/lib/secret';

const Sidebar = () => {
  const { sidebar, setSidebar, classes, clubs } = useContext(Context);
  const pathname = usePathname();

  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const closeSidebar = () => setSidebar(false);

  const isActive = (path) => pathname === path;

  return (
    <>
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity duration-300 md:hidden ${
          sidebar ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      />

      <aside
        className={`fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-emerald-500 text-white z-50 flex flex-col justify-between py-6 px-4 shadow-2xl transition-transform duration-300 ease-in-out md:hidden overflow-y-auto ${
          sidebar ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-emerald-400/40">
            <Link href="/" onClick={closeSidebar} className="flex items-center gap-2 group">
              <div className="flex flex-col">
                <span className="font-semibold text-white text-base leading-tight">
                  {SCHOOL_NAME}
                </span>
              </div>
            </Link>
            <button
              onClick={closeSidebar}
              className="p-1.5 rounded-lg text-white hover:bg-emerald-600 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          <nav className="flex flex-col gap-1.5">
            <Link
              href="/"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive('/')
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-white/90 hover:bg-emerald-600 hover:text-white'
              }`}
            >
              <FiHome className="text-base text-white" />
              <span>Home</span>
            </Link>

            {/* Events */}
            <Link
              href="/events"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive('/events')
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-white/90 hover:bg-emerald-600 hover:text-white'
              }`}
            >
              <FiCalendar className="text-base text-white" />
              <span>Events</span>
            </Link>

            {/* Notices */}
            <Link
              href="/notices"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive('/notices')
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-white/90 hover:bg-emerald-600 hover:text-white'
              }`}
            >
              <MdOutlineAnnouncement className="text-base text-white" />
              <span>Notices</span>
            </Link>

            {/* Accordion 1: About */}
            <div className="flex flex-col">
              <button
                onClick={() => toggleSection('about')}
                className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  openSection === 'about'
                    ? 'bg-emerald-600 text-white'
                    : 'text-white/90 hover:bg-emerald-600 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiInfo className="text-base text-white" />
                  <span>About FIT</span>
                </div>
                <FiChevronDown
                  className={`text-xs text-white transition-transform duration-200 ${
                    openSection === 'about' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSection === 'about' && (
                <div className="pl-11 pr-4 py-1 flex flex-col gap-2 border-l-2 border-emerald-400/40 ml-6 mt-1">
                  <Link href="/about" onClick={closeSidebar} className="text-xs text-white/90 hover:bg-emerald-600/50 hover:text-white py-1 px-2 rounded transition-colors">
                    About Overview
                  </Link>
                  <Link href="/about/mission-vission" onClick={closeSidebar} className="text-xs text-white/90 hover:bg-emerald-600/50 hover:text-white py-1 px-2 rounded transition-colors">
                    Mission & Vision
                  </Link>
                  <Link href="/about/campus-details" onClick={closeSidebar} className="text-xs text-white/90 hover:bg-emerald-600/50 hover:text-white py-1 px-2 rounded transition-colors">
                    Campus Details
                  </Link>
                </div>
              )}
            </div>

            {/* Administration */}
            <Link
              href="/administration"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive('/administration')
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-white/90 hover:bg-emerald-600 hover:text-white'
              }`}
            >
              <FiBookOpen className="text-base text-white" />
              <span>Administration</span>
            </Link>

            {/* Programs */}
            <Link
              href="/programs"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive('/programs')
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-white/90 hover:bg-emerald-600 hover:text-white'
              }`}
            >
              <FiGrid className="text-base text-white" />
              <span>Programs</span>
            </Link>

            {/* Accordion 2: Classes */}
            <div className="flex flex-col">
              <button
                onClick={() => toggleSection('classes')}
                className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  openSection === 'classes'
                    ? 'bg-emerald-600 text-white'
                    : 'text-white/90 hover:bg-emerald-600 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiBookOpen className="text-base text-white" />
                  <span>Classes</span>
                </div>
                <FiChevronDown
                  className={`text-xs text-white transition-transform duration-200 ${
                    openSection === 'classes' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSection === 'classes' && (
                <div className="pl-11 pr-4 py-1 flex flex-col gap-2 border-l-2 border-emerald-400/40 ml-6 mt-1 max-h-48 overflow-y-auto">
                  {classes && classes.length > 0 ? (
                    classes.map((c) => (
                      <Link
                        key={c.id || c.code}
                        href={`/classes/${c.code || c.id}`}
                        onClick={closeSidebar}
                        className="text-xs text-white/90 hover:bg-emerald-600/50 hover:text-white py-1 px-2 rounded transition-colors"
                      >
                        {c.name}
                      </Link>
                    ))
                  ) : (
                    <span className="text-xs text-white/70 italic py-1 px-2">No classes available</span>
                  )}
                </div>
              )}
            </div>

            {/* Accordion 3: Facilities */}
            <div className="flex flex-col">
              <button
                onClick={() => toggleSection('facilities')}
                className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  openSection === 'facilities'
                    ? 'bg-emerald-600 text-white'
                    : 'text-white/90 hover:bg-emerald-600 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiGrid className="text-base text-white" />
                  <span>Facilities</span>
                </div>
                <FiChevronDown
                  className={`text-xs text-white transition-transform duration-200 ${
                    openSection === 'facilities' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSection === 'facilities' && (
                <div className="pl-11 pr-4 py-1 flex flex-col gap-2 border-l-2 border-emerald-400/40 ml-6 mt-1">
                  <Link href="/facilities" onClick={closeSidebar} className="text-xs text-white/90 hover:bg-emerald-600/50 hover:text-white py-1 px-2 rounded transition-colors">
                    Facilities Overview
                  </Link>
                  <Link href="/facilities/classrooms" onClick={closeSidebar} className="text-xs text-white/90 hover:bg-emerald-600/50 hover:text-white py-1 px-2 rounded transition-colors">
                    Classrooms
                  </Link>
                  <Link href="/facilities/hostels" onClick={closeSidebar} className="text-xs text-white/90 hover:bg-emerald-600/50 hover:text-white py-1 px-2 rounded transition-colors">
                    Hostels
                  </Link>
                </div>
              )}
            </div>

            {/* Accordion 4: Clubs */}
            <div className="flex flex-col">
              <button
                onClick={() => toggleSection('clubs')}
                className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  openSection === 'clubs'
                    ? 'bg-emerald-600 text-white'
                    : 'text-white/90 hover:bg-emerald-600 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiInfo className="text-base text-white" />
                  <span>Clubs</span>
                </div>
                <FiChevronDown
                  className={`text-xs text-white transition-transform duration-200 ${
                    openSection === 'clubs' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSection === 'clubs' && (
                <div className="pl-11 pr-4 py-1 flex flex-col gap-2 border-l-2 border-emerald-400/40 ml-6 mt-1 max-h-48 overflow-y-auto">
                  {clubs && clubs.length > 0 ? (
                    clubs.map((c) => (
                      <Link
                        key={c.id || c.slug}
                        href={`/clubs/${c.slug || c.id}`}
                        onClick={closeSidebar}
                        className="text-xs text-white/90 hover:bg-emerald-600/50 hover:text-white py-1 px-2 rounded transition-colors"
                      >
                        {c.name}
                      </Link>
                    ))
                  ) : (
                    <span className="text-xs text-white/70 italic py-1 px-2">No clubs available</span>
                  )}
                </div>
              )}
            </div>

            {/* News */}
            <Link
              href="/news"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive('/news')
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-white/90 hover:bg-emerald-600 hover:text-white'
              }`}
            >
              <FiInfo className="text-base text-white" />
              <span>News Hub</span>
            </Link>

            {/* Staff */}
            <Link
              href="/staffs"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive('/staffs')
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-white/90 hover:bg-emerald-600 hover:text-white'
              }`}
            >
              <FiBookOpen className="text-base text-white" />
              <span>Staff Directory</span>
            </Link>

            {/* Result */}
            <Link
              href="/result"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive('/result')
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-white/90 hover:bg-emerald-600 hover:text-white'
              }`}
            >
              <FiGrid className="text-base text-white" />
              <span>Result Portal</span>
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive('/contact')
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-white/90 hover:bg-emerald-600 hover:text-white'
              }`}
            >
              <FiMail className="text-base text-white" />
              <span>Contact Us</span>
            </Link>
          </nav>
        </div>

        {/* Footer Actions inside Drawer */}
        <div className="flex flex-col gap-2 mt-auto pt-6 border-t border-emerald-400/40">
          <Link
            href="/auth/student"
            onClick={closeSidebar}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-white/30 text-white hover:bg-emerald-600 font-bold text-sm transition-colors"
          >
            <span>Student Portal</span>
          </Link>
          <Link
            href="/auth/access"
            onClick={closeSidebar}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-white/15 hover:bg-emerald-600 text-white font-bold text-sm transition-colors"
          >
            <FiLogIn />
            <span>Login</span>
          </Link>
          <Link
            href="/auth/student/registration"
            onClick={closeSidebar}
            className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-xl bg-white text-emerald-600 hover:bg-emerald-50 font-bold text-sm shadow-md transition-all"
          >
            <span>Apply Now</span>
            <FiArrowRight />
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;