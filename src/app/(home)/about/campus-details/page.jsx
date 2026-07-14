'use client';

import React from 'react';
import { FiBookOpen, FiActivity, FiMapPin, FiHeart, FiHome } from 'react-icons/fi';
import Link from 'next/link';

const CampusDetailsPage = () => {
  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            Details
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Fontana Campus Details
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            Exploring the dynamic features, physical layouts, and standard services offered on our campus site.
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col gap-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="flex gap-4 items-center border-b border-slate-100 pb-4">
            <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center shrink-0">
              <FiBookOpen />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Central Library Terminals</h3>
              <p className="text-slate-500 text-xs mt-0.5">Equipped with 20 internet terminals, online research catalog, and comfortable quiet reading sections.</p>
            </div>
          </div>

          <div className="flex gap-4 items-center border-b border-slate-100 pb-4">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
              <FiActivity />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Hardware Engineering Laboratories</h3>
              <p className="text-slate-500 text-xs mt-0.5">High-speed computers, development microcontrollers, oscilloscope boards, and soldering stations.</p>
            </div>
          </div>

          <div className="flex gap-4 items-center border-b border-slate-100 pb-4">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <FiHome />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Student Resident Amenities</h3>
              <p className="text-slate-500 text-xs mt-0.5">Clean water supply, reliable power fallback, safe designated study rooms, and robust allocation guidelines.</p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
              <FiHeart />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Medical Center & Recreation</h3>
              <p className="text-slate-500 text-xs mt-0.5">FIT Campus Clinic provides daily health checkups, primary care medicines, and simple sports recovery units.</p>
            </div>
          </div>

          <div className="flex gap-3 justify-end border-t border-slate-100 pt-6 mt-2">
            <Link
              href="/about/campus"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Back to Overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusDetailsPage;