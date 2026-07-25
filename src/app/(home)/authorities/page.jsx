'use client';

import React, { useContext } from 'react';
import { Context } from '@/component/helper/Context';
import AuthorityCard from '@/component/cards/AuthorityCard';
import { FiShield, FiUsers } from 'react-icons/fi';

const AuthoritiesPage = () => {
  const { designations } = useContext(Context);

  const displayRoles = designations && designations.length > 0
    ? designations.map(d => ({
        title: d.title,
        slug: d.slug,
        href: `/authorities/${d.slug}`,
        desc: d.description || `Appointed leadership and governance for ${d.title}.`,
        icon: FiShield
      }))
    : [];

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Governance &amp; Authorities
          </h1>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            Explore our governance structure and access detailed directories of appointed board members, executive directors, and department authorities.
          </p>
        </div>

        {displayRoles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayRoles.map((role) => (
              <AuthorityCard key={role.slug} authority={role} isRole={true} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary-light text-primary border border-primary-light flex items-center justify-center mx-auto text-2xl">
              <FiUsers />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900">No Authority Roles Available</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                No authority designations have been configured yet.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AuthoritiesPage;
