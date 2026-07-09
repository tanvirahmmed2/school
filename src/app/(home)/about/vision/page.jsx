import React from 'react';
import { FiTarget, FiHeart, FiCpu } from 'react-icons/fi';

const VisionPage = () => {
  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            Academic Outlook
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Our Vision & Core Values
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            Establishing a world-class academic space focused on technical excellence, continuous improvement, and social responsibility.
          </p>
        </div>

        {/* Vision details */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
              <FiTarget className="text-2xl text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-sm mt-1">Our Vision</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                To be recognized as a leading technical institute that generates breakthrough research and develops industry leaders.
              </p>
            </div>
            <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
              <FiHeart className="text-2xl text-rose-500" />
              <h3 className="font-extrabold text-slate-900 text-sm mt-1">Ethics & Values</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Nurturing a culture of integrity, mutual respect, fairness, and ethical research across all departments.
              </p>
            </div>
            <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
              <FiCpu className="text-2xl text-sky-600" />
              <h3 className="font-extrabold text-slate-900 text-sm mt-1">Research Focus</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Fostering student exploration in machine learning, sustainable energy systems, and modern infrastructure designs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionPage;
