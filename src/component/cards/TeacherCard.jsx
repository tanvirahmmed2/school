'use client';

import React from 'react';
import Link from 'next/link';
import { FiUser, FiArrowRight, FiBriefcase } from 'react-icons/fi';

const TeacherCard = ({ teacher, className = '' }) => {
  return (
    <div
      className={`group bg-white rounded-2xl border border-slate-100 hover:border-primary hover:shadow-md transition-all duration-250 overflow-hidden flex ${className}`}
    >
      {/* Left: Image Panel */}
      <div className="w-[150px] shrink-0 relative bg-primary-light overflow-hidden">
        {teacher.image ? (
          <img
            src={teacher.image}
            alt={teacher.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white border border-primary-light flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FiUser className="text-primary text-3xl" />
            </div>
          </div>
        )}
      </div>

      {/* Right: Info Panel */}
      <div className="flex-1 min-w-0 p-5 flex flex-col justify-center gap-2">
        {/* Name */}
        <h4 className="text-base font-extrabold text-slate-900 group-hover:text-primary transition-colors leading-tight truncate">
          {teacher.name}
        </h4>

        {/* Designation */}
        <span className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider leading-tight">
          <FiBriefcase className="text-slate-300 shrink-0" />
          <span className="truncate">{teacher.designation || 'Faculty Member'}</span>
        </span>

        {/* Divider */}
        <div className="w-10 h-0.5 bg-primary-light rounded my-2"></div>

        {/* View Profile Link */}
        <Link
          href={`/teachers/${teacher.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary transition-colors w-fit px-3 py-2 rounded-lg bg-primary-light border border-primary-light group/link"
        >
          View Profile
          <FiArrowRight className="group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default TeacherCard;
