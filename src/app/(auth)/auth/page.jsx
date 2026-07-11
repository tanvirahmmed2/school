'use client';

import React from 'react';
import Link from 'next/link';
import { FiUsers, FiBookOpen, FiBriefcase, FiShield, FiArrowRight, FiActivity } from 'react-icons/fi';

const AuthPortalSelectionPage = () => {
  const portals = [
    {
      title: 'Student Portal',
     href: '/auth/student/login',
      icon: FiBookOpen,
      badge: 'Student Log',
      cardClass: 'bg-white hover:border-blue-350 hover:shadow-[0_15px_35px_rgba(59,130,246,0.08)] border-slate-200/80',
      iconClass: 'bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-100',
      badgeClass: 'bg-blue-50 text-blue-600 border border-blue-100',
      footerClass: 'group-hover:text-blue-600',
      gradient: 'from-blue-500/5 to-transparent'
    },
    {
      title: 'Teacher Portal',
      href: '/auth/teacher/login',
      icon: FiUsers,
      badge: 'Academic Panel',
      cardClass: 'bg-white hover:border-indigo-350 hover:shadow-[0_15px_35px_rgba(99,102,241,0.08)] border-slate-200/80',
      iconClass: 'bg-indigo-50 text-indigo-600 border border-indigo-100 group-hover:bg-indigo-100',
      badgeClass: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
      footerClass: 'group-hover:text-indigo-600',
      gradient: 'from-indigo-500/5 to-transparent'
    },
    {
      title: 'Administrative Portal',
      href: '/auth/access/login',
      icon: FiShield,
      badge: 'System Admin',
      cardClass: 'bg-white hover:border-purple-350 hover:shadow-[0_15px_35px_rgba(168,85,247,0.08)] border-slate-200/80',
      iconClass: 'bg-purple-50 text-purple-600 border border-purple-100 group-hover:bg-purple-100',
      badgeClass: 'bg-purple-50 text-purple-600 border border-purple-100',
      footerClass: 'group-hover:text-purple-600',
      gradient: 'from-purple-500/5 to-transparent'
    }
  ];

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white text-slate-800 relative px-4 py-16 overflow-hidden">
     
      <div className="absolute top-[-10%] left-[-10%] w-[50%] aspect-square rounded-full bg-blue-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-40"></div>

      <div className="w-full flex items-center justify-center flex-col relative z-10">
        
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
          {portals.map((portal) => {
            const Icon = portal.icon;

            return (
              <Link
                key={portal.href}
                href={portal.href}
                className={`group relative border p-7 md:p-8 rounded-[28px] transition-all duration-300 ease-out hover:-translate-y-1 ${portal.cardClass} flex flex-col justify-between overflow-hidden cursor-pointer min-h-[220px]`}
              >
               
                <div>
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${portal.iconClass}`}>
                      <Icon className="text-xl" />
                    </div>
                    <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-lg ${portal.badgeClass}`}>
                      {portal.badge}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-800 tracking-tight relative z-10 group-hover:text-slate-900">
                    {portal.title}
                  </h2>
                  
                </div>

                <div className={`mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 transition-colors relative z-10 ${portal.footerClass}`}>
                  <span>Enter Portal Dashboard</span>
                  <FiArrowRight className="text-lg transition-transform duration-300 group-hover:translate-x-1.5" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="w-full text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-450 hover:text-slate-700 transition-colors py-2 px-4 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 shadow-xs text-slate-500"
          >
            Return to School Home Screen
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPortalSelectionPage;
