'use client';

import React from 'react';
import { FiUser, FiBriefcase, FiMail, FiPhone, FiMapPin, FiShield } from 'react-icons/fi';

const StaffCard = ({ staff, className = '' }) => {
  // Format role name nicely (e.g., cashier -> Cashier, registrar -> Registrar)
  const formatRole = (role) => {
    if (!role) return 'Staff Member';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div
      className={`group bg-white rounded-2xl border border-slate-100 hover:border-sky-200 hover:shadow-[0_8px_30px_rgba(14,165,233,0.1)] transition-all duration-250 overflow-hidden flex ${className}`}
    >
      {/* ── Left: Image / Avatar Panel ──────────────────────── */}
      <div className="w-[140px] md:w-[150px] shrink-0 relative bg-gradient-to-br from-sky-50 to-slate-100 overflow-hidden flex items-center justify-center">
        {staff.image ? (
          <img
            src={staff.image}
            alt={staff.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className="w-20 h-20 rounded-full bg-sky-100 border-2 border-sky-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xs">
              <FiUser className="text-sky-500 text-3xl" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-sky-600/0 group-hover:bg-sky-600/5 transition-all duration-300 pointer-events-none"></div>
      </div>

      {/* ── Right: Info Panel ──────────────────────── */}
      <div className="flex-1 min-w-0 p-5 flex flex-col justify-center gap-2">
        {/* Role Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-100 uppercase tracking-wider">
            <FiShield className="text-[10px]" />
            {formatRole(staff.role)}
          </span>
        </div>

        {/* Name */}
        <h4 className="text-base font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors leading-tight truncate">
          {staff.name}
        </h4>

        {/* Email & Phone */}
        <div className="flex flex-col gap-1 text-xs text-slate-500 font-medium">
          {staff.email && (
            <div className="flex items-center gap-1.5 truncate">
              <FiMail className="text-slate-400 shrink-0 text-xs" />
              <span className="truncate">{staff.email}</span>
            </div>
          )}
          {staff.number && (
            <div className="flex items-center gap-1.5 truncate">
              <FiPhone className="text-slate-400 shrink-0 text-xs" />
              <span className="truncate">{staff.number}</span>
            </div>
          )}
          {staff.address && (
            <div className="flex items-center gap-1.5 truncate">
              <FiMapPin className="text-slate-400 shrink-0 text-xs" />
              <span className="truncate">{staff.address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffCard;
