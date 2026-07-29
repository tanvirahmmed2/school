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
        className={` items-center  justify-center p-1 transition-all duration-300 flex flex-col h-full ${className}`}
      >
        <div className="w-full aspect-square rounded-full hover:shadow-sm overflow-hidden bg-slate-100 relative shrink-0">
          {coverImage ? (
            <Image width={500} height={500}
              src={coverImage}
              alt={cardTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-primary-light flex flex-col items-center justify-center gap-1.5 p-3 text-center">
              <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-primary-light flex items-center justify-center text-primary text-lg group-hover:scale-110 transition-transform duration-300">
                <FiAward />
              </div>
              <span className="text-[9px] font-bold text-primary uppercase tracking-wider">
                Honour &amp; Award
              </span>
            </div>
          )}

        </div>

        <div className="pt-3 px-0.5 flex flex-col items-center justify-center flex-1 gap-1.5">
          
          <h3 className="font-bold text-slate-900 text-xs md:text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {cardTitle}
          </h3>

          {awardedBy && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium mt-auto">

              <span className="truncate">
                <strong className="text-slate-700 font-bold">{awardedBy}</strong>
              </span>
            </div>
          )}

          <div className=" border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            {formattedDate ? (
              <span className="flex items-center gap-1">
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
