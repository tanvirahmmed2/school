'use client';

import React from 'react';
import Link from 'next/link';
import { FiAward, FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';
import Image from 'next/image';

const RecognitionCard = ({ recognition, item, href, className = '' }) => {
  const data = recognition || item;
  if (!data) return null;

  const { name, title, awarded_by, given_by, date, image, image_url, slug, id } = data;
  const cardTitle = name || title || 'Recognition';
  const coverImage = image || image_url;
  const awardedBy = awarded_by || given_by || data.awardedBy || data.givenBy;
  const targetSlug = slug || id;
  const targetHref = href || `/recognitions/${targetSlug}`;

  const formattedDate = date
    ? new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <Link href={targetHref} className="block group h-full">
      <div
        className={`bg-white items-center justify-center rounded-2xl p-1 border border-slate-100 shadow-xs  transition-all duration-300 flex flex-col h-full ${className}`}
      >
        <div className="w-full aspect-square  rounded-xl overflow-hidden bg-slate-100 relative shrink-0">
          {coverImage ? (
            <Image width={500} height={500}
              src={coverImage}
              alt={cardTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-amber-50 via-amber-100/40 to-sky-50 flex flex-col items-center justify-center gap-1.5 p-3 text-center">
              <div className="w-10 h-10 rounded-xl bg-white/90 shadow-xs border border-amber-200/60 flex items-center justify-center text-amber-500 text-lg group-hover:scale-110 transition-transform duration-300">
                <FiAward />
              </div>
              <span className="text-[9px] font-bold text-amber-700/80 uppercase tracking-wider">
                Honour &amp; Award
              </span>
            </div>
          )}

        </div>

        <div className="pt-3 px-0.5 flex flex-col items-center justify-center flex-1 gap-1.5">
          
          <h3 className="font-extrabold text-slate-900 text-xs md:text-sm leading-tight group-hover:text-amber-600 transition-colors line-clamp-2">
            {cardTitle}
          </h3>

          {awardedBy && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium mt-auto pt-1">
              <FiUser className="text-amber-500 text-xs shrink-0" />
              <span className="truncate">
                <span className="text-slate-400">By: </span>
                <strong className="text-slate-700 font-bold">{awardedBy}</strong>
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            {formattedDate ? (
              <span className="flex items-center gap-1">
                <FiCalendar className="text-amber-500 shrink-0 text-[11px]" />
                <span>{formattedDate}</span>
              </span>
            ) : (
              <span />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecognitionCard;
