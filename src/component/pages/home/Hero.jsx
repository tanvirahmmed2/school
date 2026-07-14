'use client';

import React from 'react';
import Link from 'next/link';
import { FiArrowRight, FiBookOpen, FiUser, FiActivity, FiAward } from 'react-icons/fi';

const Hero = () => {
  return (
    <section className="w-full bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.15),transparent_45%)]" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="max-w-3xl">
          <span className="inline-block text-xs font-bold text-sky-400 bg-sky-950/60 border border-sky-900 px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-6">
            Fontana Institute of Technology
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-white mb-6">
            Empowering Minds <br />
            <span className="text-sky-400">Shaping Futures</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
            Welcome to a community dedicated to academic rigor, creative innovation, and global leadership. We provide students the resources and support to excel in their chosen fields.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-16">
            <Link 
              href="/apply" 
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-sky-500/20"
            >
              <span>Apply for Admission</span>
              <FiArrowRight />
            </Link>
            <Link 
              href="/auth/student/login" 
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-6 py-3 rounded-xl text-sm border border-slate-700 transition-all"
            >
              <span>Student Portal</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-800">
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-center text-sky-400 shrink-0">
              <FiUser className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black">1,500+</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Students</p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-center text-sky-400 shrink-0">
              <FiBookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black">80+</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Expert Faculty</p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-center text-sky-400 shrink-0">
              <FiActivity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black">30+</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Programs</p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-center text-sky-400 shrink-0">
              <FiAward className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black">99.2%</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Graduation Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;