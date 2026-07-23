'use client';

import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome, FiDollarSign, FiUsers, FiSliders, FiActivity, FiCalendar, FiBookOpen, FiCreditCard, FiClock, FiFileText
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
        { label: 'Achievements', href: '/staff/registrar/acheivement', icon: FiSliders },
        { label: 'Notice Board', href: '/staff/registrar/notices', icon: FiBookOpen },
        { label: 'Student Attendance', href: '/staff/registrar/student-attendence', icon: FiCalendar },
        { label: 'Teacher Attendance', href: '/staff/registrar/teacher-attendence', icon: FiCalendar },
        { label: 'Leave Applications', href: '/staff/registrar/leaves', icon: FiFileText }
      ];
    } else {
      roleLinks = [
        { label: 'Desk Activities', href: '/staff', icon: FiActivity }
      ];
    }

    return [
      ...base,
      ...roleLinks
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
        className={`fixed top-16 left-0 bottom-0 w-64 bg-emerald-500 text-white z-40 flex flex-col justify-between py-6 px-4 transition-transform duration-200 ease-in-out md:translate-x-0 overflow-y-auto ${
          staffSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Back />
            <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest px-3 flex items-center gap-1.5 mb-2 mt-2 opacity-90">
              Staff Navigation
            </span>

            {loading ? (
              <div className="flex flex-col gap-2 px-3">
                <div className="h-8 bg-emerald-600/50 rounded-xl animate-pulse"></div>
                <div className="h-8 bg-emerald-600/50 rounded-xl animate-pulse"></div>
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
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'text-white/90 hover:bg-emerald-600 hover:text-white'
                      }`}
                    >
                      <Icon className="text-base text-white" />
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
