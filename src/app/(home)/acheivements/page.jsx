import React from 'react';
import { FiAward, FiBook, FiGlobe, FiUsers } from 'react-icons/fi';

const AchievementsPage = () => {
  const highlights = [
    {
      title: 'Outstanding Science Fair Project 2026',
      description: 'FIT department students won first place in the Regional Innovation Challenge for AI-driven environmental monitoring.',
      category: 'Innovation',
      icon: FiAward,
    },
    {
      title: 'National Athletics Championship Runner-up',
      description: 'The Fontana Institute track and field team secured 4 gold medals in the inter-university sports league.',
      category: 'Sports',
      icon: FiGlobe,
    },
    {
      title: 'Top Research Citations Record',
      description: 'FIT researchers published over 15 papers in IEEE, Nature, and ACM journals regarding microgrid designs.',
      category: 'Research',
      icon: FiBook,
    },
    {
      title: 'Industry Recruitment Excellence',
      description: 'Over 85% of our graduating computer science class received internship offers from tech partners.',
      category: 'Placements',
      icon: FiUsers,
    },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {highlights.map((h, idx) => {
            const Icon = h.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between hover:shadow-xs transition-shadow duration-150"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
                    <Icon />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded w-fit uppercase tracking-wider">
                      {h.category}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base mt-1">
                      {h.title}
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                      {h.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;
