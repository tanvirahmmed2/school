'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiCheck, FiX, FiChevronRight, FiCalendar, FiUser } from 'react-icons/fi';

const AdminStaffLeavesPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/staff/leaves');
      const data = await res.json();
      if (data.success && data.paylod?.leaves) {
        setLeaves(data.paylod.leaves);
      } else {
        throw new Error(data.error || 'Failed to fetch leave records.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load staff leave applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleProcessLeave = async (id, status) => {
    const confirm = window.confirm(`Are you sure you want to ${status.toLowerCase()} this leave application?`);
    if (!confirm) return;

    setProcessingId(id);
    try {
      const res = await fetch('/api/admin/staff/leaves', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || `Leave application ${status.toLowerCase()} successfully!`);
        fetchLeaves();
      } else {
        throw new Error(data.error || 'Failed to process leave application.');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const pendingLeaves = leaves.filter((l) => l.status === 'Pending');
  const processedLeaves = leaves.filter((l) => l.status !== 'Pending');

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FiCalendar className="text-sky-600 animate-pulse" /> Staff Leave Approvals
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review, approve, and archive leave requests submitted by operational and registry staff.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 gap-1.5">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-400 hover:text-slate-655'
          }`}
        >
          Pending Requests ({pendingLeaves.length})
        </button>
        <button
          onClick={() => setActiveTab('archive')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'archive'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-400 hover:text-slate-655'
          }`}
        >
          Archive Log ({processedLeaves.length})
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        {loading ? (
          <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-slate-400">Loading leave requests...</span>
          </div>
        ) : activeTab === 'pending' ? (
          pendingLeaves.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
              <span className="text-slate-355 text-5xl mb-3">🏖️</span>
              <h3 className="text-sm font-bold text-slate-600">No Pending Requests</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
                There are no leave applications pending review.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Staff Member</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Leave Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Reason Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingLeaves.map((lv) => (
                    <tr key={lv.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100">
                            <FiUser />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{lv.staff_name}</p>
                            <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded capitalize">
                              {lv.staff_role}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full">
                          {lv.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-650 font-bold flex items-center gap-1">
                          {new Date(lv.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          <FiChevronRight className="text-slate-400" />
                          {new Date(lv.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-slate-500 max-w-sm truncate" title={lv.reason}>
                          {lv.reason}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            disabled={processingId !== null}
                            onClick={() => handleProcessLeave(lv.id, 'Approved')}
                            className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-all cursor-pointer border border-green-200/50"
                            title="Approve Leave"
                          >
                            <FiCheck className="text-sm" />
                          </button>
                          <button
                            disabled={processingId !== null}
                            onClick={() => handleProcessLeave(lv.id, 'Rejected')}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-650 rounded-xl transition-all cursor-pointer border border-red-200/50"
                            title="Reject Leave"
                          >
                            <FiX className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : processedLeaves.length === 0 ? (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
            <span className="text-slate-355 text-5xl mb-3">📁</span>
            <h3 className="text-sm font-bold text-slate-650">Archive Log Empty</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
              No processed leave logs found.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Staff Member</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Leave Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Remarks / Reason</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {processedLeaves.map((lv) => (
                  <tr key={lv.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-200/50">
                          <FiUser />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{lv.staff_name}</p>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{lv.staff_role}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded">
                        {lv.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500 font-semibold">
                        {new Date(lv.start_date).toLocaleDateString()} to {new Date(lv.end_date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-500 max-w-xs truncate" title={lv.reason}>
                        {lv.reason}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        lv.status === 'Approved'
                          ? 'bg-green-50 text-green-600 border border-green-100'
                          : 'bg-red-50 text-red-650 border border-red-100'
                      }`}>
                        {lv.status}
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

export default AdminStaffLeavesPage;
