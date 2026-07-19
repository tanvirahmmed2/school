'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
  FiArrowLeft, FiUser, FiMail, FiPhone, FiCalendar, 
  FiMapPin, FiAward, FiBook, FiCheck, FiX, FiLayers, FiImage, FiFileText, FiDollarSign
} from 'react-icons/fi';

const ApplicantDetailsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchApplicant = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/students/admissions?id=${id}`);
        const data = await res.json();
        if (data.success && data.paylod?.applicant) {
          setApplicant(data.paylod.applicant);
        } else {
          toast.error(data.error || 'Failed to load applicant details.');
        }
      } catch (err) {
        toast.error('Failed to load applicant details.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplicant();
  }, [id]);

  const handleUpdateFeeStatus = async (newFeeStatus) => {
    try {
      const res = await fetch('/api/admin/students/admissions/fee-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_admission_id: id, status: newFeeStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || 'Fee status updated successfully!');
        setApplicant(prev => ({ ...prev, fee_status: newFeeStatus }));
      } else {
        throw new Error(data.error || 'Failed to update fee status.');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleProcess = async (status) => {
    const confirm = window.confirm(`Are you sure you want to ${status.toLowerCase()} this application?`);
    if (!confirm) return;

    setProcessing(true);
    try {
      const res = await fetch('/api/admin/students/admissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || `Application ${status.toLowerCase()} successfully!`);
        router.push('/admin/students/admissions');
      } else {
        throw new Error(data.error || 'Failed to process application.');
      }
    } catch (err) {
      toast.error(err.message);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-semibold text-slate-400">Loading applicant details...</span>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <span className="text-5xl mb-4">🔍</span>
        <h3 className="text-lg font-bold text-slate-700">Applicant Not Found</h3>
        <p className="text-sm text-slate-450 text-slate-450 mt-1">
          The requested admission candidate details could not be loaded.
        </p>
        <button
          onClick={() => router.push('/admin/students/admissions')}
          className="mt-6 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 animate-fade-up">
      {/* Back to list */}
      <button
        onClick={() => router.push('/admin/students/admissions')}
        className="self-start flex items-center gap-2 px-4 py-2 border border-slate-100 bg-white hover:bg-slate-50 text-slate-500 rounded-2xl text-xs font-bold transition-all shadow-[0_5px_15px_rgba(0,0,0,0.01)] cursor-pointer"
      >
        <FiArrowLeft className="text-sm" /> Back to Application Registry
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Visual Assets */}
        <div className="md:col-span-1 flex flex-col gap-6">
          {/* Candidate Image Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_15px_40px_rgba(0,0,0,0.01)] flex flex-col items-center text-center gap-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-start flex items-center gap-1.5">
              <FiImage className="text-xs text-blue-500" /> Candidate Photo
            </p>
            {applicant.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={applicant.image} 
                alt="Candidate Profile" 
                className="w-40 h-40 rounded-2xl object-cover border border-slate-150 shadow-md bg-slate-50"
              />
            ) : (
              <div className="w-40 h-40 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-semibold">
                No Photo Provided
              </div>
            )}
            <div>
              <h2 className="text-base font-black text-slate-800">{applicant.applicant_name}</h2>
              <span className="inline-flex mt-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                Class: {applicant.class_name}
              </span>
            </div>
          </div>

          {/* Candidate Signature Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_15px_40px_rgba(0,0,0,0.01)] flex flex-col items-center text-center gap-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-start flex items-center gap-1.5">
              <FiFileText className="text-xs text-emerald-500" /> Signature
            </p>
            {applicant.signature ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={applicant.signature} 
                alt="Candidate Signature" 
                className="w-full max-w-[200px] h-20 rounded-xl object-contain border border-slate-100 bg-white p-2 shadow-inner"
              />
            ) : (
              <div className="w-full h-20 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 text-xs font-semibold">
                No Signature Provided
              </div>
            )}
          </div>

          {/* Admission Fee Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_15px_40px_rgba(0,0,0,0.01)] flex flex-col gap-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-start flex items-center gap-1.5">
              <FiDollarSign className="text-xs text-amber-500" /> Admission Fee Status
            </p>
            <div className="w-full flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500">Fee Amount:</span>
                <span className="text-sm font-bold text-slate-800">${parseFloat(applicant.fee_amount || applicant.admission_fees_amount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500">Status:</span>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  applicant.fee_status === 'Paid'
                    ? 'bg-green-50 text-green-600 border-green-100'
                    : applicant.fee_status === 'Cancelled' || applicant.fee_status === 'Cancel'
                    ? 'bg-red-50 text-red-600 border-red-100'
                    : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {applicant.fee_status || 'Pending'}
                </span>
              </div>
              {applicant.status === 'Pending' && (
                <div className="mt-3 pt-3 border-t border-slate-50 flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Update Payment Status</label>
                  <select
                    value={applicant.fee_status || 'Pending'}
                    onChange={(e) => handleUpdateFeeStatus(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Text Information */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.01)] flex flex-col gap-6">
            
            {/* Header info */}
            <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-50">
              <div>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide ${
                  applicant.status === 'Pending' 
                    ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                    : applicant.status === 'Approved'
                    ? 'bg-green-50 text-green-600 border border-green-100'
                    : 'bg-red-50 text-red-600 border border-red-100'
                }`}>
                  {applicant.status} Application
                </span>
                {applicant.admission_title && (
                  <p className="text-xs text-slate-400 font-bold mt-1.5 uppercase tracking-wider">
                    {applicant.admission_title}
                  </p>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-semibold">
                Applied Date: {new Date(applicant.applied_date).toLocaleDateString()}
              </p>
            </div>

            {/* Profile Fields */}
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">1. Personal Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <FiUser className="text-slate-400" /> Candidate Name
                  </p>
                  <p className="text-sm font-bold text-slate-700">{applicant.applicant_name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <FiCalendar className="text-slate-400" /> Date of Birth
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {new Date(applicant.date_of_birth).toLocaleDateString()} (Gender: {applicant.gender})
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <FiAward className="text-slate-400" /> Birth Registration No
                  </p>
                  <p className="text-sm font-bold text-slate-700">{applicant.birth_regi_number || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <FiBook className="text-slate-400" /> Previous Institution
                  </p>
                  <p className="text-sm font-bold text-slate-700">{applicant.previous_school || 'None / Fresh Enrollment'}</p>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="border-t border-slate-50 pt-5">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">2. Contact & Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <FiPhone className="text-slate-400" /> Contact Phone
                  </p>
                  <p className="text-sm font-bold text-slate-700">{applicant.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <FiMail className="text-slate-400" /> Registered Email
                  </p>
                  <p className="text-sm font-bold text-slate-700">{applicant.email}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <FiMapPin className="text-slate-400" /> Residential Address
                  </p>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed">{applicant.address}</p>
                </div>
              </div>
            </div>

            {/* Parents Details */}
            <div className="border-t border-slate-50 pt-5">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">3. Guardian Metadata</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <FiUser className="text-slate-400" /> Guardian Full Name
                  </p>
                  <p className="text-sm font-bold text-slate-700">{applicant.guardian_name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <FiPhone className="text-slate-400" /> Guardian Phone
                  </p>
                  <p className="text-sm font-bold text-slate-700">{applicant.guardian_phone}</p>
                </div>
              </div>
            </div>

            {/* Action buttons (only if Pending) */}
            {applicant.status === 'Pending' && (
              <div className="flex justify-end gap-3 border-t border-slate-50 pt-6 mt-4">
                <button
                  disabled={processing}
                  onClick={() => handleProcess('Rejected')}
                  className="px-5 py-2.5 border border-red-100 hover:bg-red-50 text-red-600 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FiX /> Reject Application
                </button>
                <button
                  disabled={processing}
                  onClick={() => handleProcess('Approved')}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <FiCheck /> Approve Admission
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

const ApplicantDetailsPage = () => {
  return (
    <Suspense fallback={
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-semibold text-slate-400">Preparing candidate profile...</span>
      </div>
    }>
      <ApplicantDetailsContent />
    </Suspense>
  );
};

export default ApplicantDetailsPage;
