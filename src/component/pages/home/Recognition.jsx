'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiAward, FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';

const Recognition = () => {
  const [recognitions, setRecognitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecognitions = async () => {
      try {
        const res = await fetch('/api/recognitions');
        if (res.ok) {
          const data = await res.json();
          setRecognitions(data.paylod.recognitions || []);
        }
      } catch (err) {
        console.error('Error fetching recognitions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecognitions();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (recognitions.length === 0) return null;

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50/60">
      <div className="mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-widest mb-3">
            Honours &amp; Awards
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Recognitions
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto text-sm">
            Milestones and honours that reflect our institution's commitment to excellence.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recognitions.map((item) => (
            <Link
              key={item.id}
              href={`/recognitions/${item.slug}`}
              className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col"
            >
              {/* Image */}
              {item.image ? (
                <div className="w-full h-44 overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-full h-44 bg-gradient-to-br from-amber-50 to-sky-50 flex items-center justify-center">
                  <FiAward className="text-5xl text-amber-300" />
                </div>
              )}

              {/* Content */}
              <div className="p-5 flex flex-col gap-2 flex-1">
                <h3 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-sky-700 transition-colors">
                  {item.name}
                </h3>

                {item.description && (
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <FiUser className="flex-shrink-0" />
                    {item.awarded_by}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiCalendar className="flex-shrink-0" />
                    {new Date(item.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        {recognitions.length >= 3 && (
          <div className="text-center mt-10">
            <Link
              href="/recognitions"
              className="inline-flex items-center gap-2 text-sm font-bold text-sky-600 hover:text-sky-800 transition-colors"
            >
              <span>View All Recognitions</span>
              <FiArrowRight />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Recognition;