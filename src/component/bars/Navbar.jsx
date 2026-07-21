'use client';

import React, { useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Context } from '../helper/Context';
import { MdMenu } from 'react-icons/md';
import { SCHOOL_NAME } from '@/lib/secret';

const Navbar = () => {
  const { classes, clubs, sidebar, setSidebar } = useContext(Context);
  const pathname = usePathname();

  const isActive = (path) => pathname === path;
  const isDropdownActive = (prefix) => pathname.startsWith(prefix);
  const isAboutActive = () => pathname.startsWith('/about') || pathname === '/missions';

  const linkStyle = (path) => `px-3 h-10 flex w-full items-center justify-center  transition-all duration-200 cursor-pointer text-xs lg:text-sm font-semibold ${isActive(path)
    ? 'bg-sky-50 text-sky-600 font-bold'
    : 'text-white hover:bg-slate-50 hover:text-slate-900 font-medium'
    }`;
  const dropdownTriggerStyle = (isActiveDropdown) => `px-3 w-full px-3 h-10 flex items-center justify-center  transition-all duration-200 cursor-pointer bg-transparent border-none text-xs lg:text-sm font-semibold p-0 flex items-center gap-0.5 ${isActiveDropdown
    ? 'bg-sky-50 text-sky-600 font-bold'
    : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900 font-medium'
    }`;

  return (
    <nav className="relative w-full bg-sky-900 text-white flex flex-col h-auto items-center justify-center px-4 md:px-8 shadow-xs">

      <section className="w-full flex flex-row items-center justify-between h-14 md:h-16">
        <Link href={'/'} className="w-auto shrink-0 text-lg md:text-xl font-semibold text-white transition-colors tracking-tight">
          {SCHOOL_NAME}
        </Link>

        <section className="hidden md:flex flex-row items-center justify-end gap-5">
          <div className="w-auto flex flex-row items-center justify-center gap-4 text-sm font-semibold">
            <Link href={'/apply'} className={`transition-colors text-white hover:text-amber-100 ${isActive('/apply') ? 'text-amber-200 font-bold' : ''}`}>
              Apply
            </Link>
            <Link href={'/auth/student'} className={`transition-colors text-white hover:text-amber-100 ${isActive('/auth/student') ? 'text-amber-200 font-bold' : ''}`}>
              Student Portal
            </Link>
            <Link href={'/auth/access'} className="text-amber-600 transition-all bg-white hover:shadow-md px-4 py-1.5 rounded-lg font-bold text-xs">
              Login
            </Link>
          </div>
        </section>

        <button
          onClick={() => setSidebar(!sidebar)}
          className="md:hidden text-2xl transition-colors cursor-pointer p-2 rounded-lg text-white hover:bg-slate-100"
          aria-label="Toggle Menu"
        >
          <MdMenu />
        </button>
      </section>

      <section className="w-full hidden md:flex flex-row items-center justify-between gap-1 text-[13px] font-semibold text-white h-10">
        <Link href={'/'} className={linkStyle('/')}>Home</Link>
        <Link href={'/events'} className={linkStyle('/events')}>Events</Link>

        <div className="relative group w-full">
          <Link href={'/authorities'} className={dropdownTriggerStyle(isDropdownActive('/authorities'))}>
            Authorities
          </Link>
          <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col shadow-xl min-w-60 z-50 text-slate-700 bg-white">
            <Link href={'/authorities/principal'} className="px-4 w-full py-2 hover:bg-sky-50/85 hover:text-sky-600 transition-colors text-xs font-semibold text-left">Principal</Link>
            <Link href={'/authorities/chairman'} className="px-4 w-full py-2 hover:bg-sky-50/85 hover:text-sky-600 transition-colors text-xs font-semibold text-left">Chairman</Link>
            <Link href={'/authorities/director'} className="px-4 w-full py-2 hover:bg-sky-50/85 hover:text-sky-600 transition-colors text-xs font-semibold text-left">Director</Link>
            <Link href={'/authorities/council'} className="px-4 w-full py-2 hover:bg-sky-50/85 hover:text-sky-600 transition-colors text-xs font-semibold text-left">Council</Link>
            <Link href={'/authorities/registrar'} className="px-4 w-full py-2 hover:bg-sky-50/85 hover:text-sky-600 transition-colors text-xs font-semibold text-left">Registrar</Link>
            <Link href={'/authorities/staff'} className="px-4 w-full py-2 hover:bg-sky-50/85 hover:text-sky-600 transition-colors text-xs font-semibold text-left">Staff</Link>
            <Link href={'/authorities/officers'} className="px-4 w-full py-2 hover:bg-sky-50/85 hover:text-sky-600 transition-colors text-xs font-semibold text-left">Officers</Link>
          </div>
        </div>

        <div className="relative group w-full">
          <Link href={'/about'} className={dropdownTriggerStyle(isAboutActive())}>
            About
          </Link>
          <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col shadow-xl min-w-60 z-50 text-slate-700 bg-white">
            <Link href={'/about/campus'} className="px-4 py-2 hover:bg-sky-50/85 hover:text-sky-600 transition-colors text-xs font-semibold text-left">My Campus</Link>
            <Link href={'/missions'} className="px-4 py-2 hover:bg-sky-50/85 hover:text-sky-600 transition-colors text-xs font-semibold text-left">Mission</Link>
            <Link href={'/about/vision'} className="px-4 py-2 hover:bg-sky-50/85 hover:text-sky-600 transition-colors text-xs font-semibold text-left">Vision</Link>
            <Link href={'/about/history'} className="px-4 py-2 hover:bg-sky-50/85 hover:text-sky-600 transition-colors text-xs font-semibold text-left">History</Link>
          </div>
        </div>

        <div className="relative group w-full">
          <Link href={'/classes'} className={dropdownTriggerStyle(isDropdownActive('/classes'))}>
            Classes
          </Link>
          <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col shadow-xl min-w-60 z-50 text-slate-700 bg-white">
            {classes && classes.length > 0 ? (
              classes.map((c) => (
                <Link href={`/classes/${c.code || c.id || c}`} key={c.id || c} className="px-4 py-2 hover:bg-sky-50/85 hover:text-sky-600 transition-colors text-xs font-semibold text-left">
                  {c.name || c}
                </Link>
              ))
            ) : (
              <span className="px-4 py-2 text-slate-400 text-xs italic text-left">No classes</span>
            )}
          </div>
        </div>

        <div className="relative group w-full">
          <Link href={'/clubs'} className={dropdownTriggerStyle(isDropdownActive('/clubs'))}>
            Clubs
          </Link>
          <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col shadow-xl min-w-60 z-50 text-slate-700 bg-white">
            {clubs && clubs.length > 0 ? (
              clubs.map((c) => (
                <Link href={`/clubs/${c.slug || c.id || c}`} key={c.id || c} className="px-4 py-2 hover:bg-sky-50/85 hover:text-sky-600 transition-colors text-xs font-semibold text-left">
                  {c.name || c}
                </Link>
              ))
            ) : (
              <span className="px-4 py-2 text-slate-400 text-xs italic text-left">No clubs</span>
            )}
          </div>
        </div>

        <Link href={'/teachers'} className={linkStyle('/teachers')}>Teachers</Link>
        <Link href={'/acheivements'} className={linkStyle('/acheivements')}>Achievements</Link>
        <Link href={'/news'} className={linkStyle('/news')}>News</Link>
        <Link href={'/results'} className={linkStyle('/results')}>Results</Link>
        <Link href={'/notices'} className={linkStyle('/notices')}>Notices</Link>
        <Link href={'/contact'} className={linkStyle('/contact')}>Contact</Link>
      </section>

    </nav>
  );
};

export default Navbar;