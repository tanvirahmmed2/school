'use client';

import React, { useEffect, useState } from 'react';
import { FiAward } from 'react-icons/fi';

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await fetch('/api/achievements');
        if (res.ok) {
          const data = await res.json();
          setAchievements(data.achievements || []);
        }
      } catch (err) {
        console.error('Error fetching achievements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            Institutional Pride
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Awards & Achievements
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            FIT strives to maintain high academic, sports, and research credentials. Explore some of our latest milestones.
          </p>
        </div>

        {/* Highlights List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((h, idx) => (
              <div
                key={h.id || idx}
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col hover:shadow-xs transition-shadow duration-150"
              >
                {h.image_url && (
                  <div className="w-full h-48 bg-slate-100">
                    <img src={h.image_url} alt={h.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6 flex flex-col gap-1.5 flex-1">
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {h.title}
                  </h3>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed mt-2 whitespace-pre-wrap">
                    {h.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto text-xl mb-4">
              <FiAward />
            </div>
            <h3 className="font-bold text-slate-800">No achievements recorded yet</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsPage;
