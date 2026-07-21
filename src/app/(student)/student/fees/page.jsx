'use client';

import React, { useEffect, useState } from 'react';
import { FiDollarSign, FiClock, FiCheck, FiInfo, FiActivity } from 'react-icons/fi';

const FeesPage = () => {
  const [data, setData] = useState({ fees: [], fines: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await fetch('/api/student/fees');
        if (res.ok) {
          const resData = await res.json();
          setData(resData.paylod || { fees: [], fines: [] });
        }
      } catch (error) {
        console.error('Error fetching fees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const { fees, fines } = data;

  // Calculate summary stats
  const totalUnpaidFees = fees
    .filter((f) => f.status !== 'Paid')
    .reduce((sum, f) => sum + (parseFloat(f.amount) - parseFloat(f.paid_amount)), 0);

  const totalUnpaidFines = fines
    .filter((f) => f.status !== 'Paid')
    .reduce((sum, f) => sum + parseFloat(f.amount), 0);

  const totalOutstanding = totalUnpaidFees + totalUnpaidFines;

  const totalPaid = fees
    .reduce((sum, f) => sum + parseFloat(f.paid_amount), 0);

  const stats = [
    { label: 'Outstanding Balance', value: `৳${totalOutstanding.toFixed(2)}`, color: totalOutstanding > 0 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-500 border-slate-100', icon: FiClock },
    { label: 'Total Paid Fees', value: `৳${totalPaid.toFixed(2)}`, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: FiCheck }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100"><FiCheck /> Paid</span>;
      case 'Partially Paid':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">Partially Paid</span>;
      case 'Unpaid':
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100"><FiClock /> Unpaid</span>;
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Fees & Fines</h1>
        <p className="text-slate-500 text-sm font-medium">Verify outstanding balance, tuition ledgers, and institutional fines.</p>
      </div>

      {/* Grid Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Tuition Fees List */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8">
        <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FiDollarSign className="text-blue-600" /> Tuition & Fees Log
        </h2>

        {fees.length === 0 ? (
          <p className="text-slate-400 text-xs font-semibold text-center py-6">No tuition or semester fees logged.</p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Fee Description</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Due Date</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Paid Amount</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((fee) => (
                  <tr key={fee.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                    <td className="py-4 text-sm font-bold text-slate-800">
                      {fee.title}
                    </td>
                    <td className="py-4 text-xs font-semibold text-slate-400">
                      {new Date(fee.due_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-4">
                      {getStatusBadge(fee.status)}
                    </td>
                    <td className="py-4 text-sm font-bold text-slate-700 text-right">
                      ৳{parseFloat(fee.amount).toFixed(2)}
                    </td>
                    <td className="py-4 text-sm font-bold text-slate-500 text-right">
                      ৳{parseFloat(fee.paid_amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fines List */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8">
        <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FiInfo className="text-blue-600" /> Penalties & Fines
        </h2>

        {fines.length === 0 ? (
          <p className="text-slate-400 text-xs font-semibold text-center py-6">No fines or late penalties logged.</p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Fine Description</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Date Charged</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {fines.map((fine) => (
                  <tr key={fine.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                    <td className="py-4 text-sm font-bold text-slate-800">
                      {fine.title}
                    </td>
                    <td className="py-4 text-xs font-semibold text-slate-400">
                      {new Date(fine.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-4">
                      {getStatusBadge(fine.status)}
                    </td>
                    <td className="py-4 text-sm font-bold text-slate-700 text-right">
                      ৳{parseFloat(fine.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeesPage;
