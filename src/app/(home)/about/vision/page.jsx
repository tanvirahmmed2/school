'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FiTarget, 
  FiHeart, 
  FiCpu, 
  FiAward, 
  FiArrowLeft, 
  FiCheckCircle, 
  FiBookOpen,
  FiGlobe
} from 'react-icons/fi';

const VisionPage = () => {
  const values = [
    {
      title: 'Academic Excellence',
      desc: 'We enforce high curriculum standards, invite leading tech executives to audit courses, and structure grading registers to encourage pure technical mastery.',
      icon: FiBookOpen,
      color: 'text-sky-600 bg-sky-50 border-sky-100'
    },
    {
      title: 'Ethical Responsibility',
      desc: 'Nurturing a culture of transparency, digital fairness, and academic integrity. We prepare graduates to be socially responsible leaders.',
      icon: FiHeart,
      color: 'text-rose-600 bg-rose-50 border-rose-100'
    },
    {
      title: 'Sustainable Innovation',
      desc: 'Fostering practical solutions. Our students build microgrid software, solar charging models, and clean tech architectures in our hardware engineering labs.',
      icon: FiCpu,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    },
    {
      title: 'Global Inclusivity',
      desc: 'Fostering a campus open to diverse ideas and backgrounds, supported by active clubs, scholarship schemes, and mental health counseling.',
      icon: FiGlobe,
      color: 'text-amber-600 bg-amber-50 border-amber-100'
    }
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
            Academic Outlook
          </span>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Our Vision & Core Values
          </h1>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed">
            FIT is guided by a commitment to academic rigor, green innovation, and social responsibility. Explore our roadmap for student development.
          </p>
        </div>

        {/* Vision Statement Box */}
        <div className="relative bg-slate-900 text-white rounded-3xl p-8 overflow-hidden shadow-md border border-slate-800 flex flex-col gap-4">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950/80 z-0" />
          <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/20 text-sky-400 flex items-center justify-center shrink-0">
              <FiTarget className="text-xl" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                The Long-Term Aim
              </span>
              <h3 className="font-extrabold text-white text-base sm:text-lg">
                To stand at the global forefront of technical and administrative education.
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-1">
                FIT envisions a research-centered, digital-native academy. We cultivate critical thinkers and engineering specialists capable of solving real-world challenges, innovating sustainable technologies, and navigating international market demands.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight text-center sm:text-left">
            Our 4 Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col gap-3 shadow-xs hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${val.color}`}>
                      <Icon className="text-sm sm:text-base" />
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      {val.title}
                    </h4>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed mt-1">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quality Charter Banner */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row gap-6 items-start relative">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <FiAward className="text-xl" />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Academic Quality Framework
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              We continually audit our study paths using evaluation reports from tech industry leaders. Each term, the registrar evaluates class pass rates, teacher logs, and hardware lab safety benchmarks. This data-driven feedback loop allows us to dynamically refine courses while staying true to our foundational values.
            </p>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="flex justify-center pt-4">
          <Link
            href="/about/mission-vission"
            className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-2"
          >
            <span>Next: Mission Statement</span>
            <FiCheckCircle />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default VisionPage;
