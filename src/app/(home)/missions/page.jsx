'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FiCheck, 
  FiArrowLeft, 
  FiGlobe, 
  FiCpu, 
  FiAward, 
  FiUsers, 
  FiShield 
} from 'react-icons/fi';

const MissionPage = () => {
  const points = [
    {
      title: 'Practical Education',
      desc: 'Integrating hands-on lab training, industrial seminars, and live coding exercises directly into the core syllabus. Students build real applications under direct teacher guidance.',
      icon: FiCpu,
      color: 'text-sky-600 bg-sky-50 border-sky-100'
    },
    {
      title: 'Global Career Readiness',
      desc: 'Developing curriculum guidelines aligned with tech standards to prepare students for international hires and careers. We run resume reviews and career placement seminars.',
      icon: FiAward,
      color: 'text-amber-600 bg-amber-50 border-amber-100'
    },
    {
      title: 'Inclusive Development',
      desc: 'Ensuring access to scholarship programs, equal support systems, and dynamic club communities for all students. No scholar is left behind due to financial constraints.',
      icon: FiUsers,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    },
    {
      title: 'Innovative Academic Research',
      desc: 'Providing funding, lab access, and teacher mentoring to foster novel microgrid and software architectures. Students publish findings in regional journals.',
      icon: FiGlobe,
      color: 'text-rose-600 bg-rose-50 border-rose-100'
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        
        {/* Navigation back */}
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <FiArrowLeft className="text-sm" />
            Back to Home
          </Link>
          <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            FIT Creed
          </span>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Our Mission & Objectives
          </h1>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed">
            We aim to empower young engineering and management minds with strong fundamentals, critical thinking capabilities, and high work ethics.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Core Institutional Pillars
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              At Fontana Institute of Technology, we measure success by the impact of our graduates on industry and communities. Our academic programs are built around the following four tenets:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {points.map((pt, idx) => {
              const Icon = pt.icon;
              return (
                <div 
                  key={idx} 
                  className="flex gap-4 items-start bg-slate-50/50 p-5 rounded-2xl border border-slate-100/50 hover:shadow-xs transition-shadow"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 mt-0.5 ${pt.color}`}>
                    <Icon className="text-sm sm:text-base" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      {pt.title}
                    </h4>
                    <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed mt-0.5">
                      {pt.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quality Charter callout */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row gap-6 items-start relative">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
            <FiShield className="text-xl" />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">
              Continuous Evaluation & Growth
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Our academic board holds term reviews to ensure alignment with our educational mission. We verify curriculum relevance against hiring reports, feedback from corporate managers, and technical skill requirements in modern engineering domains.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MissionPage;
