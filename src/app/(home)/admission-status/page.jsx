'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiSearch, FiLayers, FiCheckCircle, FiXCircle, FiClock, FiAlertCircle, FiAward, FiFileText } from 'react-icons/fi';

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
    switch (status) {
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
            <FiCheckCircle /> Selected / Accepted
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
            <FiXCircle /> Not Selected
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
            <FiClock /> Under Review
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
            <FiClock /> Pending Review
          </span>
        );
    }
  };

  const getPaymentStatusBadge = (status) => {
    if (status === 'Paid') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-600 border border-green-100">
          Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
        Unpaid
      </span>
    );
  };

  return (
    <div className="w-full min-h-[70vh] py-12 px-4 md:px-8 max-w-3xl mx-auto flex flex-col gap-8 animate-fade-up">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <FiAward className="text-sky-600 animate-pulse" /> Admission Status & Results
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
              placeholder="Enter Application ID or Email Address"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-sm font-bold shadow-md shadow-sky-500/10 hover:shadow-sky-500/25 transition-all cursor-pointer disabled:opacity-60"
          >
            {loading ? 'Searching...' : 'Lookup Status'}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-3 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-400">Verifying registry file...</span>
        </div>
      ) : application ? (
        <div className="flex flex-col gap-6 animate-fade-up">
          {/* Main Info Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-50 pb-5 gap-4">
              <div>
                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block mb-1">
                  Circular: {application.circular_name || 'General Admission'}
                </span>
                <h2 className="text-xl font-black text-slate-800">{application.candidate_name}</h2>
                <p className="text-xs text-slate-450 mt-0.5">Email: {application.candidate_email}</p>
              </div>
              <div className="sm:text-right">
                <span className="text-xs text-slate-400 font-bold block mb-1">Application ID: #{application.application_id}</span>
                <span className="text-xs text-slate-450 block font-semibold">Applied on: {new Date(application.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-semibold">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Target Class</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-full">
                  <FiLayers className="text-sky-400 text-xs" />
                  {application.class_name}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Review Status</span>
                <div>{getReviewStatusBadge(application.application_status)}</div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Processing Fee</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-extrabold text-slate-700">৳500.00</span>
                  {getPaymentStatusBadge(application.payment_status)}
                </div>
              </div>
            </div>

            {/* Results publication section */}
            <div className="mt-4 pt-6 border-t border-slate-100">
              {application.is_result_published ? (
                <div>
                  {application.application_status === 'Accepted' ? (
                    <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-emerald-700 font-extrabold">
                        <FiCheckCircle className="text-xl" />
                        <span>Congratulations! Admission Selected</span>
                      </div>
                      <p className="text-xs text-emerald-800 leading-relaxed font-semibold">
                        Your application for Class {application.class_name} has been approved. Below are your assigned academic credentials:
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-2 max-w-sm text-xs font-bold">
                        <div className="bg-white border border-emerald-100 p-3 rounded-xl">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">Class Section</span>
                          <span className="text-slate-800 text-sm font-extrabold">{application.section_name || 'Assigning...'}</span>
                        </div>
                        <div className="bg-white border border-emerald-100 p-3 rounded-xl">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">Roll Number</span>
                          <span className="text-sky-600 text-sm font-extrabold">{application.roll_number || 'Assigning...'}</span>
                        </div>
                      </div>
                    </div>
                  ) : application.application_status === 'Rejected' ? (
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-slate-700 font-extrabold">
                        <FiXCircle className="text-xl text-slate-500" />
                        <span>Application Not Selected</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        We regret to inform you that your application was not selected for admission in this term. We appreciate your interest in our institution and wish you the best in your future academic activities.
                      </p>
                    </div>
                  ) : (
                    <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-amber-700 font-extrabold">
                        <FiClock className="text-xl" />
                        <span>Review Under Processing</span>
                      </div>
                      <p className="text-xs text-amber-800 leading-relaxed font-medium">
                        Your application is currently under final review by the admissions committee. Once updates are cleared, your seat allocation details will be populated here.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-blue-700 font-extrabold">
                    <FiFileText className="text-xl text-blue-500" />
                    <span>Admissions Results Pending</span>
                  </div>
                  <p className="text-xs text-blue-800 leading-relaxed font-medium">
                    The admissions circular selection results for class {application.class_name} have not been published by the administration yet. Please check back later once official notifications are issued on the Notice Board.
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
