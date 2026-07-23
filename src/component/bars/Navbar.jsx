'use client';

import React, { useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Context } from '../helper/Context';
import { MdMenu } from 'react-icons/md';
import { SCHOOL_NAME } from '@/lib/secret';

const Navbar = () => {
  const { classes, clubs, designations, sidebar, setSidebar } = useContext(Context);
  const pathname = usePathname();

  const linkStyle = () => `px-3 h-10 flex w-full items-center justify-center transition-all duration-200 cursor-pointer text-xs lg:text-sm font-semibold text-white  hover:text-white rounded-lg`;
  const dropdownTriggerStyle = () => `px-3 w-full h-10 flex items-center justify-center transition-all duration-200 cursor-pointer bg-transparent border-none text-xs lg:text-sm font-semibold p-0 flex items-center gap-0.5 text-white  hover:text-white rounded-lg`;

  return (
    <nav className="relative w-full bg-emerald-500 text-white flex flex-col h-auto items-center justify-center px-4 md:px-8 shadow-xs">

      <section className="w-full flex flex-row items-center justify-between h-14 md:h-16">
        <Link href={'/'} className="w-auto shrink-0 text-lg md:text-xl font-semibold text-white transition-colors tracking-tight">
          {SCHOOL_NAME}
        </Link>

        <section className="hidden md:flex flex-row items-center justify-end gap-5">
          <div className="w-auto flex flex-row items-center justify-center gap-4 text-sm font-semibold">
            <Link href={'/apply'} className="transition-colors text-white hover:text-emerald-100">
              Apply
            </Link>
            <Link href={'/auth/student'} className="transition-colors text-white hover:text-emerald-100">
              Student Portal
            </Link>
            <Link href={'/auth/access'} className="text-emerald-600 transition-all bg-white hover:bg-emerald-50 hover:shadow-md px-4 py-1.5 rounded-lg font-bold text-xs">
              Login
            </Link>
          </div>
        </section>

        <button
          onClick={() => setSidebar(!sidebar)}
          className="md:hidden text-2xl transition-colors cursor-pointer p-2 rounded-lg text-white "
          aria-label="Toggle Menu"
        >
          <MdMenu />
        </button>
      </section>

      <section className="w-full hidden md:flex flex-row items-center justify-between gap-1 text-[13px] font-semibold text-white h-10">
        <Link href={'/'} className={linkStyle()}>Home</Link>
        <Link href={'/events'} className={linkStyle()}>Events</Link>

        <div className="relative group w-full">
          <Link href={'/authorities'} className={dropdownTriggerStyle()}>
            Authorities
          </Link>
          <div className="absolute overflow-hidden top-full left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col shadow-xl min-w-60 z-50 text-slate-700 bg-white rounded-b-lg border border-emerald-100">
            {designations && designations.length > 0 ? (
              designations.map((d) => (
                <Link href={`/authorities/${d.slug}`} key={d.id} className="px-4 w-full py-2 hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-xs font-semibold text-left">
                  {d.title}
                </Link>
              ))
            ) : (
              <span className="px-4 py-2 text-slate-400 text-xs italic text-left">No authorities</span>
            )}
          </div>
        </div>

        <div className="relative group w-full">
          <Link href={'/about'} className={dropdownTriggerStyle()}>
            About
          </Link>
          <div className="absolute overflow-hidden top-full left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col shadow-xl min-w-60 z-50 text-slate-700 bg-white rounded-b-lg border border-emerald-100">
            <Link href={'/about/campus'} className="px-4 py-2 hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-xs font-semibold text-left">My Campus</Link>
            <Link href={'/missions'} className="px-4 py-2 hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-xs font-semibold text-left">Mission</Link>
            <Link href={'/about/vision'} className="px-4 py-2 hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-xs font-semibold text-left">Vision</Link>
            <Link href={'/about/history'} className="px-4 py-2 hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-xs font-semibold text-left">History</Link>
          </div>
        </div>

        <div className="relative group w-full">
          <Link href={'/classes'} className={dropdownTriggerStyle()}>
            Classes
          </Link>
          <div className="absolute overflow-hidden top-full left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col shadow-xl min-w-60 z-50 text-slate-700 bg-white rounded-b-lg border border-emerald-100">
            {classes && classes.length > 0 ? (
              classes.map((c) => (
                <Link href={`/classes/${c.code || c.id || c}`} key={c.id || c} className="px-4 py-2 hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-xs font-semibold text-left">
                  {c.name || c}
                </Link>
              ))
            ) : (
              <span className="px-4 py-2 text-slate-400 text-xs italic text-left">No classes</span>
            )}
          </div>
        </div>

        <div className="relative group w-full">
          <Link href={'/clubs'} className={dropdownTriggerStyle()}>
            Clubs
          </Link>
          <div className="absolute overflow-hidden top-full left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col shadow-xl min-w-60 z-50 text-slate-700 bg-white rounded-b-lg border border-emerald-100">
            {clubs && clubs.length > 0 ? (
              clubs.map((c) => (
                <Link href={`/clubs/${c.slug || c.id || c}`} key={c.id || c} className="px-4 py-2 hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-xs font-semibold text-left">
                  {c.name || c}
                </Link>
              ))
            ) : (
              <span className="px-4 py-2 text-slate-400 text-xs italic text-left">No clubs</span>
            )}
          </div>
        </div>

        <Link href={'/teachers'} className={linkStyle()}>Teachers</Link>
        <Link href={'/staffs'} className={linkStyle()}>Staff</Link>
        <Link href={'/acheivements'} className={linkStyle()}>Achievements</Link>
        <Link href={'/news'} className={linkStyle()}>News</Link>
        <Link href={'/results'} className={linkStyle()}>Results</Link>
        <Link href={'/notices'} className={linkStyle()}>Notices</Link>
        <Link href={'/contact'} className={linkStyle()}>Contact</Link>
      </section>

    </nav>
  );
};

export default Navbar;