'use client';

import React, { useEffect, useState } from 'react';
import { FiBell, FiCalendar, FiMapPin, FiInfo } from 'react-icons/fi';
import Link from 'next/link';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch('/api/notices');
        if (res.ok) {
          const data = await res.json();
          setNotices(data.paylod?.notices || []);
        }
      } catch (err) {
        console.error('Error fetching notices:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold text-sky-600 bg-sky-50 px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-3">
            Bulletin Board
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Academic Announcements
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto text-sm">
            Stay informed with the latest updates, circulars, and notices released by the registrar office.
          </p>
        </div>

        {loading ? (
          <div className="w-full py-12 flex justify-center">
            <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notices.length === 0 ? (
          <div className="w-full py-12 bg-white rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center p-6">
            <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center text-sm mb-3">
              <FiInfo />
            </div>
            <p className="text-slate-655 text-xs text-slate-400 font-medium">No announcements published at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notices.slice(0, 4).map((notice) => (
              <div
                key={notice.id}
                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col gap-3"
              >
                {/* Pinned Badge */}
                {notice.is_pinned && (
                  <span className="absolute top-0 right-0 bg-sky-500 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                    Pinned
                  </span>
                )}

                <div className="flex gap-2 items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <FiCalendar />
                  <span>
                    {new Date(notice.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                  {notice.title}
                </h3>

                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                  {notice.content}
                </p>

                <Link
                  href="/notices"
                  className="mt-auto text-[10px] font-bold text-sky-600 hover:text-sky-800 transition-colors uppercase tracking-wider flex items-center gap-1 w-fit pt-2"
                >
                  <span>View Details</span>
                  <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        )}

        {notices.length > 4 && (
          <div className="text-center mt-10">
            <Link
              href="/notices"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-605 hover:text-sky-800 transition-colors text-sky-600"
            >
              <span>View All Notice Board Announcements</span>
              <span>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Notices;