'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiCalendar, FiCheckCircle, FiSave, FiClock, FiActivity } from 'react-icons/fi';

const AdminStaffAttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [staffAttendance, setStaffAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchAttendanceSheet = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/staff/attendance?date=${selectedDate}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load staff attendance.');
      
      setStaffAttendance(data.paylod?.staffAttendance || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceSheet();
  }, [selectedDate]);

  const handleStatusChange = (staffId, newStatus) => {
    setStaffAttendance(prev =>
      prev.map(item => (item.staff_id === staffId ? { ...item, status: newStatus } : item))
    );
  };

  const handleTimeChange = (staffId, field, value) => {
    setStaffAttendance(prev =>
      prev.map(item => (item.staff_id === staffId ? { ...item, [field]: value } : item))
    );
  };

  const handleMarkAllPresent = () => {
    setStaffAttendance(prev =>
      prev.map(item => ({ ...item, status: 'Present' }))
    );
    toast.success('Marked all staff members as Present locally.');
  };

  const handleSubmitAttendance = async () => {
    if (staffAttendance.length === 0) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/staff/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          records: staffAttendance.map(item => ({
            staff_id: item.staff_id,
            status: item.status || 'Present',
            check_in: item.check_in || null,
            check_out: item.check_out || null
          }))
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save staff attendance.');

      toast.success(data.message || 'Staff attendance saved successfully.');
      fetchAttendanceSheet();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FiCalendar className="text-sky-655" /> Staff Attendance Registry
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Perform bulk daily attendance logs for operational and registry staff members.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="w-full bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5 w-full sm:w-64">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <FiCalendar /> Attendance Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-850 outline-none focus:bg-white focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleMarkAllPresent}
            disabled={loading || staffAttendance.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <FiCheckCircle className="text-sm" />
            <span>Mark All Present</span>
          </button>

          <button
            type="button"
            onClick={handleSubmitAttendance}
            disabled={loading || submitting || staffAttendance.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-500/10 hover:shadow-sky-500/20 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <FiSave className="text-sm" />
            <span>{submitting ? 'Saving...' : 'Save Attendance'}</span>
          </button>
        </div>
      </div>

      {/* Main Registry Table Card */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        {loading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-slate-400">Loading staff attendance roster...</span>
          </div>
        ) : staffAttendance.length === 0 ? (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center px-4">
            <span className="text-slate-300 text-5xl mb-3">👥</span>
            <h3 className="text-sm font-bold text-slate-600">No Staff Members Registered</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
              No active, registered staff members were found to record attendance.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Staff Member</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Check In Log</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Check Out Log</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffAttendance.map((item) => (
                  <tr key={item.staff_id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.name}</p>
                        <span className="text-[10px] text-slate-400 font-semibold">{item.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md capitalize">
                        {item.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <FiClock className="text-slate-400 text-xs" />
                        <input
                          type="text"
                          placeholder="e.g. 09:00:00"
                          value={item.check_in || ''}
                          onChange={(e) => handleTimeChange(item.staff_id, 'check_in', e.target.value)}
                          className="w-24 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-sky-500"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <FiClock className="text-slate-400 text-xs" />
                        <input
                          type="text"
                          placeholder="e.g. 17:00:00"
                          value={item.check_out || ''}
                          onChange={(e) => handleTimeChange(item.staff_id, 'check_out', e.target.value)}
                          className="w-24 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-sky-500"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1.5">
                        {['Present', 'Late', 'Absent', 'On Leave'].map((statusOption) => (
                          <button
                            key={statusOption}
                            type="button"
                            onClick={() => handleStatusChange(item.staff_id, statusOption)}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-all cursor-pointer ${
                              (item.status || 'Present') === statusOption
                                ? statusOption === 'Present'
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                  : statusOption === 'Late'
                                  ? 'bg-amber-50 text-amber-600 border border-amber-200'
                                  : statusOption === 'Absent'
                                  ? 'bg-red-50 text-red-600 border border-red-200'
                                  : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                                : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 border border-slate-200/50'
                            }`}
                          >
                            {statusOption}
                          </button>
                        ))}
                      </div>
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

export default AdminStaffAttendancePage;
