'use client';

import React from 'react';
import { FiBookOpen, FiInfo, FiExternalLink } from 'react-icons/fi';

const NoticeCard = ({ notice, className = '' }) => {
  if (!notice) return null;

  const { title, link, is_pinned, created_at } = notice;
  const noticeDate = created_at ? new Date(created_at) : null;

  return (
    <div
      className={`bg-white rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-200 ${
        is_pinned
          ? 'border-amber-200 shadow-xs bg-amber-50/20 hover:border-amber-300'
          : 'border-slate-100 hover:border-sky-200 hover:shadow-xs'
      } ${className}`}
    >
      <div className="flex gap-3.5 items-start">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
            is_pinned
              ? 'bg-amber-100 text-amber-600 border border-amber-200'
              : 'bg-sky-50 text-sky-600 border border-sky-100'
          }`}
        >
          {is_pinned ? <FiInfo className="text-lg" /> : <FiBookOpen className="text-lg" />}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-extrabold text-slate-800 text-sm md:text-base leading-snug">
              {title}
            </h3>
            {is_pinned && (
              <span className="text-[9px] font-black text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                Pinned
              </span>
            )}
          </div>
          {noticeDate && (
            <span className="text-[10px] font-bold text-slate-400">
              {noticeDate.toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </span>
          )}
        </div>
      </div>

      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            is_pinned
              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
              : 'bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-100 hover:border-sky-200'
          }`}
        >
          <span>View Document</span>
          <FiExternalLink className="text-xs" />
        </a>
      )}
    </div>
  );
};

export default NoticeCard;
