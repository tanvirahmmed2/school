'use client';

import React from 'react';
import { FiUsers, FiAward, FiGlobe, FiBriefcase, FiBookOpen } from 'react-icons/fi';

const CollaborationsPage = () => {
  const partners = [
    {
      name: 'MIT Media Lab',
      type: 'Research Alliance',
      description: 'Collaborating on next-generation edge intelligence and embedded systems designs.',
      location: 'Cambridge, USA',
      icon: FiGlobe,
      color: 'from-purple-500 to-indigo-600',
      bgLight: 'bg-purple-50 text-purple-650'
    },
    {
      name: 'Samsung R&D Institute',
      type: 'Industrial Partner',
      description: 'Funding research programs in IoT protocols and providing internships for senior students.',
      location: 'Dhaka, Bangladesh',
      icon: FiBriefcase,
      color: 'from-blue-500 to-sky-650',
      bgLight: 'bg-blue-50 text-blue-650'
    },
    {
      name: 'National University of Singapore',
      type: 'Academic Exchange',
      description: 'Student exchange initiative allowing credit transfers for Computer Engineering courses.',
      location: 'Singapore',
      icon: FiAward,
      color: 'from-orange-500 to-amber-600',
      bgLight: 'bg-orange-50 text-orange-650'
    },
    {
      name: 'Cisco Networking Academy',
      type: 'Technical Program',
      description: 'Authorized local laboratory providing networking certifications and industry curriculum.',
      location: 'Global Partnership',
      icon: FiBookOpen,
      color: 'from-emerald-500 to-teal-650',
      bgLight: 'bg-emerald-50 text-emerald-650'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            Global Network
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Our Collaborations
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            We partner with leading universities, tech giants, and global research institutions to offer world-class exposure to our faculty and students.
          </p>
        </div>

        {/* Dynamic Partner Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {partners.map((partner, idx) => {
            const Icon = partner.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-100 hover:border-sky-100 hover:shadow-lg transition-all duration-300 p-8 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Visual gradient accent on hover */}
                <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${partner.color} opacity-80`}></div>

                <div className="flex gap-5 items-start pl-2">
                  <div className={`w-14 h-14 rounded-2xl ${partner.bgLight} flex items-center justify-center text-2xl shrink-0 shadow-inner group-hover:scale-105 transition-transform`}>
                    <Icon />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {partner.type}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-sky-600 transition-colors">
                      {partner.name}
                    </h3>
                    <p className="text-slate-400 text-xs font-bold flex items-center gap-1">
                      <FiGlobe className="text-slate-350" /> {partner.location}
                    </p>
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed mt-2.5">
                      {partner.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Network Section */}
        <div className="bg-gradient-to-tr from-slate-900 to-sky-950 text-white rounded-3xl p-8 md:p-12 text-center flex flex-col items-center gap-6 relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent"></div>
          <div className="flex flex-col gap-3 relative z-10">
            <h2 className="text-xl md:text-2xl font-black tracking-tight">
              Interested in Partnering with FIT?
            </h2>
            <p className="text-sky-200 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
              We are constantly seeking innovative researchers, corporate trainers, and universities to join our collaborative networks. Contact our external relations office to initiate joint ventures.
            </p>
          </div>
          <a
            href="mailto:collaborations@fit.edu.bd"
            className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold px-6 py-3 rounded-xl shadow-md hover:scale-[1.02] transition-all relative z-10 text-sm"
          >
            <FiUsers />
            <span>Connect with External Relations</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CollaborationsPage;
