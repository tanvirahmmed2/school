'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiHome, FiCheckCircle, FiClock, FiXCircle, FiSend, FiAlertCircle, FiShield } from 'react-icons/fi';

export default function StudentHostelsPage() {
  const [hostels, setHostels] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeAllocation, setActiveAllocation] = useState(null);
  const [isAllocated, setIsAllocated] = useState(false);
  const [studentGender, setStudentGender] = useState(null);
  const [loading, setLoading] = useState(true);

  // Application form
  const [preferredHostelId, setPreferredHostelId] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resH, resApp] = await Promise.all([
        axios.get('/api/hostels'),
        axios.get('/api/hostel-applications')
      ]);

      setHostels(resH.data.payload?.hostels || resH.data.paylod?.hostels || []);
      setApplications(resApp.data.payload?.applications || resApp.data.paylod?.applications || []);
      setActiveAllocation(resApp.data.payload?.activeAllocation || resApp.data.paylod?.activeAllocation || null);
      setIsAllocated(resApp.data.payload?.isAllocated || resApp.data.paylod?.isAllocated || false);
      setStudentGender(resApp.data.payload?.studentGender || resApp.data.paylod?.studentGender || null);
    } catch (error) {
      toast.error('Failed to load hostel data.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (isAllocated) {
      toast.error('You are already allocated to a hostel seat.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post('/api/hostel-applications', {
        preferred_hostel_id: preferredHostelId || null,
        reason
      });

      toast.success(response.data.message || 'Hostel application submitted!');
      setPreferredHostelId('');
      setReason('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const hasPendingApp = applications.some(a => a.status === 'pending');

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FiHome className="text-primary" /> Hostel & Hall Accommodation
        </h1>
        <p className="text-sm text-slate-500">
          View your active hostel seat allocation status or apply for a residential hall seat.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs font-semibold">Loading hostel portal...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Active Allocation or Application Form */}
          <div className="lg:col-span-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
            {isAllocated && activeAllocation ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-base border-b border-slate-100 pb-3">
                  <FiCheckCircle className="text-lg" /> Active Seat Allocated
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-emerald-950 space-y-2">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">Hostel Hall</div>
                    <div className="text-base font-extrabold text-slate-900">{activeAllocation.hostel_name}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-emerald-200/60">
                    <div>
                      <span className="font-bold text-slate-600">Seat Code:</span>
                      <div className="font-extrabold text-primary text-sm">{activeAllocation.seat_code}</div>
                    </div>
                    <div>
                      <span className="font-bold text-slate-600">Location:</span>
                      <div className="font-semibold">Floor {activeAllocation.floor}, Room {activeAllocation.room_number}</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-emerald-800 pt-2 border-t border-emerald-200/60 font-semibold">
                    Monthly Fee: ${activeAllocation.monthly_fee}/month
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 flex items-start gap-2">
                  <FiShield className="text-amber-600 text-base shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    You currently hold an active seat. New applications are restricted while holding an active allocation.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <FiSend className="text-primary" /> Apply for Hostel Allocation
                </h2>

                {hasPendingApp ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-2">
                    <p className="font-bold flex items-center gap-1.5 text-amber-800">
                      <FiClock className="text-sm" /> Application Under Review
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      Your hostel application has been submitted and is currently being reviewed by the administration. You will be notified once a seat is assigned.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleApplySubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700">Preferred Hostel / Hall (Optional)</label>
                        {studentGender && (
                          <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-md">
                            {studentGender} Halls Only
                          </span>
                        )}
                      </div>
                      <select
                        value={preferredHostelId}
                        onChange={(e) => setPreferredHostelId(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                      >
                        <option value="">-- No Preference (Any Eligible Hall) --</option>
                        {hostels
                          .filter((h) => {
                            const hG = (h.gender || 'Both').toLowerCase();
                            if (hG === 'both') return true;
                            const sG = (studentGender || '').toLowerCase();
                            const isFemaleStudent = sG.includes('female') || sG === 'f';
                            const isMaleStudent = !isFemaleStudent && (sG.includes('male') || sG === 'm');
                            const isMaleHostel = hG === 'male' || (hG.includes('male') && !hG.includes('female'));
                            const isFemaleHostel = hG === 'female' || hG.includes('female');
                            if (isMaleHostel && !isMaleStudent) return false;
                            if (isFemaleHostel && !isFemaleStudent) return false;
                            return true;
                          })
                          .map((h) => (
                            <option key={h.id} value={h.id}>
                              {h.name} ({h.gender} Hall)
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700">Reason / Details for Request</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="State your reason for residential hall accommodation request..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Application History */}
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl shadow-xs overflow-hidden space-y-4 p-6">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
              Application History ({applications.length})
            </h2>

            {applications.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">No previous hostel applications found.</div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-900">
                        {app.preferred_hostel_name ? `Preferred: ${app.preferred_hostel_name}` : 'General Hostel Request'}
                      </div>
                      <div className="text-[11px] text-slate-500">{app.reason}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">
                        Applied on {new Date(app.applied_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </div>
                    </div>

                    <div>
                      {app.status === 'pending' && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                          <FiClock /> Pending Review
                        </span>
                      )}
                      {app.status === 'approved' && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                          <FiCheckCircle /> Approved & Allocated
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 flex items-center gap-1 w-fit">
                          <FiXCircle /> Rejected
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
