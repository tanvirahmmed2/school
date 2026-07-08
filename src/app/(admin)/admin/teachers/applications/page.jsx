'use client';

import React from 'react';
import { FiFileText, FiCheck, FiX } from 'react-icons/fi';

const AdminApplicationsPage = () => {
  const mockApplications = [
    { id: 1, name: 'John Doe', type: 'Sick Leave', range: '2026-07-10 to 2026-07-12 (2 Days)', reason: 'Fever recovery', status: 'Pending' },
    { id: 2, name: 'Sarah Connor', type: 'Casual Leave', range: '2026-07-15 to 2026-07-16 (1 Day)', reason: 'Personal errands', status: 'Approved' },
    { id: 3, name: 'Walter White', type: 'Medical Leave', range: '2026-07-20 to 2026-07-25 (5 Days)', reason: 'Outpatient treatment', status: 'Rejected' },
  ];

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Top Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FiFileText className="text-blue-600" /> Applications Drawer
        </h1>
        <p className="text-sm text-slate-500">
          Review, approve, or reject teacher job requests or leave applications.
        </p>
      </div>

      {/* Applications Table Card */}
      <div className="w-full bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">
            Leave Applications Registry
          </h2>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Request Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date/Duration</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockApplications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{app.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">{app.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">{app.range}</td>
                  <td className="px-6 py-4 text-xs text-slate-600 max-w-[200px] truncate" title={app.reason}>{app.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      app.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                      app.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-2">
                    {app.status === 'Pending' ? (
                      <div className="inline-flex gap-1.5">
                        <button className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center">
                          <FiCheck className="text-sm" />
                        </button>
                        <button className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center">
                          <FiX className="text-sm" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No Action Needed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminApplicationsPage;
