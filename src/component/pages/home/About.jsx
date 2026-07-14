'use client';

import React from 'react';
import { FiAward, FiBook, FiCheckCircle } from 'react-icons/fi';

const About = () => {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="inline-block text-xs font-bold text-sky-650 bg-sky-50 px-3.5 py-1.5 rounded-full uppercase tracking-widest w-fit text-sky-600">
              Who We Are
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A Legacy of Academic and Personal Excellence
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Founded on the pillars of character, scholarship, and community, Fontana Institute of Technology is dedicated to preparing students for global career success. Our state-of-the-art facilities and progressive teaching methods cultivate a dynamic environment where potential is transformed into achievement.
            </p>

            <div className="flex flex-col gap-3 mt-2">
              <div className="flex gap-2.5 items-start">
                <FiCheckCircle className="text-sky-500 w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 text-sm">Distinguished Global Faculty</p>
                  <p className="text-slate-500 text-xs mt-0.5">Learn from certified instructors and industry professionals with years of field experience.</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <FiCheckCircle className="text-sky-500 w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 text-sm">Comprehensive Curriculums</p>
                  <p className="text-slate-500 text-xs mt-0.5">Academic plans aligned with standard college frameworks and digital advancements.</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <FiCheckCircle className="text-sky-500 w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 text-sm">State-of-the-art Campus & Hostel Systems</p>
                  <p className="text-slate-500 text-xs mt-0.5">Modern class environments, scientific labs, and well-managed residential properties.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Cards column */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex flex-col gap-3">
              <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center font-bold">
                <FiBook />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Modern Classrooms</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Smart displays, stable connectivity, and modern teaching aids for high quality learning experiences.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex flex-col gap-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
                <FiAward />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Research Labs</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Fully equipped engineering, physics, and computer science modules for hands-on research.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex flex-col gap-3 sm:col-span-2">
              <h3 className="font-bold text-slate-800 text-sm">Fontana Accreditation</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                FIT is fully accredited by regional academic senates, ensuring global recognition of transcripts, courses, and certifications.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;