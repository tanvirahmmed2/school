'use client';

import React from 'react';
import Link from 'next/link';
import { FiSearch, FiLock, FiBookOpen, FiArrowRight } from 'react-icons/fi';

const ResultsPortalPage = () => {
  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Results & Academic Transcripts
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            Official term-end exam results are processed and published securely on the FIT system. Follow instructions below to lookup transcripts.
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:shadow-xs transition-shadow">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 text-lg">
                <FiSearch />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                Public Inquiry Form
              </h3>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                For public verification queries or alumni certificate verification, enter the student ID and session code.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3 mt-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student Roll ID</label>
                  <input
                    type="text"
                    placeholder="e.g. STU-10254"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exam Term / Session</label>
                  <input
                    type="text"
                    placeholder="e.g. Spring 2026"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none transition-colors"
                  />
                </div>
              </form>
            </div>
            <button
              onClick={() => alert('Official grade details are secured. Please log in as a student to search details.')}
              className="inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold px-4 py-2.5 rounded-xl mt-6 transition-all text-xs cursor-pointer"
            >
              <span>Search Records</span>
            </button>
          </div>
      </div>
    </div>
  );
};

export default ResultsPortalPage;
