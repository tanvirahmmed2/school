'use client';

import React from 'react';
import Link from 'next/link';
import { FiUser, FiArrowRight, FiBriefcase } from 'react-icons/fi';

const TeacherCard = ({ teacher, className = '' }) => {
  return (
    <div
      className={`group bg-white rounded-2xl border border-slate-100 hover:border-sky-200 hover:shadow-[0_8px_30px_rgba(14,165,233,0.1)] transition-all duration-250 overflow-hidden flex ${className}`}
    >
      {/* ── Left: Image Panel ──────────────────────── */}
      <div className="w-[150px] shrink-0 relative bg-gradient-to-br from-sky-50 to-slate-100 overflow-hidden">
        {teacher.image ? (
          <img
            src={teacher.image}
            alt={teacher.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-sky-100 border-2 border-sky-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FiUser className="text-sky-500 text-3xl" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-sky-600/0 group-hover:bg-sky-600/8 transition-all duration-300 pointer-events-none"></div>
      </div>

      {/* ── Right: Info Panel ──────────────────────── */}
      <div className="flex-1 min-w-0 p-5 flex flex-col justify-center gap-2">
        {/* Name */}
        <h4 className="text-base font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors leading-tight truncate">
          {teacher.name}
        </h4>

        {/* Designation */}
        <span className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider leading-tight">
          <FiBriefcase className="text-slate-300 shrink-0" />
          <span className="truncate">{teacher.designation || 'Faculty Member'}</span>
        </span>

        {/* Divider */}
        <div className="w-10 h-0.5 bg-sky-200 rounded my-2"></div>

        {/* View Profile Link */}
        <Link
          href={`/teachers/${teacher.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors w-fit px-3 py-2 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-100 hover:border-sky-200 group/link"
        >
          View Profile
          <FiArrowRight className="group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default TeacherCard;
