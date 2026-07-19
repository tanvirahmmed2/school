'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiUsers, FiCheck, FiX, FiCalendar, FiClock, FiAlertOctagon } from 'react-icons/fi';

const RegistrarAdmissionsPage = () => {
  const [role, setRole] = useState(null);
  const [admissions, setAdmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchProfileAndAdmissions = async () => {
    setLoading(true);
    try {
      const profileRes = await fetch('/api/staff/me');
      if (!profileRes.ok) {
        setLoading(false);
        return;
      }
      const profileData = await profileRes.json();
      const userRole = profileData.paylod.staff.role;
      setRole(userRole);

      if (userRole === 'register' || userRole === 'registrar') {
        const res = await fetch('/api/admin/students/admissions');
        const data = await res.json();
        if (data.success && data.paylod?.admissions) {
          setAdmissions(data.paylod.admissions);
        }
      }
    } catch (err) {
      toast.error('Failed to load admission applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndAdmissions();
  }, []);

  const handleProcessAdmission = async (id, status) => {
    const confirm = window.confirm(`Are you sure you want to ${status.toLowerCase()} this application?`);
    if (!confirm) return;

    setProcessingId(id);
    try {
      const res = await fetch('/api/admin/students/admissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || `Application ${status.toLowerCase()} successfully!`);
        fetchProfileAndAdmissions();
      } else {
        throw new Error(data.error || 'Failed to process application.');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleUpdateFeeStatus = async (studentAdmissionId, nextStatus) => {
    try {
      const res = await fetch('/api/admin/students/admissions/fee-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_admission_id: studentAdmissionId, status: nextStatus })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Fee status updated successfully.');
        fetchProfileAndAdmissions();
      } else {
        throw new Error(data.error || 'Failed to update fee status.');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-sky-655 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-semibold text-slate-400">Loading admissions records...</span>
      </div>
    );
  }

  // Hardcoded role guard
  if (role !== 'register' && role !== 'registrar') {
    return (
      <div className="w-full max-w-md mx-auto mt-16 p-8 bg-red-50 border border-red-100 rounded-3xl text-center flex flex-col items-center gap-4 shadow-sm animate-fade-up">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <FiAlertOctagon className="text-red-650 text-xl" />
        </div>
        <div>
          <h2 className="text-base font-bold text-red-800">Access Denied</h2>
          <p className="text-xs text-red-655 mt-1">
            This module is restricted to the <strong>Registrar</strong> role only. You do not have permissions to process admissions.
          </p>
        </div>
      </div>
    );
  }

  const pendingAdmissions = admissions.filter((a) => a.status === 'Pending');
  const processedAdmissions = admissions.filter((a) => a.status !== 'Pending');

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FiUsers className="text-sky-600 animate-pulse" /> Admissions Registry Desk
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Verify student intake requests, record fee status payouts, and approve new candidates to the student registry.
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
          Pending Review ({pendingAdmissions.length})
        </button>
        <button
          onClick={() => setActiveTab('archive')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'archive'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-400 hover:text-slate-655'
          }`}
        >
          Registry Archive ({processedAdmissions.length})
        </button>
      </div>

      {/* List Container */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        {activeTab === 'pending' ? (
          pendingAdmissions.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
              <span className="text-slate-300 text-5xl mb-3">📝</span>
              <h3 className="text-sm font-bold text-slate-600">No Applications Awaiting Review</h3>
              <p className="text-xs text-slate-400 mt-1">There are currently no new intake registrations.</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Applied Program</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Circular Fee</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingAdmissions.map((appl) => {
                    const isPaid = appl.fee_status === 'Paid' || appl.fee_status === 'paid';
                    return (
                      <tr key={appl.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800">{appl.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Email: {appl.email}</p>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                          {appl.class_name}
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-700">
                          ${Number(appl.admission_fees_amount || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={appl.fee_status || 'Pending'}
                            onChange={(e) => handleUpdateFeeStatus(appl.id, e.target.value)}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 outline-none focus:border-sky-500 cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              disabled={processingId === appl.id || !isPaid}
                              onClick={() => handleProcessAdmission(appl.id, 'Approved')}
                              className={`p-2 rounded-xl transition-all inline-flex items-center gap-1 text-xs font-bold cursor-pointer ${
                                isPaid 
                                  ? 'bg-green-50 hover:bg-green-100 text-green-600' 
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              }`}
                              title={isPaid ? 'Approve candidate' : 'Admissions fees must be paid to approve'}
                            >
                              <FiCheck />
                              <span>Approve</span>
                            </button>
                            <button
                              disabled={processingId === appl.id}
                              onClick={() => handleProcessAdmission(appl.id, 'Rejected')}
                              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1 text-xs font-bold"
                              title="Reject candidate"
                            >
                              <FiX />
                              <span>Reject</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          processedAdmissions.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
              <span className="text-slate-305 text-5xl mb-3">🗄️</span>
              <h3 className="text-sm font-bold text-slate-600">Archive Log Empty</h3>
              <p className="text-xs text-slate-400 mt-1">Processed requests will show up in the archive registry.</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Circular</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Outcome</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Processed Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {processedAdmissions.map((appl) => (
                    <tr key={appl.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800">{appl.name}</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Email: {appl.email}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                        {appl.class_name}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full ${
                          appl.status === 'Approved'
                            ? 'bg-green-50 text-green-600 border border-green-100'
                            : 'bg-red-50 text-red-655 border border-red-100'
                        }`}>
                          {appl.status === 'Approved' ? 'Approved' : 'Rejected'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <FiCalendar />
                          {new Date(appl.updated_at).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default RegistrarAdmissionsPage;
