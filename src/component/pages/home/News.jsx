'use client';

import React, { useEffect, useState } from 'react';
import { FiCalendar, FiBookOpen, FiArrowRight, FiInfo } from 'react-icons/fi';
import Link from 'next/link';

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        if (res.ok) {
          const data = await res.json();
          setNewsList(data.paylod?.news || []);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold text-sky-655 bg-sky-50 px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-3 text-sky-600">
            Insights
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Latest Institutional News
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto text-sm">
            Read updates on educational advancements, department news, faculty research journals, and campus initiatives.
          </p>
        </div>

        {loading ? (
          <div className="w-full py-12 flex justify-center">
            <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : newsList.length === 0 ? (
          <div className="w-full py-12 bg-white rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center p-6">
            <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center text-sm mb-3">
              <FiInfo />
            </div>
            <p className="text-slate-400 text-xs font-medium">No news articles published at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsList.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col"
              >
                {/* News Image */}
                {item.image ? (
                  <div className="w-full h-44 overflow-hidden bg-slate-100 relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-sky-50 to-indigo-50 flex items-center justify-center text-sky-200">
                    <FiBookOpen className="text-5xl" />
                  </div>
                )}

                {/* News details */}
                <div className="p-5 flex flex-col gap-3 flex-grow">
                  <div className="flex gap-2 items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <FiCalendar />
                    <span>
                      {new Date(item.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-sky-700 transition-colors">
                    {item.title}
                  </h3>

                  {item.content && (
                    <div 
                      className="text-slate-500 text-xs leading-relaxed line-clamp-3 rich-text-content"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                  )}

                  <Link
                    href={`/news/${item.slug || item.id}`}
                    className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-800 transition-colors w-fit pt-2"
                  >
                    <span>Read Article</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {newsList.length > 3 && (
          <div className="text-center mt-10">
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-605 hover:text-sky-850 transition-colors text-sky-600"
            >
              <span>View All News Publications</span>
              <span>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default News;