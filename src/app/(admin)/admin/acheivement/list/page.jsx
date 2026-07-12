'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiPlus, FiAward, FiCalendar, FiExternalLink, FiImage } from 'react-icons/fi';

const AchievementListPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await fetch('/api/achievements');
        if (res.ok) {
          const data = await res.json();
          setAchievements(data.paylod.achievements || []);
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
    <div className="w-full py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            Control Panel
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
            Recorded Achievements
          </h1>
        </div>
        <Link
          href="/admin/acheivement/new"
          className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-colors"
        >
          <FiPlus />
          <span>Add New Achievement</span>
        </Link>
      </div>

      {/* List Container */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-semibold text-slate-400">Loading achievements list...</span>
          </div>
        ) : achievements.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs text-slate-650">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="p-4 font-black uppercase text-[10px] tracking-wider text-slate-400 pl-6">Image</th>
                  <th className="p-4 font-black uppercase text-[10px] tracking-wider text-slate-400">Achievement Title</th>
                  <th className="p-4 font-black uppercase text-[10px] tracking-wider text-slate-400">Date Recorded</th>
                  <th className="p-4 font-black uppercase text-[10px] tracking-wider text-slate-400 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-semibold text-slate-800">
                {achievements.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-4 pl-6">
                      {item.image_url ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                          <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400">
                          <FiImage className="text-sm" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 max-w-sm md:max-w-md">
                      <div className="font-extrabold text-slate-900">{item.title}</div>
                      <div className="text-slate-450 text-[10px] mt-0.5 max-w-[400px] font-medium leading-relaxed">{item.description}</div>
                    </td>
                    <td className="p-4 text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <FiCalendar />
                        {new Date(item.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Link
                        href={`/acheivements`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-855 text-[11px] font-bold"
                      >
                        <span>View public</span>
                        <FiExternalLink />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto text-xl mb-4">
              <FiAward />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No achievements recorded</h3>
            <p className="text-slate-500 text-xs mt-1">
              Outstanding milestones and institutional awards will be listed here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementListPage;
