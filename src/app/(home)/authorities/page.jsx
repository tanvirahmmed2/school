'use client';

import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { Context } from '@/component/helper/Context';
import AuthorityCard from '@/component/cards/AuthorityCard';
import { FiChevronRight, FiUsers, FiBriefcase, FiAward } from 'react-icons/fi';

const AuthoritiesPage = () => {
  const { designations: contextDesignations } = useContext(Context);

  const [authorities, setAuthorities] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all authority members
        const authRes = await fetch('/api/authorities');
        if (authRes.ok) {
          const authData = await authRes.json();
          const payload = authData.paylod || authData.payload || {};
          setAuthorities(payload.authorities || []);
        }

        if (contextDesignations && contextDesignations.length > 0) {
          setDesignations(contextDesignations);
        } else {
          const desRes = await fetch('/api/authorities/designations');
          if (desRes.ok) {
            const desData = await desRes.json();
            const desPayload = desData.paylod || desData.payload || {};
            setDesignations(desPayload.designations || []);
          }
        }
      } catch (err) {
        console.error('Error fetching authority data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contextDesignations]);

  const isHeadFlag = (val) => val === true || val === 'true' || val === 1 || val === '1';

  const headMembers = authorities.filter((a) => isHeadFlag(a?.is_head));

  const displayHeadMembers = headMembers;

  const otherDesignations = designations.filter((d) => !isHeadFlag(d?.is_head));

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Governance &amp; Authorities
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Institutional leadership profiles and departmental governance directories.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80">
            <FiAward className="text-primary text-base" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Head of Institution
            </h2>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse space-y-3">
              <div className="h-5 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-100 rounded w-1/4" />
              <div className="h-12 bg-slate-100 rounded w-full" />
            </div>
          ) : displayHeadMembers.length > 0 ? (
            <div className="space-y-4 w-full flex flex-wrap justify-center items-center">
              {displayHeadMembers.map((member) => (
                <AuthorityCard key={member.id} authority={member} isRole={false} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center space-y-1">
              <FiUsers className="text-slate-300 text-2xl mx-auto" />
              <p className="text-xs text-slate-500 font-medium">No head profiles available.</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
            
            <span className="text-xs text-slate-400 font-semibold">
              {otherDesignations.length} directories
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col gap-2.5">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white border border-slate-200/80 rounded-xl p-4 animate-pulse h-14" />
              ))}
            </div>
          ) : otherDesignations.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {otherDesignations.map((des) => {
                const memberCount = authorities.filter(
                  (a) =>
                    (a.designation || '').toLowerCase() === (des.slug || '').toLowerCase() ||
                    (a.designation_title || '').toLowerCase() === (des.title || '').toLowerCase()
                ).length;

                return (
                  <Link
                    key={des.id || des.slug}
                    href={`/authorities/${des.slug}`}
                    className="group bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-primary/60 rounded-xl px-4 py-3.5 flex items-center justify-between transition-all"
                  >
                    <div className="min-w-0 pr-4">
                      <h3 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors truncate">
                        {des.title}
                      </h3>
                      {des.description && (
                        <p className="text-xs text-slate-500 truncate max-w-md">
                          {des.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-semibold text-slate-400 group-hover:text-primary transition-colors">
                        {memberCount} {memberCount === 1 ? 'member' : 'members'}
                      </span>
                      <FiChevronRight className="text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all text-sm" />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center">
              <p className="text-xs text-slate-400">No other designations listed.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AuthoritiesPage;
