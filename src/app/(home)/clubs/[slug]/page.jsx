'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiUsers, FiAward, FiArrowLeft } from 'react-icons/fi';

const ClubDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;

  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch('/api/clubs');
        if (res.ok) {
          const data = await res.json();
          const list = data.paylod.clubs || [];
          setClubs(list);

          // Find matching club by slug or id
          const found = list.find(c => String(c.slug) === String(slug) || String(c.id) === String(slug));
          setSelectedClub(found || null);
        }
      } catch (err) {
        console.error('Error fetching clubs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, [slug]);

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold mb-6 transition-colors cursor-pointer"
        >
          <FiArrowLeft />
          <span>Back to Home</span>
        </button>

        {loading ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xs animate-pulse flex flex-col gap-4">
            <div className="w-32 h-6 bg-slate-200 rounded"></div>
            <div className="w-48 h-4 bg-slate-200 rounded"></div>
            <div className="w-full h-24 bg-slate-200 rounded mt-4"></div>
          </div>
        ) : selectedClub ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col gap-6">
            {/* Header */}
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
                <FiUsers />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded w-fit uppercase tracking-wider">
                  Student Club
                </span>
                <h1 className="text-2xl font-black text-slate-900 mt-1">
                  {selectedClub.name}
                </h1>
                <p className="text-slate-450 text-xs font-bold uppercase tracking-wider mt-0.5">
                  Slug: {selectedClub.slug}
                </p>
              </div>
            </div>

            <div className="w-full h-px bg-slate-100 my-2"></div>

            {/* Description */}
            <div className="flex flex-col gap-4 text-xs md:text-sm text-slate-600 leading-relaxed">
              <h3 className="font-extrabold text-slate-800 text-base">Club Overview</h3>
              <p>
                {selectedClub.description || 'Welcome to our student activity club. This community is established to help students build skills, coordinate group events, and showcase innovations at institute conferences.'}
              </p>
              <p>
                FIT clubs are guided by student leadership under academic council registration. Active members participate in science exhibitions, cultural galas, inter-university competitions, and coding hackathons.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center max-w-md mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto text-xl mb-4">
              <FiUsers />
            </div>
            <h3 className="font-bold text-slate-800 text-base font-extrabold">Club not found</h3>
            <p className="text-slate-500 text-xs mt-1">
              The requested club slug or directory ID does not match any records in our database.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubDetailsPage;
