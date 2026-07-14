'use client';

import React from 'react';
import Link from 'next/link';
import { FiClock, FiTarget, FiMap, FiArrowRight, FiBookOpen } from 'react-icons/fi';

const About = () => {
  const sections = [
    {
      title: 'Our Historic Journey',
      desc: 'Explore the major milestones and founding chronicles of Fontana Institute of Technology since 2015.',
      href: '/about/history',
      icon: FiClock,
      color: 'text-sky-600 bg-sky-50'
    },
    {
      title: 'Vision & Core Values',
      desc: 'Learn about our long-term academic objectives, ethical guidelines, and dedication to research.',
      href: '/about/vision',
      icon: FiTarget,
      color: 'text-amber-600 bg-amber-50'
    },
    {
      title: 'Mission Statement',
      desc: 'Read our institutional mission detailing progressive teaching frameworks and student care.',
      href: '/about/mission-vission',
      icon: FiBookOpen,
      color: 'text-emerald-600 bg-emerald-50'
    },
    {
      title: 'Campus & Infrastructure',
      desc: 'Take a tour of our state-of-the-art libraries, high-tech labs, and residential hostels.',
      href: '/about/campus',
      icon: FiMap,
      color: 'text-rose-600 bg-rose-50'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            Overview
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            About Fontana Institute
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            Fontana Institute of Technology (FIT) is an educational academy built to inspire, train, and support student success in the technology and management fields.
          </p>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <Link
                key={idx}
                href={sec.href}
                className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col gap-4 hover:shadow-xs hover:border-slate-200 transition-all group cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${sec.color}`}>
                  <Icon className="text-sm" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm group-hover:text-sky-650 transition-colors">
                    {sec.title}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                    {sec.desc}
                  </p>
                </div>
                <div className="mt-auto text-[10px] font-bold text-sky-600 uppercase tracking-wider flex items-center gap-1 group-hover:text-sky-850">
                  <span>Explore Section</span>
                  <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Institution Info */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 mt-8 shadow-xs flex flex-col gap-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <h3 className="font-bold text-slate-900 text-base">FIT Charter of Academic Quality</h3>
          <p>
            We are committed to delivering global standard computer science and administration courses. Fontana recruits seasoned faculty members, hosts regular career placement seminars, and maintains modern lab setups. By utilizing clean digital registry workflows (student records, results, schedules), we ensure maximum transparency for parents and students alike.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;