import React from 'react';
import { FiClock, FiStar, FiFlag, FiBookmark } from 'react-icons/fi';

const HistoryPage = () => {
  const timeline = [
    {
      year: '2015',
      title: 'Foundation Stone',
      desc: 'Fontana Institute of Technology was founded by a council of lead educationists to provide tech training.',
      icon: FiFlag,
    },
    {
      year: '2018',
      title: 'First Graduation Batch',
      desc: 'The institute graduated its first set of computer science and management professionals, achieving high industry placement.',
      icon: FiStar,
    },
    {
      year: '2022',
      title: 'Research Wing Inception',
      desc: 'Launched the central postgraduate research center with focus on solar power systems and cybersecurity protocols.',
      icon: FiBookmark,
    },
    {
      year: '2026',
      title: 'Digital Systems Rollout',
      desc: 'Completed deployment of the integrated academic portals, online routine systems, and registrar registers.',
      icon: FiClock,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            FIT Chronicle
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Our Historic Journey
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            From humble beginnings to an emerging technical hub, explore how Fontana Institute of Technology has expanded over the past decade.
          </p>
        </div>

        {/* Timeline */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xs flex flex-col gap-8 relative">
          <div className="absolute left-[39px] top-12 bottom-12 w-0.5 bg-slate-100 hidden sm:block"></div>
          
          <div className="flex flex-col gap-8 relative z-10">
            {timeline.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex gap-4 sm:gap-6 items-start">
                  {/* Badge */}
                  <div className="w-12 h-12 rounded-full bg-sky-50 border-2 border-white text-sky-600 flex items-center justify-center font-black text-sm shrink-0 shadow-xs relative">
                    <Icon className="text-sm" />
                  </div>

                  <div className="flex flex-col gap-1 mt-1.5">
                    <span className="text-xs font-bold text-sky-600 tracking-wider">
                      Year {item.year}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-xl">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
