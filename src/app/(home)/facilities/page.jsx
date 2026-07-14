'use client';

import React from 'react';
import Link from 'next/link';
import { FiHome, FiBookOpen, FiArrowRight, FiActivity } from 'react-icons/fi';

const FacilitiesPage = () => {
  const cards = [
    {
      title: 'Residential Hostels',
      desc: 'Learn about on-campus residential housing, gender-segregated dorms, pricing structure, and provost rules.',
      href: '/facilities/hostels',
      icon: FiHome,
      color: 'text-amber-600 bg-amber-50'
    },
    {
      title: 'Modern Classrooms & Halls',
      desc: 'Explore classrooms featuring smart interactive projectors, comfortable seating layouts, and sound dampening systems.',
      href: '/facilities/classrooms',
      icon: FiBookOpen,
      color: 'text-sky-600 bg-sky-50'
    },
    {
      title: 'Athletic Sports Grounds',
      desc: 'FIT maintains a major outdoor sports field, athletic running tracks, and dynamic indoor gyms for students.',
      href: '/about/campus',
      icon: FiActivity,
      color: 'text-emerald-600 bg-emerald-50'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-sky-655 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest text-sky-600">
            FIT Facilities
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Institute Facilities & Services
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            Exploring on-campus infrastructure designed to simplify study, housing allocations, and student routines.
          </p>
        </div>

        {/* Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col gap-4 shadow-xs"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
                  <Icon className="text-sm" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">
                    {card.title}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                <Link
                  href={card.href}
                  className="mt-auto text-[10px] font-bold text-sky-600 uppercase tracking-wider flex items-center gap-1 hover:text-sky-800"
                >
                  <span>Explore facility</span>
                  <FiArrowRight />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Footer info box */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 mt-8 shadow-xs flex flex-col gap-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <h3 className="font-bold text-slate-900 text-base">Continuous Upgrades</h3>
          <p>
            Fontana regularly updates academic spaces to align with environmental codes. We rely on solar grids, rainwater processing stations, and energy-conserving smart lights across all main class blocks and hostel wings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FacilitiesPage;