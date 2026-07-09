import React from 'react';
import { FiCheck } from 'react-icons/fi';

const MissionPage = () => {
  const points = [
    {
      title: 'Practical Education',
      desc: 'Integrating hands-on lab training, industrial seminars, and live coding exercises directly into the core syllabus.',
    },
    {
      title: 'Global Career Readiness',
      desc: 'Developing curriculum guidelines aligned with tech standards to prepare students for international hires and careers.',
    },
    {
      title: 'Inclusive Development',
      desc: 'Ensuring access to scholarship programs, equal support systems, and dynamic club communities for all students.',
    },
    {
      title: 'Innovative Academic Research',
      desc: 'Providing funding, lab access, and teacher mentoring to foster novel microgrid and software architectures.',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            FIT Creed
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Our Mission & Objectives
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            We aim to empower young engineering and management minds with strong fundamentals, critical thinkings, and high work ethics.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xs flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              Core Institutional Pillars
            </h2>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
              At Fontana Institute of Technology, we measure success by the impact of our graduates on industry and communities. Our academic programs are built around the following four tenets:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {points.map((pt, idx) => (
              <div key={idx} className="flex gap-3 items-start bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  <FiCheck />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {pt.title}
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {pt.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionPage;
