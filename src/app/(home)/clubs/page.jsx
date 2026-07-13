'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiUsers, FiArrowRight } from 'react-icons/fi';

const ClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch('/api/clubs');
        if (res.ok) {
          const data = await res.json();
          setClubs(data.paylod.clubs || []);
        }
      } catch (err) {
        console.error('Failed to fetch clubs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-50/55 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            Student Life
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Our Student Clubs
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            Join one of our student activity communities. Build new skills, coordinate group exhibitions, and showcase innovations.
          </p>
        </div>

        {/* Loading / Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs animate-pulse flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-200"></div>
                <div className="w-24 h-4 bg-slate-200 rounded"></div>
                <div className="w-32 h-3 bg-slate-200 rounded"></div>
                <div className="w-full h-8 bg-slate-200 rounded mt-4"></div>
              </div>
            ))}
          </div>
        ) : clubs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <div
                key={club.id}
                className="bg-white rounded-2xl border border-slate-100 hover:border-sky-200 hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 text-xl font-bold mb-4 group-hover:scale-105 transition-transform duration-200 overflow-hidden border border-slate-100">
                    {club.image ? (
                      <img src={club.image} alt={club.name} className="w-full h-full object-cover" />
                    ) : (
                      <FiUsers />
                    )}
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-sky-600 transition-colors">
                    {club.name}
                  </h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                    Slug: {club.slug}
                  </p>
                  <p className="text-slate-500 text-xs mt-3 leading-relaxed line-clamp-3">
                    {club.description || 'Welcome to our student activity club. This community is established to help students build skills, coordinate group events, and showcase innovations at institute conferences.'}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50">
                  <Link
                    href={`/clubs/${club.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-850 transition-colors"
                  >
                    <span>View Club Details</span>
                    <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center max-w-md mx-auto shadow-xs mt-8">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto text-xl mb-4">
              <FiUsers />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No active clubs found</h3>
            <p className="text-slate-500 text-xs mt-1">
              There are currently no listed student clubs in our records.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubsPage;
