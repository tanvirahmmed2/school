'use client';

import React, { useEffect, useState } from 'react';
import { FiMail, FiPhone } from 'react-icons/fi';

const DirectorPage = () => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDirector = async () => {
      try {
        const res = await fetch('/api/authorities');
        if (res.ok) {
          const data = await res.json();
          const list = data.paylod.authorities || [];
          const found = list.find(m => m.designation === 'director');
          if (found) {
            setMember(found);
          }
        }
      } catch (err) {
        console.error('Failed to fetch Director:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDirector();
  }, []);

  const displayMember = member || {
    name: 'Mr. Hasan Mahmood',
    bio: 'FIT is focused on building operational efficiencies that support direct learning activities. Our team drives university tie-ups, sets up digital library terminals, and manages classroom infrastructure.\n\nWe strive to maintain a smooth administrative pipeline so teachers can focus on training, while students are provided premium resources and industrial training linkages.',
    email: 'director@fit.edu.bd',
    contact: '+880 180 500 0302',
    image: null
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'DI';
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xs animate-pulse flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 h-48 bg-slate-200 rounded-2xl"></div>
            <div className="w-full md:w-2/3 flex flex-col gap-4">
              <div className="w-32 h-6 bg-slate-200 rounded"></div>
              <div className="w-full h-24 bg-slate-200 rounded"></div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row gap-8 items-start">
            {/* Profile left */}
            <div className="w-full md:w-1/3 bg-slate-50/50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center text-center">
              {displayMember.image ? (
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 shadow-md bg-slate-100">
                  <img src={displayMember.image} alt={displayMember.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-200 to-indigo-100 text-sky-750 flex items-center justify-center text-3xl font-black mb-4">
                  {getInitials(displayMember.name)}
                </div>
              )}
              <h3 className="font-extrabold text-slate-900 text-base">{displayMember.name}</h3>
              <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded uppercase tracking-wider mt-1.5">
                Managing Director
              </span>
              <div className="w-12 h-0.5 bg-slate-200 rounded my-4"></div>
              <div className="flex flex-col gap-2 w-full text-xs text-slate-500 font-semibold">
                {displayMember.email && (
                  <span className="flex items-center justify-center gap-1.5 truncate">
                    <FiMail className="shrink-0" /> {displayMember.email}
                  </span>
                )}
                {displayMember.contact && (
                  <span className="flex items-center justify-center gap-1.5">
                    <FiPhone className="shrink-0" /> {displayMember.contact}
                  </span>
                )}
              </div>
            </div>

            {/* Right Message content */}
            <div className="w-full md:w-2/3 flex flex-col gap-5">
              <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest w-fit">
                Operations & Development
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                Executing Institutional Standards
              </h2>
              <div className="text-slate-600 text-xs md:text-sm leading-relaxed flex flex-col gap-4">
                {displayMember.bio ? (
                  displayMember.bio.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <p>Executive management operational strategies.</p>
                )}
                <p className="font-semibold text-slate-800">
                  {displayMember.name} <br />
                  <span className="text-xs font-bold text-slate-400">Managing Director, FIT</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectorPage;
