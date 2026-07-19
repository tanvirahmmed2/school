'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiClock, FiCheckCircle, FiLogIn, FiLogOut, FiCalendar } from 'react-icons/fi';

const StaffAttendancePage = () => {
  const [time, setTime] = useState(null);
  const [history, setHistory] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  // Live Digital Clock
  useEffect(() => {
    setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await fetch('/api/staff/attendance');
      const data = await res.json();
      if (data.success && data.paylod?.attendance) {
        setHistory(data.paylod.attendance);
        
        // Find if today has a record
        const todayStr = new Date().toISOString().split('T')[0];
        const todayRec = data.paylod.attendance.find(
          (rec) => new Date(rec.date).toISOString().split('T')[0] === todayStr
        );
        setTodayRecord(todayRec || null);
      }
    } catch (err) {
      toast.error('Failed to load attendance history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleCheckAction = async () => {
    setChecking(true);
    try {
      const res = await fetch('/api/staff/attendance/check', {
        method: 'POST'
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message);
        fetchAttendance();
      } else {
        throw new Error(data.error || 'Failed to register check action.');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setChecking(false);
    }
  };

  const getTodayStatus = () => {
    if (!todayRecord) {
      return {
        label: 'Not Checked In',
        color: 'text-amber-600 bg-amber-50 border-amber-200',
        desc: 'Please mark your check-in time for today.',
        action: 'Check In',
        icon: FiLogIn,
        btnClass: 'from-emerald-500 to-teal-500 shadow-emerald-500/10 hover:shadow-emerald-500/25 text-white hover:-translate-y-0.5'
      };
    }
    
    if (!todayRecord.check_out) {
      return {
        label: 'Active (Checked In)',
        color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        desc: `Checked in at ${todayRecord.check_in}. Don't forget to check out before leaving.`,
        action: 'Check Out',
        icon: FiLogOut,
        btnClass: 'from-amber-500 to-orange-500 shadow-amber-500/10 hover:shadow-amber-500/25 text-white hover:-translate-y-0.5'
      };
    }

    return {
      label: 'Day Completed',
      color: 'text-sky-600 bg-sky-50 border-sky-200',
      desc: `Check-in: ${todayRecord.check_in} | Check-out: ${todayRecord.check_out}`,
      action: 'Checked Out',
      icon: FiCheckCircle,
      disabled: true,
      btnClass: 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
    };
  };

  const statusInfo = getTodayStatus();
  const ActionIcon = statusInfo.icon;

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FiClock className="text-sky-600 animate-pulse" /> My Attendance Desk
        </h1>
        <p className="text-sm text-slate-500">
          Record your daily check-in and check-out timestamps, and view past attendance logs.
        </p>
      </div>

      {/* Main Grid: Check In action card & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Check Action */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center gap-6 relative overflow-hidden min-h-[300px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full blur-3xl pointer-events-none opacity-50"></div>
          
          <div className="flex flex-col items-center">
            {time ? (
              <span className="text-4xl font-black text-slate-800 tracking-wider font-mono">
                {time}
              </span>
            ) : (
              <div className="h-10 w-44 bg-slate-100 animate-pulse rounded-xl"></div>
            )}
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2 max-w-sm text-center">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            <p className="text-xs text-slate-500 leading-relaxed mt-1">
              {statusInfo.desc}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCheckAction}
            disabled={statusInfo.disabled || checking || loading}
            className={`flex items-center gap-2 px-8 py-3.5 text-sm font-bold rounded-2xl bg-linear-to-r shadow-md transition-all duration-200 cursor-pointer ${statusInfo.btnClass}`}
          >
            <ActionIcon className="text-lg" />
            <span>{checking ? 'Registering...' : statusInfo.action}</span>
          </button>
        </div>

        {/* Attendance Summary Stats */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col justify-between gap-6">
          <h2 className="text-sm font-bold text-slate-850 border-b border-slate-100 pb-3 flex items-center gap-1.5">
            <FiCalendar className="text-slate-400" /> Attendance Summary
          </h2>

          <div className="grid grid-cols-2 gap-4 flex-1 items-center">
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 text-center">
              <span className="text-2xl font-black text-emerald-600">{history.filter(h => h.status === 'Present').length}</span>
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mt-1">Present Days</p>
            </div>

            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50 text-center">
              <span className="text-2xl font-black text-amber-600">{history.filter(h => h.status === 'Late').length}</span>
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mt-1">Late Arrivals</p>
            </div>

            <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100/50 text-center">
              <span className="text-2xl font-black text-red-655">{history.filter(h => h.status === 'Absent').length}</span>
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mt-1">Absent Days</p>
            </div>

            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 text-center">
              <span className="text-2xl font-black text-indigo-600">{history.filter(h => h.status === 'On Leave').length}</span>
              <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider mt-1">On Leaves</p>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center italic">
            Overall record matching logged active registers.
          </p>
        </div>
      </div>

      {/* History Log Table */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">Attendance Log History</h2>
        </div>

        {loading ? (
          <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-slate-400">Loading history logs...</span>
          </div>
        ) : history.length === 0 ? (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
            <span className="text-slate-300 text-5xl mb-3">📅</span>
            <h3 className="text-sm font-bold text-slate-650">No Log Records Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
              You haven't recorded any check-in logs yet.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                      {new Date(record.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 font-semibold font-mono">
                      {record.check_in || '--:--:--'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 font-semibold font-mono">
                      {record.check_out || '--:--:--'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        record.status === 'Present' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        record.status === 'Late' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        record.status === 'Absent' ? 'bg-red-50 text-red-655 border-red-100' :
                        'bg-indigo-50 text-indigo-600 border-indigo-100'
                      }`}>
                        {record.status}
                      </span>
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

export default StaffAttendancePage;
