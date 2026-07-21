'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FiBookOpen, 
  FiActivity, 
  FiMap, 
  FiArrowLeft, 
  FiArrowRight, 
  FiHeart, 
  FiShield, 
  FiSun 
} from 'react-icons/fi';

const CampusPage = () => {
  const facilities = [
    {
      title: 'Central Library',
      desc: 'An expansive academic repository featuring over 50,000 reference volumes, international journal catalog databases, and 20 quiet digital terminals for research.',
      icon: FiBookOpen,
      color: 'text-sky-600 bg-sky-50 border-sky-100'
    },
    {
      title: 'High-Tech Labs & Innovation Hub',
      desc: 'Equipped with clean workbench modules, digital oscilloscopes, microcontroller boards, and high-performance server workstations for engineering practice.',
      icon: FiActivity,
      color: 'text-rose-600 bg-rose-50 border-rose-100'
    },
    {
      title: 'Residential Hostels',
      desc: 'Twin-sharing student rooms featuring dining halls, stable fiber Wi-Fi networks, laundry facilities, and 24/7 security watch systems.',
      icon: FiMap,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    }
  ];

  const highlights = [
    {
      title: 'Campus Medical Clinic',
      desc: 'Our health wing provides daily diagnostic checkups, primary medicines, and recovery care for sports physical activities.',
      icon: FiHeart,
      color: 'text-amber-500 bg-amber-50'
    },
    {
      title: 'Eco-Friendly Setup',
      desc: 'Incorporating clean energy structures including 80kW rooftop solar grid arrays, green study gardens, and rainwater conservation basins.',
      icon: FiSun,
      color: 'text-emerald-500 bg-emerald-50'
    },
    {
      title: 'Secure Access & Network',
      desc: 'Entire campus is secured with RFID card check-gates, complete CCTV coverage, and secure student credentials access across portals.',
      icon: FiShield,
      color: 'text-indigo-500 bg-indigo-50'
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
            Campus Life
          </span>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Our Campus & Infrastructure
          </h1>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed">
            FIT is spread across a modern campus layout designed to stimulate intellectual conversations, collaborative engineering projects, and a healthy lifestyle.
          </p>
        </div>

        {/* Core Facilities Grid */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Key Academic Facilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {facilities.map((fac, idx) => {
              const Icon = fac.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col gap-3 shadow-xs hover:shadow-sm transition-shadow"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${fac.color}`}>
                    <Icon className="text-base" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    {fac.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {fac.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Campus services highlights */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          <h3 className="font-bold text-slate-900 text-base sm:text-lg border-b border-slate-100 pb-4">
            Services & Infrastructure Standards
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {highlights.map((h, idx) => {
              const Icon = h.icon;
              return (
                <div key={idx} className="flex gap-4 items-start">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 ${h.color}`}>
                    <Icon className="text-sm" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      {h.title}
                    </h4>
                    <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed">
                      {h.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-950/40 via-slate-900 to-indigo-950/40 z-0" />
          
          <div className="relative z-10 flex flex-col gap-1.5 max-w-xl">
            <h4 className="font-black text-white text-base sm:text-lg">
              Looking for detailed measurements & parameters?
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Read technical specs about our lab apparatus, hostel rules, clinic facilities, and library open-hours.
            </p>
          </div>

          <Link
            href="/about/campus-details"
            className="relative z-10 bg-white hover:bg-slate-50 text-slate-900 font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-xs hover:shadow-md cursor-pointer shrink-0 flex items-center gap-1.5"
          >
            <span>Campus Specifications</span>
            <FiArrowRight />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CampusPage;
