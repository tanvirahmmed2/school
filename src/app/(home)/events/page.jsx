'use client';

import React, { useEffect, useState } from 'react';
import { FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events || []);
        }
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-full">
            FIT Community
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Upcoming Events & Seminars
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            Stay updated with the latest workshops, academic seminars, sports meets, and cultural festivals at Fontana Institute of Technology.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs animate-pulse flex flex-col gap-4">
                <div className="w-24 h-4 bg-slate-200 rounded"></div>
                <div className="w-3/4 h-6 bg-slate-200 rounded"></div>
                <div className="w-full h-12 bg-slate-200 rounded"></div>
                <div className="w-1/2 h-4 bg-slate-200 rounded mt-auto"></div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => {
              const eventDate = new Date(event.event_date);
              return (
                <div key={event.id} className="bg-white rounded-2xl border border-slate-100 hover:border-sky-200 hover:shadow-[0_10px_30px_rgba(14,165,233,0.04)] shadow-xs p-6 flex flex-col justify-between transition-all duration-200 group">
                  <div className="flex flex-col gap-3">
                    {/* Date Tag */}
                    <div className="flex items-center gap-1.5 text-sky-600 bg-sky-50 px-3 py-1 rounded-lg text-xs font-bold w-fit">
                      <FiCalendar className="text-sm" />
                      <span>{eventDate.toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                    </div>

                    <h2 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors mt-1">
                      {event.title}
                    </h2>

                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Location & Meta info */}
                  <div className="flex flex-wrap gap-4 items-center border-t border-slate-50 pt-4 mt-6 text-xs text-slate-500 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <FiMapPin className="text-slate-400 text-sm" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiClock className="text-slate-400 text-sm" />
                      {eventDate.toLocaleTimeString(undefined, { timeStyle: 'short' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center max-w-md mx-auto shadow-xs mt-8">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto text-xl mb-4">
              <FiCalendar />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No events scheduled</h3>
            <p className="text-slate-500 text-xs mt-1">
              There are currently no upcoming events list on the institutional panel. Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
