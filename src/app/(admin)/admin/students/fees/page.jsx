'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiDollarSign, FiPlus, FiX, FiLayers, FiUsers, FiCreditCard, FiAlertTriangle, FiBookOpen } from 'react-icons/fi';

const AdminStudentFeesPage = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [fines, setFines] = useState([]);

  // Filter selections
  const [filterClassId, setFilterClassId] = useState('');
  const [filterStudentId, setFilterStudentId] = useState('');

  // Invoice creation form states
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [invTitle, setInvTitle] = useState('');
  const [invAmount, setInvAmount] = useState('');
  const [invDueDate, setInvDueDate] = useState('');
  const [invClassId, setInvClassId] = useState('');
  const [invStudentId, setInvStudentId] = useState('');
  const [invStudentsList, setInvStudentsList] = useState([]);

  // Payment modal state
  const [recordingPaymentFee, setRecordingPaymentFee] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  // Fine modal state
  const [applyingFineStudent, setApplyingFineStudent] = useState(null);
  const [fineTitle, setFineTitle] = useState('');
  const [fineAmount, setFineAmount] = useState('');
  const [linkedFeeId, setLinkedFeeId] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch initial lookup lists
  const fetchInitialData = async () => {
    try {
      const classesRes = await fetch('/api/classes');
      const classesData = await classesRes.json();
      setClasses(classesData.paylod.classes || []);

      // Fetch all registered students
      const studentsRes = await fetch('/api/students');
      const studentsData = await studentsRes.json();
      setStudents((studentsData.paylod?.students || []).filter((s) => s.is_registered));
    } catch (err) {
      toast.error('Failed to load classes or student roster.');
    }
  };

  // Fetch fees log list
  const fetchFeesAndFines = async () => {
    setLoading(true);
    try {
      let feesUrl = '/api/students/fees';
      const params = [];
      if (filterClassId) params.push(`class_id=${filterClassId}`);
      if (filterStudentId) params.push(`student_id=${filterStudentId}`);
      if (params.length > 0) feesUrl += '?' + params.join('&');

      const feesRes = await fetch(feesUrl);
      const feesData = await feesRes.json();
      setFees(feesData.paylod?.fees || []);

      let finesUrl = '/api/students/fines';
      if (filterStudentId) finesUrl += `?student_id=${filterStudentId}`;
      const finesRes = await fetch(finesUrl);
      const finesData = await finesRes.json();
      setFines(finesData.paylod?.fines || []);
    } catch (err) {
      toast.error('Failed to retrieve financial logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchFeesAndFines();
  }, [filterClassId, filterStudentId]);

  // Fetch students for Invoice creation dropdown based on class selection
  useEffect(() => {
    if (!invClassId) {
      setInvStudentsList([]);
      setInvStudentId('');
      return;
    }
    const fetchClassStudents = async () => {
      const res = await fetch(`/api/students?class_id=${invClassId}`);
      const data = await res.json();
      setInvStudentsList((data.paylod.students || []).filter((s) => s.is_registered));
      setInvStudentId('');
    };
    fetchClassStudents();
  }, [invClassId]);

  // Create Fee Invoices
  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!invTitle || !invAmount || !invDueDate) {
      toast.error('Invoice details are required.');
      return;
    }

    if (!invClassId && !invStudentId) {
      toast.error('Assign target (Class or individual Student) is required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/students/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: invStudentId || null,
          class_id: invClassId || null,
          title: invTitle,
          amount: invAmount,
          due_date: invDueDate
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate fee logs.');

      toast.success(data.message || 'Fee invoices generated successfully!');
      setInvTitle('');
      setInvAmount('');
      setInvDueDate('');
      setInvClassId('');
      setInvStudentId('');
      setShowAddInvoice(false);
      fetchFeesAndFines();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Fee Payment
  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!paymentAmount || isNaN(parseFloat(paymentAmount))) {
      toast.error('Please enter a valid payment amount.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/students/fees', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fee_id: recordingPaymentFee.id,
          paid_amount: paymentAmount
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record payment.');

      toast.success(data.message || 'Payment logged successfully.');
      setRecordingPaymentFee(null);
      setPaymentAmount('');
      fetchFeesAndFines();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Fine Logger
  const handleApplyFine = async (e) => {
    e.preventDefault();
    if (!fineTitle || !fineAmount) {
      toast.error('Fine description and Amount are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/students/fines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: applyingFineStudent.student_id,
          fee_id: linkedFeeId || null,
          title: fineTitle,
          amount: fineAmount
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to log fine.');

      toast.success(data.message || 'Fine applied successfully!');
      setApplyingFineStudent(null);
      setFineTitle('');
      setFineAmount('');
      setLinkedFeeId('');
      fetchFeesAndFines();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle fine status
  const handleToggleFineStatus = async (fineId, currentStatus) => {
    const nextStatus = currentStatus === 'Paid' ? 'Unpaid' : 'Paid';
    try {
      const res = await fetch('/api/students/fines', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fine_id: fineId, status: nextStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(data.message);
      fetchFeesAndFines();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <FiDollarSign className="text-blue-600" /> Student Financial Ledgers
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Bill students class-wide, review fees registries, log payments, and apply fines.
          </p>
        </div>

        <button
          onClick={() => {
            setShowAddInvoice(!showAddInvoice);
            setRecordingPaymentFee(null);
            setApplyingFineStudent(null);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-xs cursor-pointer"
        >
          {showAddInvoice ? (
            <>
              <FiX className="text-lg" /> Close Invoice Panel
            </>
          ) : (
            <>
              <FiPlus className="text-lg" /> Bill Invoice
            </>
          )}
        </button>
      </div>

      {/* Selectors / Filters */}
      <div className="w-full bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:w-1/2 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Filter by Class
          </label>
          <select
            value={filterClassId}
            onChange={(e) => {
              setFilterClassId(e.target.value);
              setFilterStudentId('');
            }}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-850 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Classes...</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-1/2 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Filter by Student
          </label>
          <select
            value={filterStudentId}
            onChange={(e) => {
              setFilterStudentId(e.target.value);
              setFilterClassId('');
            }}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-850 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Students...</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.registration_number})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bill Invoice Form */}
      {showAddInvoice && (
        <div className="w-full bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] animate-fade-up">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            💳 Generate Invoice (Class-wide or Individual Student)
          </h2>
          <form onSubmit={handleCreateInvoice} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500">Invoice Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Tuition Fee January 2026"
                value={invTitle}
                onChange={(e) => setInvTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500">Amount (BDT)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="e.g. 150.00"
                value={invAmount}
                onChange={(e) => setInvAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500">Due Date</label>
              <input
                type="date"
                required
                value={invDueDate}
                onChange={(e) => setInvDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500">Assign Target Class</label>
              <select
                value={invClassId}
                onChange={(e) => setInvClassId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white"
              >
                <option value="">Select class...</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500">Assign Individual Student (Optional)</label>
              <select
                value={invStudentId}
                onChange={(e) => setInvStudentId(e.target.value)}
                disabled={!invClassId}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white disabled:opacity-60"
              >
                <option value="">All Registered Students in Class...</option>
                {invStudentsList.map((std) => (
                  <option key={std.id} value={std.id}>
                    {std.name} ({std.registration_number})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddInvoice(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-655 text-sm font-semibold rounded-xl transition-all duration-150 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-all duration-150 cursor-pointer"
              >
                {submitting ? 'Generating...' : 'Issue Invoice'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Record Payment Form */}
      {recordingPaymentFee && (
        <div className="w-full bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] animate-fade-up">
          <h2 className="text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
            💰 Record Fee Payment Transaction
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Invoice: "{recordingPaymentFee.title}" for {recordingPaymentFee.student_name}. 
            Total Due: ৳{recordingPaymentFee.amount} (Paid so far: ৳{recordingPaymentFee.paid_amount})
          </p>
          <form onSubmit={handleRecordPayment} className="flex flex-col sm:flex-row items-end gap-4 max-w-160">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs font-semibold text-slate-500">Record Paid Amount (BDT)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="e.g. 50.00"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-909 outline-none focus:bg-white focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setRecordingPaymentFee(null)}
                className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl cursor-pointer"
              >
                {submitting ? 'Recording...' : 'Record Payment'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Apply Fine Form */}
      {applyingFineStudent && (
        <div className="w-full bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] animate-fade-up">
          <h2 className="text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
            ⚠️ Apply Fine to Student
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Student Name: {applyingFineStudent.student_name} ({applyingFineStudent.registration_number})
          </p>
          <form onSubmit={handleApplyFine} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500">Fine Description / Reason</label>
              <input
                type="text"
                required
                placeholder="e.g. Late Library Return Fine"
                value={fineTitle}
                onChange={(e) => setFineTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500">Fine Amount (BDT)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="e.g. 10.00"
                value={fineAmount}
                onChange={(e) => setFineAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500">Link to Fee Invoice (Optional)</label>
              <select
                value={linkedFeeId}
                onChange={(e) => setLinkedFeeId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white"
              >
                <option value="">None (General Fine)...</option>
                {fees
                  .filter((f) => f.student_id === applyingFineStudent.student_id)
                  .map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.title} (৳{f.amount})
                    </option>
                  ))}
              </select>
            </div>

            <div className="sm:col-span-3 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setApplyingFineStudent(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-655 text-sm font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl cursor-pointer"
              >
                {submitting ? 'Applying...' : 'Apply Fine'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Grid: Fees logs and Fines list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Invoices List Panel (2/3 width) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800">
              Fee Invoice Registry logs ({fees.length})
            </h2>
          </div>

          {loading ? (
            <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold text-slate-400">Loading fees log...</span>
            </div>
          ) : fees.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
              <span className="text-slate-300 text-6xl mb-4">💰</span>
              <h3 className="text-sm font-bold text-slate-600">No Invoices</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
                No fee invoices generated matching active filters.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 bg-slate-50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Student Details
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Invoice Title
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Financials
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-slate-50/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{fee.student_name}</p>
                          <span className="text-[10px] text-slate-400 font-bold">
                            {fee.registration_number} (Class: {fee.class_name})
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-bold text-slate-700">{fee.title}</span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs font-semibold text-slate-600">
                          <p>Due: <span className="font-bold text-slate-800">৳{fee.amount}</span></p>
                          <p>Paid: <span className="text-green-600">৳{fee.paid_amount}</span></p>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          fee.status === 'Paid' 
                            ? 'bg-green-50 text-green-600' 
                            : fee.status === 'Partially Paid' 
                            ? 'bg-indigo-50 text-indigo-600' 
                            : 'bg-red-50 text-red-600'
                        }`}>
                          {fee.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-1.5">
                        {fee.status !== 'Paid' && (
                          <button
                            onClick={() => {
                              setRecordingPaymentFee(fee);
                              setApplyingFineStudent(null);
                            }}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer"
                            title="Collect Payment"
                          >
                            Collect
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setApplyingFineStudent(fee);
                            setRecordingPaymentFee(null);
                          }}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-650 border border-red-100 text-red-600 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer"
                          title="Apply Penalty Fine"
                        >
                          Fine
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Fines Panel (1/3 width) */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              <FiAlertTriangle className="text-amber-500" /> Fines Records ({fines.length})
            </h2>
          </div>

          {loading ? (
            <div className="w-full py-16 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : fines.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center px-4">
              <span className="text-slate-300 text-5xl mb-3">🔔</span>
              <p className="text-xs text-slate-400">No active fine logs records found.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {fines.map((fine) => (
                <div key={fine.id} className="p-4 hover:bg-slate-50/20 transition-colors flex flex-col gap-2 relative">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-slate-800">{fine.title}</span>
                      <span className={`inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded-md ${
                        fine.status === 'Paid' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {fine.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                      {fine.student_name} ({fine.registration_number})
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1 text-xs">
                    <span className="font-bold text-red-500">৳{fine.amount}</span>
                    <button
                      onClick={() => handleToggleFineStatus(fine.id, fine.status)}
                      className="text-[10px] font-bold text-blue-500 hover:text-blue-600 transition-colors underline cursor-pointer"
                    >
                      Mark as {fine.status === 'Paid' ? 'Unpaid' : 'Paid'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminStudentFeesPage;
