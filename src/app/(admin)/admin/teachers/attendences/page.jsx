'use client';

import React from 'react';
import { FiCalendar, FiFilter } from 'react-icons/fi';

const AdminAttendancesPage = () => {
  const mockAttendances = [
    { id: 1, name: 'John Doe', date: '2026-07-08', checkIn: '08:45 AM', checkOut: '04:30 PM', status: 'Present' },
    { id: 2, name: 'Sarah Connor', date: '2026-07-08', checkIn: '09:05 AM', checkOut: '04:35 PM', status: 'Late' },
    { id: 3, name: 'Walter White', date: '2026-07-08', checkIn: '---', checkOut: '---', status: 'Absent' },
  ];

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Top Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FiCalendar className="text-blue-600" /> Attendance Registry
        </h1>
        <p className="text-sm text-slate-500">
          Track and log teacher daily check-in timings and leaves.
        </p>
      </div>

      {/* Daily Log Summary */}
      <div className="w-full bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-base font-bold text-slate-800">
            Daily Log Summary (Today)
          </h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
              <FiFilter /> Filter Date
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockAttendances.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{record.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">{record.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">{record.checkIn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">{record.checkOut}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      record.status === 'Present' ? 'bg-emerald-50 text-emerald-600' :
                      record.status === 'Late' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {record.status}
                    </span>
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

export default AdminAttendancesPage;
