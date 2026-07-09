import React from 'react';
import { FiUsers, FiMail, FiPhone } from 'react-icons/fi';

const OfficersPage = () => {
  const officers = [
    { name: 'Dr. Sarah Islam', role: 'Registrar', contact: 'registrar@fit.edu.bd' },
    { name: 'Mr. Hasan Mahmood', role: 'Managing Director', contact: 'director@fit.edu.bd' },
    { name: 'Mrs. Fatema Begum', role: 'Accounts Officer', contact: 'accounts@fit.edu.bd' },
    { name: 'Mr. Tanvir Rahman', role: 'IT Support Officer', contact: 'it-support@fit.edu.bd' },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            FIT Directory
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Institutional Officers
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            Detailed list of administrative officers, IT support heads, and account executives.
          </p>
        </div>

        {/* Officers Grid */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col gap-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <FiUsers className="text-xl text-sky-600" />
            <h3 className="font-extrabold text-slate-900 text-lg">Officers Contacts Directory</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {officers.map((officer, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-100/50 rounded-2xl flex flex-col gap-1 text-xs md:text-sm text-slate-650">
                <h4 className="font-extrabold text-slate-900 text-base">{officer.name}</h4>
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wide">{officer.role}</span>
                <span className="text-slate-500 text-xs mt-2 font-semibold">Email: {officer.contact}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficersPage;
