'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  FiSearch,
  FiDollarSign,
  FiCreditCard,
  FiUser,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiRefreshCw,
  FiCalendar,
  FiFileText,
  FiX,
  FiBookOpen,
  FiLayers
} from 'react-icons/fi';

const RegistrarFeesPage = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  
  // Selected student and their data
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentFees, setStudentFees] = useState([]);
  const [studentPayments, setStudentPayments] = useState([]);

  // Overall recent payments (shown when no student is selected or as general log)
  const [recentPayments, setRecentPayments] = useState([]);

  // Recording Payment Modal State
  const [recordingFee, setRecordingFee] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [transactionId, setTransactionId] = useState('');
  const [remarks, setRemarks] = useState('');

  const [loading, setLoading] = useState(true);
  const [loadingFees, setLoadingFees] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch classes and students on load
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Classes
      const classesRes = await fetch('/api/classes');
      if (classesRes.ok) {
        const classesData = await classesRes.json();
        setClasses(classesData.classes || []);
      }

      // 2. Fetch all registered students
      const studentsRes = await fetch('/api/students');
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        const activeStudents = (studentsData.students || []).filter(s => s.is_registered);
        setStudents(activeStudents);
        setFilteredStudents(activeStudents);
      }

      // 3. Fetch general recent payments
      await fetchRecentPayments();
    } catch (err) {
      console.error(err);
      toast.error('Failed to load initial workspace data.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent payments overall
  const fetchRecentPayments = async () => {
    try {
      const res = await fetch('/api/students/fees/payments');
      if (res.ok) {
        const data = await res.json();
        setRecentPayments(data.payments || []);
      }
    } catch (err) {
      console.error('Failed to load transaction logs:', err);
    }
  };

  // Load student fees and payment history
  const fetchStudentFinancials = async (studentId) => {
    setLoadingFees(true);
    try {
      // Fetch Invoices
      const feesRes = await fetch(`/api/students/fees?student_id=${studentId}`);
      if (feesRes.ok) {
        const feesData = await feesRes.json();
        setStudentFees(feesData.fees || []);
      }

      // Fetch Payments history for this student
      const paymentsRes = await fetch(`/api/students/fees/payments?student_id=${studentId}`);
      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json();
        setStudentPayments(paymentsData.payments || []);
      }
    } catch (err) {
      toast.error('Failed to retrieve student financial records.');
    } finally {
      setLoadingFees(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Filter student list client-side based on class selection and search query
  useEffect(() => {
    let result = students;

    if (selectedClassId) {
      result = result.filter(s => s.class_id.toString() === selectedClassId.toString());
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        s =>
          (s.name && s.name.toLowerCase().includes(query)) ||
          (s.registration_number && s.registration_number.toLowerCase().includes(query)) ||
          (s.phone && s.phone.includes(query))
      );
    }

    setFilteredStudents(result);
  }, [searchQuery, selectedClassId, students]);

  // Handle selecting a student
  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setStudentFees([]);
    setStudentPayments([]);
    fetchStudentFinancials(student.id);
  };

  // Handle recording payment submission
  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!paymentAmount || isNaN(parseFloat(paymentAmount)) || parseFloat(paymentAmount) <= 0) {
      toast.error('Please enter a valid positive payment amount.');
      return;
    }

    const dueAmount = Math.round((parseFloat(recordingFee.amount) - parseFloat(recordingFee.paid_amount)) * 100) / 100;
    if (parseFloat(paymentAmount) > dueAmount) {
      toast.error(`Payment amount exceeds the outstanding due of $${dueAmount.toFixed(2)}.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/students/fees', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fee_id: recordingFee.id,
          paid_amount: paymentAmount,
          payment_method: paymentMethod,
          transaction_id: transactionId,
          remarks: remarks
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process payment.');

      toast.success(data.message || 'Payment recorded successfully.');
      
      // Reset form states
      setRecordingFee(null);
      setPaymentAmount('');
      setPaymentMethod('Cash');
      setTransactionId('');
      setRemarks('');

      // Refresh student financial status and overall records
      if (selectedStudent) {
        fetchStudentFinancials(selectedStudent.id);
      }
      fetchRecentPayments();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
            <FiCheckCircle className="text-xs" /> Paid
          </span>
        );
      case 'Partially Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
            <FiClock className="text-xs" /> Partially Paid
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
            <FiAlertCircle className="text-xs" /> Unpaid
          </span>
        );
    }
  };

  // Compute selected student totals
  const totalInvoiced = studentFees.reduce((sum, f) => sum + parseFloat(f.amount), 0);
  const totalPaid = studentFees.reduce((sum, f) => sum + parseFloat(f.paid_amount), 0);
  const totalOutstanding = totalInvoiced - totalPaid;

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Fee Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 animate-fade-up">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-3xl p-6 md:p-8 shadow-[0_15px_30px_rgba(99,102,241,0.15)]">
        <div className="absolute top-0 right-0 w-[30%] aspect-square rounded-full bg-white/5 blur-[80px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-200 flex items-center gap-1">
              <FiDollarSign /> Cashier & Accounts
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Student Fees Payment Portal</h1>
            <p className="text-xs text-indigo-100">Search student profiles, inspect invoice records, and process secure tuition fee payments.</p>
          </div>
          {selectedStudent && (
            <button
              onClick={() => {
                setSelectedStudent(null);
                setStudentFees([]);
                setStudentPayments([]);
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md border border-white/20 text-xs font-bold rounded-2xl transition-all flex items-center gap-2"
            >
              <FiX className="text-sm" /> Clear Selected Student
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Student Roster & Filters */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_35px_rgba(0,0,0,0.01)] flex flex-col gap-5">
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-50 pb-3">
              <FiUser className="text-indigo-600" /> Student Roster
            </h2>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3.5 text-slate-400 text-base" />
              <input
                type="text"
                placeholder="Search name or reg no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600 transition-all"
              />
            </div>

            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold text-slate-600 focus:outline-none focus:bg-white focus:border-indigo-600 transition-all"
            >
              <option value="">All Academic Classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Student Selection List */}
          <div className="max-h-[400px] overflow-y-auto flex flex-col gap-1 pr-1 custom-scrollbar">
            {filteredStudents.length === 0 ? (
              <p className="text-center text-xs font-semibold text-slate-400 py-6">No matching students found.</p>
            ) : (
              filteredStudents.map((std) => {
                const isSelected = selectedStudent?.id === std.id;
                return (
                  <button
                    key={std.id}
                    onClick={() => handleSelectStudent(std)}
                    className={`w-full text-left px-4 py-3 rounded-2xl transition-all flex justify-between items-center ${
                      isSelected
                        ? 'bg-indigo-50 border border-indigo-100 text-indigo-900 shadow-sm'
                        : 'bg-white border border-transparent hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold">{std.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        {std.registration_number} • Class {std.class_name}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Invoices & Transactions */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {selectedStudent ? (
            <>
              {/* Selected Student Dashboard */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_35px_rgba(0,0,0,0.01)] flex flex-col gap-6">
                {/* Student Info Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center text-lg font-bold">
                      {selectedStudent.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-base font-bold text-slate-800">{selectedStudent.name}</h3>
                      <p className="text-xs text-slate-400 font-semibold">
                        Reg No: <span className="text-slate-600 font-bold uppercase">{selectedStudent.registration_number}</span> • Class {selectedStudent.class_name} {selectedStudent.section_name && `(${selectedStudent.section_name})`}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col text-left sm:text-right text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Number</span>
                    <span className="font-bold text-slate-600">{selectedStudent.phone || 'N/A'}</span>
                  </div>
                </div>

                {/* Financial Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <FiFileText /> Total Invoiced
                    </span>
                    <span className="text-xl font-bold text-slate-800">${totalInvoiced.toFixed(2)}</span>
                  </div>

                  <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-4 flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                      <FiCheckCircle /> Total Collected
                    </span>
                    <span className="text-xl font-bold text-emerald-700">${totalPaid.toFixed(2)}</span>
                  </div>

                  <div className="bg-rose-50/50 border border-rose-100/50 rounded-2xl p-4 flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest flex items-center gap-1">
                      <FiAlertCircle /> Total Outstanding
                    </span>
                    <span className="text-xl font-bold text-rose-700">${totalOutstanding.toFixed(2)}</span>
                  </div>
                </div>

                {/* Invoices List */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <FiLayers /> Active Fee Invoices
                  </h4>

                  {loadingFees ? (
                    <div className="py-12 flex justify-center items-center">
                      <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : studentFees.length === 0 ? (
                    <p className="text-slate-400 text-xs font-semibold text-center py-8 bg-slate-50 rounded-2xl border border-slate-100">
                      No tuition fees or invoices logged for this student.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-medium border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400">
                            <th className="pb-3 font-bold uppercase tracking-wider">Fee Description</th>
                            <th className="pb-3 font-bold uppercase tracking-wider">Due Date</th>
                            <th className="pb-3 font-bold uppercase tracking-wider text-center">Status</th>
                            <th className="pb-3 font-bold uppercase tracking-wider text-right">Invoiced</th>
                            <th className="pb-3 font-bold uppercase tracking-wider text-right">Paid</th>
                            <th className="pb-3 font-bold uppercase tracking-wider text-right">Outstanding</th>
                            <th className="pb-3 font-bold uppercase tracking-wider text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {studentFees.map((fee) => {
                            const due = parseFloat(fee.amount) - parseFloat(fee.paid_amount);
                            return (
                              <tr key={fee.id} className="hover:bg-slate-50/20 transition-colors">
                                <td className="py-3 font-bold text-slate-800">{fee.title}</td>
                                <td className="py-3 text-slate-500">
                                  {new Date(fee.due_date).toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </td>
                                <td className="py-3 text-center">{getStatusBadge(fee.status)}</td>
                                <td className="py-3 text-right font-semibold text-slate-700">${parseFloat(fee.amount).toFixed(2)}</td>
                                <td className="py-3 text-right font-semibold text-slate-700">${parseFloat(fee.paid_amount).toFixed(2)}</td>
                                <td className="py-3 text-right font-bold text-slate-700">
                                  {due > 0 ? (
                                    <span className="text-rose-600">${due.toFixed(2)}</span>
                                  ) : (
                                    <span className="text-slate-400">$0.00</span>
                                  )}
                                </td>
                                <td className="py-3 text-center">
                                  {fee.status !== 'Paid' ? (
                                    <button
                                      onClick={() => {
                                        setRecordingFee(fee);
                                        setPaymentAmount(due.toString());
                                      }}
                                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-lg transition-all text-[10px]"
                                    >
                                      Record Payment
                                    </button>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 font-bold">Settled</span>
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
              </div>

              {/* Selected Student Payment History */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_35px_rgba(0,0,0,0.01)] flex flex-col gap-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-50 pb-3">
                  <FiClock className="text-indigo-600" /> Student Payment Logs
                </h4>

                {loadingFees ? (
                  <div className="py-6 flex justify-center items-center">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : studentPayments.length === 0 ? (
                  <p className="text-slate-400 text-xs font-semibold text-center py-6">
                    No payment history transactions recorded for this student.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-medium border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400">
                          <th className="pb-2.5 font-bold uppercase tracking-wider">Payment Date</th>
                          <th className="pb-2.5 font-bold uppercase tracking-wider">Fee Description</th>
                          <th className="pb-2.5 font-bold uppercase tracking-wider">Method</th>
                          <th className="pb-2.5 font-bold uppercase tracking-wider">Transaction Ref</th>
                          <th className="pb-2.5 font-bold uppercase tracking-wider text-right">Amount Paid</th>
                          <th className="pb-2.5 font-bold uppercase tracking-wider">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {studentPayments.map((pay) => (
                          <tr key={pay.id} className="text-slate-700">
                            <td className="py-2.5 text-slate-500">
                              {new Date(pay.payment_date).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="py-2.5 font-bold text-slate-800">{pay.fee_title}</td>
                            <td className="py-2.5">
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                                {pay.payment_method}
                              </span>
                            </td>
                            <td className="py-2.5 font-mono text-slate-500">{pay.transaction_id || 'N/A'}</td>
                            <td className="py-2.5 text-right font-bold text-emerald-600">${parseFloat(pay.amount_paid).toFixed(2)}</td>
                            <td className="py-2.5 text-slate-400 italic max-w-xs truncate">{pay.remarks || 'None'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* General / Dashboard Overview (No Student Selected) */
            <div className="flex flex-col gap-6">
              {/* Call to action card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_10px_35px_rgba(0,0,0,0.01)] text-center flex flex-col items-center gap-4 py-12">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center text-3xl">
                  <FiBookOpen />
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                  <h3 className="text-lg font-bold text-slate-800">Select a student to manage fees</h3>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    Use the student roster sidebar to search and select a student. You can check invoices, view transaction history, and take new payments.
                  </p>
                </div>
              </div>

              {/* General Payment Logs */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_35px_rgba(0,0,0,0.01)] flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <FiCreditCard className="text-indigo-600" /> Recent Cashier Transactions (System-wide)
                  </h2>
                  <button
                    onClick={fetchRecentPayments}
                    className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 active:bg-slate-100 rounded-xl transition-all"
                    title="Refresh logs"
                  >
                    <FiRefreshCw className="text-sm" />
                  </button>
                </div>

                {recentPayments.length === 0 ? (
                  <p className="text-slate-400 text-xs font-semibold text-center py-8">
                    No transactions recorded in the system yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-medium border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400">
                          <th className="pb-3 font-bold uppercase tracking-wider">Date</th>
                          <th className="pb-3 font-bold uppercase tracking-wider">Student Name</th>
                          <th className="pb-3 font-bold uppercase tracking-wider">Reg No</th>
                          <th className="pb-3 font-bold uppercase tracking-wider">Class</th>
                          <th className="pb-3 font-bold uppercase tracking-wider">Fee Description</th>
                          <th className="pb-3 font-bold uppercase tracking-wider text-center">Method</th>
                          <th className="pb-3 font-bold uppercase tracking-wider text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {recentPayments.map((pay) => (
                          <tr key={pay.id} className="text-slate-700 hover:bg-slate-50/20 transition-colors">
                            <td className="py-3 text-slate-400">
                              {new Date(pay.payment_date).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="py-3 font-bold text-slate-800">{pay.student_name}</td>
                            <td className="py-3 font-semibold uppercase text-slate-600">{pay.registration_number}</td>
                            <td className="py-3 text-slate-500">{pay.class_name}</td>
                            <td className="py-3 font-medium text-slate-700">{pay.fee_title}</td>
                            <td className="py-3 text-center">
                              <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                                {pay.payment_method}
                              </span>
                            </td>
                            <td className="py-3 text-right font-extrabold text-emerald-600">${parseFloat(pay.amount_paid).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Record Payment Form Modal */}
      {recordingFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 animate-scale-up">
            <button
              onClick={() => setRecordingFee(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
            >
              <FiX className="text-base" />
            </button>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 flex items-center gap-1 mb-1">
                <FiDollarSign /> Cashier Action
              </span>
              <h3 className="text-base font-extrabold text-slate-800">Record Fee Payment</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                Process payment details for <span className="text-slate-600 font-bold">{selectedStudent.name}</span>.
              </p>
            </div>

            {/* Fee summary block */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2.5 text-xs text-slate-600">
              <div className="flex justify-between font-semibold">
                <span>Fee Invoice:</span>
                <span className="font-bold text-slate-800">{recordingFee.title}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total Amount:</span>
                <span className="font-bold text-slate-800">${parseFloat(recordingFee.amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Amount Paid So Far:</span>
                <span className="font-bold text-emerald-600">${parseFloat(recordingFee.paid_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/50 pt-2 font-bold text-slate-800">
                <span>Remaining Outstanding:</span>
                <span className="text-rose-600">
                  ${(Math.round((parseFloat(recordingFee.amount) - parseFloat(recordingFee.paid_amount)) * 100) / 100).toFixed(2)}
                </span>
              </div>
            </div>

            <form onSubmit={handleRecordPayment} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Payment Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={(Math.round((parseFloat(recordingFee.amount) - parseFloat(recordingFee.paid_amount)) * 100) / 100).toString()}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-600 rounded-2xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-600 rounded-2xl text-xs font-semibold text-slate-700 focus:outline-none transition-all"
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Mobile Banking">Mobile Banking</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Transaction Ref / Receipt No (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. TXN-9843-9823"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-600 rounded-2xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Remarks / Comments (Optional)</label>
                <textarea
                  placeholder="Add details, cheque numbers, details of discount if any..."
                  value={remarks}
                  rows={2}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-600 rounded-2xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setRecordingFee(null)}
                  className="flex-1 py-2.5 border border-slate-100 hover:bg-slate-50 active:bg-slate-100 text-xs font-bold text-slate-600 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 text-white text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(99,102,241,0.2)]"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <FiCreditCard /> Record Payment
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrarFeesPage;
