'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiFileText, FiPrinter, FiLock, FiCheckCircle, FiClock, FiCalendar, FiMapPin, FiInfo, FiDollarSign } from 'react-icons/fi';
import { printAdmitCard } from '@/lib/receipts/admit_card';

const StudentAdmitCardsPage = () => {
  const [student, setStudent] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmitCards = async () => {
      try {
        const res = await fetch('/api/student/admit-cards');
        if (res.ok) {
          const data = await res.json();
          const payload = data.paylod || {};
          setStudent(payload.student || null);
          setExams(payload.exams || []);
        }
      } catch (error) {
        console.error('Error fetching admit cards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmitCards();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-primary-light border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full mx-auto animate-fade-up">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800 mb-1 flex items-center gap-2">
          <FiFileText className="text-primary" /> Examination Admit Cards
        </h1>
        <p className="text-slate-500 text-sm font-medium">
          Download and print official candidate examination hall entry permits for cleared term exams.
        </p>
      </div>

      {/* Candidate Banner */}
      {student && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-light text-primary rounded-2xl flex items-center justify-center font-bold text-lg border border-primary-light shrink-0">
              {student.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">{student.name}</h2>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                Reg: <strong>{student.registration_number}</strong> &bull; Class: <strong>{student.class_name}</strong> {student.section_name ? `(${student.section_name})` : ''} &bull; Roll: <strong>{student.roll || 'N/A'}</strong>
              </p>
            </div>
          </div>

          <Link
            href="/student/fees"
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-all border border-slate-100"
          >
            <FiDollarSign className="text-amber-500" /> View Fees & Invoices
          </Link>
        </div>
      )}

      {/* Exams Roster Cards */}
      {exams.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-4">
            <FiInfo className="text-3xl" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">No Examination Circulars Found</h3>
          <p className="text-slate-400 text-xs font-medium max-w-xs">There are no examination routines published for your class at this moment.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {exams.map((exam) => {
            const startStr = exam.start_date ? new Date(exam.start_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';
            const endStr = exam.end_date ? new Date(exam.end_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';
            const feeAmount = exam.exam_fee ? parseFloat(exam.exam_fee) : 0;

            return (
              <div key={exam.id} className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
                {/* Header bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-800">{exam.name}</h2>
                      {exam.term && (
                        <span className="text-xs font-bold text-primary bg-primary-light border border-primary-light px-2.5 py-0.5 rounded-full">
                          {exam.term}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-semibold mt-1">
                      Timeline: <strong>{startStr}</strong> – <strong>{endStr}</strong> &bull; Total Timetable Entries: <strong>{exam.schedules.length}</strong>
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-3">
                    {exam.isPaid ? (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-xs font-bold">
                        <FiCheckCircle className="text-sm" /> Fee Cleared / Paid
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-full text-xs font-bold">
                        <FiLock className="text-sm" /> Exam Fee Unpaid (৳{feeAmount.toFixed(2)})
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Left: Schedule Summary */}
                  <div className="flex flex-col gap-2 flex-1">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scheduled Subjects</h3>
                    {exam.schedules.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No subject schedules mapped yet.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {exam.schedules.map((sch) => (
                          <span key={sch.id} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700">
                            {sch.subject_name} ({sch.subject_code}) &bull; {new Date(sch.exam_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Print / Gate Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {exam.isPaid ? (
                      <button
                        onClick={() => printAdmitCard(exam, student, exam.schedules)}
                        className="flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl text-xs font-bold shadow-md transition-all cursor-pointer"
                      >
                        <FiPrinter className="text-base" /> Print / Download Admit Card
                      </button>
                    ) : (
                      <div className="flex flex-col gap-2 items-end">
                        <button
                          disabled
                          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 text-slate-400 rounded-2xl text-xs font-bold cursor-not-allowed border border-slate-200"
                        >
                          <FiLock className="text-base text-slate-400" /> Admit Card Locked
                        </button>
                        <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                          <FiInfo className="text-xs shrink-0" /> Pay ৳{feeAmount.toFixed(2)} exam fee at cashier desk to unlock.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentAdmitCardsPage;
