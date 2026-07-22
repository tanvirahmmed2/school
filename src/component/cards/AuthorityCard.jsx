'use client';

import React from 'react';
import Link from 'next/link';
import { FiUser, FiMail, FiPhone, FiChevronRight } from 'react-icons/fi';

const AuthorityCard = ({ authority, className = '' }) => {
  if (!authority) return null;

  const { title, name, desc, bio, email, contact, hours, href, image, designation, icon: CustomIcon } = authority;
  const displayName = name || title || 'Board Member';
  const displayDesc = desc || bio || 'Institutional Leadership Member';
  const displayEmail = email;
  const displayContact = contact || hours;

  const cardContent = (
    <div
      className={`group bg-white rounded-2xl border border-slate-100 hover:border-sky-200 hover:shadow-[0_8px_30px_rgba(14,165,233,0.08)] transition-all duration-250 overflow-hidden flex flex-col sm:flex-row p-5 gap-4 ${className}`}
    >
      {/* Avatar / Icon side */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-sky-50 to-slate-100 border border-sky-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
        {image ? (
          <img src={image} alt={displayName} className="w-full h-full object-cover rounded-2xl" />
        ) : CustomIcon ? (
          <CustomIcon className="text-sky-600 text-2xl" />
        ) : (
          <FiUser className="text-sky-500 text-2xl" />
        )}
      </div>

      {/* Details side */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-extrabold text-slate-900 text-base group-hover:text-sky-600 transition-colors leading-tight truncate">
            {displayName}
          </h3>
          {designation && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-100 shrink-0">
              {designation}
            </span>
          )}
        </div>

        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
          {displayDesc}
        </p>

        {(displayEmail || displayContact) && (
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-400 mt-1">
            {displayEmail && (
              <span className="flex items-center gap-1">
                <FiMail className="text-slate-400 shrink-0 text-xs" />
                <span className="truncate">{displayEmail}</span>
              </span>
            )}
            {displayContact && (
              <span className="flex items-center gap-1">
                <FiPhone className="text-slate-400 shrink-0 text-xs" />
                <span className="truncate">{displayContact}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {href && (
        <div className="self-center hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 group-hover:bg-sky-50 text-slate-400 group-hover:text-sky-600 transition-all">
          <FiChevronRight className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{cardContent}</Link>;
  }

  return cardContent;
};

export default AuthorityCard;
