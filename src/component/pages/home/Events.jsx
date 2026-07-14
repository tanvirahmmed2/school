'use client';

import React, { useEffect, useState } from 'react';
import { FiCalendar, FiMapPin, FiClock, FiInfo } from 'react-icons/fi';
import Link from 'next/link';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          setEvents(data.paylod?.events || []);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold text-sky-655 bg-sky-50 px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-3 text-sky-600">
            Calendar
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Upcoming Campus Events
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto text-sm">
            Join our assemblies, academic symposiums, inter-school sports matches, and cultural exhibitions.
          </p>
        </div>

        {loading ? (
          <div className="w-full py-12 flex justify-center">
            <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="w-full py-12 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center p-6">
            <div className="w-10 h-10 bg-white text-slate-400 rounded-xl flex items-center justify-center text-sm mb-3 border border-slate-100">
              <FiInfo />
            </div>
            <p className="text-slate-400 text-xs font-medium">No events scheduled at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.slice(0, 4).map((event) => {
              const dateObj = new Date(event.event_date);
              const day = dateObj.getDate();
              const month = dateObj.toLocaleDateString(undefined, { month: 'short' });
              
              return (
                <div
                  key={event.id}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:border-slate-200 hover:bg-slate-50/70 transition-all flex gap-5"
                >
                  {/* Calendar Badge */}
                  <div className="w-14 h-14 bg-sky-50 border border-sky-100 text-sky-600 rounded-2xl flex flex-col items-center justify-center shrink-0">
                    <span className="text-lg font-black leading-none">{day}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">{month}</span>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-slate-800 text-sm leading-snug">
                      {event.title}
                    </h3>
                    
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                      {event.description}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <FiMapPin /> {event.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <FiClock /> {dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {events.length > 4 && (
          <div className="text-center mt-10">
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-605 hover:text-sky-850 transition-colors text-sky-600"
            >
              <span>View Full Campus Event Calendar</span>
              <span>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;