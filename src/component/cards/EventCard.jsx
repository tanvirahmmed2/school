'use client';

import React from 'react';
import { FiCalendar, FiMapPin, FiClock, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

const EventCard = ({ event, href, className = '' }) => {
  if (!event) return null;

  const { id, title, description, event_date, location, image } = event;
  const dateObj = event_date ? new Date(event_date) : null;
  const day = dateObj ? dateObj.getDate() : '';
  const month = dateObj ? dateObj.toLocaleDateString(undefined, { month: 'short' }) : '';
  const time = dateObj ? dateObj.toLocaleTimeString(undefined, { timeStyle: 'short' }) : '';

  const targetHref = href || `/events/${id}`;

  const card = (
    <div
      className={`bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)] hover:border-emerald-200 transition-all duration-250 flex flex-col sm:flex-row group h-full ${className}`}
    >
      {/* Cover Image or Calendar Badge */}
      {image ? (
        <div className="w-full sm:w-48 h-48 overflow-hidden bg-slate-100 shrink-0 relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {dateObj && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs border border-white/50 text-emerald-700 px-2.5 py-1 rounded-xl flex flex-col items-center justify-center font-bold text-xs shadow-xs">
              <span className="text-sm font-black leading-none">{day}</span>
              <span className="text-[9px] uppercase tracking-wider">{month}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full sm:w-40 bg-gradient-to-br from-emerald-50 to-teal-50 flex sm:flex-col items-center justify-center p-4 shrink-0 relative border-b sm:border-b-0 sm:border-r border-slate-100">
          <div className="w-14 h-14 bg-white border border-emerald-100 text-emerald-600 rounded-2xl flex flex-col items-center justify-center shadow-xs">
            <span className="text-lg font-black leading-none">{day}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">{month}</span>
          </div>
        </div>
      )}

      {/* Info Container */}
      <div className="p-5 flex flex-col justify-between gap-3 flex-1">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {time && (
              <span className="flex items-center gap-1">
                <FiClock className="text-xs text-emerald-500 shrink-0" />
                {time}
              </span>
            )}
            {location && (
              <span className="flex items-center gap-1">
                <FiMapPin className="text-xs text-emerald-500 shrink-0" />
                {location}
              </span>
            )}
          </div>

          <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-emerald-600 transition-colors">
            {title}
          </h3>

          {description && (
            <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
              {description}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-slate-50 flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
          <span>View Details</span>
          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );

  return (
    <Link href={targetHref} className="block h-full">
      {card}
    </Link>
  );
};

export default EventCard;
