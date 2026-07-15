'use client';

import React, { useEffect, useState } from 'react';
import { FiDollarSign, FiClock, FiCheck, FiInfo } from 'react-icons/fi';

const SalaryHistoryPage = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const res = await fetch('/api/teacher/salary');
        if (res.ok) {
          const data = await res.json();
          setSalaries(data.paylod.salaries || []);
        }
      } catch (err) {
        console.error('Failed to load salary ledger:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSalary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-650 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate summaries
  const paidSalaries = salaries.filter((s) => s.status === 'Paid');
  const totalEarned = paidSalaries.reduce((sum, s) => sum + (parseFloat(s.basic) + parseFloat(s.allowance) - parseFloat(s.deductions)), 0);
  const totalPending = salaries.filter((s) => s.status !== 'Paid').length;

  const stats = [
    { label: 'Total Earnings Credited', value: `৳${totalEarned.toFixed(2)}`, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: FiCheck },
    { label: 'Pending Credits', value: totalPending, color: totalPending > 0 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-500 border-slate-100', icon: FiClock }
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Salary Ledger History</h1>
        <p className="text-slate-500 text-sm font-medium">Verify your monthly basic pays, allowances, tax/benefit deductions, and payment status.</p>
      </div>

      {/* Stats summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`p-6 rounded-3xl border ${stat.color} flex items-center justify-between`}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-85 block mb-1">{stat.label}</span>
                <span className="text-2xl md:text-3xl font-black">{stat.value}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/20 border border-white/10">
                <Icon className="text-2xl" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Salary history Log */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8">
        <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FiDollarSign className="text-indigo-600" /> Salary History
        </h2>

        {salaries.length === 0 ? (
          <p className="text-slate-400 text-xs font-semibold text-center py-12">No salary entries registered yet.</p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Billing Month</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Payment Status</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Basic Pay</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Allowances</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Deductions</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Net Credited</th>
                </tr>
              </thead>
              <tbody>
                {salaries.map((salary) => {
                  const net = parseFloat(salary.basic) + parseFloat(salary.allowance) - parseFloat(salary.deductions);
                  return (
                    <tr key={salary.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                      <td className="py-4 text-sm font-bold text-slate-800">
                        {salary.month}
                      </td>
                      <td className="py-4">
                        {salary.status === 'Paid' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100"><FiCheck /> Paid</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100"><FiClock /> Pending</span>
                        )}
                      </td>
                      <td className="py-4 text-sm font-bold text-slate-500 text-right">
                        ৳{parseFloat(salary.basic).toFixed(2)}
                      </td>
                      <td className="py-4 text-sm font-bold text-slate-500 text-right">
                        +৳{parseFloat(salary.allowance).toFixed(2)}
                      </td>
                      <td className="py-4 text-sm font-bold text-slate-500 text-right">
                        -৳{parseFloat(salary.deductions).toFixed(2)}
                      </td>
                      <td className="py-4 text-sm font-extrabold text-slate-800 text-right">
                        ৳{net.toFixed(2)}
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
  );
};

export default SalaryHistoryPage;
