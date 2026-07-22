'use client';

import React from 'react';
import { FiFileText, FiCalendar, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

const NewsCard = ({ news, href, className = '' }) => {
  if (!news) return null;

  const { title, content, image, created_at } = news;
  const newsDate = created_at ? new Date(created_at) : null;

  const card = (
    <div
      className={`bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-[0_8px_30px_rgba(14,165,233,0.08)] hover:border-sky-200 transition-all duration-250 flex flex-col group h-full ${className}`}
    >
      {/* Cover Image */}
      {image ? (
        <div className="w-full h-48 overflow-hidden bg-slate-100 shrink-0 relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-sky-50 to-indigo-50 flex items-center justify-center shrink-0 relative">
          <FiFileText className="text-5xl text-sky-200" />
        </div>
      )}

      {/* Info Container */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {newsDate && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <FiCalendar className="text-xs shrink-0 text-sky-500" />
            <span>{newsDate.toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
          </div>
        )}

        <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-sky-600 transition-colors">
          {title}
        </h3>

        <p className="text-slate-500 text-xs leading-relaxed line-clamp-4 whitespace-pre-wrap flex-1">
          {content}
        </p>

        {href && (
          <div className="pt-2 border-t border-slate-50 flex items-center gap-1 text-xs font-bold text-sky-600 group-hover:text-sky-700">
            <span>Read Article</span>
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block h-full">{card}</Link>;
  }

  return card;
};

export default NewsCard;
