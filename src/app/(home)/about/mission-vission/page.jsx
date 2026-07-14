'use client';

import React from 'react';
import { FiEye, FiActivity, FiGlobe } from 'react-icons/fi';

const MissionVisionPage = () => {
  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-sky-655 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest text-sky-600">
            FIT Standard
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Our Mission & Vision
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            Establishing Fontana Institute of Technology as a hub of character, technical research, and academic placement excellence.
          </p>
        </div>

        {/* Content Box */}
        <div className="flex flex-col gap-8 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs">
          {/* Mission */}
          <div className="flex gap-4 sm:gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0">
              <FiGlobe className="text-lg" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-extrabold text-slate-900 text-base">
                Academic Mission
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                To equip technical scholars with robust skill sets, values, and credentials. We deliver state-of-the-art facilities, structured computer labs, library terminals, and housing hostel setups to foster active, safe learning communities.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="flex gap-4 sm:gap-6 items-start border-t border-slate-100 pt-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <FiEye className="text-lg" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-extrabold text-slate-900 text-base">
                Core Vision
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                To revolutionize technical training systems. FIT envisions a unified, digitized educational network where registrar registers, term result portals, classroom subjects, and residential hostel allocations are automated, secure, and accessible.
              </p>
            </div>
          </div>

          {/* Strategy */}
          <div className="flex gap-4 sm:gap-6 items-start border-t border-slate-100 pt-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <FiActivity className="text-lg" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-extrabold text-slate-900 text-base">
                Operational Strategy
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Promoting dynamic student activities. We ensure regular inter-class software competitions, cultural exhibitions, and secure sports tournaments to coordinate holistic personal development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionVisionPage;