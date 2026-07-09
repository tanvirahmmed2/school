'use client';

import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome, FiUser, FiShield, FiMenu, FiFileText, FiCalendar, FiAlertCircle, FiDollarSign
} from 'react-icons/fi';
import { Context } from '@/component/helper/Context';

const Sidebar = () => {
  const pathname = usePathname();
  const { staffSidebar, setStaffSidebar } = useContext(Context);
  const [role, setRole] = useState('staff');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffRole = async () => {
      try {
        const response = await fetch('/api/staff/me');
        if (response.ok) {
          const data = await response.json();
          setRole(data.staff.role);
        }
      } catch (error) {
        console.error('Failed to fetch staff role in sidebar:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaffRole();
  }, []);

  const isRegistrar = role === 'registrar';

  const staffLinks = isRegistrar
    ? [
        { label: 'Registrar Dashboard', href: '/staffs/registrar', icon: FiShield },
        { label: 'Take Student Fees', href: '/staffs/registrar/fees', icon: FiDollarSign },
        { label: 'News Management', href: '/staffs/registrar/news', icon: FiFileText },
        { label: 'Events Management', href: '/staffs/registrar/events', icon: FiCalendar },
        { label: 'Notices Management', href: '/staffs/registrar/notices', icon: FiAlertCircle },
        { label: 'Staff Profile', href: '/staffs/staff', icon: FiUser },
      ]
    : [
        { label: 'Staff Dashboard', href: '/staffs/staff', icon: FiHome },
        { label: 'My Profile', href: '/staffs/staff', icon: FiUser },
      ];

  return (
    <>
      {/* Mobile Sidebar backdrop */}
      {staffSidebar && (
        <div
          className="fixed inset-0 top-16 bg-slate-900/20 backdrop-blur-xs z-30 md:hidden transition-opacity duration-200"
          onClick={() => setStaffSidebar(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-100 z-40 flex flex-col justify-between py-6 px-4 transition-transform duration-200 ease-in-out md:translate-x-0 overflow-y-auto ${
          staffSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 flex items-center gap-1.5 mb-2">
              {isRegistrar ? 'Registrar Navigation' : 'Staff Navigation'}
            </span>
            <nav className="flex flex-col gap-1">
              {staffLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setStaffSidebar(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <Icon className={`text-base ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Portal Status */}
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-center mt-6">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Portal Status
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Online
          </span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;