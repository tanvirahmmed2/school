'use client';

import React, { useEffect, useState } from 'react';
import { FiFileText, FiCalendar } from 'react-icons/fi';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        if (res.ok) {
          const data = await res.json();
          setNews(data.paylod.news || []);
        }
      } catch (err) {
        console.error('Failed to fetch news:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            Campus Updates
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Campus News &amp; Stories
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            Stay tuned with updates on academics, student achievements, campus activities, and scientific breakthroughs.
          </p>
        </div>

        {/* Loading / Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs animate-pulse flex flex-col gap-4">
                <div className="w-full h-44 bg-slate-200 rounded-xl"></div>
                <div className="w-24 h-4 bg-slate-200 rounded"></div>
                <div className="w-3/4 h-6 bg-slate-200 rounded"></div>
                <div className="w-full h-12 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => {
              const newsDate = new Date(item.created_at);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md hover:border-sky-100 transition-all duration-200 flex flex-col group"
                >
                  {/* Article Image Cover */}
                  {item.image ? (
                    <div className="w-full h-48 overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-sky-50 to-indigo-50 flex items-center justify-center shrink-0">
                      <FiFileText className="text-5xl text-sky-200" />
                    </div>
                  )}

                  {/* Article Info */}
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    {/* Date */}
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <FiCalendar className="text-xs shrink-0" />
                      <span>{newsDate.toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                    </div>

                    <h2 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-sky-600 transition-colors">
                      {item.title}
                    </h2>

                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed line-clamp-4 whitespace-pre-wrap">
                      {item.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center max-w-md mx-auto shadow-xs mt-8">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto text-xl mb-4">
              <FiFileText />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No news articles published</h3>
            <p className="text-slate-500 text-xs mt-1">
              There are currently no featured stories or news feeds cataloged.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;