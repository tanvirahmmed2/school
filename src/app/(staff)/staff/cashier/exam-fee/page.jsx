'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiBookOpen, FiDollarSign, FiClock, FiCheck, FiSearch, FiSliders, FiCreditCard, FiAlertOctagon } from 'react-icons/fi';

const CashierExamFeePage = () => {
  const [role, setRole] = useState(null);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examFees, setExamFees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Payment Recording Modal State
  const [recordingPaymentFee, setRecordingPaymentFee] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [transactionId, setTransactionId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const fetchExams = async () => {
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

      if (userRole === 'cashier') {
        const res = await fetch('/api/exams');
        if (res.ok) {
          const data = await res.json();
          setExams(data.paylod?.exams || []);
        }
      }
    } catch (err) {
      toast.error('Failed to load exams roster.');
    } finally {
      setLoading(false);
    }
  };

  const fetchExamFees = async (exam) => {
    setLoading(true);
    try {
      // Fetch all student fees for the target class of the exam
      const res = await fetch(`/api/students/fees?class_id=${exam.class_id}`);
      if (res.ok) {
        const data = await res.json();
        const allFees = data.paylod?.fees || [];
        // Filter locally for invoices that match the exam name
        const matchToken = `Exam Fee: ${exam.name.trim()}`;
        const filtered = allFees.filter(f => f.title.toLowerCase().includes(exam.name.toLowerCase()));
        setExamFees(filtered);
      }
    } catch (err) {
      toast.error('Failed to fetch student exam fee records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleSelectExam = (exam) => {
    setSelectedExam(exam);
    fetchExamFees(exam);
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!paymentAmount || isNaN(parseFloat(paymentAmount))) {
      toast.error('Please enter a valid payment amount.');
      return;
    }

    setSubmittingPayment(true);
    try {
      const res = await fetch('/api/students/fees', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fee_id: recordingPaymentFee.id,
          paid_amount: paymentAmount,
          payment_method: paymentMethod,
          transaction_id: transactionId,
          remarks: remarks
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record payment.');

      toast.success(data.message || 'Payment logged successfully.');
      setRecordingPaymentFee(null);
      setPaymentAmount('');
      setPaymentMethod('Cash');
      setTransactionId('');
      setRemarks('');
      if (selectedExam) {
        fetchExamFees(selectedExam);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmittingPayment(false);
    }
  };

  if (loading && !role) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-semibold text-slate-400">Loading exams billing...</span>
      </div>
    );
  }

  if (role !== 'cashier') {
    return (
      <div className="w-full max-w-md mx-auto mt-16 p-8 bg-red-50 border border-red-100 rounded-3xl text-center flex flex-col items-center gap-4 shadow-sm animate-fade-up">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <FiAlertOctagon className="text-red-600 text-xl" />
        </div>
        <div>
          <h2 className="text-base font-bold text-red-800">Access Denied</h2>
          <p className="text-xs text-red-650 mt-1">
            This module is restricted to the <strong>Cashier</strong> role only.
          </p>
        </div>
      </div>
    );
  }

  // Filter exams list
  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (exam.term && exam.term.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === '' || exam.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <FiBookOpen className="text-amber-500" /> Exam Fees Desk
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Track exam-related student billing files, evaluate class collections, and update paid receipts.
        </p>
      </div>

      {/* Record Payment Dialog */}
      {recordingPaymentFee && (
        <form onSubmit={handleRecordPayment} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col gap-5 animate-fade-down">
          <div>
            <h2 className="text-base font-bold text-slate-850 flex items-center gap-1.5">
              <FiCreditCard className="text-amber-500" /> Record Student Exam Fee Payment
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Log transaction receipt for student <strong>{recordingPaymentFee.student_name}</strong> for invoice <em>{recordingPaymentFee.title}</em>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Amount to Pay (BDT) *</label>
              <input
                type="number"
                step="0.01"
                required
                max={(parseFloat(recordingPaymentFee.amount) - parseFloat(recordingPaymentFee.paid_amount)).toFixed(2)}
                placeholder="e.g. 500"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-450 font-semibold px-0.5">
                Outstanding: ৳{(parseFloat(recordingPaymentFee.amount) - parseFloat(recordingPaymentFee.paid_amount)).toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Payment Method *</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-amber-500 cursor-pointer"
              >
                <option value="Cash">Cash Desk</option>
                <option value="bKash">bKash Merchant</option>
                <option value="Rocket">Rocket Pay</option>
                <option value="Nagad">Nagad Pay</option>
                <option value="Bank Transfer">Direct Bank Transfer</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction ID</label>
              <input
                type="text"
                placeholder="e.g. TXN9201"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-amber-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Remarks</label>
              <input
                type="text"
                placeholder="e.g. Direct counter clearance"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setRecordingPaymentFee(null)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingPayment}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60"
            >
              {submittingPayment ? 'Processing Payment...' : 'Confirm Receipt Payment'}
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Exams List & Invoices Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exams List */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col gap-4">
            <h2 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <FiSliders className="text-amber-500" /> Filter Exams
            </h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Search exams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-amber-500"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none cursor-pointer"
              >
                <option value="">All Statuses...</option>
                <option value="upcoming">Upcoming</option>
                <option value="current">Current</option>
                <option value="previous">Previous</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/20">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Active Circulars ({filteredExams.length})</h3>
            </div>
            <div className="divide-y divide-slate-100 overflow-y-auto max-h-[400px]">
              {filteredExams.length === 0 ? (
                <p className="text-slate-400 text-xs font-semibold text-center py-10">No exams matched filters.</p>
              ) : (
                filteredExams.map((exam) => (
                  <div
                    key={exam.id}
                    onClick={() => handleSelectExam(exam)}
                    className={`p-4 transition-all duration-150 cursor-pointer flex flex-col gap-1 hover:bg-slate-50/50 ${
                      selectedExam?.id === exam.id ? 'bg-amber-50/40 border-l-4 border-amber-550 border-amber-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 truncate max-w-[70%]">{exam.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        exam.status === 'current'
                          ? 'bg-emerald-50 text-emerald-600'
                          : exam.status === 'upcoming'
                          ? 'bg-sky-50 text-sky-600'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {exam.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-450 font-semibold">{exam.class_name} &bull; Term: {exam.term || 'N/A'}</span>
                    <div className="flex items-center justify-between mt-1 text-[10px]">
                      <span className="text-slate-400">Fee: <strong className="text-slate-700">৳{parseFloat(exam.exam_fee || 0).toFixed(2)}</strong></span>
                      <span className="text-blue-600 font-bold hover:underline">View Invoices &rarr;</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Selected Exam's Student Fees Ledger */}
        <div className="lg:col-span-2">
          {selectedExam ? (
            <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col animate-fade-left">
              <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/20">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Exam billing: {selectedExam.name}</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Assigned Class: {selectedExam.class_name} &bull; Target Fee: ৳{parseFloat(selectedExam.exam_fee || 0).toFixed(2)}</p>
                </div>
              </div>

              {examFees.length === 0 ? (
                <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
                  <span className="text-slate-300 text-4xl mb-3">💵</span>
                  <h4 className="text-xs font-bold text-slate-655">No Invoices logged</h4>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-[240px]">
                    No exam fee invoices are logged for this exam. (Note: Exam fees are only generated for active students when exam fee is set &gt; 0).
                  </p>
                </div>
              ) : (
                <div className="w-full overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
                        <th className="px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Invoice Title</th>
                        <th className="px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Fee Due</th>
                        <th className="px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Paid</th>
                        <th className="px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {examFees.map((fee) => {
                        const isPaid = fee.status === 'Paid';
                        return (
                          <tr key={fee.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-5 py-3 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-800">{fee.student_name}</span>
                                <span className="text-[9px] text-slate-400 font-semibold">Reg: #{fee.registration_number}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-xs text-slate-600 font-semibold">{fee.title}</td>
                            <td className="px-5 py-3 text-xs font-bold text-slate-850 text-right">৳{parseFloat(fee.amount).toFixed(2)}</td>
                            <td className="px-5 py-3 text-xs font-bold text-emerald-600 text-right">৳{parseFloat(fee.paid_amount || 0).toFixed(2)}</td>
                            <td className="px-5 py-3">
                              <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isPaid
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                  : fee.status === 'Partially Paid'
                                  ? 'bg-sky-50 text-sky-600 border border-sky-100'
                                  : 'bg-red-50 text-red-655 text-red-600 border border-red-100'
                              }`}>
                                {fee.status}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-right">
                              {!isPaid ? (
                                <button
                                  onClick={() => {
                                    setRecordingPaymentFee(fee);
                                    setPaymentAmount((parseFloat(fee.amount) - parseFloat(fee.paid_amount || 0)).toFixed(2));
                                  }}
                                  className="text-[10px] font-bold text-amber-650 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-0.5 justify-end ml-auto"
                                >
                                  <FiCreditCard className="text-[9px]" /> Pay
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic font-semibold px-2">Cleared</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-[0_10px_40px_rgba(0,0,0,0.01)] flex flex-col items-center justify-center">
              <span className="text-slate-300 text-5xl mb-4">✍️</span>
              <h3 className="text-sm font-bold text-slate-655">Select an Exam</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[260px]">
                Choose an exam circular from the left column roster to audit student exam fees and process counter collections.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CashierExamFeePage;
