'use client';

import React from 'react';
import Link from 'next/link';
import { FiCheckCircle, FiFileText, FiClock, FiDollarSign, FiArrowRight } from 'react-icons/fi';

const AdmissionPage = () => {
  const criteria = [
    {
      title: 'Academic Standing',
      detail: 'Minimum GPA of 3.50 in secondary and higher secondary school certificates or equivalent international diploma courses.',
    },
    {
      title: 'Entrance Evaluation',
      detail: 'Successful completion of the FIT online capability test covering fundamental mathematics, logical reasoning, and basic coding constructs.',
    },
    {
      title: 'Documentation',
      detail: 'Submission of certified high school certificates, passport-size photographs, letters of recommendation, and identity papers.',
    }
  ];

  const timeline = [
    { date: 'June 01, 2026', title: 'Admissions Open', desc: 'Online portal starts accepting fresh profiles.' },
    { date: 'August 15, 2026', title: 'Entrance Exams', desc: 'Evaluation assessments held online in waves.' },
    { date: 'September 01, 2026', title: 'Registry Approval', desc: 'Registry announces first selection list.' }
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
            Admission & Enrollment Info
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            Explore entry requirements, admission deadlines, and start your application to join Fontana Institute of Technology.
          </p>
        </div>

        {/* Content Section */}
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
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-650 shrink-0 mt-0.5">
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
                href="/apply"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-850 transition-colors"
              >
                <span>View Full Checklist</span>
                <FiArrowRight />
              </Link>
            </div>
          </div>

          {/* Column 2: Timeline */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-650 flex items-center justify-center text-lg">
                  <FiClock />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">Admission Timeline</h3>
              </div>
              <div className="flex flex-col gap-6 relative border-l border-slate-100 pl-4 ml-2">
                {timeline.map((step, idx) => (
                  <div key={idx} className="relative flex flex-col gap-1">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white ring-2 ring-amber-100"></div>
                    <span className="text-[10px] font-black text-amber-650 tracking-wider">
                      {step.date}
                    </span>
                    <span className="font-bold text-slate-800 text-xs">
                      {step.title}
                    </span>
                    <p className="text-slate-500 text-[11px] leading-normal">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tuition Fees overview */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 hover:shadow-xs transition-shadow mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-650 flex items-center justify-center text-lg">
              <FiDollarSign />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Tuition Costs & Aid</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs md:text-sm text-slate-650 leading-relaxed">
            <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/60">
              <span className="font-bold text-slate-800">Enrollment Security</span>
              <p className="text-slate-500 text-xs">A one-time deposit of $150 covers administrative fees and registrar credentials.</p>
            </div>
            <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/60">
              <span className="font-bold text-slate-800">Term Costs</span>
              <p className="text-slate-500 text-xs">Course tuition fees are calculated per credit and billed prior to midterm cycles.</p>
            </div>
            <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/60">
              <span className="font-bold text-slate-800">Scholarship Programs</span>
              <p className="text-slate-500 text-xs">Financial waivers up to 75% are allocated automatically based on academic test grades.</p>
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
              Enroll today in the Fontana Institute of Technology digital portal. Application processing takes less than 3 business days.
            </p>
          </div>
          <Link
            href="/auth/student/registration"
            className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-sky-950 font-extrabold px-6 py-3 rounded-xl shadow-md hover:scale-[1.02] transition-all relative z-10 text-sm"
          >
            <FiFileText />
            <span>Open Application Form</span>
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdmissionPage;
