'use client';

import React, { useEffect, useState } from 'react';
import { FiBriefcase } from 'react-icons/fi';

const StaffPage = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch('/api/authorities');
        if (res.ok) {
          const data = await res.json();
          const list = data.paylod.authorities || [];
          const filtered = list.filter(m => m.designation === 'staff');
          if (filtered.length > 0) {
            setStaffList(filtered.map(m => ({
              title: m.name,
              desc: m.bio || 'Support Division Desk Staff',
              email: m.email || 'support@fit.edu.bd',
              hours: m.contact || 'Mon - Fri (9:00 AM - 5:00 PM)'
            })));
          } else {
            // Default mock fallback
            setStaffList([
              {
                title: 'Admissions Help Desk',
                desc: 'For course registrations, program changes, or dynamic enrollment queries.',
                email: 'admissions-desk@fit.edu.bd',
                hours: 'Mon - Fri (9:00 AM - 5:00 PM)'
              },
              {
                title: 'Billing & Accounts Desk',
                desc: 'For fee invoices, payment processing, installments, and receipts verification.',
                email: 'billing@fit.edu.bd',
                hours: 'Mon - Fri (9:00 AM - 4:00 PM)'
              }
            ]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch Staff:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">
            Support Teams
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Administrative & Support Staff
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm md:text-base">
            Our back-office teams keep academic services running smoothly. Reach out for any assistance.
          </p>
        </div>

        {/* Staff details */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col gap-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <FiBriefcase className="text-xl text-sky-600" />
            <h3 className="font-extrabold text-slate-900 text-lg">Support Division & Help Desks</h3>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs md:text-sm text-slate-600">
              {staffList.map((staff, idx) => (
                <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-100/50 flex flex-col gap-1">
                  <h4 className="font-extrabold text-slate-900 text-sm">{staff.title}</h4>
                  <p className="text-slate-550 leading-relaxed text-xs">{staff.desc}</p>
                  <div className="flex flex-col gap-1 text-[11px] font-semibold text-slate-500 mt-3">
                    <span>Email: {staff.email}</span>
                    <span>Hours: {staff.hours}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
