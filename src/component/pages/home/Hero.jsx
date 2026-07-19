'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiBookOpen, FiUsers, FiLayers } from 'react-icons/fi';

const Hero = () => {
  const [stats, setStats] = useState({
    totalStudents: 1500,
    totalTeachers: 80,
    totalClasses: 12
  });
  const [schoolName, setSchoolName] = useState('Fontana Institute of Technology');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch('/api/public/stats');
        const statsData = await statsRes.json();
        if (statsData.success && statsData.payload) {
          setStats({
            totalStudents: statsData.payload.totalStudents || 0,
            totalTeachers: statsData.payload.totalTeachers || 0,
            totalClasses: statsData.payload.totalClasses || 0 
          });
        }
      } catch (err) {
        console.error('Error fetching public stats:', err);
      }

      try {
        const settingsRes = await fetch('/api/admin/website-settings');
        const settingsData = await settingsRes.json();
        if (settingsData.success && settingsData.paylod?.settings?.school_name) {
          setSchoolName(settingsData.paylod.settings.school_name);
        }
      } catch (err) {
        console.error('Error fetching website settings:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-60 select-none pointer-events-none"
      >
        <source src="/campus.mp4" type="video/mp4" />
      </video>

 
      {/* Content Container */}
      <div className="max-w-6xl mx-auto w-full relative z-10 flex flex-col items-center text-center">
        

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-none mb-8 max-w-4xl">
          {schoolName}
        </h1>

        <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mb-12 leading-relaxed font-light">
          Welcome to a community dedicated to academic rigor, creative innovation, and global leadership. We provide students the resources and support to excel in their chosen fields.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20 w-full sm:w-auto px-4 justify-center">
          <Link 
            href="/apply" 
            className="group relative inline-flex items-center justify-center gap-2 bg-linear-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold px-8 py-4 rounded-xl text-sm transition-all duration-300 shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 hover:-translate-y-0.5"
          >
            <span>Apply for Admission</span>
            <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link 
            href="/auth/student/login" 
            className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-xl text-sm border border-white/10 hover:border-white/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5"
          >
            <span>Student Portal</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-white/10 w-full">
          
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 hover:border-sky-500/30 p-5 rounded-2xl backdrop-blur-md hover:bg-white/10 hover:shadow-lg hover:shadow-sky-500/5 group transition-all duration-300">
            <div className="w-12 h-12 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-110 transition-transform duration-300">
              <FiUsers className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-3xl font-black text-white tracking-tight">
                {stats.totalStudents.toLocaleString()}+
              </p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Total Students</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 hover:border-sky-500/30 p-5 rounded-2xl backdrop-blur-md hover:bg-white/10 hover:shadow-lg hover:shadow-sky-500/5 group transition-all duration-300">
            <div className="w-12 h-12 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-110 transition-transform duration-300">
              <FiBookOpen className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-3xl font-black text-white tracking-tight">
                {stats.totalTeachers}+
              </p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Expert Faculty</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 hover:border-sky-500/30 p-5 rounded-2xl backdrop-blur-md hover:bg-white/10 hover:shadow-lg hover:shadow-sky-500/5 group transition-all duration-300">
            <div className="w-12 h-12 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-110 transition-transform duration-300">
              <FiLayers className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-3xl font-black text-white tracking-tight">
                {stats.totalClasses}
              </p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Academic Classes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;