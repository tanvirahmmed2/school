'use client';

import React, { useEffect, useState } from 'react';
import { FiUsers } from 'react-icons/fi';

const DESIGNATION_LABELS = {
  chairman: 'Chairman of Governing Board',
  director: 'Managing Director',
  principal: 'Principal / Dean',
  registrar: 'Registrar',
  council: 'Academic Council Member',
  officers: 'Executive Officer',
  staff: 'Support Staff'
};

const AdministrationPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorities = async () => {
      try {
        const res = await fetch('/api/authorities');
        if (res.ok) {
          const data = await res.json();
          setMembers(data.paylod.authorities || []);
        }
      } catch (err) {
        console.error('Failed to fetch authorities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthorities();
  }, []);

  // Default fallback if database is empty
  const displayMembers = members.length > 0 ? members : [
    { name: 'Alhaji A. Rahman', designation: 'chairman', email: 'chairman@fit.edu.bd', contact: '+880 180 500 0301' },
    { name: 'Mr. Hasan Mahmood', designation: 'director', email: 'director@fit.edu.bd', contact: '+880 180 500 0302' },
    { name: 'Prof. Dr. Rahman', designation: 'principal', email: 'principal@fit.edu.bd', contact: '+880 180 500 0300' },
    { name: 'Dr. Sarah Islam', designation: 'registrar', email: 'registrar@fit.edu.bd', contact: '+880 180 500 0303' }
  ];

  // Grouping members
  const executiveRoles = ['chairman', 'director', 'principal', 'registrar'];
  const executives = displayMembers.filter(m => executiveRoles.includes(m.designation));
  const councilMembers = displayMembers.filter(m => m.designation === 'council');
  const supportStaff = displayMembers.filter(m => m.designation === 'officers' || m.designation === 'staff');

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AD';
  };

  const renderCard = (member) => (
    <div key={member.id || member.name} className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-all duration-200 flex items-center gap-4 group">
      {member.image ? (
        <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-200 animate-fade-in">
          <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-50 to-indigo-50 text-sky-650 flex items-center justify-center text-lg font-bold shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-200">
          {getInitials(member.name)}
        </div>
      )}
      <div className="flex flex-col gap-0.5 min-w-0">
        <h3 className="font-extrabold text-slate-900 text-sm md:text-base group-hover:text-sky-600 transition-colors truncate">
          {member.name}
        </h3>
        <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded w-fit uppercase tracking-wider">
          {DESIGNATION_LABELS[member.designation] || member.designation}
        </span>
        <div className="flex flex-col gap-0.5 text-[11px] text-slate-500 font-semibold mt-2">
          {member.email && <span className="truncate">Email: {member.email}</span>}
          {member.contact && <span>Phone: {member.contact}</span>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            FIT Administration
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Institutional Administration & Governance
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            Detailed overview of our governing board members, executive management, and support desk staff directories.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs animate-pulse flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-200 shrink-0"></div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="w-24 h-4 bg-slate-200 rounded"></div>
                  <div className="w-32 h-3 bg-slate-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {/* Executive Management */}
            {executives.length > 0 && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <FiUsers className="text-xl text-sky-600" />
                  <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Executive Board & Leadership</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {executives.map(renderCard)}
                </div>
              </div>
            )}

            {/* Academic Council */}
            {councilMembers.length > 0 && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <FiUsers className="text-xl text-sky-600" />
                  <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Academic Senate & Council</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {councilMembers.map(renderCard)}
                </div>
              </div>
            )}

            {/* Support Desk & Executives */}
            {supportStaff.length > 0 && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <FiUsers className="text-xl text-sky-600" />
                  <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Administrative Support Teams</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {supportStaff.map(renderCard)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdministrationPage;