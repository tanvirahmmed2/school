'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiAward, FiCalendar, FiUser, FiArrowLeft } from 'react-icons/fi';

const RecognitionsPage = () => {
  const [recognitions, setRecognitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecognitions = async () => {
      try {
        const res = await fetch('/api/recognitions');
        if (res.ok) {
          const data = await res.json();
          setRecognitions(data.recognitions || []);
        }
      } catch (err) {
        console.error('Error fetching recognitions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecognitions();
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors mb-8"
        >
          <FiArrowLeft />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-widest mb-3">
            Honours &amp; Awards
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            All Recognitions
          </h1>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto text-sm">
            A full record of honours and awards received by our institution.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recognitions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recognitions.map((item) => (
              <Link
                key={item.id}
                href={`/recognitions/${item.slug}`}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col"
              >
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

                <div className="p-5 flex flex-col gap-2 flex-1">
                  <h2 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-sky-700 transition-colors">
                    {item.name}
                  </h2>
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
        ) : (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto text-2xl mb-4">
              <FiAward />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">No recognitions recorded yet</h3>
            <p className="text-slate-500 text-sm mt-1">Check back later for updates.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecognitionsPage;
