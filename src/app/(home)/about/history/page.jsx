'use client';

import React, { useEffect, useState } from 'react';
import { 
  FiClock, 
  FiStar, 
  FiFlag, 
  FiBookmark, 
  FiAward,
  FiTrendingUp,
  FiInfo,
  FiAlertCircle
} from 'react-icons/fi';

const iconList = [FiFlag, FiAward, FiBookmark, FiStar, FiTrendingUp];
const colorStyles = [
  'text-primary bg-primary-light border-primary-light',
  'text-amber-600 bg-amber-50 border-amber-100',
  'text-primary bg-primary-light border-primary-light',
  'text-rose-600 bg-rose-50 border-rose-100',
  'text-primary bg-primary-light border-primary-light'
];

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const HistoryPage = () => {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/histories');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to load history data');
      }
      const list = data.paylod?.histories || data.histories || [];
      setHistories(list);
    } catch (err) {
      console.error('Error fetching histories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistories();
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full flex flex-col gap-10 max-w-5xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight leading-tight">
            Our Historic Journey
          </h1>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed">
            Discover the key milestones, foundation, and achievements in our institutional growth.
          </p>
        </div>

      
        {loading ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-xs flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-slate-500">Loading historical milestones...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 text-center flex flex-col items-center gap-3">
            <FiAlertCircle className="text-3xl text-rose-600" />
            <p className="text-sm font-semibold text-rose-700">{error}</p>
            <button
              onClick={fetchHistories}
              className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition-colors"
            >
              Retry Loading
            </button>
          </div>
        ) : histories.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3">
            <FiClock className="text-4xl text-slate-300" />
            <h3 className="text-base font-bold text-slate-700">No History Records Available</h3>
            <p className="text-xs text-slate-500 max-w-md">
              No historical milestones have been published yet. Please check back later or add records in the admin console.
            </p>
          </div>
        ) : (
          <div className="relative bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col gap-8">
            {/* Vertical central bar */}
            <div className="absolute left-[39px] sm:left-[47px] top-12 bottom-12 w-0.5 bg-slate-100" />
            
            <div className="flex flex-col gap-10 relative z-10">
              {histories.map((item, idx) => {
                const Icon = iconList[idx % iconList.length];
                const colorStyle = colorStyles[idx % colorStyles.length];
                return (
                  <div key={item.id || idx} className="flex gap-4 sm:gap-6 items-start group">
                    
                    {/* Badge Timeline circle */}
                    <div className={`w-12 h-12 rounded-full border-2 border-white flex items-center justify-center shrink-0 shadow-xs relative transition-transform group-hover:scale-105 ${colorStyle}`}>
                      <Icon className="text-base" />
                    </div>

                    {/* Content block */}
                    <div className="flex flex-col gap-2 mt-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                        <h3 className="font-semibold text-slate-900 text-sm sm:text-base group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <span className="text-xs font-semibold text-primary tracking-wider bg-primary-light px-2.5 py-0.5 rounded-full w-fit shrink-0">
                          {formatDate(item.date)}
                        </span>
                      </div>
                      
                      <div 
                        className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl prose prose-slate"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />

                      {item.infor && item.infor.trim() !== '' && (
                        <div className="mt-1 bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs font-semibold text-slate-600 max-w-2xl flex items-start gap-2">
                          <FiInfo className="text-primary text-sm shrink-0 mt-0.5" />
                          <span className="whitespace-pre-line">{item.infor}</span>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default HistoryPage;
