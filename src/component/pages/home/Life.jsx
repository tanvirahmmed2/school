'use client';

import React from 'react';
import { FiHome, FiCompass, FiTarget } from 'react-icons/fi';
import Link from 'next/link';
import { SCHOOL_NAME } from '@/lib/secret';

const Life = () => {
  let schoolname=SCHOOL_NAME
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full">
        <div className="text-center mb-12">
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Student Life at {schoolname.split(" ").map(word => word[0]).join("")}
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto text-sm">
            Education goes beyond classrooms. We provide rich campus spaces for co-curricular clubs, sports, and secure community living.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
            <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center text-xl shrink-0">
              <FiCompass />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Student Activity Clubs</h3>
              <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                Connect with peers in our coding club, debate assemblies, research organizations, and athletic events to develop team leadership qualities.
              </p>
            </div>
            <Link href="/clubs" className="mt-auto text-xs font-bold text-sky-600 hover:text-sky-850 transition-colors">
              Explore Clubs →
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl shrink-0">
              <FiHome />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Secure Residential Halls</h3>
              <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                Clean, gender-segregated on-campus hostels with designated room layouts, active provost management, and strict student-hostel gender matching rules.
              </p>
            </div>
            <Link href="/facilities/hostels" className="mt-auto text-xs font-bold text-sky-650 hover:text-sky-850 transition-colors text-amber-600">
              View Residences →
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl shrink-0">
              <FiTarget />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Sports & Athletics</h3>
              <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                A massive central campus sports ground supporting soccer, cricket, running tracks, and dynamic indoor basketball courts to promote physical fitness.
              </p>
            </div>
            <span className="mt-auto text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              FIT Physical Education
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Life;