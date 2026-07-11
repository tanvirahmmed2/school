'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiPlus, FiFileText, FiImage, FiCalendar, FiUsers } from 'react-icons/fi';

const ClubNewsListPage = () => {
  const [clubNews, setClubNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubNews = async () => {
      try {
        const res = await fetch('/api/club-news');
        if (res.ok) {
          const data = await res.json();
          setClubNews(data.clubNews || []);
        }
      } catch (err) {
        console.error('Error fetching club news:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClubNews();
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
            Club Announcements & News
          </h1>
        </div>
        <Link
          href="/admin/club-news/new"
          className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-colors"
        >
          <FiPlus />
          <span>Write Club News</span>
        </Link>
      </div>

      {/* List Container */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-semibold text-slate-400">Loading club announcements...</span>
          </div>
        ) : clubNews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs text-slate-650">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="p-4 font-black uppercase text-[10px] tracking-wider text-slate-400 pl-6">Cover</th>
                  <th className="p-4 font-black uppercase text-[10px] tracking-wider text-slate-400">Club</th>
                  <th className="p-4 font-black uppercase text-[10px] tracking-wider text-slate-400">Announcement Title</th>
                  <th className="p-4 font-black uppercase text-[10px] tracking-wider text-slate-400">Published Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-semibold text-slate-800">
                {clubNews.map((item) => (
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
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded uppercase tracking-wider">
                        <FiUsers className="text-xs" />
                        {item.club_name}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs md:max-w-sm">
                      <div className="truncate font-extrabold text-slate-900">{item.title}</div>
                      <div className="truncate text-slate-450 text-[10px] mt-0.5 max-w-[260px] font-medium">{item.content}</div>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto text-xl mb-4">
              <FiFileText />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No announcements found</h3>
            <p className="text-slate-500 text-xs mt-1">
              Club updates, event announcements, and newsletters published will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubNewsListPage;
