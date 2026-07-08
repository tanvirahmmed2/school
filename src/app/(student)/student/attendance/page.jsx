'use client';

import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiXCircle, FiClock, FiAlertCircle, FiActivity } from 'react-icons/fi';

const AttendancePage = () => {
  const [data, setData] = useState({ history: [], summary: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch('/api/student/attendance');
        if (res.ok) {
          const resData = await res.json();
          setData(resData);
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const { history, summary } = data;

  const total = parseInt(summary?.total || 0, 10);
  const present = parseInt(summary?.present || 0, 10);
  const absent = parseInt(summary?.absent || 0, 10);
  const late = parseInt(summary?.late || 0, 10);
  const halfDay = parseInt(summary?.half_day || 0, 10);

  const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 100;

  const cards = [
    { label: 'Attendance Rate', value: `${rate}%`, color: 'text-blue-600 bg-blue-50 border-blue-100', icon: FiActivity },
    { label: 'Present Days', value: present, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: FiCheckCircle },
    { label: 'Absent Days', value: absent, color: 'text-rose-600 bg-rose-50 border-rose-100', icon: FiXCircle },
    { label: 'Late Entries', value: late, color: 'text-amber-600 bg-amber-50 border-amber-100', icon: FiClock },
    { label: 'Half Days', value: halfDay, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', icon: FiAlertCircle }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">Present</span>;
      case 'Absent':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">Absent</span>;
      case 'Late':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">Late</span>;
      case 'Half Day':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">Half Day</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-600 border border-slate-100">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">My Attendance Registry</h1>
        <p className="text-slate-500 text-sm font-medium">Verify your registered presence and check monthly updates.</p>
      </div>

      {/* Grid Summaries */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className={`p-5 rounded-2xl border ${card.color} flex flex-col justify-between`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold opacity-80">{card.label}</span>
                <Icon className="text-lg opacity-80" />
              </div>
              <span className="text-xl md:text-2xl font-extrabold">{card.value}</span>
            </div>
          );
        })}
      </div>

      {/* History log */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8">
        <h2 className="text-base font-bold text-slate-800 mb-6">Attendance Logs</h2>
        
        {history.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-semibold text-sm">
            No attendance entries have been registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row) => (
                  <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                    <td className="py-4 text-sm font-semibold text-slate-700">
                      {new Date(row.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-4">
                      {getStatusBadge(row.status)}
                    </td>
                    <td className="py-4 text-xs font-semibold text-slate-400">
                      {row.remarks || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
