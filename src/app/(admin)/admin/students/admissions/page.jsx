'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiUsers, FiCheck, FiX, FiLayers, FiCalendar, FiClock, FiFileText, FiChevronRight } from 'react-icons/fi';

const AdmissionsPage = () => {
  const [admissions, setAdmissions] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [activeTab, setActiveTab] = useState('admissions-pending');
  const [loadingAdmissions, setLoadingAdmissions] = useState(true);
  const [loadingLeaves, setLoadingLeaves] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchAdmissions = async () => {
    setLoadingAdmissions(true);
    try {
      const res = await fetch('/api/admin/students/admissions');
      const data = await res.json();
      if (data.success && data.paylod?.admissions) {
        setAdmissions(data.paylod.admissions);
      }
    } catch (err) {
      toast.error('Failed to load admission applications.');
    } finally {
      setLoadingAdmissions(false);
    }
  };

  const fetchLeaves = async () => {
    setLoadingLeaves(true);
    try {
      const res = await fetch('/api/admin/students/leaves');
      const data = await res.json();
      if (data.success && data.paylod?.leaves) {
        setLeaves(data.paylod.leaves);
      }
    } catch (err) {
      toast.error('Failed to load student leave applications.');
    } finally {
      setLoadingLeaves(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
    fetchLeaves();
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
        fetchAdmissions();
      } else {
        throw new Error(data.error || 'Failed to process application.');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleProcessLeave = async (id, status) => {
    const confirm = window.confirm(`Are you sure you want to ${status.toLowerCase()} this leave application?`);
    if (!confirm) return;

    setProcessingId(id);
    try {
      const res = await fetch('/api/admin/students/leaves', {
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

  const pendingAdmissions = admissions.filter((a) => a.status === 'Pending');
  const processedAdmissions = admissions.filter((a) => a.status !== 'Pending');

  const pendingLeaves = leaves.filter((l) => l.status === 'Pending');
  const processedLeaves = leaves.filter((l) => l.status !== 'Pending');

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FiUsers className="text-blue-600" /> Student Desk & Approvals
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review, approve, and manage new student admission applications and student leaves.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 gap-1.5 flex-wrap">
        <button
          onClick={() => setActiveTab('admissions-pending')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'admissions-pending'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Pending Admissions ({pendingAdmissions.length})
        </button>
        <button
          onClick={() => setActiveTab('admissions-archive')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'admissions-archive'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Admissions Log ({processedAdmissions.length})
        </button>
        <button
          onClick={() => setActiveTab('leaves-pending')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'leaves-pending'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Pending Leaves ({pendingLeaves.length})
        </button>
        <button
          onClick={() => setActiveTab('leaves-archive')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'leaves-archive'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Leaves Log ({processedLeaves.length})
        </button>
      </div>

      {/* Pending Admissions Tab */}
      {activeTab === 'admissions-pending' && (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800">Pending Admission Registrations</h2>
          </div>

          {loadingAdmissions ? (
            <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold text-slate-400">Loading admissions...</span>
            </div>
          ) : pendingAdmissions.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
              <span className="text-slate-350 text-5xl mb-3">📝</span>
              <h3 className="text-sm font-bold text-slate-600">No Pending Applications</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
                Oakridge student intake desk is clear. Active listings will register inside this sheet.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Applicant</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Detail</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Applied Target</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Guardian Info</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingAdmissions.map((adm) => (
                    <tr key={adm.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{adm.applicant_name}</p>
                          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5 mt-0.5">
                            <FiCalendar /> DOB: {new Date(adm.date_of_birth).toLocaleDateString()} | Gender: {adm.gender}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-700">{adm.phone}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{adm.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                            <FiLayers className="text-xs text-blue-400" />
                            Class: {adm.class_name}
                          </span>
                          {adm.previous_school && (
                            <p className="text-[10px] text-slate-400 mt-1">Prev: {adm.previous_school}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-700">{adm.guardian_name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Phone: {adm.guardian_phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            disabled={processingId !== null}
                            onClick={() => handleProcessAdmission(adm.id, 'Approved')}
                            className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-all cursor-pointer"
                            title="Approve Admission"
                          >
                            <FiCheck className="text-sm" />
                          </button>
                          <button
                            disabled={processingId !== null}
                            onClick={() => handleProcessAdmission(adm.id, 'Rejected')}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all cursor-pointer"
                            title="Reject Admission"
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
          )}
        </div>
      )}

      {/* Admissions Log Tab */}
      {activeTab === 'admissions-archive' && (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800">Processed Admissions Log</h2>
          </div>

          {loadingAdmissions ? (
            <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold text-slate-400">Loading admissions...</span>
            </div>
          ) : processedAdmissions.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
              <span className="text-slate-350 text-5xl mb-3">📁</span>
              <h3 className="text-sm font-bold text-slate-650">Archive Log Empty</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
                No processed or historic applications logged in records.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Applicant</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Applied Target</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Processed Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {processedAdmissions.map((adm) => (
                    <tr key={adm.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{adm.applicant_name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{adm.email} | {adm.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-slate-650 flex items-center gap-1.5">
                          Class: {adm.class_name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                          <FiClock className="text-slate-400" />
                          {new Date(adm.updated_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          adm.status === 'Approved'
                            ? 'bg-green-50 text-green-600 border border-green-100'
                            : 'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                          {adm.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Pending Leaves Tab */}
      {activeTab === 'leaves-pending' && (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800">Pending Student Leave Drawer</h2>
          </div>

          {loadingLeaves ? (
            <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold text-slate-400">Loading leave requests...</span>
            </div>
          ) : pendingLeaves.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
              <span className="text-slate-350 text-5xl mb-3">🏖️</span>
              <h3 className="text-sm font-bold text-slate-600">No Leaves Pending</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
                There are no pending leave applications from students. Active leaves will register here.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Leave Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Reason Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingLeaves.map((lv) => (
                    <tr key={lv.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{lv.student_name}</p>
                          <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                            {lv.registration_number}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            {lv.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-650 font-bold flex items-center gap-1">
                          {new Date(lv.start_date).toLocaleDateString()}
                          <FiChevronRight className="text-slate-400" />
                          {new Date(lv.end_date).toLocaleDateString()}
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
                            className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-all cursor-pointer"
                            title="Approve Leave"
                          >
                            <FiCheck className="text-sm" />
                          </button>
                          <button
                            disabled={processingId !== null}
                            onClick={() => handleProcessLeave(lv.id, 'Rejected')}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all cursor-pointer"
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
          )}
        </div>
      )}

      {/* Leaves Log Tab */}
      {activeTab === 'leaves-archive' && (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800">Processed Student Leaves History Log</h2>
          </div>

          {loadingLeaves ? (
            <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold text-slate-400">Loading leave logs...</span>
            </div>
          ) : processedLeaves.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
              <span className="text-slate-355 text-5xl mb-3">📁</span>
              <h3 className="text-sm font-bold text-slate-650">Archive Log Empty</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
                No processed leave registers found in historical archive.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
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
                        <div>
                          <p className="text-sm font-bold text-slate-800">{lv.student_name}</p>
                          <span className="text-[10px] text-slate-400">{lv.registration_number}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
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
                            : 'bg-red-50 text-red-600 border border-red-100'
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
      )}
    </div>
  );
};

export default AdmissionsPage;
