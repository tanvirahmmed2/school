import React from 'react';
import { FiMail, FiPhone, FiFileText } from 'react-icons/fi';

const RegistrarPage = () => {
  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row gap-8 items-start">
          {/* Profile left */}
          <div className="w-full md:w-1/3 bg-slate-50/50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-200 to-indigo-100 text-sky-750 flex items-center justify-center text-3xl font-black mb-4">
              RE
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Dr. Sarah Islam</h3>
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded uppercase tracking-wider mt-1.5">
              The Registrar
            </span>
            <div className="w-12 h-0.5 bg-slate-200 rounded my-4"></div>
            <div className="flex flex-col gap-2 w-full text-xs text-slate-500 font-semibold">
              <span className="flex items-center justify-center gap-1.5">
                <FiMail /> registrar@fit.edu.bd
              </span>
              <span className="flex items-center justify-center gap-1.5">
                <FiPhone /> +880 180 500 0303
              </span>
            </div>
          </div>

          {/* Right Message content */}
          <div className="w-full md:w-2/3 flex flex-col gap-5">
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest w-fit">
              Registry & Admissions
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Admissions & Verification Protocols
            </h2>
            <div className="text-slate-600 text-xs md:text-sm leading-relaxed flex flex-col gap-4">
              <p>
                The Office of the Registrar coordinates student enrollments, exam transcript logs, class schedules, and certificate issuing processes. Our division maintains clean data records for all departments.
              </p>
              <p>
                For transcript orders, registration details modifications, or grade confirmation letters, students can submit application requests at our main registry desk or via the online ticketing system.
              </p>
              <p className="font-semibold text-slate-800">
                Dr. Sarah Islam <br />
                <span className="text-xs font-bold text-slate-400">Registrar, FIT</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrarPage;
