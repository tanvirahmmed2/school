'use client';

import React from 'react';
import Link from 'next/link';
import { FiUser, FiMail, FiPhone, FiChevronRight, FiAward, FiBriefcase } from 'react-icons/fi';

const AuthorityCard = ({ authority, className = '', isRole = false }) => {
  if (!authority) return null;

  const {
    title,
    name,
    desc,
    bio,
    email,
    contact,
    hours,
    href,
    image,
    designation,
    designation_title,
    qualifications,
    icon: CustomIcon
  } = authority;

  // Determine if this is a Role selection card or Member profile card
  const isRoleCard = isRole || Boolean(href && !name && title);
  const displayName = name || title || 'Board Member';
  const displayDesignation = designation_title || designation;
  const displayDesc = bio || desc || 'Institutional Leadership Member';
  const displayEmail = email;
  const displayContact = contact || hours;

  if (isRoleCard) {
    return (
      <Link href={href || `/authorities/${authority.slug || ''}`} className="block group">
        <div
          className={`bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)] transition-all duration-300 overflow-hidden flex flex-col sm:flex-row p-6 gap-5 ${className}`}
        >
          {/* Icon side */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
            {CustomIcon ? (
              <CustomIcon className="text-emerald-600 text-2xl sm:text-3xl" />
            ) : (
              <FiBriefcase className="text-emerald-600 text-2xl sm:text-3xl" />
            )}
          </div>

          {/* Details side */}
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-emerald-600 transition-colors leading-tight">
                {title || name}
              </h3>
            </div>

            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-2">
              {displayDesc}
            </p>
          </div>

          <div className="self-center hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-slate-50 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-600 transition-all">
            <FiChevronRight className="text-lg group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>
    );
  }

  // Authority Member Profile Card
  return (
    <div
      className={`group bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-[0_10px_35px_rgba(16,185,129,0.1)] transition-all duration-300 overflow-hidden flex flex-col sm:flex-row p-6 gap-6 ${className}`}
    >
      {/* Avatar / Photo */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-100 flex items-center justify-center shrink-0 overflow-hidden relative shadow-xs">
        {image ? (
          <img
            src={image}
            alt={displayName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-emerald-600">
            <FiUser className="text-4xl" />
          </div>
        )}
      </div>

      {/* Main Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl group-hover:text-emerald-600 transition-colors leading-snug">
              {displayName}
            </h3>
            {displayDesignation && (
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
                {displayDesignation}
              </span>
            )}
          </div>

          {displayDesc && (
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-1 line-clamp-3">
              {displayDesc}
            </p>
          )}
        </div>

        {/* Qualifications if provided */}
        {qualifications && qualifications.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
              <FiAward className="text-emerald-500" /> Qualifications
            </span>
            <div className="flex flex-wrap gap-1.5">
              {qualifications.map((q, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-100"
                >
                  {q.degree} ({q.institution}, {q.passing_year})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contact Info Footer */}
        {(displayEmail || displayContact) && (
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
            {displayEmail && (
              <a
                href={`mailto:${displayEmail}`}
                className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors"
              >
                <FiMail className="text-emerald-500 shrink-0" />
                <span className="truncate">{displayEmail}</span>
              </a>
            )}
            {displayContact && (
              <a
                href={`tel:${displayContact}`}
                className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors"
              >
                <FiPhone className="text-emerald-500 shrink-0" />
                <span className="truncate">{displayContact}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorityCard;
