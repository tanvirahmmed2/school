'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiDollarSign, FiInfo, FiLayers, FiCheckCircle, FiShield, FiTrendingUp } from 'react-icons/fi';

const PublicMonthlyFeesPage = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicFees = async () => {
      try {
        const res = await fetch('/api/public/monthly-fees');
        const data = await res.json();
        if (res.ok && data.success) {
          setFees(data.paylod?.monthlyFees || []);
        } else {
          throw new Error(data.error || 'Failed to retrieve fee information.');
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicFees();
  }, []);

  // Institutional Fee Parameters
  const generalFeeData = [
    { name: 'Admission Application Processing', amount: '৳500.00', frequency: 'One-time (Non-refundable)', description: 'Incurred upon candidate circular application submission.' },
    { name: 'Annual Sports & Activity fee', amount: '৳2,500.00', frequency: 'Annual (Payable in January)', description: 'Includes library access, cultural functions, sports facility usage, and gym.' },
    { name: 'Term Examination fee', amount: 'As Scheduled by Admin', frequency: 'Per Exam Term', description: 'Assigned automatically when term schedule details are announced.' }
  ];

  return (
    <div className="w-full min-h-[70vh] py-12 px-4 md:px-8 max-w-4xl mx-auto flex flex-col gap-8 animate-fade-up">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <FiDollarSign className="text-sky-600" /> Class-wise Fee Structures
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
          Review transparent breakdown rates for monthly student tuition fees, exam schedules, and miscellaneous institutional fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Monthly Tuition Fee List */}
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-5">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              🏫 Base Monthly Tuition Fees
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tuition fee rates assigned to students of respective active class tiers.
            </p>
          </div>

          {loading ? (
            <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-semibold text-slate-400">Loading fee structures...</span>
            </div>
          ) : fees.length === 0 ? (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2 border border-dashed border-slate-150 rounded-2xl">
              <FiInfo className="text-3xl" />
              <p className="text-xs font-semibold">No active class tuition fees are currently configured.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs font-semibold text-slate-600">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-5 py-3 text-slate-400 uppercase text-[10px] tracking-wider">Class Tiers</th>
                    <th className="px-5 py-3 text-slate-400 uppercase text-[10px] tracking-wider text-right pr-8">Monthly tuition rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-800">
                  {fees.map((fee) => (
                    <tr key={fee.class_name} className="hover:bg-slate-50/20 transition-colors">
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 font-bold text-sky-600 bg-sky-50 border border-sky-100 px-2.5 py-0.5 rounded-full">
                          <FiLayers className="text-sky-400 text-xs" />
                          {fee.class_name}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-right pr-8">
                        {parseFloat(fee.amount) > 0 ? (
                          <span className="text-sm font-extrabold text-slate-900">
                            ৳{parseFloat(fee.amount).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-slate-400 italic">
                            TBD (৳0.00)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Institutional Charges / Guidelines */}
        <div className="md:col-span-1 flex flex-col gap-6">
          {/* General Institutional Charges */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Other Institutional Fees</h4>
            <div className="flex flex-col gap-4 text-xs">
              {generalFeeData.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-0.5 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                  <span className="font-bold text-slate-800">{item.name}</span>
                  <div className="flex items-center justify-between mt-1 text-[11px] font-semibold">
                    <span className="text-sky-600 font-bold">{item.amount}</span>
                    <span className="text-slate-400">{item.frequency}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Guidelines Checklist */}
          <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-md flex flex-col gap-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-sky-400">Payment Policies</h4>
            <ul className="flex flex-col gap-3 text-xs leading-relaxed text-slate-300 font-medium">
              <li className="flex items-start gap-2">
                <FiCheckCircle className="text-emerald-400 mt-0.5 shrink-0" />
                <span>Monthly tuition fee invoices are auto-generated on the 1st of every calendar month.</span>
              </li>
              <li className="flex items-start gap-2">
                <FiCheckCircle className="text-emerald-400 mt-0.5 shrink-0" />
                <span>Tuition payment bills are payable by the last calendar day of the same month.</span>
              </li>
              <li className="flex items-start gap-2">
                <FiCheckCircle className="text-emerald-400 mt-0.5 shrink-0" />
                <span>Late payments may trigger administrative fines automatically logged to the student desk.</span>
              </li>
              <li className="flex items-start gap-2">
                <FiCheckCircle className="text-emerald-400 mt-0.5 shrink-0" />
                <span>Cashier manual logs support Cash counter and major digital wallet transfers (bKash/Nagad).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicMonthlyFeesPage;
