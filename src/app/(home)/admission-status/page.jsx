'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiSearch, FiLayers, FiCheckCircle, FiXCircle, FiClock, FiAlertCircle, FiAward, FiFileText, FiPrinter } from 'react-icons/fi';
import { printAdmissionFeeReceipt } from '@/lib/receipts/admission_fee';

const AdmissionStatusPage = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Please enter your Application ID or Email.');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/public/admissions/status?search=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setApplication(data.paylod.application);
      } else {
        setApplication(null);
        toast.error(data.error || 'No matching application found.');
      }
    } catch (err) {
      setApplication(null);
      toast.error('Failed to lookup admission application.');
    } finally {
      setLoading(false);
    }
  };

  const getReviewStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'approved':
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <FiCheckCircle /> Selected / Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
            <FiXCircle /> Rejected! Try again
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <FiClock /> Result will be published soon
          </span>
        );
      case 'incomplete':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <FiClock /> Incomplete (Fee / Photo Upload Pending)
          </span>
        );
    }
  };

  const getPaymentStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'paid') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-600 border border-green-100">
          Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
        Unpaid
      </span>
    );
  };

  const formatClass = (cls) => {
    if (!cls) return 'N/A';
    const str = String(cls).trim();
    return str.toLowerCase().startsWith('class') ? str : `Class ${str}`;
  };

  return (
    <div className="w-full min-h-[70vh] py-12 px-4 md:px-8 max-w-3xl mx-auto flex flex-col gap-8 animate-fade-up">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <FiAward className="text-primary animate-pulse" /> Admission Status &amp; Results
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          Look up your admission intake application status, verification reviews, and final results index.
        </p>
      </div>

      {/* Input Search Box */}
      <div className="w-full max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-3.5 text-slate-400 text-base" />
            <input
              type="text"
              placeholder="Enter Application ID (e.g. 10008) or Email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-2xl text-sm font-bold shadow-md shadow-sky-500/10 hover:shadow-sky-500/25 transition-all cursor-pointer disabled:opacity-60"
          >
            {loading ? 'Searching...' : 'Lookup Status'}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-400">Verifying registry file...</span>
        </div>
      ) : application ? (
        <div className="flex flex-col gap-6 animate-fade-up">
          {/* Main Info Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-50 pb-5 gap-4">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1">
                  Circular: {application.circular_name || 'General Admission'}
                </span>
                <h2 className="text-xl font-semibold text-slate-800">{application.candidate_name}</h2>
                <p className="text-xs text-slate-450 mt-0.5">Email: {application.candidate_email}</p>
              </div>
              <div className="sm:text-right flex flex-col sm:items-end gap-1">
                <span className="text-xs text-slate-400 font-bold block">Application ID: #{application.application_id}</span>
                <span className="text-xs text-slate-450 block font-semibold">Applied on: {new Date(application.created_at).toLocaleDateString()}</span>
                <button
                  onClick={() => printAdmissionFeeReceipt(application)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer mt-1"
                >
                  <FiPrinter /> Print / Download Receipt
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-semibold">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Target Class</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary-light border border-primary-light px-2.5 py-1 rounded-full">
                  <FiLayers className="text-sky-400 text-xs" />
                  {formatClass(application.class_name)}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Status</span>
                <div>{getReviewStatusBadge(application.application_status)}</div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Admission Fee</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-semibold text-slate-700">BDT {parseFloat(application.fee_amount || 0).toFixed(2)}</span>
                  {getPaymentStatusBadge(application.payment_status)}
                </div>
              </div>
            </div>

            {/* Results publication section */}
            <div className="mt-4 pt-6 border-t border-slate-100">
              {application.is_result_published ? (
                <div>
                  {['approved', 'accepted'].includes((application.application_status || '').toLowerCase()) ? (
                    <div className="p-6 bg-primary-light border border-primary-light rounded-2xl flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-primary font-semibold">
                        <FiCheckCircle className="text-xl" />
                        <span>Congratulations! Admission Selected</span>
                      </div>
                      <p className="text-xs text-primary leading-relaxed font-semibold">
                        Your application for {formatClass(application.class_name)} has been approved. Below are your assigned academic credentials:
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-2 max-w-sm text-xs font-bold">
                        <div className="bg-white border border-primary-light p-3 rounded-xl">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">Class Section</span>
                          <span className="text-slate-800 text-sm font-semibold">{application.section_name || 'Assigning...'}</span>
                        </div>
                        <div className="bg-white border border-primary-light p-3 rounded-xl">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">Roll Number</span>
                          <span className="text-primary text-sm font-semibold">{application.roll_number || 'Assigning...'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (application.application_status || '').toLowerCase() === 'rejected' ? (
                    <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-rose-700 font-semibold">
                        <FiXCircle className="text-xl text-rose-500" />
                        <span>Rejected! Try again</span>
                      </div>
                      <p className="text-xs text-rose-600 leading-relaxed font-medium">
                        We regret to inform you that your application was not selected for admission in this term. We appreciate your interest in our institution and wish you the best in your future academic activities.
                      </p>
                    </div>
                  ) : (
                    <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-amber-700 font-semibold">
                        <FiClock className="text-xl" />
                        <span>Result will be published soon</span>
                      </div>
                      <p className="text-xs text-amber-800 leading-relaxed font-medium">
                        Your application is under review by the admissions committee. The circular results will be published soon.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-amber-700 font-semibold">
                    <FiClock className="text-xl text-amber-600" />
                    <span>Result will be published soon</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    The admissions circular selection results for {formatClass(application.class_name)} have not been published by the administration yet. Result will be published soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="w-full max-w-md mx-auto p-8 bg-rose-50 border border-rose-100 rounded-3xl text-center flex flex-col items-center gap-3 animate-fade-up">
          <FiAlertCircle className="text-rose-500 text-3xl" />
          <div>
            <h3 className="text-sm font-bold text-rose-800">No Application Found</h3>
            <p className="text-xs text-rose-650 mt-1">
              No admission application corresponds to that Application ID or candidate email address.
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md mx-auto p-8 border border-dashed border-slate-200 rounded-3xl text-center text-slate-400 flex flex-col items-center gap-2 animate-fade-up">
          <span>🎓</span>
          <p className="text-xs font-semibold">Enter your credentials above to check admission application status.</p>
        </div>
      )}
    </div>
  );
};

export default AdmissionStatusPage;
