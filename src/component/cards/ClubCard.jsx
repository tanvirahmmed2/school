'use client';

import React from 'react';
import Link from 'next/link';
import { FiUsers, FiArrowRight } from 'react-icons/fi';

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
};

const ClubCard = ({ club, className = '' }) => {
  if (!club) return null;

  const { id, name, slug, motto, description, image } = club;
  const cleanDescription = stripHtml(description);

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all duration-200 group ${className}`}
    >
      <div>
        {/* Cover / Image Area */}
        {image ? (
          <div className="w-full h-44 bg-slate-100 overflow-hidden relative border-b border-slate-100">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="w-full h-32 bg-slate-50 border-b border-slate-100 flex items-center justify-center relative">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 text-xl shadow-xs group-hover:scale-110 transition-transform duration-200">
              <FiUsers />
            </div>
          </div>
        )}

        {/* Details Area */}
        <div className="p-5 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            Student Club
          </span>

          <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
            {name}
          </h3>

          {motto && (
            <p className="text-xs italic text-indigo-600 font-medium line-clamp-1">
              "{motto}"
            </p>
          )}

          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 pt-1">
            {cleanDescription || 'Welcome to our student activity club.'}
          </p>
        </div>
      </div>

      {/* Footer Action Link */}
      <div className="px-5 pb-5 pt-2">
        <Link
          href={`/clubs/${slug || id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors group/link cursor-pointer"
        >
          <span>View Club Details</span>
          <FiArrowRight className="text-sm group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default ClubCard;
