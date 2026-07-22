'use client';

import React from 'react';
import AuthorityCard from '@/component/cards/AuthorityCard';
import { FiUser, FiUsers, FiShield, FiBriefcase, FiFileText } from 'react-icons/fi';

const AuthoritiesPage = () => {
  const roles = [
    { title: 'The Principal', href: '/authorities/principal', icon: FiUser, desc: 'Office of the Principal, chief academic officer overview.' },
    { title: 'The Chairman', href: '/authorities/chairman', icon: FiShield, desc: 'Governing board of directors chairman profiles.' },
    { title: 'Executive Director', href: '/authorities/director', icon: FiUser, desc: 'Operational development strategy division statement.' },
    { title: 'Academic Council', href: '/authorities/council', icon: FiUsers, desc: 'Central curriculum review senate board roster.' },
    { title: 'Office of the Registrar', href: '/authorities/registrar', icon: FiFileText, desc: 'Student registrations, admissions, transcripts, and records.' },
    { title: 'Administrative Support Staffs', href: '/authorities/staff', icon: FiBriefcase, desc: 'Support staff teams, desks, and contact timings.' },
    { title: 'Executive Officers', href: '/authorities/officers', icon: FiUsers, desc: 'Directory of institutional officers and department leads.' },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest border border-sky-100">
            FIT Leadership
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Governance &amp; Authorities
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            FIT is governed by a board of seasoned academic and operational managers directing our syllabus standards.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {roles.map((role, idx) => (
            <AuthorityCard key={idx} authority={role} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthoritiesPage;
