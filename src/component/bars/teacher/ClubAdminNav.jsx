'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiGrid, FiInfo, FiUsers, FiFileText } from 'react-icons/fi';

const ClubAdminNav = ({ currentClub, clubs = [], selectedClubId, onClubSelect }) => {
  const pathname = usePathname();

  const navTabs = [
    { label: 'Overview', href: '/teacher/clubs', icon: FiGrid },
    { label: 'Notice Info', href: '/teacher/clubs/notice', icon: FiInfo },
    { label: 'Members & Roles', href: '/teacher/clubs/members', icon: FiUsers },
    { label: 'Club News', href: '/teacher/clubs/news', icon: FiFileText },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Header bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{currentClub?.name || 'Club Admin'}</h1>
          <p className="text-xs text-slate-500">
            Role: <span className="font-semibold text-slate-700">{currentClub?.admin_designation || 'Club Admin'}</span>
          </p>
        </div>

        {clubs.length > 1 && onClubSelect && (
          <select
            value={selectedClubId}
            onChange={(e) => onClubSelect(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none cursor-pointer"
          >
            {clubs.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Tabs Sub-Navigation */}
      <div className="flex items-center gap-1 bg-white border border-slate-200 p-1.5 rounded-xl overflow-x-auto shadow-xs">
        {navTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="text-sm" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ClubAdminNav;
