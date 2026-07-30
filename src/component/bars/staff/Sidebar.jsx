'use client';

import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome, FiDollarSign, FiUsers, FiSliders, FiActivity, FiCalendar, 
  FiBookOpen, FiCreditCard, FiClock, FiFileText, FiPlus, FiUser
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
          setRole(data.paylod?.staff?.role || data.payload?.staff?.role || null);
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

    let roleLinks = [];
    if (role === 'cashier') {
      roleLinks = [
        { label: 'Admission Fees', href: '/staff/cashier/admission-fee', icon: FiUsers },
        { label: 'Monthly Fees', href: '/staff/cashier/monthly-fee', icon: FiCalendar },
        { label: 'Exam Fees', href: '/staff/cashier/exam-fee', icon: FiBookOpen },
        { label: 'Payroll Desk', href: '/staff/cashier/salary', icon: FiCreditCard },
        { label: 'Transaction Desk', href: '/staff/cashier/transactions', icon: FiDollarSign },
      ];
    } else if (role === 'registrar') {
      roleLinks = [
        { label: 'Admissions Registry', href: '/staff/registrar/admissions', icon: FiUsers },
        { label: 'Class Routines', href: '/staff/registrar/routine', icon: FiClock },
        { label: 'Campus News', href: '/staff/registrar/news', icon: FiFileText },
        { label: 'Events List', href: '/staff/registrar/events', icon: FiCalendar },
        { label: 'Create Event', href: '/staff/registrar/events/new', icon: FiPlus },
        { label: 'Event Participants', href: '/staff/registrar/events/participants', icon: FiUsers },
        { label: 'Club Announcements', href: '/staff/registrar/club-news', icon: FiActivity },
        { label: 'Achievements', href: '/staff/registrar/achievements', icon: FiSliders },
        { label: 'Notice Board', href: '/staff/registrar/notices', icon: FiBookOpen },
        { label: 'Student Attendance', href: '/staff/registrar/student-attendence', icon: FiCalendar },
        { label: 'Leave Applications', href: '/staff/registrar/leaves', icon: FiFileText },
        { label: 'Hostel Applications', href: '/staff/registrar/hostels/applications', icon: FiFileText },
        { label: 'Hostel Management', href: '/staff/registrar/hostels', icon: FiHome }
      ];
    } else {
      roleLinks = [
        { label: 'Desk Activities', href: '/staff', icon: FiActivity }
      ];
    }

    const commonEnd = [
      { label: 'My Profile', href: '/staff/profile', icon: FiUser }
    ];

    return [
      ...base,
      ...roleLinks,
      ...commonEnd
    ];
  };

  const activeLinks = getLinks();

  return (
    <>
      {staffSidebar && (
        <div
          className="fixed inset-0 top-16 bg-slate-900/30 backdrop-blur-xs z-30 md:hidden transition-opacity duration-200"
          onClick={() => setStaffSidebar(false)}
        />
      )}

      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-200/80 z-40 flex flex-col justify-between py-5 px-3 transition-transform duration-200 ease-in-out md:translate-x-0 overflow-y-auto ${
          staffSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-4">
          <Back />
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 flex items-center gap-1.5 mb-1">
              Staff Navigation {role ? `(${role})` : ''}
            </span>

            {loading ? (
              <div className="flex flex-col gap-2 px-3">
                <div className="h-9 bg-slate-100 rounded-xl animate-pulse"></div>
                <div className="h-9 bg-slate-100 rounded-xl animate-pulse"></div>
                <div className="h-9 bg-slate-100 rounded-xl animate-pulse"></div>
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
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all duration-150 group ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60 shadow-2xs'
                          : 'text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`text-base ${isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-slate-100">
          <Link
            href="/"
            onClick={() => setStaffSidebar(false)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
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
