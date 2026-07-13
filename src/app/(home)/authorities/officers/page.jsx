'use client';

import React, { useEffect, useState } from 'react';
import { FiUsers } from 'react-icons/fi';

const OfficersPage = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const res = await fetch('/api/authorities');
        if (res.ok) {
          const data = await res.json();
          const list = data.paylod.authorities || [];
          const filtered = list.filter(m => m.designation === 'officers');
          if (filtered.length > 0) {
            setOfficers(filtered.map(m => ({
              name: m.name,
              role: m.bio || 'Executive Officer',
              contact: m.email || m.contact || 'info@fit.edu.bd'
            })));
          } else {
            // Default mock fallback
            setOfficers([
              { name: 'Dr. Sarah Islam', role: 'Registrar', contact: 'registrar@fit.edu.bd' },
              { name: 'Mr. Hasan Mahmood', role: 'Managing Director', contact: 'director@fit.edu.bd' },
              { name: 'Mrs. Fatema Begum', role: 'Accounts Officer', contact: 'accounts@fit.edu.bd' },
              { name: 'Mr. Tanvir Rahman', role: 'IT Support Officer', contact: 'it-support@fit.edu.bd' },
            ]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch Officers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOfficers();
  }, []);

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

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {officers.map((officer, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-100/50 rounded-2xl flex flex-col gap-1 text-xs md:text-sm text-slate-650">
                  <h4 className="font-extrabold text-slate-900 text-base">{officer.name}</h4>
                  <span className="text-xs font-bold text-sky-600 uppercase tracking-wide">{officer.role}</span>
                  <span className="text-slate-500 text-xs mt-2 font-semibold">Contact: {officer.contact}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficersPage;
