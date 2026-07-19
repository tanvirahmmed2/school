'use client';

import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome, FiDollarSign, FiUsers, FiSliders, FiActivity
} from 'react-icons/fi';
import { Context } from '@/component/helper/Context';
import Back from '@/component/button/Back';

const Sidebar = () => {
  const pathname = usePathname();
  const { staffSidebar, setStaffSidebar } = useContext(Context);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/staff/me');
        if (res.ok) {
          const data = await res.json();
          setRole(data.paylod.staff.role);
        }
      } catch (err) {
        console.error('Failed to load role in sidebar:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const getLinks = () => {
    const base = [
      { label: 'Portal Home', href: '/staff', icon: FiHome }
    ];

    if (role === 'cashier') {
      return [
        ...base,
        { label: 'Transaction Desk', href: '/staff/cashier/transactions', icon: FiDollarSign }
      ];
    }

    if (role === 'register' || role === 'registrar') {
      return [
        ...base,
        { label: 'Admissions Registry', href: '/staff/register/admissions', icon: FiUsers }
      ];
    }

    // general staff / fallback
    return [
      ...base,
      { label: 'Desk Activities', href: '/staff', icon: FiActivity }
    ];
  };

  const activeLinks = getLinks();

  return (
    <>
      {staffSidebar && (
        <div
          className="fixed inset-0 top-16 bg-slate-900/20 backdrop-blur-xs z-30 md:hidden transition-opacity duration-200"
          onClick={() => setStaffSidebar(false)}
        />
      )}

      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-100 z-40 flex flex-col justify-between py-6 px-4 transition-transform duration-200 ease-in-out md:translate-x-0 overflow-y-auto ${
          staffSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Back />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 flex items-center gap-1.5 mb-2 mt-2">
              Staff Navigation
            </span>

            {loading ? (
              <div className="flex flex-col gap-2 px-3">
                <div className="h-8 bg-slate-100 rounded-xl animate-pulse"></div>
                <div className="h-8 bg-slate-100 rounded-xl animate-pulse"></div>
              </div>
            ) : (
              <nav className="flex flex-col gap-1">
                {activeLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setStaffSidebar(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                        isActive
                          ? 'bg-sky-50 text-sky-600'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <Icon className={`text-base ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/"
            onClick={() => setStaffSidebar(false)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-500/10 hover:shadow-sky-500/20 transition-all duration-200 hover:-translate-y-0.5"
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
