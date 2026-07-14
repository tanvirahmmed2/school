'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiCheckCircle, FiFileText, FiClock, FiDollarSign, FiArrowRight, FiLayers, FiCalendar } from 'react-icons/fi';

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

  const criteria = [
    {
      title: 'Academic Standing',
      detail: 'Minimum GPA of 3.50 in secondary and higher school certificates or equivalent international courses.',
    },
    {
      title: 'Entrance Evaluation',
      detail: 'Successful completion of capability tests covering fundamental mathematics, logical reasoning, and basic coding.',
    },
    {
      title: 'Documentation & Age limits',
      detail: 'Birth registration certificate matching selected circular target age bracket limits, passport-size photographs, and school transcripts.',
    }
  ];

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
                    </div>
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

        {/* Content Section: Requirements & Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12">
          {/* Column 1: Entry Requirements */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-xs transition-shadow md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-650 flex items-center justify-center text-lg">
                  <FiCheckCircle />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">Entry Criteria</h3>
              </div>
              <div className="flex flex-col gap-5">
                {criteria.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-655 text-slate-600 shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-sm">{item.title}</span>
                      <p className="text-slate-500 text-xs md:text-sm leading-relaxed mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-50">
              <Link
                href="/admission/apply"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-850 transition-colors"
              >
                <span>View Generic Form</span>
                <FiArrowRight />
              </Link>
            </div>
          </div>

          {/* Column 2: Tuition Fees overview */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-650 flex items-center justify-center text-lg">
                  <FiDollarSign />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">Tuition Costs</h3>
              </div>
              <div className="flex flex-col gap-4 text-xs leading-relaxed">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-slate-800">Enrollment Security</span>
                  <p className="text-slate-500 text-[11px]">A one-time deposit of $150 covers administrative setup registration fees.</p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-slate-800">Term Costs</span>
                  <p className="text-slate-500 text-[11px]">Tuition fee covers courses, labs, and lms resources per billing semester.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-tr from-sky-900 to-indigo-950 text-white rounded-3xl p-8 md:p-10 shadow-lg text-center flex flex-col items-center gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-800/10 via-transparent to-transparent"></div>
          <div className="flex flex-col gap-2 relative z-10">
            <h2 className="text-xl md:text-2xl font-black tracking-tight">
              Ready to submit your application?
            </h2>
            <p className="text-sky-200 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
              Enroll today in Fontana. Processing admissions candidates registry updates takes less than 3 business days.
            </p>
          </div>
          <Link
            href="/admission/apply"
            className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-sky-950 font-extrabold px-6 py-3 rounded-xl shadow-md hover:scale-[1.02] transition-all relative z-10 text-sm"
          >
            <FiFileText />
            <span>Open Candidate Application</span>
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdmissionPage;
