'use client';

import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Context } from '../helper/Context';
import { FiX, FiChevronDown, FiHome, FiInfo, FiBookOpen, FiGrid, FiMail, FiLogIn, FiArrowRight } from 'react-icons/fi';
import { MdOutlineAnnouncement } from 'react-icons/md';

const Sidebar = () => {
  const { sidebar, setSidebar, classes, clubs } = useContext(Context);
  const pathname = usePathname();

  // Accordion active state
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const closeSidebar = () => setSidebar(false);

  // Helper to determine link styling
  const isActive = (path) => pathname === path;

  return (
    <>
      {/* 1. Backdrop Overlay (Fades In/Out) */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity duration-300 md:hidden ${
          sidebar ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      />

      {/* 2. Side Panel Drawer (Slides In/Out from Right) */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 flex flex-col justify-between py-6 px-4 shadow-2xl transition-transform duration-300 ease-in-out md:hidden overflow-y-auto ${
          sidebar ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* Header with Brand & Close Button */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <Link href="/" onClick={closeSidebar} className="flex items-center gap-2 group">
              
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-800 text-sm leading-tight">
                  Fontana
                </span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                  FIT Portal
                </span>
              </div>
            </Link>
            <button
              onClick={closeSidebar}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {/* Home */}
            <Link
              href="/"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive('/')
                  ? 'bg-sky-50 text-sky-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <FiHome className="text-base" />
              <span>Home</span>
            </Link>

            {/* Notices */}
            <Link
              href="/notices"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive('/notices')
                  ? 'bg-sky-50 text-sky-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <MdOutlineAnnouncement className="text-base" />
              <span>Notices</span>
            </Link>

            {/* Accordion 1: About */}
            <div className="flex flex-col">
              <button
                onClick={() => toggleSection('about')}
                className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  openSection === 'about'
                    ? 'bg-slate-50 text-slate-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiInfo className="text-base" />
                  <span>About FIT</span>
                </div>
                <FiChevronDown
                  className={`text-xs transition-transform duration-200 ${
                    openSection === 'about' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSection === 'about' && (
                <div className="pl-11 pr-4 py-1 flex flex-col gap-2 border-l-2 border-slate-100 ml-6 mt-1">
                  <Link href="/about" onClick={closeSidebar} className="text-xs text-slate-500 hover:text-sky-600 py-1 transition-colors">
                    About Overview
                  </Link>
                  <Link href="/about/mission-vission" onClick={closeSidebar} className="text-xs text-slate-500 hover:text-sky-600 py-1 transition-colors">
                    Mission & Vision
                  </Link>
                  <Link href="/about/campus-details" onClick={closeSidebar} className="text-xs text-slate-500 hover:text-sky-600 py-1 transition-colors">
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
                  ? 'bg-sky-50 text-sky-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <FiBookOpen className="text-base" />
              <span>Administration</span>
            </Link>

            {/* Programs */}
            <Link
              href="/programs"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive('/programs')
                  ? 'bg-sky-50 text-sky-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <FiGrid className="text-base" />
              <span>Programs</span>
            </Link>

            {/* Accordion 2: Classes */}
            <div className="flex flex-col">
              <button
                onClick={() => toggleSection('classes')}
                className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  openSection === 'classes'
                    ? 'bg-slate-50 text-slate-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiBookOpen className="text-base" />
                  <span>Classes</span>
                </div>
                <FiChevronDown
                  className={`text-xs transition-transform duration-200 ${
                    openSection === 'classes' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSection === 'classes' && (
                <div className="pl-11 pr-4 py-1 flex flex-col gap-2 border-l-2 border-slate-100 ml-6 mt-1 max-h-48 overflow-y-auto">
                  {classes && classes.length > 0 ? (
                    classes.map((c) => (
                      <Link
                        key={c.id || c.code}
                        href={`/classes/${c.code || c.id}`}
                        onClick={closeSidebar}
                        className="text-xs text-slate-500 hover:text-sky-600 py-1 transition-colors"
                      >
                        {c.name}
                      </Link>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic py-1">No classes available</span>
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
                    ? 'bg-slate-50 text-slate-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiGrid className="text-base" />
                  <span>Facilities</span>
                </div>
                <FiChevronDown
                  className={`text-xs transition-transform duration-200 ${
                    openSection === 'facilities' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSection === 'facilities' && (
                <div className="pl-11 pr-4 py-1 flex flex-col gap-2 border-l-2 border-slate-100 ml-6 mt-1">
                  <Link href="/facilities" onClick={closeSidebar} className="text-xs text-slate-500 hover:text-sky-600 py-1 transition-colors">
                    Facilities Overview
                  </Link>
                  <Link href="/facilities/classrooms" onClick={closeSidebar} className="text-xs text-slate-500 hover:text-sky-600 py-1 transition-colors">
                    Classrooms
                  </Link>
                  <Link href="/facilities/hostels" onClick={closeSidebar} className="text-xs text-slate-500 hover:text-sky-600 py-1 transition-colors">
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
                    ? 'bg-slate-50 text-slate-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiInfo className="text-base" />
                  <span>Clubs</span>
                </div>
                <FiChevronDown
                  className={`text-xs transition-transform duration-200 ${
                    openSection === 'clubs' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSection === 'clubs' && (
                <div className="pl-11 pr-4 py-1 flex flex-col gap-2 border-l-2 border-slate-100 ml-6 mt-1 max-h-48 overflow-y-auto">
                  {clubs && clubs.length > 0 ? (
                    clubs.map((c) => (
                      <Link
                        key={c.id || c.slug}
                        href={`/clubs/${c.slug || c.id}`}
                        onClick={closeSidebar}
                        className="text-xs text-slate-500 hover:text-sky-600 py-1 transition-colors"
                      >
                        {c.name}
                      </Link>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic py-1">No clubs available</span>
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
                  ? 'bg-sky-50 text-sky-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <FiInfo className="text-base" />
              <span>News Hub</span>
            </Link>

            {/* Result */}
            <Link
              href="/result"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive('/result')
                  ? 'bg-sky-50 text-sky-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <FiGrid className="text-base" />
              <span>Result Portal</span>
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive('/contact')
                  ? 'bg-sky-50 text-sky-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <FiMail className="text-base" />
              <span>Contact Us</span>
            </Link>
          </nav>
        </div>

        {/* Footer Actions inside Drawer */}
        <div className="flex flex-col gap-2 mt-auto pt-6 border-t border-slate-100">
          <Link
            href="/auth"
            onClick={closeSidebar}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm transition-colors"
          >
            <FiLogIn />
            <span>Portal Login</span>
          </Link>
          <Link
            href="/auth/student/registration"
            onClick={closeSidebar}
            className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-sm shadow-md shadow-sky-50 hover:shadow-lg transition-all"
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