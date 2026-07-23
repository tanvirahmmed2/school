'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiArrowLeft, FiCalendar, FiUsers, FiFileText } from 'react-icons/fi';

const ClubNewsDetailPage = () => {
  const { slug } = useParams();
  const [clubNews, setClubNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubNews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/club-news/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setClubNews(data.paylod?.clubNews || null);
        }
      } catch (err) {
        console.error('Error fetching club news:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchClubNews();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-slate-50/50 py-16 px-4 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 text-xs font-semibold">Loading club news article...</p>
        </div>
      </div>
    );
  }

  if (!clubNews) {
    return (
      <div className="w-full min-h-screen bg-slate-50/50 py-16 px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-100 shadow-xs text-center space-y-4">
          <FiFileText className="text-4xl text-slate-300 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Club News Article Not Found</h2>
          <p className="text-slate-500 text-xs">The club announcement or news article could not be found.</p>
          <Link
            href="/clubs"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all"
          >
            <FiArrowLeft /> Back to Clubs
          </Link>
        </div>
      </div>
    );
  }

  const coverImage = clubNews.image_url || clubNews.image;
  const newsDate = clubNews.created_at ? new Date(clubNews.created_at) : null;

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/clubs"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <FiArrowLeft />
            <span>Back to Clubs</span>
          </Link>

          {clubNews.club_slug && (
            <Link
              href={`/clubs/${clubNews.club_slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs rounded-xl transition-colors"
            >
              <FiUsers />
              <span>Visit {clubNews.club_name || 'Club'} Page</span>
            </Link>
          )}
        </div>

        {/* Club News Article */}
        <article className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          {coverImage && (
            <div className="w-full h-64 md:h-96 bg-slate-100 overflow-hidden relative">
              <img
                src={coverImage}
                alt={clubNews.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-10 space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <FiUsers /> {clubNews.club_name || 'Club Announcement'}
                </span>
                {newsDate && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                    <FiCalendar className="text-emerald-600" />
                    {newsDate.toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {clubNews.title}
              </h1>
            </div>

            <div className="prose prose-slate max-w-none text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap border-t border-slate-100 pt-6">
              {clubNews.content}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ClubNewsDetailPage;
