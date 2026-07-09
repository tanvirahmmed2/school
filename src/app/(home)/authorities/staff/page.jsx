import React from 'react';
import { FiBriefcase, FiMail, FiPhone } from 'react-icons/fi';

const StaffPage = () => {
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs md:text-sm text-slate-600">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100/50 flex flex-col gap-1">
              <h4 className="font-extrabold text-slate-900 text-sm">Admissions Help Desk</h4>
              <p className="text-slate-550 leading-relaxed text-xs">For course registrations, program changes, or dynamic enrollment queries.</p>
              <div className="flex flex-col gap-1 text-[11px] font-semibold text-slate-500 mt-3">
                <span>Email: admissions-desk@fit.edu.bd</span>
                <span>Hours: Mon - Fri (9:00 AM - 5:00 PM)</span>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100/50 flex flex-col gap-1">
              <h4 className="font-extrabold text-slate-900 text-sm">Billing & Accounts Desk</h4>
              <p className="text-slate-550 leading-relaxed text-xs">For fee invoices, payment processing, installments, and receipts verification.</p>
              <div className="flex flex-col gap-1 text-[11px] font-semibold text-slate-500 mt-3">
                <span>Email: billing@fit.edu.bd</span>
                <span>Hours: Mon - Fri (9:00 AM - 4:00 PM)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
