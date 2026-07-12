'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiCalendar, FiPlus, FiCheck, FiX, FiClock, FiFileText } from 'react-icons/fi';

const LeavesPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Form states
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await fetch('/api/teacher/leaves');
        if (res.ok) {
          const data = await res.json();
          setApplications(data.paylod.applications || []);
        }
      } catch (err) {
        console.error('Failed to load leave history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, [reloadTrigger]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type || !startDate || !endDate || !reason) {
      toast.error('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/teacher/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          start_date: startDate,
          end_date: endDate,
          reason
        })
      });

      if (res.ok) {
        toast.success('Leave application submitted successfully!');
        setType('');
        setStartDate('');
        setEndDate('');
        setReason('');
        setShowApplyModal(false);
        setReloadTrigger((prev) => prev + 1);
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to submit application.');
      }
    } catch (err) {
      toast.error('An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100"><FiCheck /> Approved</span>;
      case 'Rejected':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100"><FiX /> Rejected</span>;
      case 'Pending':
      default:
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100"><FiClock /> Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-650 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      {/* Title & Apply action */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Leave Applications</h1>
          <p className="text-slate-500 text-sm font-medium">Apply for new leaves and monitor your historical submissions status.</p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="flex items-center justify-center gap-1.5 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold shadow-md shadow-indigo-500/10 hover:shadow-lg transition-all cursor-pointer w-fit"
        >
          <FiPlus className="text-lg" />
          <span>Apply Leave</span>
        </button>
      </div>

      {/* Leave Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-xl flex flex-col gap-6 animate-fade-down duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FiFileText className="text-indigo-600" /> New Leave Application
              </h2>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-1.5 hover:bg-slate-50 text-slate-400 rounded-lg transition-colors cursor-pointer"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Leave Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-colors"
                  required
                >
                  <option value="">-- Choose Type --</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Medical/Sick Leave">Medical/Sick Leave</option>
                  <option value="Maternity/Paternity Leave">Maternity/Paternity Leave</option>
                  <option value="Duty Leave">Duty Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reason for Leave</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe details/reasons..."
                  rows="4"
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-colors resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-2xl text-sm font-bold shadow-md shadow-indigo-500/10 hover:shadow-lg transition-all cursor-pointer mt-2"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Applications Log */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8">
        <h2 className="text-base font-bold text-slate-800 mb-6">Leave History</h2>

        {applications.length === 0 ? (
          <p className="text-slate-400 text-xs font-semibold text-center py-12">No leave applications submitted yet.</p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Date Applied</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Leave Type</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Duration</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Reason</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                    <td className="py-4 text-xs font-semibold text-slate-400">
                      {new Date(app.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-4 text-sm font-bold text-slate-800">
                      {app.type}
                    </td>
                    <td className="py-4 text-sm font-semibold text-slate-600">
                      {new Date(app.start_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} — {new Date(app.end_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="py-4 text-xs font-semibold text-slate-500 max-w-xs truncate">
                      {app.reason}
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

export default LeavesPage;
