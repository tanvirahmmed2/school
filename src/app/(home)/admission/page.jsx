'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiCheckCircle, FiFileText, FiClock, FiDollarSign, FiArrowRight, FiLayers, FiCalendar } from 'react-icons/fi';
import Life from '@/component/pages/home/Life';

const AdmissionPage = () => {
  const [circulars, setCirculars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveCirculars = async () => {
      try {
        const res = await fetch('/api/admin/admissions');
        const data = await res.json();
        if (data.success && data.paylod?.circulars) {
          // Filter to only show active circulars where finish_date >= today
          const todayStr = new Date().toISOString().split('T')[0];
          const active = data.paylod.circulars.filter(
            (c) => new Date(c.finish_date).toISOString().split('T')[0] >= todayStr
          );
          setCirculars(active);
        }
      } catch (err) {
        console.error('Failed to load active circulars:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveCirculars();
  }, []);



  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            Admissions Desk
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Admission & Enrollment circulars
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            Explore active entry circular drives, registration requirements, and file your student admission application.
          </p>
        </div>

        {/* Dynamic circular drives listings */}
        <div className="mb-12">
          <h2 className="text-base font-bold text-slate-800 uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Active Circular Intakes
          </h2>

          {loading ? (
            <div className="w-full py-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : circulars.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-xs">
              <span className="text-3xl">📭</span>
              <p className="text-xs font-bold text-slate-500 mt-2">No Active Intakes Right Now</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Please check back later or contact the admin desk.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {circulars.map((c) => (
                <div key={c.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-sky-100 transition-all flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full w-max">
                      <FiLayers /> Class: {c.class_name}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug mt-1">{c.title}</h3>
                    <div className="flex flex-col gap-1.5 text-xs text-slate-500 font-semibold mt-2">
                      <div className="flex items-center gap-1.5">
                        <FiClock className="text-slate-400" />
                        <span>Deadline: <strong className="text-slate-700">{new Date(c.finish_date).toLocaleDateString()}</strong></span>
                      </div>
                      {c.min_age !== null || c.max_age !== null ? (
                        <div className="flex items-center gap-1.5">
                          <FiCalendar className="text-slate-400" />
                          <span>Age limits: <strong className="text-slate-700">{c.min_age || 0} to {c.max_age || '∞'} years</strong></span>
                        </div>
                      ) : null}
                      {c.fees !== undefined && c.fees !== null && (
                        <div className="flex items-center gap-1.5 text-blue-600">
                          <FiDollarSign className="text-blue-500" />
                          <span>Admission Fee: <strong className="text-blue-700">${parseFloat(c.fees).toFixed(2)}</strong></span>
                        </div>
                      )}
                    </div>
                    {c.description && (
                      <div className="border-t border-slate-100 pt-2.5 mt-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Details & Requirements</p>
                        <div 
                          className="prose prose-sm max-w-none text-[11px] text-slate-650 text-slate-650 leading-relaxed font-normal" 
                          dangerouslySetInnerHTML={{ __html: c.description }} 
                        />
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/admission/apply?admission_id=${c.id}`}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold tracking-wide transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Apply Online</span>
                    <FiArrowRight />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <Life/>
      </div>
    </div>
  );
};

export default AdmissionPage;
