import React from 'react';
import Link from 'next/link';
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
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            FIT Leadership
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Governance & Authorities
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            FIT is governed by a board of seasoned academic and operational managers directing our syllabus standards.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {roles.map((role, idx) => {
            const Icon = role.icon;
            return (
              <Link
                key={idx}
                href={role.href}
                className="bg-white rounded-2xl border border-slate-100 p-6 flex gap-4 hover:border-sky-200 hover:shadow-xs transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <Icon />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-sky-600 transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                    {role.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AuthoritiesPage;
