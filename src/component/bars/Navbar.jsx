'use client';

import React, { useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Context } from '../helper/Context';
import { MdMenu } from 'react-icons/md';

const Navbar = () => {
  const { classes, clubs, sidebar, setSidebar } = useContext(Context);
  const pathname = usePathname();

  // Helper function to check if active
  const isActive = (path) => pathname === path;
  const isDropdownActive = (prefix) => pathname.startsWith(prefix);

  return (
    <nav className="w-full bg-sky-950 text-white flex flex-row items-center justify-between px-4 md:px-6 py-2 h-[72px] md:h-[92px] fixed top-0 left-0 right-0 z-50 border-b border-sky-900/60 shadow-lg shadow-sky-950/10">
      {/* Brand / Logo */}
      <Link href={'/'} className="font-extrabold text-base md:text-lg tracking-tight shrink-0 mr-4 hover:text-amber-300 transition-colors duration-200">
        Fontana Institute of Technology
      </Link>

      {/* Main Desktop Sections (Hidden on Mobile) */}
      <section className="w-full hidden md:flex flex-col items-end justify-center gap-1">
        {/* Top utility row */}
        <section className="w-full flex flex-row items-center justify-end">
          <div className="w-auto flex flex-row items-center justify-center gap-4 text-xs font-semibold text-sky-200">
            <Link href={'/notices'} className={`hover:text-amber-300 transition-colors ${isActive('/notices') ? 'text-amber-300' : ''}`}>Notices</Link>
            <Link href={'/apply'} className={`hover:text-amber-300 transition-colors ${isActive('/apply') ? 'text-amber-300' : ''}`}>Apply</Link>
            <Link href={'/auth'} className="text-white hover:text-amber-300 transition-all bg-sky-900 border border-sky-850 hover:bg-sky-850 px-2.5 py-0.5 rounded shadow-xs">Login</Link>
          </div>
        </section>

        {/* Bottom primary row */}
        <section className="w-full flex flex-row items-center justify-end gap-5 text-[13px] font-semibold text-sky-100/90">
          <Link href={'/'} className={`hover:text-amber-300 transition-colors ${isActive('/') ? 'text-amber-300 border-b-2 border-amber-400 pb-0.5' : ''}`}>Home</Link>
          <Link href={'/events'} className={`hover:text-amber-300 transition-colors ${isActive('/events') ? 'text-amber-300 border-b-2 border-amber-400 pb-0.5' : ''}`}>Events</Link>
          
          {/* Authorities Dropdown */}
          <div className="relative group py-1">
            <Link href={'/authorities'} className={`hover:text-amber-300 transition-colors flex items-center gap-0.5 cursor-pointer ${isDropdownActive('/authorities') ? 'text-amber-300' : ''}`}>
              Authorities
            </Link>
            <div className="absolute top-full right-0 mt-1.5 hidden group-hover:flex flex-col bg-sky-900 text-sky-100 border border-sky-850 rounded-lg shadow-xl py-1.5 min-w-40 z-50">
              <Link href={'/authorities/principal'} className="px-4 py-2 hover:bg-sky-850 hover:text-amber-300 transition-colors text-xs font-bold text-left">Principle</Link>
              <Link href={'/authorities/chairman'} className="px-4 py-2 hover:bg-sky-850 hover:text-amber-300 transition-colors text-xs font-bold text-left">Chairman</Link>
              <Link href={'/authorities/director'} className="px-4 py-2 hover:bg-sky-850 hover:text-amber-300 transition-colors text-xs font-bold text-left">Director</Link>
              <Link href={'/authorities/council'} className="px-4 py-2 hover:bg-sky-850 hover:text-amber-300 transition-colors text-xs font-bold text-left">Council</Link>
              <Link href={'/authorities/registrar'} className="px-4 py-2 hover:bg-sky-850 hover:text-amber-300 transition-colors text-xs font-bold text-left">Registrar</Link>
              <Link href={'/authorities/staff'} className="px-4 py-2 hover:bg-sky-850 hover:text-amber-300 transition-colors text-xs font-bold text-left">Staffs</Link>
              <Link href={'/authorities/officers'} className="px-4 py-2 hover:bg-sky-850 hover:text-amber-300 transition-colors text-xs font-bold text-left">Officers</Link>
            </div>
          </div>

          {/* About Dropdown */}
          <div className="relative group py-1">
            <Link href={'/about'} className={`hover:text-amber-300 transition-colors flex items-center gap-0.5 cursor-pointer ${isDropdownActive('/about') ? 'text-amber-300' : ''}`}>
              About
            </Link>
            <div className="absolute top-full right-0 mt-1.5 hidden group-hover:flex flex-col bg-sky-900 text-sky-100 border border-sky-850 rounded-lg shadow-xl py-1.5 min-w-36 z-50">
              <Link href={'/about/campus'} className="px-4 py-2 hover:bg-sky-850 hover:text-amber-300 transition-colors text-xs font-bold text-left">My Campus</Link>
              <Link href={'/missions'} className="px-4 py-2 hover:bg-sky-850 hover:text-amber-300 transition-colors text-xs font-bold text-left">Mission</Link>
              <Link href={'/about/vision'} className="px-4 py-2 hover:bg-sky-850 hover:text-amber-300 transition-colors text-xs font-bold text-left">Vision</Link>
              <Link href={'/about/history'} className="px-4 py-2 hover:bg-sky-850 hover:text-amber-300 transition-colors text-xs font-bold text-left">History</Link>
            </div>
          </div>

          {/* Classes Dropdown */}
          <div className="relative group py-1">
            <button className="hover:text-amber-300 transition-colors flex items-center gap-0.5 cursor-pointer bg-transparent border-none text-[13px] font-semibold text-sky-100/90 p-0">
              Classes
            </button>
            <div className="absolute top-full right-0 mt-1.5 hidden group-hover:flex flex-col bg-sky-900 text-sky-100 border border-sky-850 rounded-lg shadow-xl py-1.5 min-w-36 z-50 max-h-52 overflow-y-auto">
              {classes && classes.length > 0 ? (
                classes.map((c) => (
                  <Link href={`/classes/${c.code || c.id || c}`} key={c.id || c} className="px-4 py-2 hover:bg-sky-850 hover:text-amber-300 transition-colors text-xs font-bold text-left">
                    {c.name || c}
                  </Link>
                ))
              ) : (
                <span className="px-4 py-2 text-sky-400 text-xs italic text-left">No classes</span>
              )}
            </div>
          </div>

          {/* Clubs Dropdown */}
          <div className="relative group py-1">
            <button className="hover:text-amber-300 transition-colors flex items-center gap-0.5 cursor-pointer bg-transparent border-none text-[13px] font-semibold text-sky-100/90 p-0">
              Clubs
            </button>
            <div className="absolute top-full right-0 mt-1.5 hidden group-hover:flex flex-col bg-sky-900 text-sky-100 border border-sky-850 rounded-lg shadow-xl py-1.5 min-w-36 z-50 max-h-52 overflow-y-auto">
              {clubs && clubs.length > 0 ? (
                clubs.map((c) => (
                  <Link href={`/clubs/${c.slug || c.id || c}`} key={c.id || c} className="px-4 py-2 hover:bg-sky-850 hover:text-amber-300 transition-colors text-xs font-bold text-left">
                    {c.name || c}
                  </Link>
                ))
              ) : (
                <span className="px-4 py-2 text-sky-400 text-xs italic text-left">No clubs</span>
              )}
            </div>
          </div>

          <Link href={'/teachers'} className={`hover:text-amber-300 transition-colors ${isActive('/teachers') ? 'text-amber-300 border-b-2 border-amber-400 pb-0.5' : ''}`}>Teachers</Link>
          <Link href={'/acheivements'} className={`hover:text-amber-300 transition-colors ${isActive('/acheivements') ? 'text-amber-300 border-b-2 border-amber-400 pb-0.5' : ''}`}>Acheivements</Link>
          <Link href={'/news'} className={`hover:text-amber-300 transition-colors ${isActive('/news') ? 'text-amber-300 border-b-2 border-amber-400 pb-0.5' : ''}`}>News</Link>
          <Link href={'/results'} className={`hover:text-amber-300 transition-colors ${isActive('/results') ? 'text-amber-300 border-b-2 border-amber-400 pb-0.5' : ''}`}>Results</Link>
          <Link href={'/contact'} className={`hover:text-amber-300 transition-colors ${isActive('/contact') ? 'text-amber-300 border-b-2 border-amber-400 pb-0.5' : ''}`}>Contact</Link>
        </section>
      </section>

      {/* Mobile Menu Toggle Button */}
      <button 
        onClick={() => setSidebar(!sidebar)} 
        className="md:hidden text-2xl hover:text-amber-300 transition-colors cursor-pointer p-1.5 rounded hover:bg-sky-900/60"
        aria-label="Toggle Menu"
      >
        <MdMenu />
      </button>
    </nav>
  );
};

export default Navbar;