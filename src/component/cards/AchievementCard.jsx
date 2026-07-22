'use client';

import React from 'react';
import { FiAward, FiStar } from 'react-icons/fi';

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
};

const AchievementCard = ({ achievement, className = '' }) => {
  if (!achievement) return null;

  const { title, description, image_url, image } = achievement;
  const coverImage = image_url || image;
  const cleanDescription = stripHtml(description);

  return (
    <div
      className={`bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col hover:border-amber-200 hover:shadow-[0_8px_30px_rgba(245,158,11,0.08)] transition-all duration-250 group ${className}`}
    >
      {coverImage ? (
        <div className="w-full h-48 bg-slate-100 overflow-hidden relative">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-amber-500 text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
            <FiStar className="text-xs" /> Awarded
          </div>
        </div>
      ) : (
        <div className="w-full h-36 bg-gradient-to-br from-amber-50 via-amber-50/50 to-slate-50 flex items-center justify-center relative">
          <div className="w-16 h-16 rounded-2xl bg-amber-100/80 border border-amber-200 flex items-center justify-center text-amber-600 text-3xl group-hover:scale-110 transition-transform duration-300">
            <FiAward />
          </div>
        </div>
      )}

      <div className="p-6 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold uppercase tracking-wider">
          <FiAward className="text-sm shrink-0" />
          <span>Milestone Honor</span>
        </div>

        <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-amber-600 transition-colors">
          {title}
        </h3>

        <p className="text-slate-500 text-xs md:text-sm leading-relaxed mt-1 line-clamp-4 flex-1">
          {cleanDescription}
        </p>
      </div>
    </div>
  );
};

export default AchievementCard;
