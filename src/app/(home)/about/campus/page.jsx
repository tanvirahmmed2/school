import React from 'react';
import { FiBookOpen, FiActivity, FiMap } from 'react-icons/fi';

const CampusPage = () => {
  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            Campus Life
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Our Infrastructure & Facilities
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            Fontana Institute of Technology is spread across a lush green campus equipped with state-of-the-art labs and modern study spaces.
          </p>
        </div>

        {/* Info Grid */}
        <div className="flex flex-col gap-8 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/50 flex flex-col gap-2">
              <FiBookOpen className="text-2xl text-sky-600" />
              <h3 className="font-extrabold text-slate-900 text-sm mt-1">Central Library</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Over 50,000 reference text books, research journals, and online resource terminals accessible to students.
              </p>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/50 flex flex-col gap-2">
              <FiActivity className="text-2xl text-sky-600" />
              <h3 className="font-extrabold text-slate-900 text-sm mt-1">High-Tech Labs</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Fully equipped computer rooms, electronics workshops, and mechanical engineering prototyping machinery.
              </p>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/50 flex flex-col gap-2">
              <FiMap className="text-2xl text-sky-600" />
              <h3 className="font-extrabold text-slate-900 text-sm mt-1">Residential Hostels</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Premium housing hostels featuring round-the-clock dining halls, high-speed Wi-Fi, and recreation rooms.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-100 pt-6">
            <h3 className="font-bold text-slate-900 text-base">Campus Map & Accessibility</h3>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
              Located in the heart of Dhaka, the FIT campus is easily accessible via major transit lines. The campus is fully wheelchair accessible and incorporates environment-friendly practices, including solar power stations and rainwater harvesting systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusPage;
