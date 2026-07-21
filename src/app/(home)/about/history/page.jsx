'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FiClock, 
  FiStar, 
  FiFlag, 
  FiBookmark, 
  FiAward,
  FiArrowLeft,
  FiTrendingUp
} from 'react-icons/fi';

const HistoryPage = () => {
  const timeline = [
    {
      year: '2015',
      title: 'The Foundation & Inception',
      desc: 'Fontana Institute of Technology (FIT) was established on April 15, 2015, under the direction of a dedicated council of computer scientists and academic philanthropists. The initial campus started with two engineering laboratories and a curriculum focusing on system design, database management, and business administration fundamentals.',
      details: 'Initial cohort: 75 students | Faculty: 8 pioneering instructors.',
      icon: FiFlag,
      color: 'text-sky-600 bg-sky-50 border-sky-100'
    },
    {
      year: '2018',
      title: 'First Graduates & State Accreditation',
      desc: 'The institute celebrated its first graduating class of computer science and management scholars, with an impressive 89% securing placement within six months. In the same year, FIT achieved full regional accreditation and formal university alliance credentials.',
      details: 'First batch size: 68 graduates | Top hiring sectors: Software and Fintech.',
      icon: FiAward,
      color: 'text-amber-600 bg-amber-50 border-amber-100'
    },
    {
      year: '2021',
      title: 'Innovation Hub & Postgraduate Grants',
      desc: 'FIT inaugurated its Robotics & Sustainable Energy Innovation Center. Backed by government research grants, the center has since produced key patents in solar micro-grid designs and decentralized security protocols.',
      details: 'Research funding: $1.2M USD | Patents filed: 3 unique architectures.',
      icon: FiBookmark,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    },
    {
      year: '2024',
      title: 'Campus Expansion & Central Library',
      desc: 'To support a rapidly expanding student body, the physical campus footprint doubled. This expansion saw the construction of a state-of-the-art Central Library housing online research databases, a multi-sport indoor stadium, and a modern residential hostel.',
      details: 'Library capacity: 50,000+ volumes | Hostel capacity: 400+ residents.',
      icon: FiStar,
      color: 'text-rose-600 bg-rose-50 border-rose-100'
    },
    {
      year: '2026',
      title: 'Fully Digital Ecosystem Rollout',
      desc: 'FIT completed the transition to a fully digitized registrar system, integrating student profiles, academic schedules, term results, and fee accounts into a single secure web application. This phase establishes FIT as one of the most technologically advanced campuses in the region.',
      details: 'Platform uptime: 99.9% | Transactions: 100% paperless.',
      icon: FiTrendingUp,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100'
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        
        {/* Navigation back */}
        <div className="flex justify-between items-center">
          <Link
            href="/about"
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <FiArrowLeft className="text-sm" />
            Back to Overview
          </Link>
          <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            FIT Chronicle
          </span>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Our Historic Journey
          </h1>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed">
            From a focused engineering center in 2015 to a multi-disciplinary technology institute today. Discover the key milestones in our growth.
          </p>
        </div>

        {/* Founding Philosophy Quote */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-200" />
          <blockquote className="text-slate-600 italic text-xs sm:text-sm leading-relaxed">
            &ldquo;We did not build Fontana simply to award certificates. We designed it as a community where young minds acquire the discipline, ethics, and technical prowess required to transform society through technology.&rdquo;
          </blockquote>
          <div className="flex flex-col gap-0.5">
            <cite className="font-extrabold text-slate-900 text-xs sm:text-sm not-italic">
              Marcus Vance, Sr.
            </cite>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Co-Founder & Chief Academic Trustee
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col gap-8">
          {/* Vertical central bar (only on sm and above) */}
          <div className="absolute left-[39px] sm:left-[47px] top-12 bottom-12 w-0.5 bg-slate-100" />
          
          <div className="flex flex-col gap-10 relative z-10">
            {timeline.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex gap-4 sm:gap-6 items-start group">
                  
                  {/* Badge Timeline circle */}
                  <div className={`w-12 h-12 rounded-full border-2 border-white flex items-center justify-center shrink-0 shadow-xs relative transition-transform group-hover:scale-105 ${item.color}`}>
                    <Icon className="text-base" />
                  </div>

                  {/* Content block */}
                  <div className="flex flex-col gap-2 mt-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                      <h3 className="font-black text-slate-900 text-sm sm:text-base group-hover:text-sky-650 transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-xs font-black text-sky-600 tracking-wider bg-sky-50 px-2.5 py-0.5 rounded-full w-fit">
                        Year {item.year}
                      </span>
                    </div>
                    
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-2xl">
                      {item.desc}
                    </p>

                    <div className="mt-1 bg-slate-50 border border-slate-100/60 p-2.5 rounded-xl text-[10px] sm:text-xs font-semibold text-slate-500 max-w-fit">
                      {item.details}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="flex justify-center pt-4">
          <Link
            href="/about/vision"
            className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-2"
          >
            <span>Next: Vision & Core Values</span>
            <FiStar />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default HistoryPage;
