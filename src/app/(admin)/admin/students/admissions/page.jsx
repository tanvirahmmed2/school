'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiUsers, FiCheck, FiX, FiLayers, FiCalendar, FiClock, FiChevronRight, FiSearch } from 'react-icons/fi';
import Link from 'next/link';

const AdmissionsPage = () => {
  const [admissions, setAdmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/students/admissions');
      const data = await res.json();
      if (data.success && data.paylod?.admissions) {
        setAdmissions(data.paylod.admissions);
      }
    } catch (err) {
      toast.error('Failed to load admission applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
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

  const pendingAdmissions = admissions.filter((a) => a.status === 'Pending');
  const processedAdmissions = admissions.filter((a) => a.status !== 'Pending');

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FiUsers className="text-blue-600 animate-pulse" /> Student Admission Applications
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review, verify, and approve pending applicant admissions. Approved profiles automatically register as students.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 gap-1.5">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Pending Applications ({pendingAdmissions.length})
        </button>
        <button
          onClick={() => setActiveTab('archive')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'archive'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Archive Log ({processedAdmissions.length})
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        {loading ? (
          <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-slate-400">Loading admissions...</span>
          </div>
        ) : activeTab === 'pending' ? (
          pendingAdmissions.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
              <span className="text-slate-355 text-5xl mb-3">📝</span>
              <h3 className="text-sm font-bold text-slate-600">No Pending Applications</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
                Intake processing list is currently empty.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Applicant / Birth Reg</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Detail</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Applied Class</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Fee Status</th>
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
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Birth Reg No: {adm.birth_regi_number || 'N/A'}</p>
                          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5 mt-1">
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
                          {adm.admission_title && (
                            <p className="text-[9px] text-slate-400 font-semibold mt-1 truncate max-w-[150px]" title={adm.admission_title}>
                              Circular: {adm.admission_title}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-xs font-bold text-slate-800">${parseFloat(adm.fee_amount || adm.admission_fees_amount || 0).toFixed(2)}</p>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 border ${
                            adm.fee_status === 'Paid'
                              ? 'bg-green-50 text-green-600 border-green-100'
                              : adm.fee_status === 'Cancelled' || adm.fee_status === 'Cancel'
                              ? 'bg-red-50 text-red-600 border-red-100'
                              : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {adm.fee_status || 'Pending'}
                          </span>
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
                          <Link
                            href={`/admin/students/admissions/applicant?id=${adm.id}`}
                            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all"
                            title="Preview Applicant Info"
                          >
                            <FiSearch className="text-sm" />
                          </Link>
                          <button
                            disabled={processingId !== null}
                            onClick={() => handleProcessAdmission(adm.id, 'Approved')}
                            className="p-2 bg-green-55 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-all cursor-pointer"
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
          )
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
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Admission Fee</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Processed Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
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
                      <div>
                        <p className="text-xs font-bold text-slate-800">${parseFloat(adm.fee_amount || adm.admission_fees_amount || 0).toFixed(2)}</p>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 border ${
                          adm.fee_status === 'Paid'
                            ? 'bg-green-50 text-green-600 border-green-100'
                            : adm.fee_status === 'Cancelled' || adm.fee_status === 'Cancel'
                            ? 'bg-red-50 text-red-600 border-red-100'
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {adm.fee_status || 'Pending'}
                        </span>
                      </div>
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
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/students/admissions/applicant?id=${adm.id}`}
                        className="inline-flex p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all"
                        title="Preview Applicant Info"
                      >
                        <FiSearch className="text-sm" />
                      </Link>
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

export default AdmissionsPage;
